from typing import Dict, Any, List
from ..tools.cost_calculator import CostCalculator
from ..memory.conversation_memory import ConversationMemory
from ...services.openai_service import OpenAIService

class PlannerAgent:
    def __init__(self):
        self.cost_calculator = CostCalculator()
        self.memory = ConversationMemory()
        self.openai_service = OpenAIService()
    
    async def create_itinerary(self, trip_data: Dict[str, Any]) -> Dict[str, Any]:
        # Calculate duration from dates if provided
        duration = self._calculate_duration(trip_data)
        trip_data["duration"] = duration
        
        # Generate AI-powered itinerary
        ai_itinerary = await self.openai_service.generate_itinerary(trip_data)
        
        # Calculate costs
        total_cost = self.cost_calculator.calculate_total_cost(trip_data)
        
        itinerary = {
            "destination": trip_data.get("destination"),
            "duration": duration,
            "activities": self._extract_activities(ai_itinerary),
            "estimated_cost": total_cost,
            "recommendations": ai_itinerary.get("recommendations", []),
            "daily_plan": ai_itinerary.get("daily_plan", []),
            "ai_generated": True,
            "api_sources": {
                "itinerary": ai_itinerary.get("api_source", "Mock Data"),
                "flights": "Amadeus API" if trip_data.get("flights") else "Mock Data",
                "hotels": "Amadeus API" if trip_data.get("hotels") else "Mock Data",
                "weather": "OpenWeatherMap API"
            }
        }
        
        await self.memory.store_plan(itinerary)
        return itinerary
    
    def _calculate_duration(self, trip_data: Dict[str, Any]) -> int:
        start_date = trip_data.get("start_date")
        end_date = trip_data.get("end_date")
        
        if start_date and end_date:
            from datetime import datetime
            try:
                start = datetime.fromisoformat(start_date)
                end = datetime.fromisoformat(end_date)
                return (end - start).days
            except:
                pass
        
        return trip_data.get("duration", 3)
    
    def _extract_activities(self, ai_itinerary: Dict[str, Any]) -> List[str]:
        daily_plan = ai_itinerary.get("daily_plan", [])
        activities = []
        
        for day in daily_plan:
            if isinstance(day, dict):
                activities.extend([
                    day.get("morning", ""),
                    day.get("afternoon", ""),
                    day.get("evening", "")
                ])
        
        return [activity for activity in activities if activity]
    
    def _get_recommendations(self, trip_data: Dict[str, Any]) -> List[str]:
        return ["Book early for better prices", "Check weather forecast"]