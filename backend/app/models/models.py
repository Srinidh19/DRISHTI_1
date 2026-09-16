from sqlalchemy import Column, String, Integer, Float, Boolean, JSON, DateTime, Text
from datetime import datetime
from ..core.database import Base

class Camera(Base):
    __tablename__ = "cameras"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    bop = Column(String, nullable=False)
    zone = Column(String, nullable=False)
    type = Column(String, nullable=False) # Fixed, PTZ, IR, Thermal
    resolution = Column(String, default="1080p")
    fps = Column(Integer, default=25)
    latency_ms = Column(Integer, default=38)
    health = Column(String, default="ONLINE") # ONLINE, WARNING, OFFLINE, MAINTENANCE, ACTIVE_WATCH
    last_heartbeat = Column(String, default="1s ago")
    analytics_active = Column(Boolean, default=True)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    fov_heading = Column(Float, default=0.0)
    fov_angle = Column(Float, default=65.0)
    range_meters = Column(Float, default=300.0)
    stream_type = Column(String, default="optical") # optical, thermal, ir
    is_ptz_backup = Column(Boolean, default=False)
    backup_target_cam_id = Column(String, nullable=True)
    detected_objects = Column(JSON, default=list)

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    severity = Column(String, nullable=False) # INFORMATIONAL, LOW, HIGH, CRITICAL
    status = Column(String, default="NEW") # NEW, ACKNOWLEDGED, ASSIGNED, CONFIRMED, ESCALATED, DISMISSED, RESOLVED
    timestamp = Column(String, nullable=False)
    location = Column(String, nullable=False)
    bop = Column(String, nullable=False)
    zone = Column(String, nullable=False)
    primary_camera = Column(String, nullable=False)
    cameras = Column(JSON, default=list)
    object_type = Column(String, default="PERSON")
    object_count = Column(Integer, default=1)
    track_id = Column(String, nullable=True)
    direction = Column(String, nullable=True)
    speed_kmh = Column(Float, default=0.0)
    persistence_seconds = Column(Integer, default=0)
    confidence = Column(Float, default=0.90)
    risk_score = Column(Integer, default=50)
    description = Column(Text, default="")
    risk_breakdown = Column(JSON, default=dict)
    timeline = Column(JSON, default=list)
    notes = Column(JSON, default=list)
    assigned_to = Column(String, nullable=True)
    evidence_ids = Column(JSON, default=list)
    unified_fault = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class ObjectTrack(Base):
    __tablename__ = "object_tracks"

    id = Column(String, primary_key=True, index=True)
    object_type = Column(String, default="PERSON")
    origin_camera = Column(String, nullable=False)
    current_camera = Column(String, nullable=False)
    direction = Column(String, default="North → South")
    predicted_next_camera = Column(String, default="CAM-06")
    risk = Column(String, default="HIGH")
    active_duration_seconds = Column(Integer, default=0)
    related_incident_id = Column(String, nullable=False)
    current_speed_kmh = Column(Float, default=4.5)
    confidence = Column(Float, default=0.92)
    waypoints = Column(JSON, default=list)

class SwanWatchRequest(Base):
    __tablename__ = "swan_watch_requests"

    id = Column(String, primary_key=True, index=True)
    from_camera = Column(String, nullable=False)
    to_camera = Column(String, nullable=False)
    track_id = Column(String, nullable=False)
    status = Column(String, default="REQUESTED") # REQUESTED, ACCEPTED, ACTIVE, CONFIRMED, EXPIRED, CANCELLED
    timestamp = Column(String, nullable=False)
    eta_seconds = Column(Integer, default=6)
    confidence_score = Column(Float, default=0.92)

class ShieldFaultEvent(Base):
    __tablename__ = "shield_fault_events"

    id = Column(String, primary_key=True, index=True)
    camera_id = Column(String, nullable=False)
    camera_name = Column(String, nullable=False)
    condition = Column(String, nullable=False)
    detection_confidence = Column(Float, default=0.94)
    criticality = Column(String, default="HIGH")
    detected_at = Column(String, nullable=False)
    coverage_lost_percent = Column(Integer, default=12)
    coverage_restored_percent = Column(Integer, default=88)
    residual_blind_zone_percent = Column(Integer, default=12)
    backup_cameras = Column(JSON, default=list)
    maintenance_dispatched = Column(Boolean, default=False)
    maintenance_ticket_id = Column(String, nullable=True)

class VirtualFence(Base):
    __tablename__ = "virtual_fences"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    sector = Column(String, nullable=False)
    coordinates = Column(JSON, nullable=False)
    status = Column(String, default="INTACT") # INTACT, BREACHED

class RestrictedZone(Base):
    __tablename__ = "restricted_zones"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    coordinates = Column(JSON, nullable=False)
    fill_color = Column(String, default="#c93c3c")

class IncidentEvidence(Base):
    __tablename__ = "incident_evidence"

    id = Column(String, primary_key=True, index=True)
    time = Column(String, nullable=False)
    incident_id = Column(String, nullable=False, index=True)
    camera_id = Column(String, nullable=False)
    camera_name = Column(String, nullable=False)
    type = Column(String, nullable=False) # FENCE_CROSSING, PERSON, VEHICLE, FAULT
    status = Column(String, default="VERIFIED") # VERIFIED, REVIEW, ARCHIVED
    confidence = Column(Float, default=0.94)
    classification = Column(String, nullable=False)
    has_video_clip = Column(Boolean, default=False)
    clip_duration_seconds = Column(Integer, nullable=True)
    file_size_bytes = Column(Integer, default=1024000)
    hash_digest = Column(String, nullable=False) # SHA-256
    storage_reference = Column(String, nullable=True)
    audit_trail = Column(JSON, default=list)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(String, nullable=False)
    user_id = Column(String, nullable=False)
    role = Column(String, nullable=False)
    action = Column(String, nullable=False)
    resource = Column(String, nullable=False)
    resource_id = Column(String, nullable=False)
    result = Column(String, default="SUCCESS")
    metadata_json = Column(JSON, default=dict)

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False) # ADMIN, SUPERVISOR, OPERATOR
    status = Column(String, default="ACTIVE")
    badge_number = Column(String, nullable=False)
    station = Column(String, nullable=False)
    last_login = Column(String, default="Just now")
