from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from .trip_model import Trip, TripResponse
from .user_model import User, UserResponse

class TripRequest(BaseModel):
    destination: str
    start_date: str
    end_date: str
    budget: float
    travelers: int
    preferences: dict = {}
    interests: list = []

class ContactMessage(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    category: str
    subject: str
    message: str
    priority: str = "normal"

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str

class AIRequest(BaseModel):
    query: str
    context: Optional[Dict[str, Any]] = {}
    
class AIResponse(BaseModel):
    response: str
    confidence: float
    sources: List[str] = []