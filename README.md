# DRISHTI — Intelligent Border Surveillance & Response Platform

> **Doctrine:** *Detect locally → verify through multiple signals → correlate → assess risk → preserve evidence → human operator decides.*

DRISHTI is an operational Command-and-Control (C4I) platform for intelligent border surveillance, designed for professional Security Operations Centers (SOC), tactical GIS commands, and automated perimeter defense across border sectors (e.g. North Sector / BOP-17).

---

## 1. System Architecture

```text
                         DRISHTI
                            │
              ┌─────────────┴─────────────┐
              │                           │
       COMMAND CENTRE                 EDGE BOP
              │                           │
       React / TypeScript             RTSP / ONVIF
              │                           │
        MapLibre GIS                   FFmpeg
              │                           │
          WebSocket                    YOLO
              │                           │
           FastAPI                  ByteTrack
              │                           │
       ┌──────┼──────┐                  │
       │      │      │                  │
 PostgreSQL Redis   MQTT ───────────────┘
 + PostGIS
       │
       ├── Incidents & Triage
       ├── Tracks & Trajectories
       ├── Camera Network & Health
       ├── Geofences & Buffer Zones
       ├── Forensic Evidence & SHA-256
       ├── SWAN Autonomous Coordination
       ├── SHIELD Self-Healing Defense
       └── Immutable Audit Log
```

---

## 2. Core Subsystems

### SWAN (Smart Watch and Alert Network)
- **Multi-Camera Tracking:** Correlates target trajectories across adjacent camera sensor nodes.
- **Predictive Handoffs:** Calculates velocity vectors (e.g. 168° heading) to publish priority watch requests before the target enters the next camera field-of-view.
- **Multi-Camera Confirmation:** Elevates confidence and fused risk score upon multi-sensor corroboration.

### SHIELD (Self-Healing Intelligent Edge-Led Defense)
- **Health Telemetry:** Heartbeat, latency, FPS, and stream health monitoring.
- **Fault Diagnostics:** Automated classification of lens obstruction, defocus, black frames, frozen streams, and suspected physical tamper.
- **Autonomous Recovery:** Calculates perimeter blind zone percentage and automatically slews adjacent PTZ cameras (e.g. `CAM-TOWER-01` and `CAM-ROAD-05`) to restore coverage to 88%.

---

## 3. Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+ (Python 3.12 verified)
- SQLite (built-in) or PostgreSQL + PostGIS (for production)

### Step 1: Start the Backend (FastAPI)
```bash
# Install backend dependencies
python -m pip install -r backend/requirements.txt

# Run the FastAPI service on port 8000
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```
- API Documentation: `http://localhost:8000/docs`
- Health Endpoint: `http://localhost:8000/health`
- WebSocket Server: `ws://localhost:8000/ws`

### Step 2: Start the Frontend (React + Vite + MapLibre GL JS)
```bash
# Install frontend dependencies
npm install

# Run the Vite development server on port 3000
npm run dev
```
- Command Center Console: `http://localhost:3000/app/command`

---

## 4. Operational Route Hierarchy

| Route | Functionality |
|---|---|
| `/login` | Operator badge authentication terminal |
| `/app/command` | Primary tactical screen: MapLibre GIS, active queue, triage drawer, 6-camera live wall |
| `/app/incidents/*` | Incident command registry: Active, Assigned, Resolved, and full Incident Workspace |
| `/app/surveillance/cameras` | Dense camera directory listing status, latency, FPS, resolution, and edge analytics |
| `/app/surveillance/live` | Matrix live wall supporting 4, 6, 9, and 12 camera grids |
| `/app/surveillance/tracks` | Active persistent target tracker with direction vectors and waypoint history |
| `/app/swan` | SWAN coordination console, spatial camera graph topology, and watch request table |
| `/app/shield` | SHIELD health metrics, fault diagnostics, blind zone calculator, and PTZ recovery |
| `/app/evidence` | Forensic evidence bank with cryptographic SHA-256 digests and chain of custody |
| `/app/analytics` | Supervisor telemetry: incidents by hour, zone distribution, fleet uptime, MTTH |
| `/app/admin/*` | Governance console: users, camera configs, geofences, and immutable audit logs |

---

## 5. Automated Demo Scenario (16 Steps)

The platform includes a built-in **Demo Controller** that triggers real backend state changes across the REST API and broadcasts live updates over WebSockets:
1. Baseline perimeter patrol (`CAM-03` healthy)
2. Target `T-104` acquired by YOLO Edge AI
3. ByteTrack persistent track vector established
4. Virtual Fence Alpha breached (`HIGH` incident generated)
5. SWAN identifies neighboring nodes (`CAM-04`, `CAM-06`)
6. SWAN watch request dispatched to `CAM-04`
7. `CAM-04` confirms target `T-104`
8. Risk score fused to 92/100 (`CRITICAL`)
9. Unified incident consolidated with multi-sensor evidence
10. Operator confirms incident
11. Immutable cryptographic audit log committed
12. `CAM-03` lens obstruction fault classified
13. Tactical blind zone calculated (12% coverage lost)
14. SHIELD slews backup PTZ cameras (`CAM-TOWER-01` & `CAM-ROAD-05`)
15. Coverage restored to 88%
16. Target re-acquired inside recovered sector

---

## 6. Docker Deployment (Optional)

```bash
docker-compose up -d
```
Spins up:
- Frontend (Port 3000)
- Backend (Port 8000)
- PostgreSQL with PostGIS (Port 5432)
- Redis (Port 6379)
- Mosquitto MQTT Broker (Port 1883)
- MinIO S3 Evidence Store (Port 9000/9001)
