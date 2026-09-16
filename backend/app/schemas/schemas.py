from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class CameraBase(BaseModel):
    id: str
    name: str
    location: str
    bop: str
    zone: str
    type: str
    resolution: str = "1080p"
    fps: int = 25
    latency_ms: int = 38
    health: str = "ONLINE"
    last_heartbeat: str = "1s ago"
    analytics_active: bool = True
    lat: float
    lng: float
    fov_heading: float = 0.0
    fov_angle: float = 65.0
    range_meters: float = 300.0
    stream_type: str = "optical"
    is_ptz_backup: bool = False
    backup_target_cam_id: Optional[str] = None
    detected_objects: List[Dict[str, Any]] = []

class CameraResponse(CameraBase):
    class Config:
        from_attributes = True

class CameraUpdate(BaseModel):
    health: Optional[str] = None
    analytics_active: Optional[bool] = None
    is_ptz_backup: Optional[bool] = None
    backup_target_cam_id: Optional[str] = None
    detected_objects: Optional[List[Dict[str, Any]]] = None

class IncidentActionRequest(BaseModel):
    action: str # confirm, dismiss, escalate, assign, annotate
    user_id: str
    role: str = "OPERATOR"
    note: Optional[str] = None
    assignee: Optional[str] = None

class IncidentBase(BaseModel):
    id: str
    title: str
    severity: str
    status: str = "NEW"
    timestamp: str
    location: str
    bop: str
    zone: str
    primary_camera: str
    cameras: List[str] = []
    object_type: str = "PERSON"
    object_count: int = 1
    track_id: Optional[str] = None
    direction: Optional[str] = None
    speed_kmh: float = 0.0
    persistence_seconds: int = 0
    confidence: float = 0.90
    risk_score: int = 50
    description: str = ""
    risk_breakdown: Dict[str, int] = {}
    timeline: List[Dict[str, Any]] = []
    notes: List[Dict[str, Any]] = []
    assigned_to: Optional[str] = None
    evidence_ids: List[str] = []
    unified_fault: bool = False

class IncidentResponse(IncidentBase):
    class Config:
        from_attributes = True

class TrackResponse(BaseModel):
    id: str
    object_type: str
    origin_camera: str
    current_camera: str
    direction: str
    predicted_next_camera: str
    risk: str
    active_duration_seconds: int
    related_incident_id: str
    current_speed_kmh: float
    confidence: float
    waypoints: List[Dict[str, Any]] = []

    class Config:
        from_attributes = True

class SwanWatchRequestResponse(BaseModel):
    id: str
    from_camera: str
    to_camera: str
    track_id: str
    status: str
    timestamp: str
    eta_seconds: int
    confidence_score: float

    class Config:
        from_attributes = True

class ShieldFaultResponse(BaseModel):
    id: str
    camera_id: str
    camera_name: str
    condition: str
    detection_confidence: float
    criticality: str
    detected_at: str
    coverage_lost_percent: int
    coverage_restored_percent: int
    residual_blind_zone_percent: int
    backup_cameras: List[Dict[str, Any]] = []
    maintenance_dispatched: bool = False
    maintenance_ticket_id: Optional[str] = None

    class Config:
        from_attributes = True

class VirtualFenceResponse(BaseModel):
    id: str
    name: str
    sector: str
    coordinates: List[List[float]]
    status: str

    class Config:
        from_attributes = True

class RestrictedZoneResponse(BaseModel):
    id: str
    name: str
    type: str
    coordinates: List[List[float]]
    fill_color: str

    class Config:
        from_attributes = True

class EvidenceResponse(BaseModel):
    id: str
    time: str
    incident_id: str
    camera_id: str
    camera_name: str
    type: str
    status: str
    confidence: float
    classification: str
    has_video_clip: bool
    clip_duration_seconds: Optional[int] = None
    file_size_bytes: int
    hash_digest: str
    storage_reference: Optional[str] = None
    audit_trail: List[Dict[str, Any]] = []

    class Config:
        from_attributes = True

class AuditLogResponse(BaseModel):
    id: str
    timestamp: str
    user_id: str
    role: str
    action: str
    resource: str
    resource_id: str
    result: str
    metadata_json: Dict[str, Any] = {}

    class Config:
        from_attributes = True

class SystemHealthResponse(BaseModel):
    api: str = "healthy"
    database: str = "healthy"
    redis: str = "healthy"
    websocket: str = "healthy"
    mqtt: str = "healthy"
    storage: str = "healthy"
    cameras_online: int
    cameras_total: int
    edge_nodes_online: int
    edge_nodes_total: int
    swan_active: bool = True
    shield_active: bool = True
    active_incidents_count: int

class UserBase(BaseModel):
    id: str
    name: str
    role: str # ADMIN, SUPERVISOR, OPERATOR
    status: str = "ACTIVE"
    badge_number: str
    station: str
    last_login: str = "Just now"

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None
    badge_number: Optional[str] = None
    station: Optional[str] = None

class UserResponse(UserBase):
    class Config:
        from_attributes = True

class CameraCreate(CameraBase):
    pass

class IncidentCreate(IncidentBase):
    pass

class VirtualFenceCreate(BaseModel):
    id: str
    name: str
    sector: str
    coordinates: List[List[float]]
    status: str = "INTACT"

class RestrictedZoneCreate(BaseModel):
    id: str
    name: str
    type: str
    coordinates: List[List[float]]
    fill_color: str = "#c93c3c"

class EvidenceCreate(BaseModel):
    id: str
    time: str
    incident_id: str
    camera_id: str
    camera_name: str
    type: str
    status: str = "VERIFIED"
    confidence: float = 0.94
    classification: str
    has_video_clip: bool = False
    clip_duration_seconds: Optional[int] = None
    file_size_bytes: int = 1024000
    hash_digest: str
    storage_reference: Optional[str] = None
    audit_trail: List[Dict[str, Any]] = []
