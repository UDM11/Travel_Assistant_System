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
        
        # Add weather data to trip_data for AI processing
        if "weather" in trip_data:
            trip_data["weather_info"] = trip_data["weather"]
        
        # Generate AI-powered itinerary
        ai_itinerary = await self.openai_service.generate_itinerary(trip_data)
        
        # Calculate costs
        total_cost = self.cost_calculator.calculate_total_cost(trip_data)
        
        # Ensure daily_plan is always populated
        daily_plan = ai_itinerary.get("daily_plan", [])
        if not daily_plan:
            # Create default daily plan
            for day in range(1, duration + 1):
                daily_plan.append({
                    "day": day,
                    "morning": f"Day {day} morning exploration",
                    "afternoon": f"Day {day} afternoon activities", 
                    "evening": f"Day {day} evening experiences",
                    "estimated_cost": 90 + (day * 15)
                })
        
        itinerary = {
            "destination": trip_data.get("destination"),
            "duration": duration,
            "activities": self._extract_activities(ai_itinerary),
            "estimated_cost": total_cost,
            "recommendations": ai_itinerary.get("recommendations", []),
            "daily_plan": daily_plan,
            "ai_generated": True,
            "api_sources": {
                "itinerary": ai_itinerary.get("api_source", "Enhanced Mock Data"),
                "flights": "Amadeus API" if trip_data.get("flights") else "Enhanced Mock Data",
                "hotels": "Amadeus API" if trip_data.get("hotels") else "Enhanced Mock Data",
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
                morning = day.get("morning", "")
                afternoon = day.get("afternoon", "")
                evening = day.get("evening", "")
                
                if morning:
                    activities.append(f"Morning: {morning}")
                if afternoon:
                    activities.append(f"Afternoon: {afternoon}")
                if evening:
                    activities.append(f"Evening: {evening}")
        
        # If no activities found, create default ones
        if not activities:
            activities = [
                "City center exploration and orientation",
                "Visit main cultural attractions and museums",
                "Local cuisine tasting and market visits",
                "Scenic viewpoints and photo opportunities",
                "Shopping and souvenir hunting"
            ]
        
        return activities
    
    def _get_recommendations(self, trip_data: Dict[str, Any]) -> List[str]:
        return ["Book early for better prices", "Check weather forecast"]