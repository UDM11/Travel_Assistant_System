from typing import List, Dict, Any, Optional
from datetime import datetime
from ..models.trip_model import Trip, TripResponse
from ..core.utils.helpers import generate_trip_id, calculate_trip_duration
from .database import load_data, save_trips
from .travel_service import TravelService

class TripService:
    def __init__(self):
        self.travel_service = TravelService()
    
    async def create_trip(self, trip_data: Dict[str, Any], user_id: Optional[int] = None) -> TripResponse:
        trip = Trip(
            id=generate_trip_id(),
            user_id=user_id,
            destination=trip_data["destination"],
            start_date=trip_data["start_date"],
            end_date=trip_data["end_date"],
            duration=calculate_trip_duration(trip_data["start_date"], trip_data["end_date"]),
            budget=trip_data.get("budget"),
            travelers=trip_data.get("travelers", 1),
            preferences=trip_data.get("preferences", {}),
            created_at=datetime.now().isoformat()
        )
        
        # Plan the trip using travel service
        plan_result = await self.travel_service.plan_trip(trip_data)
        
        # Save trip to database
        trips, _, _ = load_data()
        trips.append(trip.dict())
        save_trips(trips)
        
        return TripResponse(**plan_result)
    
    def get_user_trips(self, user_id: int) -> List[Trip]:
        trips, _, _ = load_data()
        user_trips = [Trip(**trip) for trip in trips if trip.get("user_id") == user_id]
        return user_trips
    
    def get_trip_by_id(self, trip_id: str) -> Optional[Trip]:
        trips, _, _ = load_data()
        trip_data = next((trip for trip in trips if trip.get("id") == trip_id), None)
        return Trip(**trip_data) if trip_data else None
    
    def update_trip_status(self, trip_id: str, status: str) -> bool:
        trips, contact_messages, users = load_data()
        for trip in trips:
            if trip.get("id") == trip_id:
                trip["status"] = status
                save_trips(trips)
                return True
        return False