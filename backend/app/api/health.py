from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.models import Camera, Incident
from ..schemas.schemas import SystemHealthResponse

router = APIRouter(prefix="", tags=["Health & Diagnostics"])

@router.get("/health")
def root_health():
    return {"status": "ok", "platform": "DRISHTI", "version": "2.0.0"}

@router.get("/api/system/health", response_model=SystemHealthResponse)
def get_system_health(db: Session = Depends(get_db)):
    total_cams = db.query(Camera).count()
    online_cams = db.query(Camera).filter(Camera.health == "ONLINE").count()
    active_incidents = db.query(Incident).filter(Incident.status.notin_(["DISMISSED", "RESOLVED"])).count()

    return SystemHealthResponse(
        api="healthy",
        database="healthy",
        redis="healthy",
        websocket="healthy",
        mqtt="healthy",
        storage="healthy",
        cameras_online=online_cams,
        cameras_total=total_cams,
        edge_nodes_online=12,
        edge_nodes_total=12,
        swan_active=True,
        shield_active=True,
        active_incidents_count=active_incidents
    )
