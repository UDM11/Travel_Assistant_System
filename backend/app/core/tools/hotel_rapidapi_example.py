"""
RapidAPI Hotel Tool Usage Example
Simple example showing how to use the hotel tool with RapidAPI.
"""

import asyncio
from hotel_tool import HotelTool

async def test_hotel_search():
    """Test hotel search with RapidAPI."""
    
    try:
        # Initialize hotel tool
        hotel_tool = HotelTool()
        
        # Search for hotels
        print("🔍 Searching for hotels in Paris...")
        hotels = await hotel_tool.search_hotels(
            location="Paris",
            check_in="2024-06-15",
            check_out="2024-06-18",
            adults=2,
            rooms=1
        )
        
        print(f"✅ Found {len(hotels)} hotels")
        
        # Display results
        for i, hotel in enumerate(hotels[:5], 1):
            print(f"\n{i}. {hotel['name']}")
            print(f"   💰 ${hotel['price_per_night']:.2f} per night")
            print(f"   ⭐ Rating: {hotel['rating']}/10")
            print(f"   📍 {hotel['location']}")
            if hotel['amenities']:
                print(f"   🏨 Amenities: {', '.join(hotel['amenities'][:3])}")
        
        # Get hotel details
        if hotels:
            print(f"\n🔍 Getting details for {hotels[0]['name']}...")
            details = await hotel_tool.get_hotel_details(hotels[0]['id'])
            print(f"✅ Hotel has {len(details.get('amenities', []))} amenities")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_hotel_search())