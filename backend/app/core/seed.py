from sqlalchemy.orm import Session
from .database import SessionLocal, Base, engine
from ..models.models import (
    Camera, Incident, ObjectTrack, SwanWatchRequest, ShieldFaultEvent,
    VirtualFence, RestrictedZone, IncidentEvidence, AuditLog, User
)

def seed_database(db: Session):
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    if db.query(Camera).count() > 0:
        return # Already seeded

    # Seed Users
    users = [
        User(id="OP-042", name="SI R. Sharma", role="OPERATOR", status="ACTIVE", badge_number="BSF-OP-9482", station="BOP-17 Master Console", last_login="Today, 06:00 IST"),
        User(id="SUP-011", name="AC V. Singh", role="SUPERVISOR", status="ACTIVE", badge_number="BSF-SUP-2018", station="Sector HQ Ops Room", last_login="Today, 08:30 IST"),
        User(id="ADM-001", name="Tech Offr A. Kumar", role="ADMIN", status="ACTIVE", badge_number="TECH-SYS-0012", station="C4I Tech Center", last_login="Yesterday, 18:45 IST"),
    ]
    db.add_all(users)

    # Seed Virtual Fences
    fences = [
        VirtualFence(
            id="VF-ALPHA-01",
            name="Perimeter Virtual Fence Alpha (Zero Line)",
            sector="NORTH SECTOR / BOP-17",
            status="BREACHED",
            coordinates=[
                [32.7380, 74.8560],
                [32.7365, 74.8600],
                [32.7350, 74.8640],
                [32.7335, 74.8680],
                [32.7315, 74.8720],
                [32.7295, 74.8760]
            ]
        ),
        VirtualFence(
            id="VF-BRAVO-02",
            name="Secondary Tactical Obstacle Fence",
            sector="NORTH SECTOR / BOP-17",
            status="INTACT",
            coordinates=[
                [32.7360, 74.8550],
                [32.7345, 74.8590],
                [32.7330, 74.8630],
                [32.7315, 74.8670],
                [32.7295, 74.8710]
            ]
        )
    ]
    db.add_all(fences)

    # Seed Restricted Zones
    zones = [
        RestrictedZone(
            id="ZONE-RESTRICTED-A",
            name="Zero Line Restricted Strip (150m)",
            type="CRITICAL_PERIMETER",
            fill_color="#c93c3c",
            coordinates=[
                [32.7390, 74.8550],
                [32.7375, 74.8610],
                [32.7355, 74.8660],
                [32.7335, 74.8710],
                [32.7310, 74.8760],
                [32.7290, 74.8740],
                [32.7315, 74.8690],
                [32.7335, 74.8640],
                [32.7355, 74.8580],
                [32.7370, 74.8530]
            ]
        ),
        RestrictedZone(
            id="ZONE-BUFFER-B",
            name="BOP-17 Patrol Corridor & Approach",
            type="PATROL_TRACK",
            fill_color="#477da8",
            coordinates=[
                [32.7350, 74.8580],
                [32.7335, 74.8640],
                [32.7315, 74.8690],
                [32.7290, 74.8740],
                [32.7265, 74.8700],
                [32.7285, 74.8650],
                [32.7310, 74.8600],
                [32.7330, 74.8550]
            ]
        )
    ]
    db.add_all(zones)

    # Seed Cameras
    cameras = [
        Camera(id="CAM-01", name="CAM-01", location="North Fence", bop="BOP-17", zone="Zone North-A", type="Fixed", resolution="1080p", fps=24, latency_ms=38, health="ONLINE", last_heartbeat="1s ago", analytics_active=True, lat=32.7372, lng=74.8580, fov_heading=135.0, fov_angle=65.0, range_meters=280.0, stream_type="optical", detected_objects=[]),
        Camera(id="CAM-02", name="CAM-02", location="Road Entry", bop="BOP-17", zone="Zone Alpha Entry", type="PTZ", resolution="1080p", fps=25, latency_ms=42, health="ONLINE", last_heartbeat="1s ago", analytics_active=True, lat=32.7340, lng=74.8590, fov_heading=45.0, fov_angle=75.0, range_meters=350.0, stream_type="optical", detected_objects=[{"id": "det-02-1", "label": "VEHICLE", "confidence": 0.88, "bbox": [35, 45, 28, 22], "trackId": "T-203"}]),
        Camera(id="CAM-03", name="CAM-03", location="Fence B", bop="BOP-17", zone="Zone Fence-B", type="IR", resolution="720p", fps=24, latency_ms=44, health="WARNING", last_heartbeat="2s ago", analytics_active=True, lat=32.7350, lng=74.8635, fov_heading=160.0, fov_angle=70.0, range_meters=320.0, stream_type="thermal", detected_objects=[{"id": "det-03-1", "label": "PERSON", "confidence": 0.94, "bbox": [48, 52, 14, 26], "trackId": "T-104"}]),
        Camera(id="CAM-04", name="CAM-04", location="East Tower", bop="BOP-17", zone="Zone Tower-East", type="Fixed", resolution="1080p", fps=25, latency_ms=35, health="ONLINE", last_heartbeat="1s ago", analytics_active=True, lat=32.7330, lng=74.8670, fov_heading=220.0, fov_angle=80.0, range_meters=400.0, stream_type="optical", detected_objects=[{"id": "det-04-1", "label": "PERSON", "confidence": 0.92, "bbox": [22, 60, 16, 28], "trackId": "T-104"}]),
        Camera(id="CAM-05", name="CAM-05", location="Patrol Road", bop="BOP-17", zone="Zone Patrol-South", type="Fixed", resolution="1080p", fps=24, latency_ms=52, health="OFFLINE", last_heartbeat="14m ago", analytics_active=False, lat=32.7290, lng=74.8660, fov_heading=0.0, fov_angle=60.0, range_meters=250.0, stream_type="optical", detected_objects=[]),
        Camera(id="CAM-06", name="CAM-06", location="Ridge Watch", bop="BOP-17", zone="Zone Ridge-6", type="Fixed", resolution="1080p", fps=25, latency_ms=41, health="ONLINE", last_heartbeat="1s ago", analytics_active=True, lat=32.7310, lng=74.8710, fov_heading=250.0, fov_angle=75.0, range_meters=380.0, stream_type="optical", detected_objects=[]),
        Camera(id="CAM-07", name="CAM-07", location="Gate Alpha", bop="BOP-17", zone="Zone Gate-Alpha", type="PTZ", resolution="1080p", fps=25, latency_ms=39, health="ONLINE", last_heartbeat="1s ago", analytics_active=True, lat=32.7360, lng=74.8610, fov_heading=180.0, fov_angle=70.0, range_meters=300.0, stream_type="optical", detected_objects=[]),
        Camera(id="CAM-11", name="CAM-11", location="South Sector Line", bop="BOP-17", zone="Zone South-11", type="IR", resolution="1080p", fps=24, latency_ms=48, health="ONLINE", last_heartbeat="1s ago", analytics_active=True, lat=32.7280, lng=74.8720, fov_heading=310.0, fov_angle=75.0, range_meters=350.0, stream_type="thermal", detected_objects=[]),
        Camera(id="CAM-TOWER-01", name="CAM-TOWER-01", location="Perimeter Tower 1", bop="BOP-17", zone="Zone High-Overwatch", type="PTZ", resolution="1080p", fps=30, latency_ms=32, health="ONLINE", last_heartbeat="1s ago", analytics_active=True, lat=32.7365, lng=74.8655, fov_heading=195.0, fov_angle=90.0, range_meters=550.0, stream_type="optical", is_ptz_backup=True, backup_target_cam_id="CAM-03", detected_objects=[]),
        Camera(id="CAM-ROAD-05", name="CAM-ROAD-05", location="High Mast Road 5", bop="BOP-17", zone="Zone Mast-Road", type="PTZ", resolution="1080p", fps=30, latency_ms=35, health="ONLINE", last_heartbeat="1s ago", analytics_active=True, lat=32.7320, lng=74.8615, fov_heading=35.0, fov_angle=85.0, range_meters=450.0, stream_type="optical", is_ptz_backup=True, backup_target_cam_id="CAM-03", detected_objects=[])
    ]
    # Add auxiliary nodes to reach 50 total cameras
    for idx in range(40):
        cam_num = idx + 12
        bop_name = "BOP-17" if cam_num < 26 else "BOP-18" if cam_num < 38 else "BOP-19"
        lat_offset = ((idx % 7) - 3) * 0.003
        lng_offset = (((idx * 3) % 9) - 4) * 0.003
        is_warn = (cam_num == 19)
        cameras.append(
            Camera(
                id=f"CAM-{cam_num:02d}",
                name=f"CAM-{cam_num:02d}",
                location=f"{bop_name} Sector Link {cam_num}",
                bop=bop_name,
                zone=f"Zone Aux-{cam_num}",
                type="PTZ" if cam_num % 3 == 0 else "IR" if cam_num % 5 == 0 else "Fixed",
                resolution="1080p",
                fps=24 + (cam_num % 2),
                latency_ms=35 + (cam_num % 25),
                health="WARNING" if is_warn else "ONLINE",
                last_heartbeat=f"{(idx % 4) + 1}s ago",
                analytics_active=True,
                lat=32.7325 + lat_offset,
                lng=74.8645 + lng_offset,
                fov_heading=(idx * 37) % 360,
                fov_angle=65.0,
                range_meters=260.0 + (cam_num * 3),
                stream_type="thermal" if cam_num % 5 == 0 else "optical",
                detected_objects=[]
            )
        )
    db.add_all(cameras)

    # Seed Incidents
    incidents = [
        Incident(
            id="INC-2026-0142",
            title="Restricted-zone intrusion",
            severity="CRITICAL",
            status="CONFIRMED",
            timestamp="02:14:06 IST",
            location="Sector North / Fence B",
            bop="BOP-17",
            zone="Zone Fence-B",
            primary_camera="CAM-03",
            cameras=["CAM-03", "CAM-04", "CAM-06"],
            object_type="PERSON",
            object_count=2,
            track_id="T-104",
            direction="North → South",
            speed_kmh=4.8,
            persistence_seconds=43,
            confidence=0.94,
            risk_score=92,
            description="Two individuals detected breaching Perimeter Virtual Fence Alpha heading south into tactical sector. SWAN confirmed target handoff from CAM-03 to CAM-04. Predicted next camera node: CAM-06.",
            risk_breakdown={"zone_criticality": 25, "fence_crossing": 25, "multi_camera_confirm": 20, "movement_direction": 12, "activity": 6, "evidence_quality": 4},
            timeline=[
                {"time": "02:14:02 IST", "title": "Target Acquisition", "description": "YOLO Edge detected 2 person signatures at outer perimeter (CAM-03)"},
                {"time": "02:14:06 IST", "title": "Fence Crossing", "description": "Virtual Fence Alpha breached (32.7350N, 74.8640E)"},
                {"time": "02:14:12 IST", "title": "SWAN Watch Request", "description": "SWAN calculated trajectory vector heading 168°; triggered CAM-04 priority watch"},
                {"time": "02:14:18 IST", "title": "CAM-04 Multi-Camera Confirmation", "description": "CAM-04 confirmed persistent Track T-104 with 0.92 confidence"},
                {"time": "02:14:28 IST", "title": "Risk Escalation", "description": "Risk score fused to 92/100 (Multi-camera confirmed intrusion)"}
            ],
            notes=[{"id": "n-1", "author": "OP-042 (SI R. Sharma)", "timestamp": "02:15:10 IST", "text": "Visual confirmation on CAM-03 thermal and CAM-04 optical. Movement is deliberate, tactical cadence. Alerted QRT Post Alpha."}],
            assigned_to="OP-042",
            evidence_ids=["EVD-0142-A", "EVD-0142-B"],
            unified_fault=True
        ),
        Incident(
            id="INC-2026-0143",
            title="Virtual-fence crossing attempt",
            severity="HIGH",
            status="NEW",
            timestamp="02:08:15 IST",
            location="Gate Alpha Approach",
            bop="BOP-17",
            zone="Zone Gate-Alpha",
            primary_camera="CAM-07",
            cameras=["CAM-07", "CAM-03"],
            object_type="PERSON",
            object_count=1,
            track_id="T-118",
            direction="West → East",
            speed_kmh=3.2,
            persistence_seconds=28,
            confidence=0.86,
            risk_score=78,
            description="Single individual loitering within 20m of perimeter gate. Trajectory indicates approach towards Virtual Fence Alpha.",
            risk_breakdown={"zone_criticality": 20, "fence_crossing": 0, "multi_camera_confirm": 0, "movement_direction": 12, "activity": 5, "evidence_quality": 3},
            timeline=[{"time": "02:08:15 IST", "title": "Detection", "description": "CAM-07 detected single person approaching perimeter zone"}],
            notes=[],
            evidence_ids=["EVD-0143-A"]
        ),
        Incident(
            id="INC-2026-0135",
            title="Vehicle anomaly",
            severity="LOW",
            status="ASSIGNED",
            timestamp="01:52:10 IST",
            location="Road Entry Alpha",
            bop="BOP-17",
            zone="Zone Alpha Entry",
            primary_camera="CAM-02",
            cameras=["CAM-02"],
            object_type="VEHICLE",
            object_count=1,
            track_id="T-203",
            direction="Approach → Checkpoint Alpha",
            speed_kmh=18.5,
            persistence_seconds=95,
            confidence=0.91,
            risk_score=34,
            description="Unscheduled transport vehicle slowed near checkpoint barrier. ANPR read candidate plate JK-02-AB-9104.",
            risk_breakdown={"zone_criticality": 10, "fence_crossing": 0, "multi_camera_confirm": 0, "movement_direction": 5, "activity": 3, "evidence_quality": 4},
            timeline=[{"time": "01:52:10 IST", "title": "Vehicle Detected", "description": "Approach speed 18 km/h"}],
            notes=[],
            assigned_to="OP-042",
            evidence_ids=["EVD-0135-A"]
        ),
        Incident(
            id="INC-2026-0139",
            title="Wildlife / stray cattle perimeter proximity",
            severity="INFORMATIONAL",
            status="DISMISSED",
            timestamp="01:24:40 IST",
            location="South Sector Line",
            bop="BOP-17",
            zone="Zone South-11",
            primary_camera="CAM-11",
            cameras=["CAM-11"],
            object_type="ANOMALY",
            object_count=3,
            direction="South → West",
            speed_kmh=2.1,
            persistence_seconds=120,
            confidence=0.95,
            risk_score=18,
            description="Thermal IR signature classified as bovine/wildlife herd moving along dry stream bed outside perimeter.",
            risk_breakdown={"zone_criticality": 10, "fence_crossing": 0, "multi_camera_confirm": 0, "movement_direction": 0, "activity": 2, "evidence_quality": 4},
            timeline=[{"time": "01:24:40 IST", "title": "Detection", "description": "Thermal signature identified with 0.95 confidence as quadruped"}],
            notes=[],
            evidence_ids=[]
        )
    ]
    db.add_all(incidents)

    # Seed Tracks
    tracks = [
        ObjectTrack(
            id="T-104",
            object_type="PERSON",
            origin_camera="CAM-03",
            current_camera="CAM-04",
            direction="North → South",
            predicted_next_camera="CAM-06",
            risk="CRITICAL",
            active_duration_seconds=43,
            related_incident_id="INC-2026-0142",
            current_speed_kmh=4.8,
            confidence=0.94,
            waypoints=[
                {"lat": 32.7360, "lng": 74.8625, "timestamp": "02:14:02 IST", "camera": "CAM-03"},
                {"lat": 32.7352, "lng": 74.8638, "timestamp": "02:14:06 IST", "camera": "CAM-03"},
                {"lat": 32.7344, "lng": 74.8652, "timestamp": "02:14:14 IST", "camera": "CAM-03 / SWAN"},
                {"lat": 32.7336, "lng": 74.8665, "timestamp": "02:14:22 IST", "camera": "CAM-04"},
                {"lat": 32.7328, "lng": 74.8678, "timestamp": "02:14:35 IST", "camera": "CAM-04"}
            ]
        ),
        ObjectTrack(
            id="T-118",
            object_type="PERSON",
            origin_camera="CAM-07",
            current_camera="CAM-07",
            direction="West → East",
            predicted_next_camera="CAM-03",
            risk="HIGH",
            active_duration_seconds=28,
            related_incident_id="INC-2026-0143",
            current_speed_kmh=3.2,
            confidence=0.86,
            waypoints=[
                {"lat": 32.7362, "lng": 74.8605, "timestamp": "02:08:15 IST", "camera": "CAM-07"},
                {"lat": 32.7359, "lng": 74.8612, "timestamp": "02:08:32 IST", "camera": "CAM-07"}
            ]
        ),
        ObjectTrack(
            id="T-203",
            object_type="VEHICLE",
            origin_camera="CAM-02",
            current_camera="CAM-02",
            direction="Approach → Checkpoint Alpha",
            predicted_next_camera="CAM-01",
            risk="LOW",
            active_duration_seconds=95,
            related_incident_id="INC-2026-0135",
            current_speed_kmh=18.5,
            confidence=0.91,
            waypoints=[
                {"lat": 32.7335, "lng": 74.8575, "timestamp": "01:52:10 IST", "camera": "CAM-02"},
                {"lat": 32.7340, "lng": 74.8585, "timestamp": "01:53:20 IST", "camera": "CAM-02"}
            ]
        )
    ]
    db.add_all(tracks)

    # Seed SWAN Watch Requests
    swan_reqs = [
        SwanWatchRequest(id="SWAN-REQ-0042", from_camera="CAM-03", to_camera="CAM-04", track_id="T-104", status="CONFIRMED", timestamp="02:14:15 IST", eta_seconds=5, confidence_score=0.94),
        SwanWatchRequest(id="SWAN-REQ-0043", from_camera="CAM-04", to_camera="CAM-06", track_id="T-104", status="ACTIVE", timestamp="02:14:30 IST", eta_seconds=14, confidence_score=0.89)
    ]
    db.add_all(swan_reqs)

    # Seed SHIELD Faults
    shield_faults = [
        ShieldFaultEvent(
            id="SHIELD-0081",
            camera_id="CAM-03",
            camera_name="CAM-03 (Fence B IR)",
            condition="Lens obstruction suspected",
            detection_confidence=0.94,
            criticality="HIGH",
            detected_at="02:18:42 IST",
            coverage_lost_percent=12,
            coverage_restored_percent=88,
            residual_blind_zone_percent=12,
            backup_cameras=[
                {"cameraId": "CAM-TOWER-01", "cameraName": "CAM-TOWER-01 (PTZ)", "status": "ACTIVE", "coverageContributionPercent": 58},
                {"cameraId": "CAM-ROAD-05", "cameraName": "CAM-ROAD-05 (PTZ)", "status": "ACTIVE", "coverageContributionPercent": 30}
            ],
            maintenance_dispatched=True,
            maintenance_ticket_id="WO-BOP17-2026-089"
        )
    ]
    db.add_all(shield_faults)

    # Seed Evidence
    evidence_items = [
        IncidentEvidence(
            id="EVD-0142-A",
            time="02:14:06 IST",
            incident_id="INC-2026-0142",
            camera_id="CAM-03",
            camera_name="CAM-03 (Fence B IR)",
            type="FENCE_CROSSING",
            status="VERIFIED",
            confidence=0.94,
            classification="Virtual-Fence Breach (2 persons)",
            has_video_clip=True,
            clip_duration_seconds=18,
            file_size_bytes=14205800,
            hash_digest="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            audit_trail=[
                {"id": "aud-1", "timestamp": "02:14:06 IST", "action": "CREATED", "operatorId": "SYSTEM (YOLO-Edge)", "notes": "Automatic snapshot and clip lock triggered by fence breach"},
                {"id": "aud-2", "timestamp": "02:15:10 IST", "action": "VERIFIED", "operatorId": "OP-042", "notes": "Verified target count and direction"}
            ]
        ),
        IncidentEvidence(
            id="EVD-0142-B",
            time="02:14:18 IST",
            incident_id="INC-2026-0142",
            camera_id="CAM-04",
            camera_name="CAM-04 (East Tower Optical)",
            type="PERSON",
            status="VERIFIED",
            confidence=0.92,
            classification="Multi-Camera Handoff Confirmation (Track T-104)",
            has_video_clip=True,
            clip_duration_seconds=24,
            file_size_bytes=19842100,
            hash_digest="a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
            audit_trail=[
                {"id": "aud-3", "timestamp": "02:14:18 IST", "action": "CREATED", "operatorId": "SYSTEM (SWAN)", "notes": "Target correlated and recorded from CAM-04"},
                {"id": "aud-4", "timestamp": "02:15:20 IST", "action": "ESCALATED", "operatorId": "OP-042", "notes": "Escalated to High Command QRT dispatch"}
            ]
        ),
        IncidentEvidence(
            id="EVD-0143-A",
            time="02:08:15 IST",
            incident_id="INC-2026-0143",
            camera_id="CAM-07",
            camera_name="CAM-07 (Gate Alpha PTZ)",
            type="PERSON",
            status="REVIEW",
            confidence=0.86,
            classification="Perimeter Proximity Loitering",
            has_video_clip=True,
            clip_duration_seconds=15,
            file_size_bytes=11200400,
            hash_digest="bc23f99e32e8f192b476e3d23194a20b221074e64f89d311894d7b736b4728b1",
            audit_trail=[{"id": "aud-5", "timestamp": "02:08:15 IST", "action": "CREATED", "operatorId": "SYSTEM (YOLO-Edge)", "notes": "Loitering threshold exceeded 20s"}]
        ),
        IncidentEvidence(
            id="EVD-0135-A",
            time="01:52:10 IST",
            incident_id="INC-2026-0135",
            camera_id="CAM-02",
            camera_name="CAM-02 (Road Entry PTZ)",
            type="VEHICLE",
            status="VERIFIED",
            confidence=0.91,
            classification="Vehicle Approach Anomaly (Candidate ANPR)",
            has_video_clip=False,
            file_size_bytes=2450000,
            hash_digest="7d1a54127b222502f5b79b5fb0803061152a44f92b37e23c65dd0e336d10e808",
            audit_trail=[{"id": "aud-6", "timestamp": "01:52:10 IST", "action": "CREATED", "operatorId": "SYSTEM (ANPR)", "notes": "Plate read candidate JK-02-AB-9104"}]
        )
    ]
    db.add_all(evidence_items)

    # Seed Audit Log entries
    audit_logs = [
        AuditLog(id="AUD-001", timestamp="02:18:42 IST", user_id="SYSTEM (SHIELD)", role="SYSTEM", action="FAULT_DETECTED", resource="CAMERA_FAULT", resource_id="CAM-03", result="SUCCESS", metadata_json={"condition": "Lens obstruction suspected"}),
        AuditLog(id="AUD-002", timestamp="02:15:10 IST", user_id="OP-042", role="OPERATOR", action="INCIDENT_CONFIRMED", resource="INCIDENT", resource_id="INC-2026-0142", result="SUCCESS", metadata_json={"notes": "Visual confirmation on dual sensors"}),
        AuditLog(id="AUD-003", timestamp="02:14:18 IST", user_id="SYSTEM (SWAN)", role="SYSTEM", action="HANDOFF_CONFIRMED", resource="SWAN_REQUEST", resource_id="SWAN-REQ-0042", result="SUCCESS", metadata_json={"camera": "CAM-04"}),
        AuditLog(id="AUD-004", timestamp="02:14:06 IST", user_id="SYSTEM (YOLO)", role="SYSTEM", action="FENCE_BREACH", resource="VIRTUAL_FENCE", resource_id="VF-ALPHA-01", result="SUCCESS", metadata_json={"sector": "BOP-17"})
    ]
    db.add_all(audit_logs)

    db.commit()
