from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..core.database import get_db
from ..models.models import Incident
from ..schemas.schemas import IncidentResponse, IncidentActionRequest
from ..realtime.connection_manager import manager
from ..services.audit_service import audit_service

router = APIRouter(prefix="/incidents", tags=["Incidents"])

@router.get("", response_model=List[IncidentResponse])
def get_incidents(db: Session = Depends(get_db)):
    return db.query(Incident).all()

@router.get("/{incident_id}", response_model=IncidentResponse)
def get_incident(incident_id: str, db: Session = Depends(get_db)):
    inc = db.query(Incident).filter(Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")
    return inc

@router.patch("/{incident_id}/action", response_model=IncidentResponse)
async def perform_incident_action(
    incident_id: str,
    action_req: IncidentActionRequest,
    db: Session = Depends(get_db)
):
    inc = db.query(Incident).filter(Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")

    action = action_req.action.lower()
    now_str = datetime.utcnow().strftime("%H:%M:%S IST")

    current_timeline = list(inc.timeline or [])
    current_notes = list(inc.notes or [])

    if action == "confirm":
        inc.status = "CONFIRMED"
        current_timeline.append({
            "time": now_str,
            "title": "Confirmed by Operator",
            "description": f"Target confirmed by {action_req.user_id} ({action_req.role})"
        })
        audit_service.log(
            db=db,
            user_id=action_req.user_id,
            role=action_req.role,
            action="INCIDENT_CONFIRMED",
            resource="INCIDENT",
            resource_id=inc.id,
            metadata={"notes": action_req.note}
        )

    elif action == "escalate":
        inc.severity = "CRITICAL"
        inc.status = "ESCALATED"
        inc.risk_score = min(100, inc.risk_score + 10)
        current_timeline.append({
            "time": now_str,
            "title": "Escalated to Sector High Command",
            "description": f"QRT alert triggered by {action_req.user_id}"
        })
        audit_service.log(
            db=db,
            user_id=action_req.user_id,
            role=action_req.role,
            action="INCIDENT_ESCALATED",
            resource="INCIDENT",
            resource_id=inc.id,
            metadata={"new_severity": "CRITICAL"}
        )

    elif action == "dismiss":
        inc.status = "DISMISSED"
        current_timeline.append({
            "time": now_str,
            "title": "Dismissed by Operator",
            "description": f"Marked false positive/dismissed by {action_req.user_id}"
        })
        audit_service.log(
            db=db,
            user_id=action_req.user_id,
            role=action_req.role,
            action="INCIDENT_DISMISSED",
            resource="INCIDENT",
            resource_id=inc.id,
            metadata={"reason": action_req.note}
        )

    elif action == "assign":
        inc.status = "ASSIGNED"
        inc.assigned_to = action_req.assignee or action_req.user_id
        current_timeline.append({
            "time": now_str,
            "title": "Incident Assigned",
            "description": f"Assigned to {inc.assigned_to}"
        })
        audit_service.log(
            db=db,
            user_id=action_req.user_id,
            role=action_req.role,
            action="INCIDENT_ASSIGNED",
            resource="INCIDENT",
            resource_id=inc.id,
            metadata={"assignee": inc.assigned_to}
        )

    elif action == "annotate":
        if action_req.note:
            current_notes.append({
                "id": f"note-{int(datetime.utcnow().timestamp())}",
                "author": f"{action_req.user_id} ({action_req.role})",
                "timestamp": now_str,
                "text": action_req.note
            })
            audit_service.log(
                db=db,
                user_id=action_req.user_id,
                role=action_req.role,
                action="INCIDENT_ANNOTATED",
                resource="INCIDENT",
                resource_id=inc.id,
                metadata={"text": action_req.note}
            )

    inc.timeline = current_timeline
    inc.notes = current_notes
    db.commit()
    db.refresh(inc)

    await manager.broadcast("incident.updated", {
        "incident_id": inc.id,
        "status": inc.status,
        "severity": inc.severity,
        "risk_score": inc.risk_score
    })
    return inc

@router.post("", response_model=IncidentResponse)
async def create_incident(inc_data: IncidentResponse, db: Session = Depends(get_db)):
    existing = db.query(Incident).filter(Incident.id == inc_data.id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Incident {inc_data.id} already exists")
    inc = Incident(**inc_data.dict())
    db.add(inc)
    db.commit()
    db.refresh(inc)
    await manager.broadcast("incident.created", {
        "incident_id": inc.id,
        "severity": inc.severity,
        "status": inc.status,
        "risk_score": inc.risk_score
    })
    return inc
