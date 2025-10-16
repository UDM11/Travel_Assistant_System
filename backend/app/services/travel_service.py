from typing import Dict, Any
from ..core.agents import ResearcherAgent, PlannerAgent, SummarizerAgent
from ..core.utils.logger import Logger
from ..core.utils.helpers import validate_trip_data, generate_trip_id

class TravelService:
    def __init__(self):
        self.researcher = ResearcherAgent()
        self.planner = PlannerAgent()
        self.summarizer = SummarizerAgent()
        self.logger = Logger("travel_service")
    
    async def plan_trip(self, trip_request: Dict[str, Any]) -> Dict[str, Any]:
        try:
            if not validate_trip_data(trip_request):
                raise ValueError("Invalid trip data")
            
            trip_id = generate_trip_id()
            self.logger.info(f"Planning trip {trip_id} for {trip_request.get('destination')}")
            
            # Research phase
            research_data = await self.researcher.research_destination(
                trip_request["destination"]
            )
            
            # Planning phase
            trip_data = {**trip_request, **research_data}
            itinerary = await self.planner.create_itinerary(trip_data)
            
            # Summary phase
            summary = await self.summarizer.summarize_trip({**trip_data, **itinerary})
            
            result = {
                "trip_id": trip_id,
                "status": "completed",
                "research": research_data,
                "itinerary": itinerary,
                "summary": summary
            }
            
            self.logger.info(f"Trip {trip_id} planned successfully")
            return result
            
        except Exception as e:
            self.logger.error(f"Error planning trip: {str(e)}")
            return {"status": "error", "message": str(e)}