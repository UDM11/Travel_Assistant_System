from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from datetime import datetime

from app.config import settings
from app.models.schemas import ContactMessage, LoginRequest, RegisterRequest
from app.services.database import load_data, save_contact_messages, save_users, save_trips
from app.services.travel_service import TravelService
from app.core.utils.helpers import generate_trip_id, calculate_trip_duration
from app.api.routes.trip_routes import router as trip_router

app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

# Initialize travel service
travel_service = TravelService()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trip_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": settings.PROJECT_NAME, "version": settings.VERSION, "status": "running"}

@app.post("/api/v1/contact")
async def submit_contact_message(message: ContactMessage):
    _, contact_messages, _ = load_data()
    message_record = {
        "id": len(contact_messages) + 1,
        "name": message.name,
        "email": message.email,
        "message": message.message,
        "created_at": datetime.utcnow().isoformat(),
        "status": "new"
    }
    contact_messages.append(message_record)
    save_contact_messages(contact_messages)
    return {"success": True, "message": "Message sent successfully!", "id": message_record["id"]}

@app.get("/api/v1/contact/messages")
async def get_contact_messages():
    _, contact_messages, _ = load_data()
    return {"success": True, "data": {"messages": contact_messages, "total": len(contact_messages)}}

@app.post("/api/v1/auth/login")
async def login(request: LoginRequest):
    try:
        _, _, users = load_data()
        user = next((u for u in users if u["email"] == request.email), None)
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        if user["password"] != request.password:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        return {
            "success": True,
            "message": "Login successful",
            "user": {
                "id": user["id"],
                "email": user["email"],
                "name": user["name"]
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Login failed")

@app.post("/api/v1/auth/register")
async def register(request: RegisterRequest):
    try:
        _, _, users = load_data()
        if any(u["email"] == request.email for u in users):
            raise HTTPException(status_code=400, detail="Email already registered")
        
        new_user = {
            "id": len(users) + 1,
            "email": request.email,
            "password": request.password,
            "name": request.name,
            "created_at": datetime.utcnow().isoformat()
        }
        
        users.append(new_user)
        save_users(users)
        
        return {
            "success": True,
            "message": "Registration successful",
            "user": {
                "id": new_user["id"],
                "email": new_user["email"],
                "name": new_user["name"]
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Registration failed")

@app.post("/api/v1/plan-trip")
async def plan_trip(trip_request: dict):
    try:
        # Plan the trip using travel service
        result = await travel_service.plan_trip(trip_request)
        
        # Extract API sources information
        itinerary = result.get("itinerary", {})
        summary = result.get("summary", {})
        
        # Save trip to database with enhanced information
        trips, _, _ = load_data()
        trip_data = {
            "id": len(trips) + 1,
            "destination": trip_request.get("destination"),
            "start_date": trip_request.get("start_date"),
            "end_date": trip_request.get("end_date"),
            "budget": trip_request.get("budget"),
            "travelers": trip_request.get("travelers", 1),
            "plan": summary.get("trip_overview", f"Welcome to {trip_request.get('destination')}!"),
            "itinerary": itinerary,
            "summary": summary,
            "cost_breakdown": summary.get("budget_summary", {
                "accommodation": itinerary.get("estimated_cost", 0) * 0.4,
                "food": itinerary.get("estimated_cost", 0) * 0.3,
                "transportation": itinerary.get("estimated_cost", 0) * 0.2,
                "activities": itinerary.get("estimated_cost", 0) * 0.1,
                "total": itinerary.get("estimated_cost", 0)
            }),
            "api_sources": {
                "weather": "OpenWeatherMap API",
                "flights": "Amadeus API", 
                "hotels": "Amadeus API",
                "ai_content": "OpenAI GPT",
                "itinerary_generation": itinerary.get("api_sources", {}),
                "summary_generation": summary.get("api_sources_used", {})
            },
            "ai_enhanced": True,
            "created_at": datetime.utcnow().isoformat()
        }
        
        trips.append(trip_data)
        save_trips(trips)
        
        # Enhanced response with API source information
        enhanced_result = {
            **result,
            "api_keys_used": {
                "openai": bool(os.getenv("OPENAI_API_KEY")),
                "weather": bool(os.getenv("WEATHER_API_KEY")),
                "flights": bool(os.getenv("FLIGHTS_API_KEY")),
                "hotels": bool(os.getenv("HOTELS_API_KEY"))
            },
            "data_sources": trip_data["api_sources"]
        }
        
        return {"success": True, "data": enhanced_result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.get("/api/v1/api-status")
async def api_status():
    """Check the status of all API keys and services"""
    api_keys = {
        "openai": bool(os.getenv("OPENAI_API_KEY")),
        "weather": bool(os.getenv("WEATHER_API_KEY")),
        "flights": bool(os.getenv("FLIGHTS_API_KEY")),
        "hotels": bool(os.getenv("HOTELS_API_KEY"))
    }
    
    services = {
        "OpenAI GPT": "AI-powered itinerary generation" if api_keys["openai"] else "Mock itinerary generation",
        "OpenWeatherMap": "Real-time weather data" if api_keys["weather"] else "Mock weather data",
        "Amadeus Flights": "Live flight pricing" if api_keys["flights"] else "Sample flight data",
        "Amadeus Hotels": "Real hotel availability" if api_keys["hotels"] else "Demo hotel data"
    }
    
    return {
        "success": True,
        "api_keys_configured": api_keys,
        "services_status": services,
        "total_apis_active": sum(api_keys.values()),
        "data_quality": "Enhanced" if sum(api_keys.values()) >= 3 else "Standard",
        "timestamp": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    print(f"Travel Assistant API starting on http://{settings.HOST}:{settings.PORT}")
    print(f"API Keys Status:")
    print(f"  - OpenAI: {'✓' if os.getenv('OPENAI_API_KEY') else '✗'}")
    print(f"  - Weather: {'✓' if os.getenv('WEATHER_API_KEY') else '✗'}")
    print(f"  - Flights: {'✓' if os.getenv('FLIGHTS_API_KEY') else '✗'}")
    print(f"  - Hotels: {'✓' if os.getenv('HOTELS_API_KEY') else '✗'}")
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)