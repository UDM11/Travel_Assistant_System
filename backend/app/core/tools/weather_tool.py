from typing import Dict, Any
import aiohttp
import os
from dotenv import load_dotenv

load_dotenv()

class WeatherTool:
    def __init__(self):
        self.api_key = os.getenv("WEATHER_API_KEY")
        self.base_url = "http://api.openweathermap.org/data/2.5"
    
    async def get_weather(self, location: str) -> Dict[str, Any]:
        try:
            async with aiohttp.ClientSession() as session:
                # Current weather
                current_url = f"{self.base_url}/weather?q={location}&appid={self.api_key}&units=metric"
                async with session.get(current_url) as response:
                    current_data = await response.json()
                
                # Forecast
                forecast_url = f"{self.base_url}/forecast?q={location}&appid={self.api_key}&units=metric&cnt=3"
                async with session.get(forecast_url) as response:
                    forecast_data = await response.json()
                
                return {
                    "location": current_data["name"],
                    "temperature": f"{round(current_data['main']['temp'])}°C",
                    "condition": current_data["weather"][0]["main"],
                    "humidity": f"{current_data['main']['humidity']}%",
                    "forecast": [
                        {
                            "day": f"Day {i+1}",
                            "temp": f"{round(item['main']['temp'])}°C",
                            "condition": item["weather"][0]["main"]
                        } for i, item in enumerate(forecast_data["list"])
                    ]
                }
        except Exception as e:
            return {
                "location": location,
                "temperature": "N/A",
                "condition": "Unable to fetch weather",
                "humidity": "N/A",
                "forecast": []
            }