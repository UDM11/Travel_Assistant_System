"""
Professional Hotel Tool Usage Examples
Demonstrates how to use the enhanced HotelTool with real API integration.
"""

import asyncio
from datetime import datetime, timedelta
from hotel_tool import HotelTool

async def example_hotel_search():
    """Example: Basic hotel search with real API data."""
    
    try:
        # Initialize the hotel tool
        hotel_tool = HotelTool(is_production=False)  # Use test environment
        
        # Example 1: Basic search
        print("🔍 Searching for hotels in Paris...")
        hotels = await hotel_tool.search_hotels(
            location="Paris",
            check_in="2024-06-15",
            check_out="2024-06-18",
            adults=2,
            rooms=1,
            currency="EUR"
        )
        
        print(f"✅ Found {len(hotels)} hotels in Paris")
        for hotel in hotels[:3]:  # Show first 3 results
            print(f"  🏨 {hotel['name']}")
            print(f"     💰 €{hotel['price_per_night']:.2f} per night")
            print(f"     ⭐ Rating: {hotel['rating']}/5")
            print(f"     📍 {hotel['address']}")
            print()
        
        # Example 2: Search with different parameters
        print("🔍 Searching for hotels in Tokyo...")
        tokyo_hotels = await hotel_tool.search_hotels(
            location="Tokyo",
            check_in=(datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d'),
            check_out=(datetime.now() + timedelta(days=33)).strftime('%Y-%m-%d'),
            adults=1,
            rooms=1,
            currency="JPY"
        )
        
        print(f"✅ Found {len(tokyo_hotels)} hotels in Tokyo")
        
        # Example 3: Get detailed hotel information
        if hotels:
            hotel_id = hotels[0]['id']
            print(f"🔍 Getting details for hotel ID: {hotel_id}")
            
            hotel_details = await hotel_tool.get_hotel_details(hotel_id)
            print(f"✅ Hotel Details:")
            print(f"  🏨 Name: {hotel_details['name']}")
            print(f"  📝 Description: {hotel_details['description'][:100]}...")
            print(f"  🎯 Amenities: {', '.join(hotel_details['amenities'][:5])}")
        
        # Example 4: Simulate booking
        if hotels:
            print(f"🎫 Simulating booking for {hotels[0]['name']}...")
            
            guest_info = {
                "first_name": "John",
                "last_name": "Doe",
                "email": "john.doe@example.com",
                "phone": "+1-555-0123"
            }
            
            booking_result = await hotel_tool.book_hotel(
                hotel_id=hotels[0]['id'],
                check_in="2024-06-15",
                check_out="2024-06-18",
                guest_info=guest_info
            )
            
            print(f"✅ Booking Status: {booking_result['status']}")
            if booking_result['status'] == 'confirmed':
                print(f"  🎫 Reference: {booking_result['booking_reference']}")
            
    except ValueError as e:
        print(f"❌ Validation Error: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")

async def example_error_handling():
    """Example: Demonstrate error handling for various scenarios."""
    
    try:
        hotel_tool = HotelTool()
        
        # Test with invalid dates
        print("🧪 Testing invalid date range...")
        try:
            await hotel_tool.search_hotels(
                location="London",
                check_in="2024-06-18",
                check_out="2024-06-15",  # Check-out before check-in
                adults=2
            )
        except ValueError as e:
            print(f"✅ Caught expected validation error: {e}")
        
        # Test with invalid location
        print("🧪 Testing unknown location...")
        try:
            hotels = await hotel_tool.search_hotels(
                location="NonExistentCity12345",
                check_in="2024-06-15",
                check_out="2024-06-18"
            )
            if not hotels:
                print("✅ No results for unknown location (as expected)")
        except Exception as e:
            print(f"✅ Handled unknown location error: {e}")
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

async def example_advanced_features():
    """Example: Demonstrate advanced features and filtering."""
    
    try:
        hotel_tool = HotelTool()
        
        # Search with specific requirements
        print("🔍 Advanced search with specific requirements...")
        
        hotels = await hotel_tool.search_hotels(
            location="Barcelona",
            check_in="2024-07-01",
            check_out="2024-07-05",
            adults=4,  # Family of 4
            rooms=2,   # 2 rooms
            currency="EUR"
        )
        
        print(f"✅ Found {len(hotels)} hotels for family stay in Barcelona")
        
        # Filter hotels by rating
        high_rated_hotels = [h for h in hotels if h['rating'] >= 4.0]
        print(f"🌟 {len(high_rated_hotels)} hotels with 4+ star rating")
        
        # Filter by price range
        budget_hotels = [h for h in hotels if h['price_per_night'] <= 150]
        print(f"💰 {len(budget_hotels)} hotels under €150 per night")
        
        # Show hotels with specific amenities
        hotels_with_wifi = [h for h in hotels if any('wifi' in amenity.lower() for amenity in h['amenities'])]
        print(f"📶 {len(hotels_with_wifi)} hotels with WiFi")
        
        # Display summary
        if hotels:
            avg_price = sum(h['price_per_night'] for h in hotels) / len(hotels)
            avg_rating = sum(h['rating'] for h in hotels if h['rating'] > 0) / len([h for h in hotels if h['rating'] > 0])
            
            print(f"\n📊 Search Summary:")
            print(f"  💰 Average price: €{avg_price:.2f} per night")
            print(f"  ⭐ Average rating: {avg_rating:.1f}/5")
            print(f"  🏨 Total options: {len(hotels)}")
        
    except Exception as e:
        print(f"❌ Error in advanced search: {e}")

def main():
    """Run all examples."""
    print("🚀 Hotel Tool Professional Examples")
    print("=" * 50)
    
    # Note: Make sure to set your environment variables:
    # HOTELS_API_KEY=your_amadeus_api_key
    # HOTELS_CLIENT_SECRET=your_amadeus_client_secret
    
    print("\n1. Basic Hotel Search Examples")
    print("-" * 30)
    asyncio.run(example_hotel_search())
    
    print("\n2. Error Handling Examples")
    print("-" * 30)
    asyncio.run(example_error_handling())
    
    print("\n3. Advanced Features Examples")
    print("-" * 30)
    asyncio.run(example_advanced_features())
    
    print("\n✅ All examples completed!")

if __name__ == "__main__":
    main()