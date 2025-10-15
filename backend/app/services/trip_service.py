from typing import Dict, Any, List, Optional
from datetime import datetime
from app.models.schemas import TripRequest
from app.core.agents.researcher_agent import ResearcherAgent
from app.core.tools.cost_calculator import CostCalculator
from app.core.utils.logger import app_logger
from app.core.utils.helpers import calculate_trip_days, generate_trip_id

class TripService:
    def __init__(self):
        self.researcher_agent = ResearcherAgent()
        self.cost_calculator = CostCalculator()
        self.trips_storage = []  # In production, use a database
    
    async def plan_trip(self, request: TripRequest) -> Dict[str, Any]:
        """Plan a complete trip using AI agents"""
        
        app_logger.info(f"Starting trip planning for {request.destination}")
        
        # Calculate trip duration
        days = calculate_trip_days(request.start_date, request.end_date)
        
        # Research destination
        research_data = await self.researcher_agent.research_destination(
            destination=request.destination,
            travel_dates={"start_date": request.start_date, "end_date": request.end_date},
            preferences=request.preferences
        )
        
        # Calculate costs
        cost_breakdown = self.cost_calculator.calculate_trip_cost(
            destination=request.destination,
            days=days,
            travelers=request.travelers,
            budget_preference=request.preferences.get("budget_level", "medium")
        )
        
        # Generate itinerary
        itinerary = await self._generate_itinerary(
            destination=request.destination,
            days=days,
            interests=request.interests,
            attractions=research_data.get("attractions", [])
        )
        
        # Create trip record
        trip_data = {
            "id": len(self.trips_storage) + 1,
            "destination": request.destination,
            "start_date": request.start_date,
            "end_date": request.end_date,
            "budget": request.budget,
            "travelers": request.travelers,
            "preferences": request.preferences,
            "interests": request.interests,
            "days": days,
            "itinerary": itinerary,
            "cost_breakdown": cost_breakdown,
            "research_data": research_data,
            "plan": await self._generate_plan_summary(request.destination, days, itinerary),
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        # Store trip
        self.trips_storage.append(trip_data)
        
        app_logger.info(f"Trip planning completed for {request.destination}")
        return trip_data
    
    async def get_all_trips(self) -> List[Dict[str, Any]]:
        """Get all planned trips"""
        return sorted(self.trips_storage, key=lambda x: x["created_at"], reverse=True)
    
    async def get_trip_by_id(self, trip_id: int) -> Optional[Dict[str, Any]]:
        """Get a specific trip by ID"""
        for trip in self.trips_storage:
            if trip["id"] == trip_id:
                return trip
        return None
    
    async def delete_trip(self, trip_id: int) -> bool:
        """Delete a trip"""
        for i, trip in enumerate(self.trips_storage):
            if trip["id"] == trip_id:
                del self.trips_storage[i]
                return True
        return False
    
    async def update_trip(self, trip_id: int, request: TripRequest) -> Optional[Dict[str, Any]]:
        """Update an existing trip"""
        for i, trip in enumerate(self.trips_storage):
            if trip["id"] == trip_id:
                # Re-plan the trip with new parameters
                updated_trip = await self.plan_trip(request)
                updated_trip["id"] = trip_id  # Keep original ID
                updated_trip["created_at"] = trip["created_at"]  # Keep original creation time
                self.trips_storage[i] = updated_trip
                return updated_trip
        return None
    
    async def _generate_itinerary(self, destination: str, days: int, interests: List[str], 
                                attractions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate day-by-day itinerary"""
        
        itinerary = []
        
        for day in range(1, min(days + 1, 8)):  # Limit to 7 days for detailed planning
            day_plan = {
                "day": day,
                "date": self._calculate_date(day),
                "theme": self._get_day_theme(day, interests),
                "activities": []
            }
            
            # Morning activity
            morning_activity = self._select_activity(attractions, "morning", interests)
            day_plan["activities"].append({
                "time": "09:00 - 12:00",
                "period": "morning",
                "activity": morning_activity["name"] if morning_activity else f"Explore {destination} morning attractions",
                "description": morning_activity.get("description", f"Start your day exploring {destination}"),
                "duration": morning_activity.get("duration", "3 hours") if morning_activity else "3 hours",
                "type": morning_activity.get("type", "sightseeing") if morning_activity else "sightseeing"
            })
            
            # Afternoon activity
            afternoon_activity = self._select_activity(attractions, "afternoon", interests)
            day_plan["activities"].append({
                "time": "14:00 - 17:00",
                "period": "afternoon",
                "activity": afternoon_activity["name"] if afternoon_activity else f"Visit local markets and shops in {destination}",
                "description": afternoon_activity.get("description", f"Discover the local culture of {destination}"),
                "duration": afternoon_activity.get("duration", "3 hours") if afternoon_activity else "3 hours",
                "type": afternoon_activity.get("type", "cultural") if afternoon_activity else "cultural"
            })
            
            # Evening activity
            day_plan["activities"].append({
                "time": "19:00 - 21:00",
                "period": "evening",
                "activity": f"Enjoy local cuisine in {destination}",
                "description": f"Experience the culinary delights of {destination}",
                "duration": "2 hours",
                "type": "dining"
            })
            
            itinerary.append(day_plan)
        
        return itinerary
    
    def _get_day_theme(self, day: int, interests: List[str]) -> str:
        """Get theme for each day based on interests"""
        themes = {
            1: "Arrival and Orientation",
            2: "Cultural Exploration",
            3: "Adventure and Activities",
            4: "Local Experiences",
            5: "Relaxation and Leisure",
            6: "Shopping and Souvenirs",
            7: "Departure Preparation"
        }
        
        if interests:
            interest_themes = {
                "culture": "Cultural Immersion",
                "adventure": "Adventure Activities",
                "food": "Culinary Journey",
                "nature": "Nature Exploration",
                "history": "Historical Discovery",
                "art": "Art and Museums",
                "shopping": "Shopping Experience"
            }
            
            for interest in interests:
                if interest.lower() in interest_themes:
                    return interest_themes[interest.lower()]
        
        return themes.get(day, "Exploration")
    
    def _select_activity(self, attractions: List[Dict[str, Any]], period: str, 
                        interests: List[str]) -> Optional[Dict[str, Any]]:
        """Select appropriate activity for time period"""
        if not attractions:
            return None
        
        # Filter attractions based on interests if available
        if interests:
            filtered = [a for a in attractions if any(interest.lower() in a.get("type", "").lower() for interest in interests)]
            if filtered:
                attractions = filtered
        
        # Simple selection logic (in production, use more sophisticated AI)
        if period == "morning" and attractions:
            return attractions[0]
        elif period == "afternoon" and len(attractions) > 1:
            return attractions[1]
        elif len(attractions) > 2:
            return attractions[2]
        
        return attractions[0] if attractions else None
    
    def _calculate_date(self, day: int) -> str:
        """Calculate date for each day (simplified)"""
        from datetime import datetime, timedelta
        base_date = datetime.now() + timedelta(days=day-1)
        return base_date.strftime("%Y-%m-%d")
    
    async def _generate_plan_summary(self, destination: str, days: int, 
                                   itinerary: List[Dict[str, Any]]) -> str:
        """Generate a human-readable plan summary"""
        
        summary = f"Welcome to your {days}-day adventure in {destination}!\n\n"
        summary += f"This carefully crafted itinerary will take you through the best of {destination}, "
        summary += f"combining must-see attractions with authentic local experiences.\n\n"
        
        summary += "Highlights of your trip:\n"
        for day_plan in itinerary[:3]:  # Show first 3 days
            day_num = day_plan["day"]
            theme = day_plan["theme"]
            summary += f"• Day {day_num}: {theme}\n"
        
        if len(itinerary) > 3:
            summary += f"• And {len(itinerary) - 3} more exciting days!\n"
        
        summary += f"\nYour journey includes cultural exploration, local cuisine, and unforgettable experiences "
        summary += f"that will make your visit to {destination} truly memorable."
        
        return summary