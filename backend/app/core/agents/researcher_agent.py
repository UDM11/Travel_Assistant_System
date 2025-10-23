from typing import Dict, Any
from ..tools.weather_tool import WeatherTool
from ..tools.flight_tool import FlightTool
from ..tools.hotel_tool import HotelTool

class ResearcherAgent:
    def __init__(self):
        self.weather_tool = WeatherTool()
        self.flight_tool = FlightTool()
        self.hotel_tool = HotelTool()
    
    async def research_destination(self, destination: str) -> Dict[str, Any]:
        print(f"🔍 Researching destination: {destination}")
        
        weather = await self.weather_tool.get_weather(destination)
        print(f"✅ Weather data: {len(str(weather))} chars")
        
        flights = await self.flight_tool.search_flights(destination)
        print(f"✅ Flights data: {len(flights)} flights")
        
        hotels = await self.hotel_tool.search_hotels(destination)
        print(f"🏨 Hotels data: {len(hotels)} hotels found")
        
        return {
            "destination": destination,
            "weather": weather,
            "flights": flights,
            "hotels": hotels,
            "research_completed": True
        }