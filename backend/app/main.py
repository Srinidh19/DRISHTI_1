from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .core.config import settings
from .core.database import engine, Base, SessionLocal
from .core.seed import seed_database
from .realtime.connection_manager import manager

# Import routers
from .api import cameras, incidents, tracks, zones, evidence, swan, shield, health, audit, demo, users

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB & Seed Data
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="DRISHTI — Intelligent Border Surveillance & Response Platform",
    description="C4I Border Security Operations Center Platform with Realtime SWAN & SHIELD Engines",
    version="2.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow local frontend development access
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root Endpoint
@app.get("/")
def root_info():
    return {
        "platform": "DRISHTI",
        "doctrine": "Detect locally -> verify through multiple signals -> correlate -> assess risk -> preserve evidence -> human operator decides",
        "version": "2.0.0",
        "docs_url": "/docs",
        "health_url": "/health",
        "api_v1": settings.API_V1_STR
    }

# WebSocket Endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep-alive receive
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

# Include API Routers under /api
app.include_router(health.router)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(cameras.router, prefix=settings.API_V1_STR)
app.include_router(incidents.router, prefix=settings.API_V1_STR)
app.include_router(tracks.router, prefix=settings.API_V1_STR)
app.include_router(zones.router, prefix=settings.API_V1_STR)
app.include_router(evidence.router, prefix=settings.API_V1_STR)
app.include_router(swan.router, prefix=settings.API_V1_STR)
app.include_router(shield.router, prefix=settings.API_V1_STR)
app.include_router(audit.router, prefix=settings.API_V1_STR)
app.include_router(demo.router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    import sys
    from pathlib import Path
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
