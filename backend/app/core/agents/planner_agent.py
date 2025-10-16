from typing import Dict, Any, List
from ..tools.cost_calculator import CostCalculator
from ..memory.conversation_memory import ConversationMemory

class PlannerAgent:
    def __init__(self):
        self.cost_calculator = CostCalculator()
        self.memory = ConversationMemory()
    
    async def create_itinerary(self, trip_data: Dict[str, Any]) -> Dict[str, Any]:
        total_cost = self.cost_calculator.calculate_total_cost(trip_data)
        
        itinerary = {
            "destination": trip_data.get("destination"),
            "duration": trip_data.get("duration", 3),
            "activities": self._generate_activities(trip_data),
            "estimated_cost": total_cost,
            "recommendations": self._get_recommendations(trip_data)
        }
        
        await self.memory.store_plan(itinerary)
        return itinerary
    
    def _generate_activities(self, trip_data: Dict[str, Any]) -> List[str]:
        return ["Sightseeing", "Local cuisine", "Cultural sites"]
    
    def _get_recommendations(self, trip_data: Dict[str, Any]) -> List[str]:
        return ["Book early for better prices", "Check weather forecast"]