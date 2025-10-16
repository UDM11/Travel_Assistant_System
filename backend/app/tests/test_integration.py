import pytest
import asyncio
from app.services.travel_service import TravelService
from app.services.ai_service import AIService
from app.services.trip_service import TripService

@pytest.mark.asyncio
async def test_full_trip_planning_flow():
    travel_service = TravelService()
    
    trip_request = {
        "destination": "Barcelona",
        "start_date": "2024-07-01",
        "end_date": "2024-07-05",
        "budget": 1800,
        "travelers": 2
    }
    
    result = await travel_service.plan_trip(trip_request)
    
    assert result["status"] == "completed"
    assert "research" in result
    assert "itinerary" in result
    assert "summary" in result

@pytest.mark.asyncio
async def test_ai_service_integration():
    ai_service = AIService()
    
    response = await ai_service.process_query(
        "What's the weather like in Paris?",
        {"destination": "Paris"}
    )
    
    assert "response" in response
    assert response["confidence"] > 0
    assert "Paris" in response["response"]

@pytest.mark.asyncio
async def test_trip_service_integration():
    trip_service = TripService()
    
    trip_data = {
        "destination": "Amsterdam",
        "start_date": "2024-08-01",
        "end_date": "2024-08-04",
        "budget": 1200,
        "travelers": 1
    }
    
    result = await trip_service.create_trip(trip_data, user_id=1)
    
    assert result.status == "completed"
    assert result.trip_id is not None