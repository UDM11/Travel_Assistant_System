import pytest
import asyncio
from app.core.agents import ResearcherAgent, PlannerAgent, SummarizerAgent

@pytest.mark.asyncio
async def test_researcher_agent():
    agent = ResearcherAgent()
    result = await agent.research_destination("Tokyo")
    
    assert result["destination"] == "Tokyo"
    assert "weather" in result
    assert "flights" in result
    assert "hotels" in result

@pytest.mark.asyncio
async def test_planner_agent():
    agent = PlannerAgent()
    trip_data = {
        "destination": "London",
        "duration": 4,
        "budget": 1500
    }
    
    result = await agent.create_itinerary(trip_data)
    
    assert result["destination"] == "London"
    assert result["duration"] == 4
    assert "estimated_cost" in result
    assert "activities" in result

@pytest.mark.asyncio
async def test_summarizer_agent():
    agent = SummarizerAgent()
    trip_data = {
        "destination": "Rome",
        "duration": 3,
        "estimated_cost": 1200
    }
    
    result = await agent.summarize_trip(trip_data)
    
    assert "trip_overview" in result
    assert "budget_summary" in result
    assert "recommendations" in result