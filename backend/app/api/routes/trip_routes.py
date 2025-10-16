from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
from app.models.schemas import TripRequest
from app.services.database import load_data, save_trips

router = APIRouter()

@router.post("/trip/plan")
async def plan_trip(request: TripRequest):
    trips, _, _ = load_data()
    
    start = datetime.strptime(request.start_date, "%Y-%m-%d")
    end = datetime.strptime(request.end_date, "%Y-%m-%d")
    days = (end - start).days + 1
    
    itinerary = []
    for i in range(min(days, 7)):
        itinerary.append({
            "day": i + 1,
            "date": (start + timedelta(days=i)).strftime("%Y-%m-%d"),
            "activities": [
                {"time": "09:00-12:00", "activity": f"Explore {request.destination} attractions"},
                {"time": "14:00-17:00", "activity": f"Visit local markets"},
                {"time": "19:00-21:00", "activity": f"Enjoy local cuisine"}
            ]
        })
    
    cost_breakdown = {
        "accommodation": request.budget * 0.4,
        "food": request.budget * 0.3,
        "transportation": request.budget * 0.2,
        "activities": request.budget * 0.1,
        "total": request.budget
    }
    
    trip = {
        "id": len(trips) + 1,
        "destination": request.destination,
        "start_date": request.start_date,
        "end_date": request.end_date,
        "budget": request.budget,
        "travelers": request.travelers,
        "plan": f"Welcome to {request.destination}! {days}-day adventure awaits.",
        "itinerary": itinerary,
        "cost_breakdown": cost_breakdown,
        "created_at": datetime.utcnow().isoformat()
    }
    
    trips.append(trip)
    save_trips(trips)
    return {"success": True, "data": trip}

@router.get("/trip")
async def get_trips():
    trips, _, _ = load_data()
    return {"success": True, "data": {"trips": trips, "total": len(trips)}}