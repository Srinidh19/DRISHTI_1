from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.models import AuditLog
from ..schemas.schemas import AuditLogResponse

router = APIRouter(prefix="/audit", tags=["Audit"])

@router.get("", response_model=List[AuditLogResponse])
def get_audit_logs(limit: int = 50, db: Session = Depends(get_db)):
    return db.query(AuditLog).order_by(AuditLog.id.desc()).limit(limit).all()
