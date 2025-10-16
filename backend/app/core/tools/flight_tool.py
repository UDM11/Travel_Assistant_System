from typing import Dict, Any, List
import asyncio

class FlightTool:
    def __init__(self):
        self.api_key = "demo_key"
    
    async def search_flights(self, destination: str, origin: str = "NYC") -> List[Dict[str, Any]]:
        # Simulate API call
        await asyncio.sleep(0.1)
        
        return [
            {
                "airline": "SkyLine Airways",
                "price": 450,
                "departure": "08:00",
                "arrival": "14:30",
                "duration": "6h 30m",
                "stops": 0
            },
            {
                "airline": "Global Wings",
                "price": 380,
                "departure": "15:45",
                "arrival": "23:15",
                "duration": "7h 30m",
                "stops": 1
            }
        ]
    
    async def book_flight(self, flight_id: str) -> Dict[str, Any]:
        await asyncio.sleep(0.1)
        return {"status": "booked", "confirmation": "ABC123"}