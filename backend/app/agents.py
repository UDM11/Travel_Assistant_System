from langchain.agents import initialize_agent, Tool
from langchain.chat_models import ChatOpenAI
from .tools import get_weather, get_flights, get_hotels, calculate_budget
from .memory import memory
import os
from dotenv import load_dotenv
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
llm = ChatOpenAI(
    temperature=0.5,
    model="gpt-4o-mini",
    openai_api_key=OPENAI_API_KEY,
    bbase_url="https://openrouter.ai/api/v1"
)


tools = [
    Tool(
        name="Weather Checker",
        func = get_weather,
        description = "Get current weather for a city"
    ),
    Tool(
        name = "Flight Finder",
        func = get_flights,
        description = "Find flights between origin and destination"
    ),
    Tool(
        name = "Hotel Finder",
        func = get_hotels,
        description = "Find hotels in a city"
    ),
    Tool(
        name = "Budget Calculator",
        func = calculate_budget,
        description = "Estimate trip costs based on flights, hotel, daily spend, and days"
    )
]


agent = initialize_agent(
    tools,
    llm,
    agent_type="zero-shot-react-description",
    verbose=True,
    memory=memory,
)


def plan_trip(user_input):
    return agent.run(user_input)