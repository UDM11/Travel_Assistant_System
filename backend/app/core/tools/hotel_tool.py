import httpx
from typing import Dict, Any, List
from datetime import datetime
from app.core.utils.logger import app_logger

class HotelTool:
    def __init__(self):
        # Using a free hotel API or mock data
        self.base_url = "https://api.example-hotels.com/v1"  # Replace with actual API
    
    async def search_hotels(self, city: str, check_in: str, check_out: str, 
                           guests: int = 1, budget_max: float = None) -> Dict[str, Any]:
        """Search for hotels in a city"""
        try:
            # Since we don't have a real free hotel API, return mock data
            return self._get_mock_hotels(city, check_in, check_out, guests, budget_max)
            
        except Exception as e:
            app_logger.error(f"Hotel search error: {str(e)}")
            return self._get_mock_hotels(city, check_in, check_out, guests, budget_max)
    
    def _get_mock_hotels(self, city: str, check_in: str, check_out: str, 
                        guests: int = 1, budget_max: float = None) -> Dict[str, Any]:
        """Return mock hotel data"""
        
        # Calculate nights
        check_in_date = datetime.strptime(check_in, "%Y-%m-%d")
        check_out_date = datetime.strptime(check_out, "%Y-%m-%d")
        nights = (check_out_date - check_in_date).days
        
        hotels = [
            {
                "id": "hotel_1",
                "name": f"Grand {city} Hotel",
                "rating": 4.5,
                "price_per_night": 120,
                "total_price": 120 * nights,
                "currency": "USD",
                "amenities": ["WiFi", "Pool", "Gym", "Restaurant"],
                "location": f"Downtown {city}",
                "image_url": "https://example.com/hotel1.jpg",
                "description": f"Luxury hotel in the heart of {city}",
                "cancellation": "Free cancellation until 24h before check-in"
            },
            {
                "id": "hotel_2",
                "name": f"{city} Business Inn",
                "rating": 4.0,
                "price_per_night": 85,
                "total_price": 85 * nights,
                "currency": "USD",
                "amenities": ["WiFi", "Business Center", "Restaurant"],
                "location": f"Business District, {city}",
                "image_url": "https://example.com/hotel2.jpg",
                "description": f"Modern business hotel in {city}",
                "cancellation": "Free cancellation until 48h before check-in"
            },
            {
                "id": "hotel_3",
                "name": f"Budget Stay {city}",
                "rating": 3.5,
                "price_per_night": 45,
                "total_price": 45 * nights,
                "currency": "USD",
                "amenities": ["WiFi", "24h Reception"],
                "location": f"City Center, {city}",
                "image_url": "https://example.com/hotel3.jpg",
                "description": f"Affordable accommodation in {city}",
                "cancellation": "Non-refundable"
            },
            {
                "id": "hotel_4",
                "name": f"{city} Boutique Hotel",
                "rating": 4.8,
                "price_per_night": 180,
                "total_price": 180 * nights,
                "currency": "USD",
                "amenities": ["WiFi", "Spa", "Fine Dining", "Concierge"],
                "location": f"Historic District, {city}",
                "image_url": "https://example.com/hotel4.jpg",
                "description": f"Boutique luxury hotel in historic {city}",
                "cancellation": "Free cancellation until 72h before check-in"
            },
            {
                "id": "hotel_5",
                "name": f"Airport {city} Hotel",
                "rating": 3.8,
                "price_per_night": 65,
                "total_price": 65 * nights,
                "currency": "USD",
                "amenities": ["WiFi", "Airport Shuttle", "Restaurant"],
                "location": f"Near Airport, {city}",
                "image_url": "https://example.com/hotel5.jpg",
                "description": f"Convenient airport hotel in {city}",
                "cancellation": "Free cancellation until 24h before check-in"
            }
        ]
        
        # Filter by budget if specified
        if budget_max:
            hotels = [h for h in hotels if h["total_price"] <= budget_max]
        
        # Sort by rating (highest first)
        hotels.sort(key=lambda x: x["rating"], reverse=True)
        
        return {
            "hotels": hotels,
            "total_results": len(hotels),
            "city": city,
            "check_in": check_in,
            "check_out": check_out,
            "nights": nights,
            "guests": guests
        }
    
    async def get_hotel_details(self, hotel_id: str) -> Dict[str, Any]:
        """Get detailed information about a specific hotel"""
        # Mock implementation
        return {
            "id": hotel_id,
            "name": "Sample Hotel",
            "description": "A wonderful place to stay",
            "amenities": ["WiFi", "Pool", "Gym"],
            "policies": {
                "check_in": "15:00",
                "check_out": "11:00",
                "cancellation": "Free cancellation until 24h before check-in"
            },
            "contact": {
                "phone": "+1-555-0123",
                "email": "info@samplehotel.com",
                "address": "123 Hotel Street, City"
            }
        }