from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.models import ObjectTrack
from ..schemas.schemas import TrackResponse

router = APIRouter(prefix="/tracks", tags=["Tracks"])

@router.get("", response_model=List[TrackResponse])
def get_tracks(db: Session = Depends(get_db)):
    return db.query(ObjectTrack).all()

@router.get("/{track_id}", response_model=TrackResponse)
def get_track(track_id: str, db: Session = Depends(get_db)):
    track = db.query(ObjectTrack).filter(ObjectTrack.id == track_id).first()
    if not track:
        raise HTTPException(status_code=404, detail=f"Track {track_id} not found")
    return track
