from typing import Dict, Any
from ..core.agents import ResearcherAgent, PlannerAgent, SummarizerAgent
from ..core.rag.retriever import Retriever
from ..core.utils.logger import Logger

class AIService:
    def __init__(self):
        self.researcher = ResearcherAgent()
        self.planner = PlannerAgent()
        self.summarizer = SummarizerAgent()
        self.retriever = Retriever()
        self.logger = Logger("ai_service")
    
    async def process_query(self, query: str, context: Dict[str, Any] = {}) -> Dict[str, Any]:
        try:
            # Retrieve relevant information
            relevant_info = await self.retriever.retrieve_relevant_info(query)
            
            # Generate response based on query type
            if "weather" in query.lower():
                response = await self._handle_weather_query(query, context)
            elif "plan" in query.lower() or "trip" in query.lower():
                response = await self._handle_trip_query(query, context)
            else:
                response = await self._handle_general_query(query, context, relevant_info)
            
            return {
                "response": response,
                "confidence": 0.85,
                "sources": [item["doc_id"] for item in relevant_info]
            }
        except Exception as e:
            self.logger.error(f"Error processing query: {str(e)}")
            return {"response": "I'm sorry, I couldn't process your request.", "confidence": 0.0, "sources": []}
    
    async def _handle_weather_query(self, query: str, context: Dict[str, Any]) -> str:
        destination = context.get("destination", "Paris")
        weather_data = await self.researcher.weather_tool.get_weather(destination)
        return f"The weather in {destination} is {weather_data['condition']} with temperature {weather_data['temperature']}"
    
    async def _handle_trip_query(self, query: str, context: Dict[str, Any]) -> str:
        if context.get("destination"):
            research = await self.researcher.research_destination(context["destination"])
            return f"I found great options for {context['destination']}. The weather looks {research['weather']['condition'].lower()}."
        return "I'd be happy to help plan your trip! Please provide your destination."
    
    async def _handle_general_query(self, query: str, context: Dict[str, Any], relevant_info: list) -> str:
        if relevant_info:
            return f"Based on my knowledge: {relevant_info[0]['text']}"
        return "I'm here to help with your travel planning needs!"