from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import uvicorn
import os
from typing import Dict, Any

from src.api.contact import router as contact_router

app = FastAPI(title="Travel Assistant API", version="1.0.0")

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(contact_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "Travel Assistant API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

@app.post("/api/v1/mock-plan/trip")
async def mock_plan_trip(request: Dict[str, Any]):
    try:
        destination = request.get("destination", "Unknown")
        start_date = request.get("start_date", "2024-01-01")
        end_date = request.get("end_date", "2024-01-07")
        budget = request.get("budget", 1000)
        travelers = request.get("travelers", 1)
        
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
        days = (end - start).days + 1
        
        itinerary = []
        for i in range(min(days, 7)):
            itinerary.append({
                "day": i + 1,
                "morning": f"Explore {destination} attractions",
                "afternoon": f"Visit local markets and shops",
                "evening": f"Enjoy local cuisine",
                "date": (start + timedelta(days=i)).strftime("%Y-%m-%d")
            })
        
        cost_per_day = budget / days
        cost_breakdown = {
            "accommodation": cost_per_day * 0.4,
            "food": cost_per_day * 0.3,
            "transportation": cost_per_day * 0.2,
            "activities": cost_per_day * 0.1,
            "total": budget
        }
        
        return {
            "id": 1,
            "destination": destination,
            "start_date": start_date,
            "end_date": end_date,
            "budget": budget,
            "travelers": travelers,
            "plan": f"Welcome to {destination}! Here's your {days}-day itinerary.",
            "itinerary": itinerary,
            "cost_breakdown": cost_breakdown,
            "created_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        return {
            "error": f"Trip planning failed: {str(e)}",
            "status": "error"
        }

if __name__ == "__main__":
    print("Contact messages will be stored in: contact_messages.json")
    print("Starting server at http://127.0.0.1:8001")
    print("API Documentation: http://127.0.0.1:8001/docs")
    uvicorn.run(app, host="127.0.0.1", port=8001)