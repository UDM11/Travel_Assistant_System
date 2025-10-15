from pydantic import BaseModel, EmailStr
from typing import List, Dict, Any, Optional
from datetime import datetime

# Trip Models
class TripRequest(BaseModel):
    destination: str
    start_date: str
    end_date: str
    budget: float
    travelers: int
    preferences: Optional[Dict[str, Any]] = {}
    interests: Optional[List[str]] = []

class TripResponse(BaseModel):
    id: int
    destination: str
    start_date: str
    end_date: str
    budget: float
    travelers: int
    plan: str
    itinerary: List[Dict[str, Any]]
    cost_breakdown: Dict[str, float]
    created_at: str

# Contact Models
class ContactMessage(BaseModel):
    name: str
    email: str
    message: str

class ContactResponse(BaseModel):
    id: int
    name: str
    email: str
    message: str
    created_at: str
    status: str

# Weather Models
class WeatherRequest(BaseModel):
    city: str
    country_code: Optional[str] = None

class WeatherResponse(BaseModel):
    city: str
    temperature: float
    description: str
    humidity: int
    wind_speed: float
    forecast: List[Dict[str, Any]]

# Flight Models
class FlightRequest(BaseModel):
    origin: str
    destination: str
    departure_date: str
    return_date: Optional[str] = None
    passengers: int = 1

class FlightResponse(BaseModel):
    flights: List[Dict[str, Any]]
    total_results: int

# Hotel Models
class HotelRequest(BaseModel):
    city: str
    check_in: str
    check_out: str
    guests: int = 1
    budget_max: Optional[float] = None

class HotelResponse(BaseModel):
    hotels: List[Dict[str, Any]]
    total_results: int

# AI Models
class AIRequest(BaseModel):
    prompt: str
    context: Optional[Dict[str, Any]] = {}

class AIResponse(BaseModel):
    response: str
    agent_used: str
    processing_time: float