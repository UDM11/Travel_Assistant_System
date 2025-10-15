from typing import Dict, Any, List
from datetime import datetime

class CostCalculator:
    def __init__(self):
        # Base cost multipliers by destination type
        self.destination_multipliers = {
            "europe": 1.2,
            "asia": 0.8,
            "north_america": 1.0,
            "south_america": 0.7,
            "africa": 0.6,
            "oceania": 1.3,
            "default": 1.0
        }
        
        # Base daily costs (USD)
        self.base_costs = {
            "accommodation": 80,
            "food": 50,
            "transportation": 30,
            "activities": 40,
            "miscellaneous": 20
        }
    
    def calculate_trip_cost(self, destination: str, days: int, travelers: int, 
                          budget_preference: str = "medium") -> Dict[str, Any]:
        """Calculate estimated trip costs"""
        
        # Determine destination multiplier
        multiplier = self._get_destination_multiplier(destination)
        
        # Adjust for budget preference
        budget_multipliers = {
            "budget": 0.6,
            "medium": 1.0,
            "luxury": 1.8
        }
        budget_mult = budget_multipliers.get(budget_preference, 1.0)
        
        # Calculate daily costs per person
        daily_costs = {}
        total_daily = 0
        
        for category, base_cost in self.base_costs.items():
            adjusted_cost = base_cost * multiplier * budget_mult
            daily_costs[category] = round(adjusted_cost, 2)
            total_daily += adjusted_cost
        
        # Calculate total trip costs
        total_per_person = total_daily * days
        total_for_group = total_per_person * travelers
        
        # Add flight estimates (rough calculation)
        flight_cost = self._estimate_flight_cost(destination, travelers)
        
        return {
            "daily_costs_per_person": daily_costs,
            "daily_total_per_person": round(total_daily, 2),
            "trip_total_per_person": round(total_per_person, 2),
            "trip_total_for_group": round(total_for_group, 2),
            "estimated_flight_cost": flight_cost,
            "grand_total": round(total_for_group + flight_cost, 2),
            "breakdown": {
                "accommodation": round(daily_costs["accommodation"] * days * travelers, 2),
                "food": round(daily_costs["food"] * days * travelers, 2),
                "transportation": round(daily_costs["transportation"] * days * travelers, 2),
                "activities": round(daily_costs["activities"] * days * travelers, 2),
                "miscellaneous": round(daily_costs["miscellaneous"] * days * travelers, 2),
                "flights": flight_cost
            },
            "currency": "USD",
            "travelers": travelers,
            "days": days,
            "destination": destination,
            "budget_level": budget_preference
        }
    
    def _get_destination_multiplier(self, destination: str) -> float:
        """Get cost multiplier based on destination"""
        destination_lower = destination.lower()
        
        # European countries
        european_countries = ["france", "germany", "italy", "spain", "uk", "switzerland", 
                            "netherlands", "austria", "belgium", "sweden", "norway", "denmark"]
        
        # Asian countries
        asian_countries = ["japan", "china", "thailand", "vietnam", "india", "indonesia", 
                         "malaysia", "singapore", "south korea", "philippines"]
        
        # North American countries
        na_countries = ["usa", "canada", "mexico"]
        
        # Check destination against regions
        for country in european_countries:
            if country in destination_lower:
                return self.destination_multipliers["europe"]
        
        for country in asian_countries:
            if country in destination_lower:
                return self.destination_multipliers["asia"]
        
        for country in na_countries:
            if country in destination_lower:
                return self.destination_multipliers["north_america"]
        
        return self.destination_multipliers["default"]
    
    def _estimate_flight_cost(self, destination: str, travelers: int) -> float:
        """Estimate flight costs based on destination"""
        # Base flight costs (round trip per person)
        base_flight_costs = {
            "domestic": 300,
            "regional": 600,
            "international": 800,
            "long_haul": 1200
        }
        
        destination_lower = destination.lower()
        
        # Determine flight category
        if any(country in destination_lower for country in ["usa", "canada"]):
            category = "domestic"
        elif any(country in destination_lower for country in ["mexico", "caribbean"]):
            category = "regional"
        elif any(country in destination_lower for country in ["europe", "uk", "france", "germany", "italy"]):
            category = "international"
        else:
            category = "long_haul"
        
        base_cost = base_flight_costs[category]
        return round(base_cost * travelers, 2)
    
    def optimize_budget(self, target_budget: float, destination: str, days: int, 
                       travelers: int) -> Dict[str, Any]:
        """Suggest budget optimizations to meet target budget"""
        
        # Calculate costs for different budget levels
        budget_levels = ["budget", "medium", "luxury"]
        options = {}
        
        for level in budget_levels:
            cost_breakdown = self.calculate_trip_cost(destination, days, travelers, level)
            options[level] = cost_breakdown
        
        # Find the best fit for target budget
        best_fit = None
        closest_diff = float('inf')
        
        for level, costs in options.items():
            diff = abs(costs["grand_total"] - target_budget)
            if diff < closest_diff:
                closest_diff = diff
                best_fit = level
        
        recommendations = []
        
        if target_budget < options["budget"]["grand_total"]:
            recommendations.append("Consider reducing trip duration")
            recommendations.append("Look for budget accommodations")
            recommendations.append("Cook some meals instead of dining out")
            recommendations.append("Use public transportation")
        elif target_budget > options["luxury"]["grand_total"]:
            recommendations.append("You can afford luxury accommodations")
            recommendations.append("Consider upgrading flights to business class")
            recommendations.append("Add premium activities and experiences")
        
        return {
            "target_budget": target_budget,
            "recommended_level": best_fit,
            "budget_difference": target_budget - options[best_fit]["grand_total"],
            "options": options,
            "recommendations": recommendations
        }