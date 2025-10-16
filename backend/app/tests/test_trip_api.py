import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_plan_trip():
    trip_data = {
        "destination": "Paris",
        "start_date": "2024-06-01",
        "end_date": "2024-06-05",
        "budget": 2000,
        "travelers": 2
    }
    
    response = client.post("/api/v1/plan-trip", json=trip_data)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "trip_id" in data["data"]

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_contact_message():
    message_data = {
        "name": "Test User",
        "email": "test@example.com",
        "message": "Test message"
    }
    
    response = client.post("/api/v1/contact", json=message_data)
    assert response.status_code == 200
    assert response.json()["success"] is True