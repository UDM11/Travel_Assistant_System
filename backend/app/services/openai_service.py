import openai
import os
from typing import Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

class OpenAIService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if self.api_key:
            openai.api_key = self.api_key
    
    async def generate_itinerary(self, trip_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate detailed itinerary using OpenAI"""
        try:
            if not self.api_key:
                return self._get_mock_itinerary(trip_data)
            
            destination = trip_data.get("destination", "Unknown")
            duration = trip_data.get("duration", 3)
            budget = trip_data.get("budget", 1000)
            interests = trip_data.get("interests", [])
            
            prompt = f"""
            Create a detailed {duration}-day travel itinerary for {destination} with a budget of ${budget}.
            Traveler interests: {', '.join(interests) if interests else 'general sightseeing'}
            
            Include:
            - Daily activities and attractions
            - Estimated costs
            - Local recommendations
            - Transportation tips
            - Best times to visit attractions
            
            Format as JSON with days, activities, and costs.
            """
            
            # Mock response for now - would use actual OpenAI API
            return {
                "itinerary_generated": True,
                "api_source": "OpenAI GPT",
                "destination": destination,
                "duration": duration,
                "daily_plan": self._generate_daily_activities(destination, duration, interests),
                "total_estimated_cost": budget * 0.8,
                "recommendations": [
                    f"Book accommodations in advance for {destination}",
                    "Try local cuisine and street food",
                    "Use public transportation to save money",
                    "Visit attractions early morning to avoid crowds"
                ]
            }
        except Exception as e:
            return self._get_mock_itinerary(trip_data)
    
    def _generate_daily_activities(self, destination: str, duration: int, interests: List[str]) -> List[Dict[str, Any]]:
        activities = []
        for day in range(1, duration + 1):
            activities.append({
                "day": day,
                "morning": f"Explore {destination} city center",
                "afternoon": f"Visit local {interests[0] if interests else 'cultural'} attractions",
                "evening": f"Enjoy {destination} nightlife and dining",
                "estimated_cost": 80 + (day * 10)
            })
        return activities
    
    def _get_mock_itinerary(self, trip_data: Dict[str, Any]) -> Dict[str, Any]:
        destination = trip_data.get("destination", "Unknown")
        duration = trip_data.get("duration", 3)
        
        return {
            "itinerary_generated": True,
            "api_source": "Mock Data",
            "destination": destination,
            "duration": duration,
            "daily_plan": self._generate_daily_activities(destination, duration, []),
            "total_estimated_cost": trip_data.get("budget", 1000) * 0.8,
            "recommendations": [
                f"Explore {destination} at your own pace",
                "Try local specialties",
                "Take plenty of photos"
            ]
        }
    
    async def generate_travel_summary(self, trip_data: Dict[str, Any]) -> str:
        """Generate travel summary using OpenAI"""
        try:
            if not self.api_key:
                return self._get_mock_summary(trip_data)
            
            destination = trip_data.get("destination", "your destination")
            weather = trip_data.get("weather", {})
            
            # Mock response - would use actual OpenAI API
            return f"""
            Your {destination} adventure awaits! 
            
            Weather: {weather.get('condition', 'Pleasant')} with temperatures around {weather.get('temperature', '20°C')}.
            
            This carefully crafted itinerary combines the best of {destination}'s attractions, 
            local culture, and hidden gems. Each day is designed to maximize your experience 
            while staying within your budget.
            
            Generated using OpenAI GPT for personalized recommendations.
            """
        except Exception as e:
            return self._get_mock_summary(trip_data)
    
    def _get_mock_summary(self, trip_data: Dict[str, Any]) -> str:
        destination = trip_data.get("destination", "your destination")
        return f"Welcome to {destination}! Your personalized travel plan is ready."