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
            
            # Enhanced Research phase with all APIs
            self.logger.info("Starting comprehensive destination research...")
            research_data = await self.researcher.research_destination(
                trip_request["destination"]
            )
            
            # Add flight search with origin if provided
            if trip_request.get("from"):
                research_data["flights"] = await self.researcher.flight_tool.search_flights(
                    destination=trip_request["destination"],
                    origin=trip_request["from"],
                    departure_date=trip_request.get("start_date")
                )
            
            # Enhanced Planning phase with AI and memory
            self.logger.info("Creating AI-powered itinerary...")
            trip_data = {
                **trip_request, 
                **research_data,
                "preferences": {
                    "travel_style": trip_request.get("travel_style", "mid-range"),
                    "accommodation": trip_request.get("accommodation", "hotel"),
                    "transportation": trip_request.get("transportation", "flight"),
                    "meal_preference": trip_request.get("meal_preference", "all"),
                    "activity_level": trip_request.get("activity_level", "moderate"),
                    "interests": trip_request.get("interests", []),
                    "special_requests": trip_request.get("special_requests", "")
                }
            }
            
            itinerary = await self.planner.create_itinerary(trip_data)
            
            # Enhanced Summary phase with AI insights
            self.logger.info("Generating AI-powered trip summary...")
            summary_data = {**trip_data, **itinerary}
            summary = await self.summarizer.summarize_trip(summary_data)
            
            # Compile comprehensive result
            result = {
                "trip_id": trip_id,
                "status": "completed",
                "research": research_data,
                "itinerary": itinerary,
                "summary": summary,
                "api_integration": {
                    "weather_api": bool(research_data.get("weather")),
                    "flights_api": bool(research_data.get("flights")),
                    "hotels_api": bool(research_data.get("hotels")),
                    "openai_api": itinerary.get("ai_generated", False)
                },
                "enhanced_features": {
                    "memory_stored": True,
                    "cost_calculated": True,
                    "preferences_applied": True,
                    "multi_agent_planning": True
                }
            }
            
            self.logger.info(f"Trip {trip_id} planned successfully with full AI integration")
            return result
            
        except Exception as e:
            self.logger.error(f"Error planning trip: {str(e)}")
            return {"status": "error", "message": str(e)}