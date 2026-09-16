from datetime import datetime
from sqlalchemy.orm import Session
from ..models.models import AuditLog
import uuid

class AuditService:
    @staticmethod
    def log(
        db: Session,
        user_id: str,
        role: str,
        action: str,
        resource: str,
        resource_id: str,
        result: str = "SUCCESS",
        metadata: dict = None
    ) -> AuditLog:
        now_str = datetime.utcnow().strftime("%H:%M:%S IST")
        audit_entry = AuditLog(
            id=f"AUD-{uuid.uuid4().hex[:8].upper()}",
            timestamp=now_str,
            user_id=user_id,
            role=role,
            action=action,
            resource=resource,
            resource_id=resource_id,
            result=result,
            metadata_json=metadata or {}
        )
        db.add(audit_entry)
        db.commit()
        db.refresh(audit_entry)
        return audit_entry

audit_service = AuditService()
