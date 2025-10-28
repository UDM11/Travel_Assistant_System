"""
Hotel Service for Frontend Integration
Handles hotel data formatting and integration with trips.json and frontend.
"""

from typing import Dict, Any, List
import json
import os
from datetime import datetime
from ..core.tools.hotel_tool import HotelTool

class HotelService:
    def __init__(self):
        self.hotel_tool = HotelTool()
        self.trips_file = "trips.json"
    
    async def search_and_format_hotels(self, destination: str, check_in: str = None, 
                                     check_out: str = None, travelers: int = 2) -> Dict[str, Any]:
        """Search hotels and format for frontend consumption."""
        try:
            hotels = await self.hotel_tool.search_hotels(
                location=destination,
                check_in=check_in,
                check_out=check_out,
                adults=travelers,
                rooms=max(1, travelers // 2)
            )
            
            return {
                "success": True,
                "hotels": hotels,
                "summary": self._create_hotel_summary(hotels),
                "api_source": "RapidAPI Booking.com"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "hotels": [],
                "summary": None
            }
    
    def _create_hotel_summary(self, hotels: List[Dict]) -> Dict[str, Any]:
        """Create hotel summary for trip highlights."""
        if not hotels:
            return {"available": False}
        
        # Find best hotel by rating
        best_hotel = max(hotels, key=lambda x: x.get('rating', 0))
        
        # Calculate price statistics
        prices = [h.get('price_per_night', 0) for h in hotels if h.get('price_per_night', 0) > 0]
        
        return {
            "available": True,
            "total_hotels": len(hotels),
            "best_hotel": {
                "name": best_hotel.get('name'),
                "rating": best_hotel.get('rating'),
                "price": best_hotel.get('price_per_night'),
                "currency": best_hotel.get('currency', 'USD')
            },
            "price_range": {
                "min": min(prices) if prices else 0,
                "max": max(prices) if prices else 0,
                "average": round(sum(prices) / len(prices), 2) if prices else 0
            }
        }
    
    def update_trip_with_hotels(self, trip_id: int, hotel_data: Dict[str, Any]) -> bool:
        """Update existing trip with hotel information."""
        try:
            if not os.path.exists(self.trips_file):
                return False
            
            with open(self.trips_file, 'r') as f:
                trips = json.load(f)
            
            # Find and update the trip
            for trip in trips:
                if trip.get('id') == trip_id:
                    # Update hotel information
                    trip['hotel_recommendations'] = hotel_data.get('hotels', [])[:5]
                    trip['hotel_summary'] = hotel_data.get('summary')
                    
                    # Update API sources
                    if 'api_sources' not in trip:
                        trip['api_sources'] = {}
                    trip['api_sources']['hotels'] = 'RapidAPI Booking.com'
                    
                    # Update summary highlights if available
                    if 'summary' in trip and hotel_data.get('summary', {}).get('available'):
                        best_hotel = hotel_data['summary']['best_hotel']
                        hotel_highlight = f"Top hotel: {best_hotel['name']} ({best_hotel['rating']}/10)"
                        
                        if 'key_highlights' in trip['summary']:
                            # Replace or add hotel highlight
                            highlights = trip['summary']['key_highlights']
                            hotel_found = False
                            for i, highlight in enumerate(highlights):
                                if 'hotel:' in highlight.lower() or 'top hotel:' in highlight.lower():
                                    highlights[i] = hotel_highlight
                                    hotel_found = True
                                    break
                            if not hotel_found:
                                highlights.append(hotel_highlight)
                    
                    break
            
            # Save updated trips
            with open(self.trips_file, 'w') as f:
                json.dump(trips, f, indent=2)
            
            return True
            
        except Exception as e:
            print(f"Error updating trip with hotels: {e}")
            return False
    
    def get_recent_hotel_searches(self, limit: int = 5) -> List[Dict[str, Any]]:
        """Get recent hotel searches from trips for frontend display."""
        try:
            if not os.path.exists(self.trips_file):
                return []
            
            with open(self.trips_file, 'r') as f:
                trips = json.load(f)
            
            recent_hotels = []
            for trip in sorted(trips, key=lambda x: x.get('created_at', ''), reverse=True)[:limit]:
                if trip.get('hotel_recommendations'):
                    hotel_info = {
                        "trip_id": trip.get('id'),
                        "destination": trip.get('destination'),
                        "hotels": trip.get('hotel_recommendations', [])[:3],  # Top 3 per trip
                        "search_date": trip.get('created_at'),
                        "travelers": trip.get('travelers', 1)
                    }
                    recent_hotels.append(hotel_info)
            
            return recent_hotels
            
        except Exception as e:
            print(f"Error getting recent hotel searches: {e}")
            return []
    
    async def get_hotel_details_for_frontend(self, hotel_id: str) -> Dict[str, Any]:
        """Get detailed hotel information for frontend display."""
        try:
            details = await self.hotel_tool.get_hotel_details(hotel_id)
            return {
                "success": True,
                "hotel": details,
                "api_source": "RapidAPI Booking.com"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "hotel": None
            }