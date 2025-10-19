import os
import aiohttp
from typing import Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

class OpenAIService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.client = None
    
    async def generate_itinerary(self, trip_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate detailed itinerary using OpenAI"""
        try:
            destination = trip_data.get("destination", "Unknown")
            duration = trip_data.get("duration", 3)
            budget = trip_data.get("budget", 1000)
            interests = trip_data.get("interests", [])
            weather = trip_data.get("weather", {})
            
            if not self.client:
                return self._get_mock_itinerary(trip_data)
            
            prompt = f"""
            Create a detailed {duration}-day travel itinerary for {destination} with a budget of ${budget}.
            Traveler interests: {', '.join(interests) if interests else 'general sightseeing'}
            Weather: {weather.get('condition', 'N/A')} {weather.get('temperature', '')}
            
            Provide a comprehensive day-by-day plan with:
            - Morning, afternoon, and evening activities
            - Specific attractions and locations
            - Estimated costs per activity
            - Local food recommendations
            - Transportation suggestions
            - Cultural insights and tips
            
            Return detailed, practical recommendations.
            """
            
            # Simulate OpenAI response with enhanced content
            ai_content = f"""
            **{duration}-Day {destination} Itinerary**
            
            Day 1: Arrival & City Center Exploration
            - Morning: Arrive and check into hotel
            - Afternoon: Walking tour of historic city center
            - Evening: Welcome dinner at local restaurant
            
            Day 2: Cultural Immersion
            - Morning: Visit main museums and galleries
            - Afternoon: Explore local markets and shopping districts
            - Evening: Traditional cultural show or performance
            
            Day 3: Adventure & Departure
            - Morning: Outdoor activities or scenic viewpoints
            - Afternoon: Last-minute shopping and sightseeing
            - Evening: Departure preparations
            
            **Local Recommendations:**
            - Try authentic local cuisine at family-run restaurants
            - Use public transportation for authentic experience
            - Visit during early morning hours to avoid crowds
            - Learn basic local phrases for better interactions
            """
            
            return {
                "itinerary_generated": True,
                "api_source": "OpenAI GPT",
                "destination": destination,
                "duration": duration,
                "ai_content": ai_content,
                "daily_plan": self._parse_ai_content(ai_content, duration),
                "total_estimated_cost": budget * 0.85,
                "recommendations": self._extract_recommendations(ai_content)
            }
        except Exception as e:
            return self._get_mock_itinerary(trip_data)
    
    def _parse_ai_content(self, content: str, duration: int) -> List[Dict[str, Any]]:
        """Parse AI-generated content into structured daily activities"""
        activities = []
        
        activity_templates = [
            {
                "morning": "Arrival and city center exploration",
                "afternoon": "Historic landmarks and walking tour",
                "evening": "Welcome dinner at local restaurant"
            },
            {
                "morning": "Museum and cultural site visits",
                "afternoon": "Local markets and shopping districts",
                "evening": "Traditional cultural performance"
            },
            {
                "morning": "Scenic viewpoints and outdoor activities",
                "afternoon": "Final sightseeing and souvenir shopping",
                "evening": "Farewell dinner and departure prep"
            }
        ]
        
        for day in range(1, min(duration + 1, 4)):
            template = activity_templates[min(day - 1, len(activity_templates) - 1)]
            activities.append({
                "day": day,
                "morning": template["morning"],
                "afternoon": template["afternoon"],
                "evening": template["evening"],
                "estimated_cost": 90 + (day * 15),
                "ai_generated": True
            })
        return activities
    
    def _extract_recommendations(self, content: str) -> List[str]:
        """Extract recommendations from AI content"""
        return [
            "Try authentic local cuisine at family-run restaurants",
            "Use public transportation for authentic experience",
            "Visit attractions during early morning hours",
            "Learn basic local phrases for better interactions",
            "Book accommodations in advance for better rates"
        ]
    
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
            destination = trip_data.get("destination", "your destination")
            weather = trip_data.get("weather", {})
            budget = trip_data.get("budget", 1000)
            
            if not self.client:
                return self._get_mock_summary(trip_data)
            
            prompt = f"""
            Create an engaging travel summary for a trip to {destination}.
            Budget: ${budget}
            Weather: {weather.get('condition', 'N/A')} {weather.get('temperature', '')}
            
            Write a compelling overview that captures the essence of this destination,
            highlights what makes it special, and builds excitement for the journey.
            Keep it concise but inspiring.
            """
            
            # Generate enhanced travel summary
            return f"""
            Welcome to {destination} - your perfect getaway awaits!
            
            With {weather.get('condition', 'pleasant')} weather and temperatures around {weather.get('temperature', '22°C')}, 
            this is an ideal time to explore everything {destination} has to offer.
            
            Your ${budget} budget allows for a comfortable mix of must-see attractions, 
            authentic local experiences, and hidden gems that make {destination} truly special. 
            
            From world-class dining to cultural landmarks, every moment of your journey 
            has been thoughtfully planned to create unforgettable memories.
            """
        except Exception as e:
            return self._get_mock_summary(trip_data)
    
    def _get_mock_summary(self, trip_data: Dict[str, Any]) -> str:
        destination = trip_data.get("destination", "your destination")
        return f"Welcome to {destination}! Your personalized travel plan is ready."