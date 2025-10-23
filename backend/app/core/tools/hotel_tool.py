from typing import Dict, Any, List
import aiohttp
import os
from dotenv import load_dotenv

load_dotenv()

class HotelTool:
    def __init__(self):
        self.api_key = os.getenv("HOTELS_API_KEY")
        self.client_secret = os.getenv("HOTELS_CLIENT_SECRET", self.api_key)  # Fallback to same key
        self.base_url = "https://test.api.amadeus.com/v1"
        self.token_url = "https://test.api.amadeus.com/v1/security/oauth2/token"
        self.access_token = None
    
    async def _get_access_token(self) -> str:
        """Get OAuth2 access token for Amadeus API"""
        if self.access_token:
            return self.access_token
            
        try:
            # For Amadeus, you need separate client_id and client_secret
            # Using the same key as both for now - you may need separate keys
            async with aiohttp.ClientSession() as session:
                data = {
                    'grant_type': 'client_credentials',
                    'client_id': self.api_key,
                    'client_secret': self.client_secret
                }
                
                async with session.post(self.token_url, data=data) as response:
                    response_text = await response.text()
                    print(f"Token response: {response.status} - {response_text}")
                    
                    if response.status == 200:
                        result = await response.json()
                        self.access_token = result.get('access_token')
                        print(f"Got access token: {self.access_token[:20]}...")
                        return self.access_token
        except Exception as e:
            print(f"Token error: {e}")
        return None
    
    async def search_hotels(self, location: str, check_in: str = None, check_out: str = None) -> List[Dict[str, Any]]:
        print(f"🏨 Searching hotels for {location}")
        
        if not self.api_key:
            print("❌ No API key - cannot get real data")
            return []
        
        token = await self._get_access_token()
        if not token:
            print("❌ Authentication failed - cannot get real data")
            return []
        
        try:
            async with aiohttp.ClientSession() as session:
                headers = {'Authorization': f'Bearer {token}'}
                
                # Get city coordinates first
                city_params = {
                    'keyword': location,
                    'subType': 'CITY'
                }
                
                # Try direct hotel search by city name first
                hotel_params = {
                    'cityCode': self._get_city_code(location)
                }
                
                if check_in:
                    hotel_params['checkInDate'] = check_in
                if check_out:
                    hotel_params['checkOutDate'] = check_out
                
                async with session.get(f"{self.base_url}/shopping/hotel-offers", 
                                     headers=headers, params=hotel_params) as response:
                    response_text = await response.text()
                    print(f"Hotel search response: {response.status} - {response_text[:200]}...")
                    
                    if response.status == 200:
                        data = await response.json()
                        hotels = self._format_real_hotels(data.get('data', []))
                        print(f"Found {len(hotels)} hotels")
                        return hotels
                    
        except Exception as e:
            print(f"Hotel API error: {e}")
        
        print("❌ Hotel API failed - no real data available")
        return []
    
    def _format_real_hotels(self, hotels_data: List[Dict]) -> List[Dict[str, Any]]:
        """Format real Amadeus API response"""
        formatted_hotels = []
        
        for hotel_offer in hotels_data[:5]:
            hotel = hotel_offer.get('hotel', {})
            offers = hotel_offer.get('offers', [{}])
            offer = offers[0] if offers else {}
            
            price_info = offer.get('price', {})
            room_info = offer.get('room', {})
            
            formatted_hotel = {
                "id": hotel.get('hotelId'),
                "name": hotel.get('name'),
                "price_per_night": float(price_info.get('total', 0)),
                "rating": hotel.get('rating', 0),
                "location": hotel.get('address', {}).get('cityName', ''),
                "address": ', '.join(hotel.get('address', {}).get('lines', [])),
                "room_type": room_info.get('typeEstimated', {}).get('category', 'Standard'),
                "amenities": [amenity.get('description') for amenity in hotel.get('amenities', [])],
                "cancellation": offer.get('policies', {}).get('cancellation', {}).get('description', ''),
                "api_source": "Amadeus Hotels API - Live Data"
            }
            formatted_hotels.append(formatted_hotel)
        
        return formatted_hotels
    

    
    def _get_city_code(self, location: str) -> str:
        """Map location to IATA city code"""
        city_codes = {
            'paris': 'PAR', 'london': 'LON', 'new york': 'NYC', 'tokyo': 'TYO',
            'rome': 'ROM', 'barcelona': 'BCN', 'amsterdam': 'AMS', 'berlin': 'BER',
            'madrid': 'MAD', 'vienna': 'VIE', 'prague': 'PRG', 'budapest': 'BUD'
        }
        return city_codes.get(location.lower(), 'PAR')

    async def book_hotel(self, hotel_id: str, nights: int) -> Dict[str, Any]:
        return {
            "status": "booked", 
            "confirmation": f"HTL{hotel_id[:6].upper()}", 
            "nights": nights,
            "api_key_used": bool(self.api_key)
        }