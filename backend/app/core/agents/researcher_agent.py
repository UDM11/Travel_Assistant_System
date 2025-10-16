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
        weather = await self.weather_tool.get_weather(destination)
        flights = await self.flight_tool.search_flights(destination)
        hotels = await self.hotel_tool.search_hotels(destination)
        
        return {
            "destination": destination,
            "weather": weather,
            "flights": flights,
            "hotels": hotels
        }