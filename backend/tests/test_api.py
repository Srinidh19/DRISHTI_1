import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoints():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["platform"] == "DRISHTI"

    sys_res = client.get("/api/system/health")
    assert sys_res.status_code == 200
    sys_data = sys_res.json()
    assert sys_data["api"] == "healthy"
    assert sys_data["cameras_total"] == 50

def test_cameras_api():
    response = client.get("/api/cameras")
    assert response.status_code == 200
    cameras = response.json()
    assert len(cameras) >= 50
    assert any(c["id"] == "CAM-03" for c in cameras)

def test_incidents_api_and_action():
    response = client.get("/api/incidents")
    assert response.status_code == 200
    incidents = response.json()
    assert len(incidents) >= 4

    # Test Confirm Action
    action_res = client.patch("/api/incidents/INC-2026-0142/action", json={
        "action": "confirm",
        "user_id": "OP-042",
        "role": "OPERATOR",
        "note": "Corroborated by dual sensors"
    })
    assert action_res.status_code == 200
    updated = action_res.json()
    assert updated["status"] == "CONFIRMED"

def test_audit_logs():
    response = client.get("/api/audit")
    assert response.status_code == 200
    logs = response.json()
    assert len(logs) > 0

def test_demo_step_endpoint():
    response = client.post("/api/demo/step/4")
    assert response.status_code == 200
    assert response.json()["status"] == "SUCCESS"
