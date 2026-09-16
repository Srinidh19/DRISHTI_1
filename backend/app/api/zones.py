from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.models import VirtualFence, RestrictedZone
from ..schemas.schemas import VirtualFenceResponse, RestrictedZoneResponse, VirtualFenceCreate, RestrictedZoneCreate
from ..realtime.connection_manager import manager

router = APIRouter(prefix="", tags=["Zones & Fences"])

@router.get("/fences", response_model=List[VirtualFenceResponse])
def get_fences(db: Session = Depends(get_db)):
    return db.query(VirtualFence).all()

@router.post("/fences", response_model=VirtualFenceResponse)
async def create_fence(fence_data: VirtualFenceCreate, db: Session = Depends(get_db)):
    existing = db.query(VirtualFence).filter(VirtualFence.id == fence_data.id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Fence {fence_data.id} already exists")
    fence = VirtualFence(**fence_data.dict())
    db.add(fence)
    db.commit()
    db.refresh(fence)
    await manager.broadcast("fence.created", {"fence_id": fence.id})
    return fence

@router.get("/zones", response_model=List[RestrictedZoneResponse])
def get_zones(db: Session = Depends(get_db)):
    return db.query(RestrictedZone).all()

@router.post("/zones", response_model=RestrictedZoneResponse)
async def create_zone(zone_data: RestrictedZoneCreate, db: Session = Depends(get_db)):
    existing = db.query(RestrictedZone).filter(RestrictedZone.id == zone_data.id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Zone {zone_data.id} already exists")
    zone = RestrictedZone(**zone_data.dict())
    db.add(zone)
    db.commit()
    db.refresh(zone)
    await manager.broadcast("zone.created", {"zone_id": zone.id})
    return zone
