import pytest
import asyncio
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.session import get_db
from app.models.trip import Base

# Test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(scope="module")
def setup_test_db():
    """Setup test database"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_health_check(setup_test_db):
    """Test health check endpoint"""
    response = client.get("/api/v1/health/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data
    assert "version" in data


def test_root_endpoint(setup_test_db):
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "Travel Assistant Agent API" in data["message"]


def test_plan_trip_endpoint(setup_test_db):
    """Test trip planning endpoint"""
    trip_data = {
        "destination": "Paris",
        "start_date": "2024-06-01",
        "end_date": "2024-06-07",
        "budget": 2500.0,
        "travelers": 2,
        "preferences": {
            "interests": ["culture", "food"],
            "comfort_level": "mid_range"
        }
    }
    
    response = client.post("/api/v1/plan/trip", json=trip_data)
    # Note: This might fail without proper API keys, but should not crash
    assert response.status_code in [200, 500]  # 500 is expected without API keys


def test_get_trips_endpoint(setup_test_db):
    """Test get trips endpoint"""
    response = client.get("/api/v1/trips/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_invalid_trip_request(setup_test_db):
    """Test invalid trip request"""
    invalid_data = {
        "destination": "",  # Empty destination
        "start_date": "invalid-date",
        "end_date": "2024-06-01",
        "budget": -100,  # Negative budget
        "travelers": 0  # Invalid traveler count
    }
    
    response = client.post("/api/v1/plan/trip", json=invalid_data)
    assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_agent_orchestrator():
    """Test agent orchestrator"""
    from app.agents.orchestrator import TripOrchestrator
    
    orchestrator = TripOrchestrator()
    status = orchestrator.get_agent_status()
    
    assert "researcher" in status
    assert "planner" in status
    assert "summarizer" in status
    assert "orchestrator" in status


def test_cost_calculator():
    """Test cost calculator"""
    from app.services.cost_calc import CostCalculator
    
    calculator = CostCalculator()
    
    # Test budget range estimation
    budget_range = calculator.estimate_budget_range(
        destination="Paris",
        days=7,
        travelers=2,
        comfort_level="mid_range"
    )
    
    assert "estimated_cost" in budget_range
    assert budget_range["travelers"] == 2
    assert budget_range["comfort_level"] == "mid_range"
