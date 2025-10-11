from typing import Dict, Any, List
from datetime import datetime, timedelta


class CostCalculator:
    """
    Service for calculating trip costs
    """
    
    def __init__(self):
        self.default_costs = {
            "meals": {
                "budget": 30,      # per day
                "mid_range": 60,   # per day
                "luxury": 120      # per day
            },
            "transportation": {
                "local_transport": 20,  # per day
                "taxi": 50,            # per day
                "car_rental": 80       # per day
            },
            "activities": {
                "budget": 25,      # per day
                "mid_range": 50,   # per day
                "luxury": 100      # per day
            },
            "miscellaneous": {
                "shopping": 50,    # per day
                "tips": 20,        # per day
                "emergency": 100   # total
            }
        }
    
    async def calculate_trip_costs(
        self,
        itinerary: List[Dict[str, Any]],
        travelers: int,
        research_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Calculate comprehensive trip costs
        """
        try:
            # Extract costs from itinerary
            itinerary_costs = self._extract_itinerary_costs(itinerary)
            
            # Calculate additional costs
            additional_costs = self._calculate_additional_costs(
                itinerary, travelers, research_data
            )
            
            # Calculate totals
            total_costs = {
                "flights": self._calculate_flight_costs(research_data),
                "hotels": self._calculate_hotel_costs(research_data),
                "meals": additional_costs["meals"],
                "transportation": additional_costs["transportation"],
                "activities": additional_costs["activities"],
                "miscellaneous": additional_costs["miscellaneous"],
                "itinerary_activities": itinerary_costs["activities"],
                "itinerary_meals": itinerary_costs["meals"],
                "itinerary_transport": itinerary_costs["transportation"]
            }
            
            # Calculate grand total
            total_cost = sum(total_costs.values())
            
            return {
                "breakdown": total_costs,
                "total_cost": total_cost,
                "cost_per_person": total_cost / travelers,
                "cost_per_day": total_cost / len(itinerary) if itinerary else 0,
                "travelers": travelers,
                "currency": "USD",
                "calculated_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            print(f"❌ Cost calculation error: {str(e)}")
            return self._get_default_costs(travelers, len(itinerary))
    
    def _extract_itinerary_costs(self, itinerary: List[Dict[str, Any]]) -> Dict[str, float]:
        """Extract costs from itinerary activities"""
        total_activities = 0
        total_meals = 0
        total_transport = 0
        
        for day in itinerary:
            # Activities cost
            morning_cost = day.get("morning", {}).get("estimated_cost", 0)
            afternoon_cost = day.get("afternoon", {}).get("estimated_cost", 0)
            evening_cost = day.get("evening", {}).get("estimated_cost", 0)
            total_activities += morning_cost + afternoon_cost + evening_cost
            
            # Meals cost
            meal_cost = day.get("meals", {}).get("meal_cost", 0)
            total_meals += meal_cost
            
            # Transportation cost
            transport_cost = day.get("transportation", {}).get("cost", 0)
            total_transport += transport_cost
        
        return {
            "activities": total_activities,
            "meals": total_meals,
            "transportation": total_transport
        }
    
    def _calculate_additional_costs(
        self,
        itinerary: List[Dict[str, Any]],
        travelers: int,
        research_data: Dict[str, Any]
    ) -> Dict[str, float]:
        """Calculate additional costs not in itinerary"""
        days = len(itinerary)
        
        # Meals (additional meals not in itinerary)
        meals_per_day = self.default_costs["meals"]["mid_range"]
        total_meals = meals_per_day * days * travelers
        
        # Transportation (local transport, taxis, etc.)
        transport_per_day = self.default_costs["transportation"]["local_transport"]
        total_transport = transport_per_day * days * travelers
        
        # Activities (additional activities)
        activities_per_day = self.default_costs["activities"]["mid_range"]
        total_activities = activities_per_day * days * travelers
        
        # Miscellaneous
        shopping_per_day = self.default_costs["miscellaneous"]["shopping"]
        tips_per_day = self.default_costs["miscellaneous"]["tips"]
        emergency = self.default_costs["miscellaneous"]["emergency"]
        
        total_miscellaneous = (shopping_per_day + tips_per_day) * days * travelers + emergency
        
        return {
            "meals": total_meals,
            "transportation": total_transport,
            "activities": total_activities,
            "miscellaneous": total_miscellaneous
        }
    
    def _calculate_flight_costs(self, research_data: Dict[str, Any]) -> float:
        """Calculate flight costs from research data"""
        flights = research_data.get("flights", {})
        if flights and "outbound_flights" in flights:
            # Use average flight price
            flight_prices = [f["price"] for f in flights["outbound_flights"]]
            if flight_prices:
                return sum(flight_prices) / len(flight_prices)
        
        # Default flight cost
        return 500
    
    def _calculate_hotel_costs(self, research_data: Dict[str, Any]) -> float:
        """Calculate hotel costs from research data"""
        hotels = research_data.get("hotels", {})
        if hotels and "hotels" in hotels:
            # Use average hotel price per night
            hotel_prices = [h["price_per_night"] for h in hotels["hotels"]]
            if hotel_prices:
                avg_price = sum(hotel_prices) / len(hotel_prices)
                nights = hotels.get("nights", 7)
                return avg_price * nights
        
        # Default hotel cost
        return 150 * 7  # $150/night for 7 nights
    
    def _get_default_costs(self, travelers: int, days: int) -> Dict[str, Any]:
        """Get default cost estimates when calculation fails"""
        default_daily_cost = 200  # per person per day
        total_cost = default_daily_cost * travelers * days
        
        return {
            "breakdown": {
                "flights": 500 * travelers,
                "hotels": 150 * days,
                "meals": 60 * days * travelers,
                "transportation": 30 * days * travelers,
                "activities": 50 * days * travelers,
                "miscellaneous": 100 * travelers
            },
            "total_cost": total_cost,
            "cost_per_person": total_cost / travelers,
            "cost_per_day": total_cost / days if days > 0 else 0,
            "travelers": travelers,
            "currency": "USD",
            "note": "Default cost estimates - detailed calculation failed"
        }
    
    def estimate_budget_range(
        self,
        destination: str,
        days: int,
        travelers: int,
        comfort_level: str = "mid_range"
    ) -> Dict[str, Any]:
        """Estimate budget range for a trip"""
        
        comfort_multipliers = {
            "budget": 0.7,
            "mid_range": 1.0,
            "luxury": 1.8
        }
        
        multiplier = comfort_multipliers.get(comfort_level, 1.0)
        
        # Base costs
        base_flight = 500 * travelers
        base_hotel = 120 * days
        base_daily = 110 * days * travelers  # meals + transport + activities
        
        total_base = base_flight + base_hotel + base_daily
        total_adjusted = total_base * multiplier
        
        return {
            "comfort_level": comfort_level,
            "estimated_cost": total_adjusted,
            "cost_per_person": total_adjusted / travelers,
            "cost_per_day": total_adjusted / days,
            "breakdown": {
                "flights": base_flight * multiplier,
                "hotels": base_hotel * multiplier,
                "daily_expenses": base_daily * multiplier
            },
            "note": f"Estimated costs for {comfort_level} travel style"
        }
