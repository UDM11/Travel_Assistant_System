from typing import Dict, Any, List
from ..memory.conversation_memory import ConversationMemory

class SummarizerAgent:
    def __init__(self):
        self.memory = ConversationMemory()
    
    async def summarize_trip(self, trip_data: Dict[str, Any]) -> Dict[str, Any]:
        summary = {
            "trip_overview": self._create_overview(trip_data),
            "key_highlights": self._extract_highlights(trip_data),
            "budget_summary": self._summarize_budget(trip_data),
            "recommendations": self._final_recommendations(trip_data)
        }
        
        await self.memory.store_summary(summary)
        return summary
    
    def _create_overview(self, trip_data: Dict[str, Any]) -> str:
        dest = trip_data.get("destination", "Unknown")
        duration = trip_data.get("duration", 0)
        return f"{duration}-day trip to {dest}"
    
    def _extract_highlights(self, trip_data: Dict[str, Any]) -> List[str]:
        return ["Best attractions", "Local experiences", "Must-try food"]
    
    def _summarize_budget(self, trip_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "total_estimated": trip_data.get("estimated_cost", 0),
            "breakdown": {"flights": 500, "hotels": 300, "activities": 200}
        }
    
    def _final_recommendations(self, trip_data: Dict[str, Any]) -> List[str]:
        return ["Pack light", "Carry travel insurance", "Learn basic phrases"]