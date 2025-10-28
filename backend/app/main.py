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
from app.api.routes.auth_routes import router as auth_router
from app.api.routes.hotel_routes import router as hotel_router

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
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(hotel_router)

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
        "phone": message.phone,
        "category": message.category,
        "subject": message.subject,
        "message": message.message,
        "priority": message.priority,
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

# Authentication endpoints are now handled by auth_routes.py

@app.post("/api/v1/plan-trip")
async def plan_trip(trip_request: dict):
    try:
        # Convert frontend field names to backend format with timestamp
        from datetime import datetime
        backend_request = {
            "destination": trip_request.get("destination"),
            "start_date": trip_request.get("startDate"),
            "end_date": trip_request.get("endDate"),
            "budget": trip_request.get("budget"),
            "travelers": trip_request.get("travelers", 1),
            "interests": trip_request.get("interests", []),
            "from": trip_request.get("from", ""),
            "travel_style": trip_request.get("travelStyle", "mid-range"),
            "accommodation": trip_request.get("accommodation", "hotel"),
            "transportation": trip_request.get("transportation", "flight"),
            "meal_preference": trip_request.get("mealPreference", "all"),
            "activity_level": trip_request.get("activityLevel", "moderate"),
            "special_requests": trip_request.get("specialRequests", ""),
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Plan the trip using travel service
        result = await travel_service.plan_trip(backend_request)
        
        # Extract hotel recommendations from result
        hotel_recommendations = result.get('hotel_recommendations', [])
        
        # Extract API sources information
        itinerary = result.get("itinerary", {})
        summary = result.get("summary", {})
        
        # Save trip to database with enhanced information
        trips, _, _ = load_data()
        trip_data = {
            "id": len(trips) + 1,
            "from": backend_request.get("from", ""),
            "destination": backend_request.get("destination"),
            "start_date": backend_request.get("start_date"),
            "end_date": backend_request.get("end_date"),
            "budget": backend_request.get("budget"),
            "travelers": backend_request.get("travelers", 1),
            "travel_style": backend_request.get("travel_style", "mid-range"),
            "accommodation": backend_request.get("accommodation", "hotel"),
            "transportation": backend_request.get("transportation", "flight"),
            "meal_preference": backend_request.get("meal_preference", "all"),
            "activity_level": backend_request.get("activity_level", "moderate"),
            "special_requests": backend_request.get("special_requests", ""),
            "interests": backend_request.get("interests", []),
            "plan": summary.get("trip_overview", f"Welcome to {trip_request.get('destination')}!"),
            "itinerary": itinerary,
            "summary": summary,
            "trip_request": backend_request,  # Store original request for reference
            "cost_breakdown": summary.get("budget_summary", {
                "flights": itinerary.get("estimated_cost", backend_request.get("budget", 1000)) * 0.3,
                "hotels": itinerary.get("estimated_cost", backend_request.get("budget", 1000)) * 0.4,
                "activities": itinerary.get("estimated_cost", backend_request.get("budget", 1000)) * 0.2,
                "food": itinerary.get("estimated_cost", backend_request.get("budget", 1000)) * 0.1,
                "total": itinerary.get("estimated_cost", backend_request.get("budget", 1000))
            }),
            "hotel_recommendations": hotel_recommendations,
            "api_sources": {
                "weather": "OpenWeatherMap API",
                "flights": "Amadeus API", 
                "hotels": "RapidAPI Booking.com",
                "ai_content": "OpenAI GPT",
                "itinerary_generation": itinerary.get("api_sources", {}),
                "summary_generation": summary.get("api_sources_used", {})
            },
            "ai_enhanced": True,
            "created_at": datetime.utcnow().isoformat()
        }
        
        trips.append(trip_data)
        save_trips(trips)
        
        # Get weather and hotel data directly
        from app.core.tools.weather_tool import WeatherTool
        from app.core.tools.hotel_tool import HotelTool
        weather_tool = WeatherTool()
        hotel_tool = HotelTool()
        weather_data = await weather_tool.get_weather(trip_request.get("destination", ""))
        hotel_data = await hotel_tool.search_hotels(
            backend_request.get("destination", ""),
            backend_request.get("start_date"),
            backend_request.get("end_date")
        )
        
        # Enhanced response with API source information
        enhanced_result = {
            **result,
            "trip_request": {
                "destination": backend_request.get("destination"),
                "start_date": backend_request.get("start_date"),
                "end_date": backend_request.get("end_date"),
                "budget": backend_request.get("budget"),
                "interests": backend_request.get("interests", [])
            },
            "api_keys_used": {
                "openai": bool(os.getenv("OPENAI_API_KEY")),
                "weather": bool(os.getenv("WEATHER_API_KEY")),
                "flights": bool(os.getenv("FLIGHTS_API_KEY")),
                "hotels": bool(os.getenv("HOTELS_API_KEY"))
            },
            "data_sources": trip_data["api_sources"],
            "weather_data": weather_data,
            "hotel_data": hotel_data,
            "hotel_recommendations": hotel_recommendations
        }
        
        return {"success": True, "data": enhanced_result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.delete("/api/v1/trip/{trip_id}")
async def delete_trip(trip_id: int):
    try:
        trips, _, _ = load_data()
        trips = [trip for trip in trips if trip["id"] != trip_id]
        save_trips(trips)
        return {"success": True, "message": "Trip deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/hotels/{location}")
async def get_hotels(location: str, check_in: str = None, check_out: str = None):
    """Get hotel data for a specific location using RapidAPI"""
    try:
        from app.core.tools.hotel_tool import HotelTool
        hotel_tool = HotelTool()
        hotels = await hotel_tool.search_hotels(location, check_in, check_out)
        
        return {
            "success": True,
            "data": {
                "location": location,
                "hotels": hotels,
                "total_hotels": len(hotels),
                "api_source": "RapidAPI Booking.com" if os.getenv("HOTELS_API_KEY") else "Mock Data"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
        "RapidAPI Hotels": "Real hotel availability via Booking.com" if api_keys["hotels"] else "Demo hotel data"
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