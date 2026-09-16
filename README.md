# DRISHTI — Intelligent Border Surveillance & Response Platform

> **Operational Doctrine:** *Detect locally → verify through multiple signals → correlate → assess risk → preserve evidence → human operator decides.*

DRISHTI is an operational Command-and-Control (C4I) platform for intelligent border surveillance, designed for professional Security Operations Centers (SOC), tactical GIS commands, and automated perimeter defense across border sectors (e.g., North Sector / BOP-17).

---

### 🌐 Live Production Deployment

| Service | Verified Production URL | Status |
|---|---|---|
| **Official DRISHTI Portal** | [https://drishti-c4i.vercel.app](https://drishti-c4i.vercel.app) | 🟢 LIVE |
| **BOP-17 Sector Mirror** | [https://drishti-bop17.vercel.app](https://drishti-bop17.vercel.app) | 🟢 LIVE |
| **Command Centre** | [https://drishti-c4i.vercel.app/app/command](https://drishti-c4i.vercel.app/app/command) | 🟢 LIVE |
| **SWAN Multi-Camera Coordination** | [https://drishti-c4i.vercel.app/app/swan/overview](https://drishti-c4i.vercel.app/app/swan/overview) | 🟢 LIVE |
| **SHIELD Self-Healing Recovery** | [https://drishti-c4i.vercel.app/app/shield/overview](https://drishti-c4i.vercel.app/app/shield/overview) | 🟢 LIVE |
| **Operator Terminal Login** | [https://drishti-c4i.vercel.app/login](https://drishti-c4i.vercel.app/login) | 🟢 LIVE |
| **GitHub Repository** | [https://github.com/Srinidh19/DRISHTI_1.git](https://github.com/Srinidh19/DRISHTI_1.git) | 🟢 CONNECTED |
| **Hosting Platform** | **Vercel** (`akulasahadev85-3512s-projects/drishti`) | 🟢 AUTO-DEPLOY |

---

## 1. System Architecture

```text
                                  DRISHTI
                                     │
               ┌─────────────────────┴─────────────────────┐
               │                                           │
        COMMAND CENTRE                                 EDGE BOP
               │                                           │
        React / TypeScript                            RTSP / ONVIF
               │                                           │
        MapLibre GIS                                     FFmpeg
               │                                           │
          WebSocket                                       YOLO
               │                                           │
            FastAPI                                    ByteTrack
               │                                           │
        ┌──────┼──────┐                                    │
        │      │      │                                    │
  PostgreSQL Redis   MQTT ─────────────────────────────────┘
  + PostGIS
        │
        ├── Incidents & Multi-sensor Triage
        ├── Tracks & Trajectories
        ├── Camera Network & Health
        ├── Geofences & Buffer Zones
        ├── Forensic Evidence Bank (SHA-256)
        ├── SWAN Multi-Camera Coordination Engine
        ├── SHIELD Self-Healing Recovery Engine
        └── Immutable Audit Log
```

---

## 2. Core Operational Subsystems

### SWAN (Smart Watch and Alert Network)
- **Multi-Camera Tracking:** Correlates target trajectories across adjacent camera sensor nodes.
- **Predictive Handoffs:** Calculates velocity vectors (e.g., 168° heading) to publish priority watch requests before the target enters the next camera field-of-view.
- **Multi-Camera Confirmation:** Elevates confidence and fused risk score upon multi-sensor corroboration.
- **Dedicated Subsystem Routes:** `/app/swan/overview`, `/app/swan/tracks`, `/app/swan/coordination`.

### SHIELD (Self-Healing Intelligent Edge-Led Defense)
- **Health Telemetry:** Real-time heartbeat, latency, FPS, and stream health monitoring.
- **Fault Diagnostics:** Automated classification of lens obstruction, defocus, black frames, frozen streams, and physical tampering.
- **Autonomous Recovery:** Calculates perimeter blind zone percentage and automatically slews adjacent PTZ cameras (`CAM-TOWER-01` and `CAM-ROAD-05`) to restore coverage to 88%.
- **Dedicated Subsystem Routes:** `/app/shield/overview`, `/app/shield/faults`, `/app/shield/coverage`, `/app/shield/recovery`.

---

## 3. Production Deployment & Continuous Integration (CI/CD)

DRISHTI follows a zero-breakage continuous deployment workflow where the **GitHub repository is the single source of truth**:

```text
  LOCAL DEVELOPMENT
         ↓
  Make code changes
         ↓
  Test locally (npm run dev / npm run build)
         ↓
  git commit -m "feat/fix: descriptive message"
         ↓
  git push origin master
         ↓
  GitHub Actions CI/CD Pipeline
         ├── 1. Checkout repository
         ├── 2. Setup Node.js 20 runtime
         ├── 3. Install dependencies (clean cache)
         ├── 4. TypeScript compilation & typecheck
         ├── 5. Vite production bundle compilation
         ├── 6. Verify SPA fallbacks (_redirects, 404.html)
         └── 7. Automated Production Deployment
         ↓
  LIVE DRISHTI PLATFORM UPDATED (Zero downtime)
```

### Auto-Deploy Supported Platforms:
1. **GitHub Pages:** Pre-configured via `.github/workflows/ci-cd.yml` (automated out of the box).
2. **Vercel:** Pre-configured via `vercel.json` with SPA rewrites (`/(.*) -> /index.html`) and asset cache headers.
3. **Cloudflare Pages / Netlify:** Pre-configured via `public/_redirects` (`/* /index.html 200`).

---

## 4. Environment Variables

Client-side environment variables must use the framework's public prefix (`VITE_`). Never commit `.env` or production secrets to Git.

### Frontend Environment Configuration (`.env`):
```env
# Map Provider Configuration (Maptiler or OpenStreetMap)
VITE_MAP_PROVIDER=maptiler
VITE_MAPTILER_API_KEY=your_maptiler_api_key_here
VITE_MAP_STYLE=hybrid

# Backend & WebSocket Connectivity
VITE_API_BASE_URL=/api
VITE_WS_URL=ws://localhost:8000/ws

# Operational Identity
VITE_PLATFORM_NAME=DRISHTI
VITE_BUILD_VERSION=2026.09.1-PROD
```

### Backend Environment Configuration:
```env
API_V1_STR=/api/v1
PROJECT_NAME="DRISHTI Border Surveillance & Response"
DATABASE_URL=sqlite:///./drishti.db
DEBUG=False
```

> **Note:** If `VITE_MAPTILER_API_KEY` is missing, the MapLibre engine seamlessly falls back to Carto Dark Matter raster tiles to ensure the map and application never crash.

---

## 5. Local Development Workflow

### Frontend
```bash
# 1. Install dependencies
npm install

# 2. Run local development server (Port 3000)
npm run dev

# 3. Test production build locally
npm run build
```

### Backend (FastAPI)
```bash
# 1. Install dependencies
python -m pip install -r backend/requirements.txt

# 2. Run the FastAPI service (Port 8000)
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```
- API Documentation: `http://localhost:8000/docs`
- Health Endpoint: `http://localhost:8000/health`
- Realtime WebSocket: `ws://localhost:8000/ws`

---

## 6. How to Update the Live Production Site

Whenever you make any changes locally, deploy them simply by pushing to GitHub:

```bash
# 1. Check local status
git status

# 2. Stage changes
git add .

# 3. Commit with a meaningful message
git commit -m "feat: improve border incident analysis"

# 4. Push to master
git push origin master
```

**What happens next:**
1. GitHub Actions automatically starts the CI/CD pipeline.
2. The pipeline runs linting, TypeScript typecheck, and Vite production compilation.
3. If any step fails, deployment is automatically halted to prevent breaking the live site.
4. If all checks pass, the live website is updated automatically.

---

## 7. Zero-Breakage & Crash Protection Architecture

DRISHTI is built with defensive fail-safe mechanisms:
- **Global & Route ErrorBoundary:** Unhandled exceptions in individual subsystems (e.g. CCTV feeds, map rendering, or chart calculations) are caught locally, displaying a recovery prompt without crashing the main application or other screens.
- **Graceful Map Fallback:** If Maptiler credentials are invalid or unavailable, the map automatically switches to Carto Dark Matter raster tiles.
- **SPA Fallback Routing:** Deep route navigation and direct page refreshes (e.g. `/app/command`, `/app/swan/overview`, `/app/shield/faults`) are handled via `_redirects`, `vercel.json`, and `public/404.html` to eliminate 404 errors.
- **WebSocket Reconnection:** Automatic backoff reconnection ensures telemetry resumes upon network recovery.

---

## 8. Rollback Procedure

If an unexpected issue occurs on the live site:

### Option A: Rollback via Git (Recommended)
```bash
# Revert the last commit cleanly
git revert HEAD

# Push the revert to master
git push origin master
```
The CI/CD pipeline will automatically build and deploy the reverted, working version.

### Option B: Rollback via GitHub Actions UI
1. Navigate to the GitHub repository: `https://github.com/Srinidh19/DRISHTI_1/actions`
2. Select the previous successful workflow run.
3. Click **Re-run all jobs**.

---

## 9. Operational Route Directory

| Route | Subsystem | Functionality |
|---|---|---|
| `/` | Public Story | Interactive 19-scene cinematic BOP simulation |
| `/login` | Authentication | Operator badge terminal |
| `/app/command` | Command & Control | Tactical MapLibre GIS, active queue, live CCTV matrix |
| `/app/incidents/*` | Incidents | Active, Assigned, Resolved registry & Incident Workspace |
| `/app/surveillance/cameras` | Surveillance | Dense camera telemetry (latency, FPS, resolution) |
| `/app/surveillance/live` | Surveillance | Matrix live wall (4, 6, 9, 12 camera grids) |
| `/app/surveillance/tracks` | Surveillance | Active target vector tracking & trajectory history |
| `/app/swan/overview` | SWAN | Autonomous multi-camera coordination overview |
| `/app/swan/tracks` | SWAN | Multi-camera active persistent tracks & handoff vectors |
| `/app/swan/coordination` | SWAN | Sensor handoff requests & spatial camera graph topology |
| `/app/shield/overview` | SHIELD | Self-healing health overview & tamper alerts |
| `/app/shield/faults` | SHIELD | Optical/network fault diagnostics |
| `/app/shield/coverage` | SHIELD | Perimeter blind zone coverage analyzer |
| `/app/shield/recovery` | SHIELD | Autonomous PTZ slew recovery workflows |
| `/app/evidence/*` | Evidence | Cryptographic SHA-256 evidence vault & chain of custody |
| `/app/analytics` | Analytics | SOC metrics, fleet uptime, MTTH & incident trends |
| `/app/admin/*` | Admin | Access control, camera configs, geofences & audit logs |

---

## 10. Health Check & Diagnostics

- **Frontend Build Identifier:** Displayed in the top bar header: `BUILD 2026.09.1-PROD`.
- **Backend Health Check:** `GET /health` returns:
  ```json
  { "status": "ok", "platform": "DRISHTI", "version": "2.0.0" }
  ```
- **Telemetry Health Check:** `GET /api/system/health` provides real-time subsystem statuses (cameras, edge nodes, SWAN, SHIELD).
