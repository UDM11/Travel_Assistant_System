from typing import Dict, Any, List
from ..memory.conversation_memory import ConversationMemory
from ...services.openai_service import OpenAIService

class SummarizerAgent:
    def __init__(self):
        self.memory = ConversationMemory()
        self.openai_service = OpenAIService()
    
    async def summarize_trip(self, trip_data: Dict[str, Any]) -> Dict[str, Any]:
        # Generate AI-powered summary
        ai_summary = await self.openai_service.generate_travel_summary(trip_data)
        
        summary = {
            "trip_overview": ai_summary,
            "key_highlights": self._extract_highlights(trip_data),
            "budget_summary": self._summarize_budget(trip_data),
            "recommendations": self._final_recommendations(trip_data),
            "api_sources_used": self._get_api_sources(trip_data),
            "ai_generated": True,
            "timestamp": trip_data.get("timestamp", "")
        }
        
        await self.memory.store_summary(summary)
        return summary
    
    def _create_overview(self, trip_data: Dict[str, Any]) -> str:
        dest = trip_data.get("destination", "Unknown")
        duration = trip_data.get("duration", 0)
        weather = trip_data.get("weather", {})
        weather_info = f" Weather: {weather.get('condition', 'N/A')} {weather.get('temperature', '')}"
        return f"{duration}-day trip to {dest}.{weather_info}"
    
    def _extract_highlights(self, trip_data: Dict[str, Any]) -> List[str]:
        highlights = []
        
        # Extract from flights data
        flights = trip_data.get("flights", [])
        if flights:
            best_flight = min(flights, key=lambda x: x.get("price", 999))
            highlights.append(f"Best flight deal: {best_flight.get('airline')} - ${best_flight.get('price')}")
        
        # Extract from hotels data
        hotels = trip_data.get("hotels", [])
        if hotels:
            top_hotel = max(hotels, key=lambda x: x.get("rating", 0))
            highlights.append(f"Top-rated hotel: {top_hotel.get('name')} ({top_hotel.get('rating')}★)")
        
        # Extract from weather
        weather = trip_data.get("weather", {})
        if weather.get("condition"):
            highlights.append(f"Weather forecast: {weather.get('condition')} {weather.get('temperature', '')}")
        
        return highlights if highlights else ["Personalized itinerary", "Local experiences", "Budget-friendly options"]
    
    def _summarize_budget(self, trip_data: Dict[str, Any]) -> Dict[str, Any]:
        total_cost = trip_data.get("estimated_cost", 1000)
        
        # Calculate breakdown based on typical travel expenses
        flights_cost = total_cost * 0.4
        hotels_cost = total_cost * 0.3
        activities_cost = total_cost * 0.2
        food_cost = total_cost * 0.1
        
        return {
            "total_estimated": total_cost,
            "breakdown": {
                "flights": round(flights_cost),
                "hotels": round(hotels_cost),
                "activities": round(activities_cost),
                "food": round(food_cost)
            },
            "currency": "USD"
        }
    
    def _final_recommendations(self, trip_data: Dict[str, Any]) -> List[str]:
        recommendations = []
        
        # Weather-based recommendations
        weather = trip_data.get("weather", {})
        if "rain" in weather.get("condition", "").lower():
            recommendations.append("Pack an umbrella or rain jacket")
        
        # Budget-based recommendations
        budget = trip_data.get("budget", 0)
        if budget < 500:
            recommendations.append("Consider budget accommodations and local transport")
        elif budget > 2000:
            recommendations.append("Explore premium experiences and fine dining")
        
        # Default recommendations
        recommendations.extend([
            "Book accommodations early for better rates",
            "Check visa requirements",
            "Get travel insurance",
            "Download offline maps"
        ])
        
        return recommendations[:5]  # Limit to 5 recommendations
    
    def _get_api_sources(self, trip_data: Dict[str, Any]) -> Dict[str, str]:
        return {
            "weather": "OpenWeatherMap API",
            "flights": "Amadeus API",
            "hotels": "Amadeus API",
            "ai_content": "OpenAI GPT",
            "summary_generation": "AI-Powered"
        }