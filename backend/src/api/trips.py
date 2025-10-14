from fastapi import APIRouter
from typing import Dict, Any
from datetime import datetime, timedelta
from src.models.trip import TripRequest
from src.storage.trip_storage import TripStorage

router = APIRouter()
storage = TripStorage()

@router.post("/mock-plan/trip")
async def plan_trip(request: TripRequest):
    """Mock trip planning endpoint"""
    try:
        destination = request.destination
        start_date = request.start_date
        end_date = request.end_date
        budget = request.budget
        travelers = request.travelers
        
        # Calculate trip duration
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
        days = (end - start).days + 1
        
        # Generate mock itinerary
        itinerary = []
        for i in range(min(days, 7)):
            itinerary.append({
                "day": i + 1,
                "morning": f"Explore {destination} attractions",
                "afternoon": f"Visit local markets and shops",
                "evening": f"Enjoy local cuisine",
                "date": (start + timedelta(days=i)).strftime("%Y-%m-%d")
            })
        
        # Generate mock cost breakdown
        cost_per_day = budget / days
        cost_breakdown = {
            "accommodation": cost_per_day * 0.4,
            "food": cost_per_day * 0.3,
            "transportation": cost_per_day * 0.2,
            "activities": cost_per_day * 0.1,
            "total": budget
        }
        
        # Generate mock plan summary
        plan_summary = f"""
        Welcome to {destination}! Here's your {days}-day itinerary:
        
        Day 1: Arrival and orientation
        Day 2-{days-1}: Explore local attractions, markets, and cuisine
        Day {days}: Departure
        
        Budget: ${budget} for {travelers} traveler(s)
        Estimated daily cost: ${cost_per_day:.2f}
        """
        
        trip_data = {
            "destination": destination,
            "start_date": start_date,
            "end_date": end_date,
            "budget": budget,
            "travelers": travelers,
            "plan": plan_summary,
            "itinerary": itinerary,
            "cost_breakdown": cost_breakdown
        }
        
        # Save trip to storage
        saved_trip = storage.add_trip(trip_data)
        return saved_trip
        
    except Exception as e:
        return {
            "error": f"Trip planning failed: {str(e)}",
            "status": "error"
        }

@router.get("/trips")
async def get_all_trips():
    """Get all saved trips"""
    return {
        "trips": storage.get_all_trips(),
        "total": len(storage.get_all_trips())
    }

@router.get("/trips/{trip_id}")
async def get_trip(trip_id: int):
    """Get specific trip by ID"""
    trip = storage.get_trip_by_id(trip_id)
    if not trip:
        return {"error": "Trip not found"}
    return trip