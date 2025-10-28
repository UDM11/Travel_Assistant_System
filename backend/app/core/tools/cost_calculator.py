from typing import Dict, Any

class CostCalculator:
    def __init__(self):
        self.base_costs = {
            "flight": 400,
            "hotel_per_night": 100,
            "food_per_day": 50,
            "activities_per_day": 75
        }
    
    def calculate_total_cost(self, trip_data: Dict[str, Any]) -> float:
        duration = trip_data.get("duration", 3)
        travelers = trip_data.get("travelers", 1)
        travel_style = trip_data.get("travel_style", "mid-range")
        
        # Adjust costs based on travel style
        multiplier = {
            "budget": 0.7,
            "mid-range": 1.0,
            "luxury": 1.8
        }.get(travel_style, 1.0)
        
        # Use real flight data if available
        flights = trip_data.get("flights", [])
        flight_cost = self.base_costs["flight"] * multiplier * travelers
        
        if isinstance(flights, list) and flights:
            valid_flights = [f for f in flights if isinstance(f, dict) and f.get("price", 0) > 0]
            if valid_flights:
                flight_cost = min(flight["price"] for flight in valid_flights) * travelers
        
        # Use real hotel data if available
        hotels_data = trip_data.get("hotels", {})
        hotel_cost = self.base_costs["hotel_per_night"] * multiplier * duration
        
        # Check if hotels data is available and has pricing
        if isinstance(hotels_data, dict) and hotels_data.get("available"):
            price_range = hotels_data.get("price_range", {})
            if price_range.get("min"):
                hotel_cost = price_range["min"] * duration
        elif isinstance(hotels_data, list) and hotels_data:
            # Handle hotel_details list format
            valid_hotels = [h for h in hotels_data if isinstance(h, dict) and h.get("price_per_night", 0) > 0]
            if valid_hotels:
                hotel_cost = min(hotel["price_per_night"] for hotel in valid_hotels) * duration
        
        food_cost = self.base_costs["food_per_day"] * multiplier * duration * travelers
        activities_cost = self.base_costs["activities_per_day"] * multiplier * duration * travelers
        
        total = flight_cost + hotel_cost + food_cost + activities_cost
        return round(total, 2)
    
    def calculate_breakdown(self, trip_data: Dict[str, Any]) -> Dict[str, float]:
        duration = trip_data.get("duration", 3)
        
        return {
            "flights": self.base_costs["flight"],
            "accommodation": self.base_costs["hotel_per_night"] * duration,
            "food": self.base_costs["food_per_day"] * duration,
            "activities": self.base_costs["activities_per_day"] * duration
        }