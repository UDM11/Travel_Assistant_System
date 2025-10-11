from typing import Dict, Any, List
import asyncio
from datetime import datetime

from app.agents.researcher import ResearcherAgent
from app.agents.planner import PlannerAgent
from app.agents.summarizer import SummarizerAgent
from app.core.config import settings


class TripOrchestrator:
    """
    Orchestrates the trip planning pipeline using multiple AI agents
    """
    
    def __init__(self):
        self.researcher = ResearcherAgent()
        self.planner = PlannerAgent()
        self.summarizer = SummarizerAgent()
    
    async def plan_trip(
        self,
        destination: str,
        start_date: str,
        end_date: str,
        budget: float,
        preferences: Dict[str, Any],
        travelers: int = 1
    ) -> Dict[str, Any]:
        """
        Execute the complete trip planning pipeline
        """
        try:
            # Step 1: Research phase
            print(f"🔍 Researching {destination}...")
            research_data = await self.researcher.research_destination(
                destination=destination,
                start_date=start_date,
                end_date=end_date,
                preferences=preferences
            )
            
            # Step 2: Planning phase
            print(f"📋 Creating itinerary for {destination}...")
            itinerary = await self.planner.create_itinerary(
                destination=destination,
                start_date=start_date,
                end_date=end_date,
                budget=budget,
                travelers=travelers,
                research_data=research_data,
                preferences=preferences
            )
            
            # Step 3: Summarization phase
            print(f"📝 Summarizing trip plan...")
            final_plan = await self.summarizer.summarize_trip(
                destination=destination,
                itinerary=itinerary,
                budget=budget,
                preferences=preferences
            )
            
            return {
                "plan": final_plan["summary"],
                "itinerary": final_plan["itinerary"],
                "cost_breakdown": final_plan["cost_breakdown"],
                "recommendations": final_plan["recommendations"],
                "research_data": research_data
            }
            
        except Exception as e:
            print(f"❌ Error in trip planning: {str(e)}")
            raise Exception(f"Trip planning failed: {str(e)}")
    
    async def update_trip_plan(
        self,
        trip_id: str,
        updates: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Update an existing trip plan based on user feedback
        """
        # This would involve re-running specific agents based on what changed
        pass
    
    def get_agent_status(self) -> Dict[str, str]:
        """
        Get the status of all agents
        """
        return {
            "researcher": "active",
            "planner": "active", 
            "summarizer": "active",
            "orchestrator": "active"
        }
