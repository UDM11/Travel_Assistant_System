import httpx
from typing import Dict, Any, List
from datetime import datetime, timedelta
from app.config import settings
from app.core.utils.logger import app_logger

class FlightTool:
    def __init__(self):
        self.api_key = settings.AMADEUS_API_KEY
        self.api_secret = settings.AMADEUS_API_SECRET
        self.base_url = "https://test.api.amadeus.com/v2"
        self.access_token = None
    
    async def search_flights(self, origin: str, destination: str, departure_date: str, 
                           return_date: str = None, passengers: int = 1) -> Dict[str, Any]:
        """Search for flights"""
        try:
            if not self.api_key:
                return self._get_mock_flights(origin, destination, departure_date, return_date, passengers)
            
            # Get access token first
            await self._get_access_token()
            
            params = {
                "originLocationCode": origin,
                "destinationLocationCode": destination,
                "departureDate": departure_date,
                "adults": passengers
            }
            
            if return_date:
                params["returnDate"] = return_date
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/shopping/flight-offers",
                    params=params,
                    headers={"Authorization": f"Bearer {self.access_token}"}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return self._format_flight_response(data)
                else:
                    app_logger.error(f"Flight API error: {response.status_code}")
                    return self._get_mock_flights(origin, destination, departure_date, return_date, passengers)
                    
        except Exception as e:
            app_logger.error(f"Flight search error: {str(e)}")
            return self._get_mock_flights(origin, destination, departure_date, return_date, passengers)
    
    async def _get_access_token(self):
        """Get Amadeus API access token"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://test.api.amadeus.com/v1/security/oauth2/token",
                    data={
                        "grant_type": "client_credentials",
                        "client_id": self.api_key,
                        "client_secret": self.api_secret
                    },
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    self.access_token = data["access_token"]
                    
        except Exception as e:
            app_logger.error(f"Token error: {str(e)}")
    
    def _format_flight_response(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Format Amadeus API response"""
        flights = []
        
        for offer in data.get("data", []):
            flight_info = {
                "id": offer["id"],
                "price": float(offer["price"]["total"]),
                "currency": offer["price"]["currency"],
                "segments": []
            }
            
            for itinerary in offer["itineraries"]:
                for segment in itinerary["segments"]:
                    flight_info["segments"].append({
                        "departure": {
                            "airport": segment["departure"]["iataCode"],
                            "time": segment["departure"]["at"]
                        },
                        "arrival": {
                            "airport": segment["arrival"]["iataCode"],
                            "time": segment["arrival"]["at"]
                        },
                        "airline": segment["carrierCode"],
                        "flight_number": segment["number"],
                        "duration": segment["duration"]
                    })
            
            flights.append(flight_info)
        
        return {
            "flights": flights,
            "total_results": len(flights)
        }
    
    def _get_mock_flights(self, origin: str, destination: str, departure_date: str, 
                         return_date: str = None, passengers: int = 1) -> Dict[str, Any]:
        """Return mock flight data"""
        flights = []
        
        # Generate 3 mock flights
        for i in range(3):
            base_price = 200 + (i * 50)
            flight = {
                "id": f"MOCK_{i+1}",
                "price": base_price * passengers,
                "currency": "USD",
                "segments": [{
                    "departure": {
                        "airport": origin,
                        "time": f"{departure_date}T{8+i*2:02d}:00:00"
                    },
                    "arrival": {
                        "airport": destination,
                        "time": f"{departure_date}T{12+i*2:02d}:30:00"
                    },
                    "airline": ["AA", "DL", "UA"][i],
                    "flight_number": f"{1000+i}",
                    "duration": "PT4H30M"
                }]
            }
            
            # Add return flight if requested
            if return_date:
                flight["segments"].append({
                    "departure": {
                        "airport": destination,
                        "time": f"{return_date}T{14+i*2:02d}:00:00"
                    },
                    "arrival": {
                        "airport": origin,
                        "time": f"{return_date}T{18+i*2:02d}:30:00"
                    },
                    "airline": ["AA", "DL", "UA"][i],
                    "flight_number": f"{2000+i}",
                    "duration": "PT4H30M"
                })
                flight["price"] *= 2  # Round trip
            
            flights.append(flight)
        
        return {
            "flights": flights,
            "total_results": len(flights)
        }