from typing import Dict, Any
from sqlalchemy.orm import Session
from ..models.models import Camera, Incident, ObjectTrack, SwanWatchRequest, ShieldFaultEvent, VirtualFence, IncidentEvidence
from ..realtime.connection_manager import manager
from .audit_service import audit_service
from .risk_engine import risk_engine
from datetime import datetime

class DemoEngine:
    def __init__(self):
        self.current_step = 1
        self.is_playing = False

    async def execute_step(self, step: int, db: Session) -> Dict[str, Any]:
        self.current_step = step
        now_str = datetime.utcnow().strftime("%H:%M:%S IST")

        if step == 1:
            # Baseline normal state
            cam3 = db.query(Camera).filter(Camera.id == "CAM-03").first()
            if cam3:
                cam3.health = "ONLINE"
                cam3.detected_objects = []
            cam4 = db.query(Camera).filter(Camera.id == "CAM-04").first()
            if cam4:
                cam4.detected_objects = []
            fence = db.query(VirtualFence).filter(VirtualFence.id == "VF-ALPHA-01").first()
            if fence:
                fence.status = "INTACT"
            db.commit()
            await manager.broadcast("system.status_changed", {"step": 1, "description": "Baseline monitoring active"})

        elif step in (2, 3):
            # Target T-104 acquired at CAM-03
            cam3 = db.query(Camera).filter(Camera.id == "CAM-03").first()
            if cam3:
                cam3.detected_objects = [
                    {"id": "det-03-1", "label": "PERSON", "confidence": 0.94, "bbox": [48, 52, 14, 26], "trackId": "T-104"}
                ]
            db.commit()
            await manager.broadcast("track.created", {"track_id": "T-104", "camera": "CAM-03", "object_type": "PERSON"})

        elif step == 4:
            # Virtual fence crossed
            fence = db.query(VirtualFence).filter(VirtualFence.id == "VF-ALPHA-01").first()
            if fence:
                fence.status = "BREACHED"
            inc = db.query(Incident).filter(Incident.id == "INC-2026-0142").first()
            if inc:
                inc.severity = "HIGH"
                inc.status = "NEW"
                inc.risk_score = 75
            db.commit()
            await manager.broadcast("incident.created", {"incident_id": "INC-2026-0142", "severity": "HIGH", "status": "NEW"})

        elif step in (5, 6):
            # SWAN watch request to CAM-04
            req = db.query(SwanWatchRequest).filter(SwanWatchRequest.id == "SWAN-REQ-0042").first()
            if req:
                req.status = "ACTIVE"
            db.commit()
            await manager.broadcast("swan.watch_requested", {"request_id": "SWAN-REQ-0042", "from_camera": "CAM-03", "to_camera": "CAM-04"})

        elif step in (7, 8, 9):
            # CAM-04 confirms target & risk escalates
            cam4 = db.query(Camera).filter(Camera.id == "CAM-04").first()
            if cam4:
                cam4.detected_objects = [
                    {"id": "det-04-1", "label": "PERSON", "confidence": 0.92, "bbox": [22, 60, 16, 28], "trackId": "T-104"}
                ]
            req = db.query(SwanWatchRequest).filter(SwanWatchRequest.id == "SWAN-REQ-0042").first()
            if req:
                req.status = "CONFIRMED"
            inc = db.query(Incident).filter(Incident.id == "INC-2026-0142").first()
            if inc:
                inc.severity = "CRITICAL"
                inc.status = "CONFIRMED"
                inc.risk_score = 92
                inc.risk_breakdown = risk_engine.calculate_risk()["breakdown"]
            db.commit()
            await manager.broadcast("swan.confirmed", {"track_id": "T-104", "confirming_camera": "CAM-04", "risk_score": 92})

        elif step in (10, 11):
            # Operator confirms incident
            inc = db.query(Incident).filter(Incident.id == "INC-2026-0142").first()
            if inc:
                inc.status = "CONFIRMED"
            audit_service.log(
                db=db,
                user_id="OP-042",
                role="OPERATOR",
                action="INCIDENT_CONFIRMED",
                resource="INCIDENT",
                resource_id="INC-2026-0142",
                metadata={"notes": "Corroborated across CAM-03 and CAM-04"}
            )
            await manager.broadcast("incident.updated", {"incident_id": "INC-2026-0142", "status": "CONFIRMED"})

        elif step in (12, 13):
            # CAM-03 fails (lens obstruction/tamper)
            cam3 = db.query(Camera).filter(Camera.id == "CAM-03").first()
            if cam3:
                cam3.health = "WARNING"
            db.commit()
            await manager.broadcast("shield.fault_detected", {"camera_id": "CAM-03", "condition": "Lens obstruction suspected", "confidence": 0.94})

        elif step in (14, 15):
            # SHIELD selects backup cameras
            cam_tow = db.query(Camera).filter(Camera.id == "CAM-TOWER-01").first()
            if cam_tow:
                cam_tow.is_ptz_backup = True
                cam_tow.backup_target_cam_id = "CAM-03"
            db.commit()
            await manager.broadcast("shield.recovery_started", {"target_camera": "CAM-03", "backup_cameras": ["CAM-TOWER-01", "CAM-ROAD-05"]})

        elif step == 16:
            # Coverage restored to 88% and target verified in backup coverage
            fault = db.query(ShieldFaultEvent).filter(ShieldFaultEvent.camera_id == "CAM-03").first()
            if fault:
                fault.coverage_restored_percent = 88
                fault.residual_blind_zone_percent = 12
            inc = db.query(Incident).filter(Incident.id == "INC-2026-0142").first()
            if inc:
                inc.unified_fault = True
                inc.title = "Restricted-zone intrusion [CAM-03 Fault & Coverage Recovery Correlated]"
            db.commit()
            await manager.broadcast("shield.coverage_restored", {"coverage_restored": 88, "residual_blind_zone": 12})

        return {
            "step": step,
            "timestamp": now_str,
            "status": "SUCCESS"
        }

demo_engine = DemoEngine()
