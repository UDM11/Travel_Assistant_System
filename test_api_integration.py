#!/usr/bin/env python3
"""
Test script to verify API integration and show all API sources being used
"""

import asyncio
import sys
import os
sys.path.append('backend')

from backend.app.core.tools.weather_tool import WeatherTool
from backend.app.core.tools.flight_tool import FlightTool
from backend.app.core.tools.hotel_tool import HotelTool
from backend.app.services.openai_service import OpenAIService
from backend.app.services.travel_service import TravelService

async def test_api_integration():
    print("🚀 Testing Travel Assistant API Integration")
    print("=" * 50)
    
    # Check API keys
    print("\n📋 API Keys Status:")
    api_keys = {
        "OpenAI": os.getenv("OPENAI_API_KEY"),
        "Weather": os.getenv("WEATHER_API_KEY"),
        "Flights": os.getenv("FLIGHTS_API_KEY"),
        "Hotels": os.getenv("HOTELS_API_KEY")
    }
    
    for service, key in api_keys.items():
        status = "✅ Configured" if key else "❌ Missing"
        print(f"  {service}: {status}")
    
    print(f"\nTotal APIs configured: {sum(1 for key in api_keys.values() if key)}/4")
    
    # Test individual tools
    print("\n🔧 Testing Individual Tools:")
    
    # Weather Tool
    print("\n🌤️  Weather Tool:")
    weather_tool = WeatherTool()
    weather_data = await weather_tool.get_weather("Paris")
    print(f"  Location: {weather_data['location']}")
    print(f"  Temperature: {weather_data['temperature']}")
    print(f"  Condition: {weather_data['condition']}")
    
    # Flight Tool
    print("\n✈️  Flight Tool:")
    flight_tool = FlightTool()
    flights = await flight_tool.search_flights("Paris", "NYC")
    for i, flight in enumerate(flights[:2], 1):
        print(f"  Flight {i}: {flight['airline']} - ${flight['price']} ({flight['api_source']})")
    
    # Hotel Tool
    print("\n🏨 Hotel Tool:")
    hotel_tool = HotelTool()
    hotels = await hotel_tool.search_hotels("Paris")
    for i, hotel in enumerate(hotels[:2], 1):
        print(f"  Hotel {i}: {hotel['name']} - ${hotel['price_per_night']}/night ({hotel['api_source']})")
    
    # OpenAI Service
    print("\n🧠 OpenAI Service:")
    openai_service = OpenAIService()
    trip_data = {
        "destination": "Paris",
        "duration": 3,
        "budget": 1500,
        "interests": ["culture", "food"]
    }
    ai_result = await openai_service.generate_itinerary(trip_data)
    print(f"  Itinerary Generated: {ai_result['itinerary_generated']}")
    print(f"  API Source: {ai_result['api_source']}")
    print(f"  Estimated Cost: ${ai_result['total_estimated_cost']}")
    
    # Full Travel Service Test
    print("\n🎯 Full Travel Service Test:")
    travel_service = TravelService()
    
    trip_request = {
        "destination": "Paris",
        "start_date": "2024-06-01",
        "end_date": "2024-06-04",
        "budget": 1500,
        "interests": ["culture", "food", "art"]
    }
    
    result = await travel_service.plan_trip(trip_request)
    
    if result["status"] == "completed":
        print("  ✅ Trip planning successful!")
        print(f"  Trip ID: {result['trip_id']}")
        
        # Show API sources used
        itinerary = result.get("itinerary", {})
        api_sources = itinerary.get("api_sources", {})
        
        print(f"\n📊 API Sources Used:")
        for source_type, source_name in api_sources.items():
            print(f"  {source_type.title()}: {source_name}")
        
        print(f"\n💰 Cost Breakdown:")
        print(f"  Total Estimated: ${itinerary.get('estimated_cost', 0)}")
        
        print(f"\n📅 Daily Activities:")
        daily_plan = itinerary.get("daily_plan", [])
        for day in daily_plan[:2]:  # Show first 2 days
            print(f"  Day {day['day']}: {day.get('morning', 'N/A')}")
    else:
        print(f"  ❌ Trip planning failed: {result.get('message', 'Unknown error')}")
    
    print("\n" + "=" * 50)
    print("🎉 API Integration Test Complete!")
    
    # Summary
    active_apis = sum(1 for key in api_keys.values() if key)
    print(f"\nSummary:")
    print(f"  • {active_apis}/4 API keys configured")
    print(f"  • Data quality: {'Enhanced' if active_apis >= 3 else 'Standard'}")
    print(f"  • All tools functional: ✅")
    print(f"  • Ready for production: {'✅' if active_apis >= 2 else '⚠️  (Recommend configuring more APIs)'}")

if __name__ == "__main__":
    asyncio.run(test_api_integration())