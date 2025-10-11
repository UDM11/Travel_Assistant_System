import httpx
import asyncio
from typing import Dict, Any, List
from datetime import datetime, timedelta

from app.core.config import settings


class FlightService:
    """
    Service for searching flight information
    """
    
    def __init__(self):
        self.api_key = settings.FLIGHT_API_KEY
        self.base_url = "https://api.skyscanner.net/v1"
    
    async def search_flights(
        self,
        origin: str = "NYC",
        destination: str = None,
        departure_date: str = None,
        return_date: str = None,
        passengers: int = 1
    ) -> Dict[str, Any]:
        """
        Search for flights
        """
        try:
            if not self.api_key or not destination:
                return await self._get_mock_flights(destination, departure_date, return_date)
            
            # For now, return mock data as flight APIs require complex setup
            return await self._get_mock_flights(destination, departure_date, return_date)
            
        except Exception as e:
            print(f"⚠️ Flight service error: {str(e)}")
            return await self._get_mock_flights(destination, departure_date, return_date)
    
    async def _get_mock_flights(
        self,
        destination: str,
        departure_date: str,
        return_date: str
    ) -> Dict[str, Any]:
        """Generate mock flight data"""
        
        # Calculate trip duration
        if departure_date and return_date:
            dep_dt = datetime.strptime(departure_date, "%Y-%m-%d")
            ret_dt = datetime.strptime(return_date, "%Y-%m-%d")
            duration = (ret_dt - dep_dt).days
        else:
            duration = 7
        
        # Mock flight data
        flights = [
            {
                "airline": "Delta Airlines",
                "flight_number": "DL1234",
                "departure": {
                    "airport": "JFK",
                    "city": "New York",
                    "time": f"{departure_date} 08:30",
                    "terminal": "Terminal 4"
                },
                "arrival": {
                    "airport": "LAX",
                    "city": destination or "Los Angeles",
                    "time": f"{departure_date} 11:45",
                    "terminal": "Terminal 2"
                },
                "duration": "5h 15m",
                "price": 450,
                "class": "Economy",
                "stops": 0
            },
            {
                "airline": "American Airlines",
                "flight_number": "AA5678",
                "departure": {
                    "airport": "JFK",
                    "city": "New York",
                    "time": f"{departure_date} 14:20",
                    "terminal": "Terminal 8"
                },
                "arrival": {
                    "airport": "LAX",
                    "city": destination or "Los Angeles",
                    "time": f"{departure_date} 17:35",
                    "terminal": "Terminal 4"
                },
                "duration": "5h 15m",
                "price": 520,
                "class": "Economy",
                "stops": 0
            },
            {
                "airline": "United Airlines",
                "flight_number": "UA9012",
                "departure": {
                    "airport": "JFK",
                    "city": "New York",
                    "time": f"{departure_date} 19:45",
                    "terminal": "Terminal 7"
                },
                "arrival": {
                    "airport": "LAX",
                    "city": destination or "Los Angeles",
                    "time": f"{departure_date} 23:00",
                    "terminal": "Terminal 7"
                },
                "duration": "5h 15m",
                "price": 380,
                "class": "Economy",
                "stops": 1
            }
        ]
        
        # Add return flights if return date provided
        return_flights = []
        if return_date:
            for flight in flights:
                return_flight = flight.copy()
                return_flight["departure"]["time"] = f"{return_date} 09:30"
                return_flight["arrival"]["time"] = f"{return_date} 17:45"
                return_flight["price"] = flight["price"] + 50  # Slightly higher return price
                return_flights.append(return_flight)
        
        return {
            "origin": "New York",
            "destination": destination or "Los Angeles",
            "departure_date": departure_date,
            "return_date": return_date,
            "trip_duration": duration,
            "outbound_flights": flights,
            "return_flights": return_flights,
            "price_range": {
                "min": min(f["price"] for f in flights),
                "max": max(f["price"] for f in flights),
                "average": sum(f["price"] for f in flights) / len(flights)
            },
            "recommendations": [
                "Book flights 2-3 months in advance for best prices",
                "Consider flexible dates for better deals",
                "Check for airline-specific promotions",
                "Compare prices across multiple booking sites"
            ],
            "note": "Mock flight data - API integration required for real-time prices"
        }
    
    async def get_airport_info(self, airport_code: str) -> Dict[str, Any]:
        """Get information about an airport"""
        # Mock airport data
        airports = {
            "JFK": {
                "name": "John F. Kennedy International Airport",
                "city": "New York",
                "country": "United States",
                "terminals": 6,
                "facilities": ["WiFi", "Restaurants", "Shopping", "Lounges"]
            },
            "LAX": {
                "name": "Los Angeles International Airport",
                "city": "Los Angeles",
                "country": "United States",
                "terminals": 9,
                "facilities": ["WiFi", "Restaurants", "Shopping", "Lounges", "Rental Cars"]
            }
        }
        
        return airports.get(airport_code, {
            "name": f"Airport {airport_code}",
            "city": "Unknown",
            "country": "Unknown",
            "terminals": 1,
            "facilities": ["Basic services"]
        })
    
    def calculate_flight_costs(
        self,
        flights: List[Dict[str, Any]],
        passengers: int = 1
    ) -> Dict[str, float]:
        """Calculate total flight costs"""
        if not flights:
            return {"total": 0, "per_person": 0}
        
        total_cost = sum(flight["price"] for flight in flights) * passengers
        
        return {
            "total": total_cost,
            "per_person": total_cost / passengers,
            "passengers": passengers
        }
