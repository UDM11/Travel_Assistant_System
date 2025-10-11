import httpx
import asyncio
from typing import Dict, Any, List
from datetime import datetime, timedelta

from app.core.config import settings


class HotelService:
    """
    Service for searching hotel information
    """
    
    def __init__(self):
        self.api_key = settings.HOTEL_API_KEY
        self.base_url = "https://api.hotels.com/v1"
    
    async def search_hotels(
        self,
        destination: str,
        check_in: str,
        check_out: str,
        guests: int = 1,
        rooms: int = 1
    ) -> Dict[str, Any]:
        """
        Search for hotels
        """
        try:
            if not self.api_key:
                return await self._get_mock_hotels(destination, check_in, check_out, guests)
            
            # For now, return mock data as hotel APIs require complex setup
            return await self._get_mock_hotels(destination, check_in, check_out, guests)
            
        except Exception as e:
            print(f"⚠️ Hotel service error: {str(e)}")
            return await self._get_mock_hotels(destination, check_in, check_out, guests)
    
    async def _get_mock_hotels(
        self,
        destination: str,
        check_in: str,
        check_out: str,
        guests: int
    ) -> Dict[str, Any]:
        """Generate mock hotel data"""
        
        # Calculate stay duration
        check_in_dt = datetime.strptime(check_in, "%Y-%m-%d")
        check_out_dt = datetime.strptime(check_out, "%Y-%m-%d")
        nights = (check_out_dt - check_in_dt).days
        
        # Mock hotel data
        hotels = [
            {
                "name": "Grand Plaza Hotel",
                "rating": 4.5,
                "stars": 5,
                "price_per_night": 180,
                "total_price": 180 * nights,
                "location": {
                    "address": "123 Main Street",
                    "district": "Downtown",
                    "distance_from_center": "0.5 km"
                },
                "amenities": [
                    "Free WiFi",
                    "Fitness Center",
                    "Pool",
                    "Restaurant",
                    "Room Service",
                    "Concierge"
                ],
                "room_type": "Deluxe King Room",
                "cancellation": "Free cancellation until 24h before check-in",
                "images": ["hotel1.jpg", "hotel2.jpg"],
                "reviews": {
                    "average_rating": 4.5,
                    "total_reviews": 1247,
                    "recent_review": "Excellent location and service!"
                }
            },
            {
                "name": "Budget Inn Express",
                "rating": 3.8,
                "stars": 3,
                "price_per_night": 85,
                "total_price": 85 * nights,
                "location": {
                    "address": "456 Business Ave",
                    "district": "Business District",
                    "distance_from_center": "2.1 km"
                },
                "amenities": [
                    "Free WiFi",
                    "Breakfast",
                    "Parking",
                    "24/7 Front Desk"
                ],
                "room_type": "Standard Double Room",
                "cancellation": "Free cancellation until 48h before check-in",
                "images": ["budget1.jpg", "budget2.jpg"],
                "reviews": {
                    "average_rating": 3.8,
                    "total_reviews": 892,
                    "recent_review": "Good value for money"
                }
            },
            {
                "name": "Luxury Resort & Spa",
                "rating": 4.9,
                "stars": 5,
                "price_per_night": 350,
                "total_price": 350 * nights,
                "location": {
                    "address": "789 Resort Boulevard",
                    "district": "Beachfront",
                    "distance_from_center": "5.2 km"
                },
                "amenities": [
                    "Free WiFi",
                    "Spa & Wellness",
                    "Multiple Restaurants",
                    "Beach Access",
                    "Pool",
                    "Fitness Center",
                    "Concierge",
                    "Valet Parking"
                ],
                "room_type": "Ocean View Suite",
                "cancellation": "Free cancellation until 7 days before check-in",
                "images": ["luxury1.jpg", "luxury2.jpg"],
                "reviews": {
                    "average_rating": 4.9,
                    "total_reviews": 456,
                    "recent_review": "Absolutely stunning resort!"
                }
            },
            {
                "name": "Boutique Hotel Central",
                "rating": 4.2,
                "stars": 4,
                "price_per_night": 140,
                "total_price": 140 * nights,
                "location": {
                    "address": "321 Historic Lane",
                    "district": "Historic Quarter",
                    "distance_from_center": "1.2 km"
                },
                "amenities": [
                    "Free WiFi",
                    "Historic Building",
                    "Rooftop Bar",
                    "Art Gallery",
                    "Concierge"
                ],
                "room_type": "Historic Room",
                "cancellation": "Free cancellation until 24h before check-in",
                "images": ["boutique1.jpg", "boutique2.jpg"],
                "reviews": {
                    "average_rating": 4.2,
                    "total_reviews": 634,
                    "recent_review": "Charming historic hotel"
                }
            }
        ]
        
        return {
            "destination": destination,
            "check_in": check_in,
            "check_out": check_out,
            "nights": nights,
            "guests": guests,
            "hotels": hotels,
            "price_range": {
                "min": min(h["price_per_night"] for h in hotels),
                "max": max(h["price_per_night"] for h in hotels),
                "average": sum(h["price_per_night"] for h in hotels) / len(hotels)
            },
            "recommendations": [
                "Book hotels 1-2 months in advance for best rates",
                "Consider location vs. price trade-offs",
                "Check for package deals with flights",
                "Read recent reviews for current conditions",
                "Look for hotels with free cancellation"
            ],
            "note": "Mock hotel data - API integration required for real-time prices"
        }
    
    async def get_hotel_details(self, hotel_id: str) -> Dict[str, Any]:
        """Get detailed information about a specific hotel"""
        # Mock detailed hotel information
        return {
            "hotel_id": hotel_id,
            "name": "Grand Plaza Hotel",
            "description": "A luxurious 5-star hotel in the heart of downtown, offering world-class amenities and exceptional service.",
            "detailed_amenities": {
                "room": [
                    "Air conditioning",
                    "Flat-screen TV",
                    "Mini bar",
                    "Safe",
                    "Balcony"
                ],
                "hotel": [
                    "24/7 Concierge",
                    "Business Center",
                    "Meeting Rooms",
                    "Laundry Service",
                    "Airport Shuttle"
                ],
                "dining": [
                    "Fine Dining Restaurant",
                    "Rooftop Bar",
                    "Coffee Shop",
                    "Room Service"
                ]
            },
            "policies": {
                "check_in": "15:00",
                "check_out": "11:00",
                "pet_policy": "Pets allowed with additional fee",
                "smoking": "Non-smoking rooms available"
            },
            "nearby_attractions": [
                "City Museum (0.3 km)",
                "Shopping Mall (0.5 km)",
                "Central Park (0.8 km)",
                "Business District (0.2 km)"
            ]
        }
    
    def calculate_hotel_costs(
        self,
        hotels: List[Dict[str, Any]],
        nights: int
    ) -> Dict[str, float]:
        """Calculate hotel costs"""
        if not hotels:
            return {"total": 0, "average_per_night": 0}
        
        total_costs = [hotel["total_price"] for hotel in hotels]
        
        return {
            "total": sum(total_costs),
            "average_per_night": sum(total_costs) / len(total_costs) / nights,
            "min_total": min(total_costs),
            "max_total": max(total_costs)
        }
