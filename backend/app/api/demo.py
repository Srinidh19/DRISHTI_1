from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..services.demo_engine import demo_engine
from ..models.models import Camera, Incident, VirtualFence, ShieldFaultEvent, SwanWatchRequest

router = APIRouter(prefix="/demo", tags=["Demo Simulation"])

@router.get("/state")
async def get_demo_state():
    return {
        "current_step": demo_engine.current_step,
        "is_playing": demo_engine.is_playing
    }

@router.post("/step/{step_num}")
async def trigger_demo_step(step_num: int, db: Session = Depends(get_db)):
    result = await demo_engine.execute_step(step_num, db)
    return result

@router.post("/track")
async def simulate_track(db: Session = Depends(get_db)):
    # Run Steps 2, 4, 7 (detection -> fence crossing -> SWAN confirmation)
    await demo_engine.execute_step(2, db)
    await demo_engine.execute_step(4, db)
    await demo_engine.execute_step(7, db)
    return {"status": "SUCCESS", "action": "SIMULATE_TRACK"}

@router.post("/fence-crossing")
async def simulate_fence_crossing(db: Session = Depends(get_db)):
    await demo_engine.execute_step(4, db)
    return {"status": "SUCCESS", "action": "SIMULATE_FENCE_CROSSING"}

@router.post("/camera-failure")
async def simulate_camera_failure(db: Session = Depends(get_db)):
    # Run Steps 12, 14, 16 (failure -> blind zone -> recovery)
    await demo_engine.execute_step(12, db)
    await demo_engine.execute_step(14, db)
    await demo_engine.execute_step(16, db)
    return {"status": "SUCCESS", "action": "SIMULATE_CAMERA_FAILURE"}

@router.post("/reset")
async def reset_demo_scenario(db: Session = Depends(get_db)):
    await demo_engine.execute_step(1, db)
    return {"status": "SUCCESS", "action": "RESET"}
