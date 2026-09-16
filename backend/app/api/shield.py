from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.models import ShieldFaultEvent
from ..schemas.schemas import ShieldFaultResponse
from ..services.audit_service import audit_service
from ..realtime.connection_manager import manager

router = APIRouter(prefix="/shield", tags=["SHIELD"])

@router.get("/faults", response_model=List[ShieldFaultResponse])
def get_shield_faults(db: Session = Depends(get_db)):
    return db.query(ShieldFaultEvent).all()

@router.post("/faults/{fault_id}/dispatch", response_model=ShieldFaultResponse)
async def dispatch_shield_maintenance(
    fault_id: str,
    user_id: str = "OP-042",
    db: Session = Depends(get_db)
):
    fault = db.query(ShieldFaultEvent).filter(ShieldFaultEvent.id == fault_id).first()
    if not fault:
        raise HTTPException(status_code=404, detail=f"Fault {fault_id} not found")

    fault.maintenance_dispatched = True
    fault.maintenance_ticket_id = f"WO-BOP17-{abs(hash(fault_id)) % 8999 + 1000}"
    db.commit()
    db.refresh(fault)

    audit_service.log(
        db=db,
        user_id=user_id,
        role="OPERATOR",
        action="MAINTENANCE_DISPATCHED",
        resource="CAMERA_FAULT",
        resource_id=fault.camera_id,
        metadata={"ticket": fault.maintenance_ticket_id}
    )

    await manager.broadcast("shield.maintenance_dispatched", {
        "fault_id": fault.id,
        "camera_id": fault.camera_id,
        "ticket": fault.maintenance_ticket_id
    })
    return fault
