from typing import Dict, Any
import asyncio

class WeatherTool:
    def __init__(self):
        self.api_key = "demo_key"
    
    async def get_weather(self, location: str) -> Dict[str, Any]:
        # Simulate API call
        await asyncio.sleep(0.1)
        
        return {
            "location": location,
            "temperature": "22°C",
            "condition": "Sunny",
            "humidity": "65%",
            "forecast": [
                {"day": "Today", "temp": "22°C", "condition": "Sunny"},
                {"day": "Tomorrow", "temp": "24°C", "condition": "Partly Cloudy"},
                {"day": "Day 3", "temp": "20°C", "condition": "Rainy"}
            ]
        }