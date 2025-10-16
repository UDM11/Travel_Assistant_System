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
        
        flight_cost = self.base_costs["flight"]
        hotel_cost = self.base_costs["hotel_per_night"] * duration
        food_cost = self.base_costs["food_per_day"] * duration
        activities_cost = self.base_costs["activities_per_day"] * duration
        
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