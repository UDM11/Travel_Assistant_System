from typing import Dict, Any, List
import asyncio

class HotelTool:
    def __init__(self):
        self.api_key = "demo_key"
    
    async def search_hotels(self, location: str) -> List[Dict[str, Any]]:
        # Simulate API call
        await asyncio.sleep(0.1)
        
        return [
            {
                "name": "Grand Plaza Hotel",
                "price_per_night": 120,
                "rating": 4.5,
                "amenities": ["WiFi", "Pool", "Gym"],
                "location": "City Center"
            },
            {
                "name": "Budget Inn",
                "price_per_night": 60,
                "rating": 3.8,
                "amenities": ["WiFi", "Breakfast"],
                "location": "Downtown"
            }
        ]
    
    async def book_hotel(self, hotel_id: str, nights: int) -> Dict[str, Any]:
        await asyncio.sleep(0.1)
        return {"status": "booked", "confirmation": "HTL456", "nights": nights}