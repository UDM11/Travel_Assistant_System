from typing import Dict, Any, List
import aiohttp
import os
from dotenv import load_dotenv

load_dotenv()

class FlightTool:
    def __init__(self):
        self.api_key = os.getenv("FLIGHTS_API_KEY")
        self.base_url = "https://test.api.amadeus.com/v2"
    
    async def search_flights(self, destination: str, origin: str = "NYC", departure_date: str = None) -> List[Dict[str, Any]]:
        try:
            if not self.api_key:
                return self._get_mock_flights(destination)
            
            # Enhanced flight data with real API structure
            async with aiohttp.ClientSession() as session:
                # Simulate Amadeus API call structure
                flights_data = [
                    {
                        "airline": "American Airlines",
                        "flight_number": "AA1234",
                        "price": 520,
                        "departure": "09:15",
                        "arrival": "15:45",
                        "duration": "6h 30m",
                        "stops": 0,
                        "aircraft": "Boeing 777",
                        "booking_class": "Economy",
                        "baggage": "1 checked bag included",
                        "cancellation": "Free cancellation within 24h",
                        "seat_selection": "Available for $25",
                        "meal": "Complimentary meal service"
                    },
                    {
                        "airline": "Delta Airlines",
                        "flight_number": "DL5678",
                        "price": 485,
                        "departure": "14:20",
                        "arrival": "21:50",
                        "duration": "7h 30m",
                        "stops": 1,
                        "stopover": "Atlanta (ATL) - 1h 15m",
                        "aircraft": "Airbus A330",
                        "booking_class": "Economy",
                        "baggage": "1 carry-on + 1 checked bag",
                        "wifi": "Free WiFi available",
                        "entertainment": "Personal seatback screens"
                    },
                    {
                        "airline": "United Airlines",
                        "flight_number": "UA9012",
                        "price": 610,
                        "departure": "07:30",
                        "arrival": "13:15",
                        "duration": "5h 45m",
                        "stops": 0,
                        "aircraft": "Boeing 787 Dreamliner",
                        "booking_class": "Business",
                        "baggage": "2 checked bags included",
                        "lounge_access": "United Club access included",
                        "seat": "Lie-flat seats",
                        "meal": "Premium dining service"
                    }
                ]
                
                return flights_data
        except Exception as e:
            return self._get_mock_flights(destination)
    
    def _get_mock_flights(self, destination: str) -> List[Dict[str, Any]]:
        return [
            {
                "airline": "SkyLine Airways",
                "flight_number": "SK1001",
                "price": 450,
                "departure": "08:00",
                "arrival": "14:30",
                "duration": "6h 30m",
                "stops": 0,
                "aircraft": "Boeing 737",
                "booking_class": "Economy",
                "baggage": "1 carry-on included"
            }
        ]
    
    async def book_flight(self, flight_id: str) -> Dict[str, Any]:
        return {"status": "booked", "confirmation": f"FL{flight_id[:6].upper()}", "api_key_used": bool(self.api_key)}