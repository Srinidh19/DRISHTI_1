from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from ..core.database import get_db
from ..models.models import SwanWatchRequest, ObjectTrack, Camera
from ..schemas.schemas import SwanWatchRequestResponse

router = APIRouter(prefix="/swan", tags=["SWAN"])

@router.get("/watch-requests", response_model=List[SwanWatchRequestResponse])
def get_watch_requests(db: Session = Depends(get_db)):
    return db.query(SwanWatchRequest).all()

@router.get("/topology")
def get_swan_topology(db: Session = Depends(get_db)):
    # Graph topology of neighboring cameras and active watches
    return {
        "status": "ACTIVE",
        "nodes": [
            {"id": "CAM-03", "name": "Fence B IR", "role": "ORIGIN", "status": "CONFIRMED"},
            {"id": "CAM-04", "name": "East Tower Optical", "role": "ACTIVE_TRACK", "status": "CONFIRMED"},
            {"id": "CAM-06", "name": "Ridge Watch", "role": "PREDICTED", "status": "PENDING"}
        ],
        "edges": [
            {"source": "CAM-03", "target": "CAM-04", "status": "CONFIRMED", "vector": "168° South"},
            {"source": "CAM-04", "target": "CAM-06", "status": "PREDICTED", "vector": "210° South-West"}
        ]
    }
