from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.models import User
from ..schemas.schemas import UserResponse, UserCreate, UserUpdate
from ..realtime.connection_manager import manager

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User {user_id} not found")
    return user

@router.post("", response_model=UserResponse)
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.id == user_data.id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"User {user_data.id} already exists")
    user = User(**user_data.dict())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, update_data: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User {user_id} not found")

    if update_data.name is not None:
        user.name = update_data.name
    if update_data.role is not None:
        user.role = update_data.role
    if update_data.status is not None:
        user.status = update_data.status
    if update_data.badge_number is not None:
        user.badge_number = update_data.badge_number
    if update_data.station is not None:
        user.station = update_data.station

    db.commit()
    db.refresh(user)

    await manager.broadcast("user.updated", {"user_id": user.id, "role": user.role, "status": user.status})
    return user
