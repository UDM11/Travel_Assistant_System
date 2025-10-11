from typing import Dict, Any, List
import asyncio
from datetime import datetime

from app.services.weather import WeatherService
from app.services.flights import FlightService
from app.services.hotels import HotelService
from app.services.llm_client import LLMClient
from app.memory.vectorstore import VectorStore


class ResearcherAgent:
    """
    Agent responsible for gathering comprehensive data about destinations
    """
    
    def __init__(self):
        self.weather_service = WeatherService()
        self.flight_service = FlightService()
        self.hotel_service = HotelService()
        self.llm_client = LLMClient()
        self.vector_store = VectorStore()
    
    async def research_destination(
        self,
        destination: str,
        start_date: str,
        end_date: str,
        preferences: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Conduct comprehensive research about the destination
        """
        try:
            # Parallel data gathering
            tasks = [
                self._get_weather_data(destination, start_date, end_date),
                self._get_flight_options(destination, start_date, end_date),
                self._get_hotel_options(destination, start_date, end_date),
                self._get_destination_info(destination, preferences),
                self._get_local_attractions(destination, preferences)
            ]
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            weather_data, flight_data, hotel_data, destination_info, attractions = results
            
            return {
                "destination": destination,
                "weather": weather_data if not isinstance(weather_data, Exception) else None,
                "flights": flight_data if not isinstance(flight_data, Exception) else None,
                "hotels": hotel_data if not isinstance(hotel_data, Exception) else None,
                "destination_info": destination_info if not isinstance(destination_info, Exception) else None,
                "attractions": attractions if not isinstance(attractions, Exception) else None,
                "research_timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            print(f"❌ Research failed: {str(e)}")
            raise Exception(f"Destination research failed: {str(e)}")
    
    async def _get_weather_data(self, destination: str, start_date: str, end_date: str) -> Dict[str, Any]:
        """Get weather information for the destination"""
        try:
            return await self.weather_service.get_weather_forecast(
                destination, start_date, end_date
            )
        except Exception as e:
            print(f"⚠️ Weather data unavailable: {str(e)}")
            return {"error": str(e)}
    
    async def _get_flight_options(self, destination: str, start_date: str, end_date: str) -> Dict[str, Any]:
        """Get flight options to the destination"""
        try:
            return await self.flight_service.search_flights(
                destination=destination,
                departure_date=start_date,
                return_date=end_date
            )
        except Exception as e:
            print(f"⚠️ Flight data unavailable: {str(e)}")
            return {"error": str(e)}
    
    async def _get_hotel_options(self, destination: str, start_date: str, end_date: str) -> Dict[str, Any]:
        """Get hotel options in the destination"""
        try:
            return await self.hotel_service.search_hotels(
                destination=destination,
                check_in=start_date,
                check_out=end_date
            )
        except Exception as e:
            print(f"⚠️ Hotel data unavailable: {str(e)}")
            return {"error": str(e)}
    
    async def _get_destination_info(self, destination: str, preferences: Dict[str, Any]) -> Dict[str, Any]:
        """Get general information about the destination using LLM"""
        try:
            prompt = f"""
            Provide comprehensive information about {destination} including:
            - Best time to visit
            - Cultural highlights
            - Local customs and etiquette
            - Transportation options
            - Safety considerations
            - Currency and payment methods
            - Language and communication
            
            Focus on aspects relevant to: {preferences.get('interests', 'general travel')}
            """
            
            response = await self.llm_client.generate_response(prompt)
            return {"destination_info": response}
            
        except Exception as e:
            print(f"⚠️ Destination info unavailable: {str(e)}")
            return {"error": str(e)}
    
    async def _get_local_attractions(self, destination: str, preferences: Dict[str, Any]) -> Dict[str, Any]:
        """Get local attractions and activities"""
        try:
            interests = preferences.get('interests', [])
            prompt = f"""
            List the top attractions and activities in {destination} that match these interests: {interests}
            
            For each attraction, include:
            - Name and description
            - Estimated cost
            - Best time to visit
            - Duration needed
            - Booking requirements
            """
            
            response = await self.llm_client.generate_response(prompt)
            return {"attractions": response}
            
        except Exception as e:
            print(f"⚠️ Attractions data unavailable: {str(e)}")
            return {"error": str(e)}
