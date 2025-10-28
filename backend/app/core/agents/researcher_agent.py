from typing import Dict, Any
from datetime import datetime, timedelta
from ..tools.weather_tool import WeatherTool
from ..tools.flight_tool import FlightTool
from ..tools.hotel_tool import HotelTool

class ResearcherAgent:
    def __init__(self):
        self.weather_tool = WeatherTool()
        self.flight_tool = FlightTool()
        self.hotel_tool = HotelTool()
    
    async def research_destination(self, destination: str, check_in: str = None, check_out: str = None, 
                                 travelers: int = 2) -> Dict[str, Any]:
        print(f"Researching destination: {destination}")
        
        weather = await self.weather_tool.get_weather(destination)
        print(f"Weather data: {len(str(weather))} chars")
        
        flights = await self.flight_tool.search_flights(destination)
        print(f"Flights data: {len(flights)} flights")
        
        hotels = await self.hotel_tool.search_hotels(
            location=destination,
            check_in=check_in,
            check_out=check_out,
            adults=travelers,
            rooms=max(1, travelers // 2)
        )
        print(f"Hotels data: {len(hotels)} hotels found via RapidAPI")
        
        # Format hotel data for trip integration
        formatted_hotels = self._format_hotels_for_trip(hotels)
        
        return {
            "destination": destination,
            "weather": weather,
            "flights": flights,
            "hotels": formatted_hotels,
            "hotel_details": hotels,  # Full hotel data for frontend
            "research_completed": True,
            "api_sources": {
                "weather": "OpenWeatherMap API",
                "flights": "Amadeus API", 
                "hotels": "RapidAPI Booking.com"
            }
        }
    
    def _format_hotels_for_trip(self, hotels: list) -> Dict[str, Any]:
        """Format hotel data for trip summary and highlights."""
        if not hotels:
            return {"available": False, "message": "No hotels found"}
        
        # Get best hotel (highest rated)
        best_hotel = max(hotels, key=lambda x: x.get('rating', 0))
        
        # Calculate average price
        avg_price = sum(h.get('price_per_night', 0) for h in hotels) / len(hotels)
        
        return {
            "available": True,
            "total_found": len(hotels),
            "best_hotel": {
                "name": best_hotel.get('name'),
                "rating": best_hotel.get('rating'),
                "price": best_hotel.get('price_per_night'),
                "currency": best_hotel.get('currency', 'USD')
            },
            "price_range": {
                "min": min(h.get('price_per_night', 0) for h in hotels),
                "max": max(h.get('price_per_night', 0) for h in hotels),
                "average": round(avg_price, 2)
            },
            "api_source": "RapidAPI Booking.com"
        }