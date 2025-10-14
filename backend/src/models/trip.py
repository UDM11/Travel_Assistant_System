from pydantic import BaseModel
from typing import List, Dict, Any, Optional

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