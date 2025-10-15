from typing import Dict, Any, List
import httpx
from app.core.utils.logger import app_logger
from app.core.tools.weather_tool import WeatherTool
from app.core.tools.flight_tool import FlightTool
from app.core.tools.hotel_tool import HotelTool

class ResearcherAgent:
    def __init__(self):
        self.weather_tool = WeatherTool()
        self.flight_tool = FlightTool()
        self.hotel_tool = HotelTool()
        self.name = "Researcher Agent"
    
    async def research_destination(self, destination: str, travel_dates: Dict[str, str], 
                                 preferences: Dict[str, Any]) -> Dict[str, Any]:
        """Research comprehensive destination information"""
        
        app_logger.info(f"Researching destination: {destination}")
        
        research_data = {
            "destination": destination,
            "weather": await self._research_weather(destination),
            "attractions": await self._research_attractions(destination),
            "local_info": await self._research_local_info(destination),
            "travel_tips": await self._research_travel_tips(destination),
            "best_time_to_visit": await self._research_best_time(destination),
            "cultural_info": await self._research_culture(destination)
        }
        
        return research_data
    
    async def research_flights(self, origin: str, destination: str, dates: Dict[str, str], 
                             travelers: int) -> Dict[str, Any]:
        """Research flight options"""
        
        app_logger.info(f"Researching flights from {origin} to {destination}")
        
        flight_data = await self.flight_tool.search_flights(
            origin=origin,
            destination=destination,
            departure_date=dates["start_date"],
            return_date=dates.get("end_date"),
            passengers=travelers
        )
        
        return flight_data
    
    async def research_accommodations(self, destination: str, dates: Dict[str, str], 
                                    travelers: int, budget: float = None) -> Dict[str, Any]:
        """Research accommodation options"""
        
        app_logger.info(f"Researching accommodations in {destination}")
        
        hotel_data = await self.hotel_tool.search_hotels(
            city=destination,
            check_in=dates["start_date"],
            check_out=dates["end_date"],
            guests=travelers,
            budget_max=budget
        )
        
        return hotel_data
    
    async def _research_weather(self, destination: str) -> Dict[str, Any]:
        """Research weather information"""
        try:
            current_weather = await self.weather_tool.get_current_weather(destination)
            forecast = await self.weather_tool.get_forecast(destination, days=7)
            
            return {
                "current": current_weather,
                "forecast": forecast["forecast"]
            }
        except Exception as e:
            app_logger.error(f"Weather research error: {str(e)}")
            return {"error": "Weather data unavailable"}
    
    async def _research_attractions(self, destination: str) -> List[Dict[str, Any]]:
        """Research popular attractions"""
        # Mock data - in production, integrate with tourism APIs
        attractions_db = {
            "paris": [
                {"name": "Eiffel Tower", "type": "landmark", "rating": 4.6, "duration": "2-3 hours"},
                {"name": "Louvre Museum", "type": "museum", "rating": 4.7, "duration": "3-4 hours"},
                {"name": "Notre-Dame Cathedral", "type": "religious", "rating": 4.5, "duration": "1-2 hours"},
                {"name": "Arc de Triomphe", "type": "landmark", "rating": 4.4, "duration": "1 hour"},
                {"name": "Sacré-Cœur", "type": "religious", "rating": 4.5, "duration": "1-2 hours"}
            ],
            "tokyo": [
                {"name": "Senso-ji Temple", "type": "religious", "rating": 4.3, "duration": "1-2 hours"},
                {"name": "Tokyo Skytree", "type": "landmark", "rating": 4.2, "duration": "2-3 hours"},
                {"name": "Meiji Shrine", "type": "religious", "rating": 4.4, "duration": "1-2 hours"},
                {"name": "Shibuya Crossing", "type": "landmark", "rating": 4.1, "duration": "30 minutes"},
                {"name": "Tsukiji Outer Market", "type": "market", "rating": 4.3, "duration": "2-3 hours"}
            ]
        }
        
        destination_key = destination.lower().replace(" ", "")
        return attractions_db.get(destination_key, [
            {"name": f"Popular attraction in {destination}", "type": "landmark", "rating": 4.0, "duration": "2 hours"},
            {"name": f"Local museum in {destination}", "type": "museum", "rating": 4.2, "duration": "3 hours"},
            {"name": f"Historic site in {destination}", "type": "historic", "rating": 4.1, "duration": "1 hour"}
        ])
    
    async def _research_local_info(self, destination: str) -> Dict[str, Any]:
        """Research local information"""
        return {
            "currency": "Local Currency",
            "language": "Local Language",
            "timezone": "Local Timezone",
            "emergency_numbers": {"police": "911", "medical": "911"},
            "tipping_culture": "10-15% in restaurants",
            "public_transport": "Metro, buses, taxis available",
            "electrical_outlets": "Type A/B plugs",
            "internet": "WiFi widely available"
        }
    
    async def _research_travel_tips(self, destination: str) -> List[str]:
        """Research travel tips"""
        return [
            f"Book accommodations in {destination} in advance during peak season",
            "Learn basic local phrases for better interaction",
            "Keep copies of important documents",
            "Check visa requirements before travel",
            "Get travel insurance",
            "Inform your bank about travel plans",
            "Download offline maps",
            "Pack appropriate clothing for the climate"
        ]
    
    async def _research_best_time(self, destination: str) -> Dict[str, Any]:
        """Research best time to visit"""
        return {
            "peak_season": "June - August",
            "shoulder_season": "April - May, September - October",
            "off_season": "November - March",
            "weather_considerations": "Mild temperatures in spring and fall",
            "crowd_levels": "High in summer, moderate in shoulder seasons",
            "price_considerations": "Higher prices during peak season"
        }
    
    async def _research_culture(self, destination: str) -> Dict[str, Any]:
        """Research cultural information"""
        return {
            "customs": ["Respect local traditions", "Dress appropriately for religious sites"],
            "etiquette": ["Be polite and patient", "Learn basic greetings"],
            "food_culture": "Try local specialties and street food",
            "shopping": "Bargaining may be expected in markets",
            "festivals": "Check for local festivals during your visit",
            "dos_and_donts": {
                "dos": ["Respect local customs", "Tip appropriately", "Be punctual"],
                "donts": ["Don't point with your finger", "Don't refuse hospitality", "Don't ignore dress codes"]
            }
        }