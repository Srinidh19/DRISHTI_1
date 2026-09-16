from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.models import IncidentEvidence
from ..schemas.schemas import EvidenceResponse

router = APIRouter(prefix="/evidence", tags=["Evidence"])

@router.get("", response_model=List[EvidenceResponse])
def get_evidence_list(db: Session = Depends(get_db)):
    return db.query(IncidentEvidence).all()

@router.get("/{evidence_id}", response_model=EvidenceResponse)
def get_evidence(evidence_id: str, db: Session = Depends(get_db)):
    ev = db.query(IncidentEvidence).filter(IncidentEvidence.id == evidence_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail=f"Evidence {evidence_id} not found")
    return ev

@router.post("", response_model=EvidenceResponse)
async def create_evidence(ev_data: EvidenceResponse, db: Session = Depends(get_db)):
    existing = db.query(IncidentEvidence).filter(IncidentEvidence.id == ev_data.id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Evidence {ev_data.id} already exists")
    ev = IncidentEvidence(**ev_data.dict())
    db.add(ev)
    db.commit()
    db.refresh(ev)
    return ev
