from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class Trip(BaseModel):
    id: Optional[str] = None
    user_id: Optional[int] = None
    destination: str
    start_date: str
    end_date: str
    duration: Optional[int] = None
    budget: Optional[float] = None
    travelers: Optional[int] = 1
    preferences: Optional[Dict[str, Any]] = {}
    status: Optional[str] = "planned"
    created_at: Optional[str] = None
    
class TripResponse(BaseModel):
    trip_id: str
    status: str
    research: Dict[str, Any]
    itinerary: Dict[str, Any]
    summary: Dict[str, Any]