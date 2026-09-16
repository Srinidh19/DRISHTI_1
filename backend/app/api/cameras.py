from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.models import Camera
from ..schemas.schemas import CameraResponse, CameraUpdate
from ..realtime.connection_manager import manager

router = APIRouter(prefix="/cameras", tags=["Cameras"])

@router.get("", response_model=List[CameraResponse])
def get_cameras(db: Session = Depends(get_db)):
    return db.query(Camera).all()

@router.get("/{camera_id}", response_model=CameraResponse)
def get_camera(camera_id: str, db: Session = Depends(get_db)):
    cam = db.query(Camera).filter(Camera.id == camera_id).first()
    if not cam:
        raise HTTPException(status_code=404, detail=f"Camera {camera_id} not found")
    return cam

@router.patch("/{camera_id}", response_model=CameraResponse)
async def update_camera(camera_id: str, update_data: CameraUpdate, db: Session = Depends(get_db)):
    cam = db.query(Camera).filter(Camera.id == camera_id).first()
    if not cam:
        raise HTTPException(status_code=404, detail=f"Camera {camera_id} not found")

    if update_data.health is not None:
        cam.health = update_data.health
    if update_data.analytics_active is not None:
        cam.analytics_active = update_data.analytics_active
    if update_data.is_ptz_backup is not None:
        cam.is_ptz_backup = update_data.is_ptz_backup
    if update_data.backup_target_cam_id is not None:
        cam.backup_target_cam_id = update_data.backup_target_cam_id
    if update_data.detected_objects is not None:
        cam.detected_objects = update_data.detected_objects

    db.commit()
    db.refresh(cam)

    await manager.broadcast("camera.status_changed", {"camera_id": cam.id, "health": cam.health})
    return cam

@router.post("", response_model=CameraResponse)
async def create_camera(cam_data: CameraResponse, db: Session = Depends(get_db)):
    existing = db.query(Camera).filter(Camera.id == cam_data.id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Camera {cam_data.id} already exists")
    cam = Camera(**cam_data.dict())
    db.add(cam)
    db.commit()
    db.refresh(cam)
    await manager.broadcast("camera.created", {"camera_id": cam.id})
    return cam

@router.post("/{camera_id}/slew")
async def slew_camera(camera_id: str, pan: float = 0.0, tilt: float = 0.0, zoom: float = 1.0, db: Session = Depends(get_db)):
    cam = db.query(Camera).filter(Camera.id == camera_id).first()
    if not cam:
        raise HTTPException(status_code=404, detail=f"Camera {camera_id} not found")
    cam.fov_heading = (cam.fov_heading + pan) % 360.0
    db.commit()
    db.refresh(cam)
    await manager.broadcast("camera.ptz_slewed", {"camera_id": cam.id, "fov_heading": cam.fov_heading, "pan": pan, "tilt": tilt, "zoom": zoom})
    return {"status": "SUCCESS", "camera_id": cam.id, "fov_heading": cam.fov_heading}
