from fastapi import APIRouter
from typing import Dict, Any
from datetime import datetime, timedelta

router = APIRouter()

@router.post("/mock-plan/trip")
async def mock_plan_trip(request: Dict[str, Any]):
    """Mock trip planning endpoint"""
    try:
        destination = request.get("destination", "Unknown")
        start_date = request.get("start_date", "2024-01-01")
        end_date = request.get("end_date", "2024-01-07")
        budget = request.get("budget", 1000)
        travelers = request.get("travelers", 1)
        
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
        
        return {
            "id": 1,
            "destination": destination,
            "start_date": start_date,
            "end_date": end_date,
            "budget": budget,
            "travelers": travelers,
            "plan": plan_summary,
            "itinerary": itinerary,
            "cost_breakdown": cost_breakdown,
            "created_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        return {
            "error": f"Mock trip planning failed: {str(e)}",
            "status": "error"
        }