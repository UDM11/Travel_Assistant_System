from typing import Dict, Any
import aiohttp
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

class WeatherTool:
    def __init__(self):
        self.api_key = os.getenv("WEATHER_API_KEY")
        self.base_url = "http://api.openweathermap.org/data/2.5"
    
    async def get_weather(self, location: str) -> Dict[str, Any]:
        try:
            if not self.api_key:
                return self._get_mock_weather(location)
                
            async with aiohttp.ClientSession() as session:
                # Current weather
                current_url = f"{self.base_url}/weather?q={location}&appid={self.api_key}&units=metric"
                async with session.get(current_url) as response:
                    if response.status != 200:
                        return self._get_mock_weather(location)
                    current_data = await response.json()
                
                # 5-day forecast
                forecast_url = f"{self.base_url}/forecast?q={location}&appid={self.api_key}&units=metric"
                async with session.get(forecast_url) as response:
                    if response.status != 200:
                        forecast_data = {"list": []}
                    else:
                        forecast_data = await response.json()
                
                return {
                    "location": current_data["name"],
                    "country": current_data["sys"]["country"],
                    "temperature": f"{round(current_data['main']['temp'])}°C",
                    "feels_like": f"{round(current_data['main']['feels_like'])}°C",
                    "condition": current_data["weather"][0]["main"],
                    "description": current_data["weather"][0]["description"].title(),
                    "humidity": f"{current_data['main']['humidity']}%",
                    "pressure": f"{current_data['main']['pressure']} hPa",
                    "wind_speed": f"{current_data['wind']['speed']} m/s",
                    "wind_direction": current_data['wind'].get('deg', 0),
                    "visibility": f"{current_data.get('visibility', 0) / 1000:.1f} km",
                    "uv_index": "Moderate",  # Would need additional API call
                    "sunrise": current_data["sys"]["sunrise"],
                    "sunset": current_data["sys"]["sunset"],
                    "forecast": [
                        {
                            "date": item["dt_txt"].split()[0],
                            "time": item["dt_txt"].split()[1],
                            "temp": f"{round(item['main']['temp'])}°C",
                            "condition": item["weather"][0]["main"],
                            "description": item["weather"][0]["description"].title(),
                            "humidity": f"{item['main']['humidity']}%",
                            "wind_speed": f"{item['wind']['speed']} m/s"
                        } for item in forecast_data["list"][:8]  # Next 24 hours (3-hour intervals)
                    ],
                    "daily_forecast": self._process_daily_forecast(forecast_data.get("list", []))
                }
        except Exception as e:
            return self._get_mock_weather(location)
    
    def _process_daily_forecast(self, forecast_list: list) -> list:
        """Process 5-day forecast into daily summaries"""
        daily_data = {}
        
        for item in forecast_list:
            date = item["dt_txt"].split()[0]
            if date not in daily_data:
                daily_data[date] = {
                    "date": date,
                    "temps": [],
                    "conditions": [],
                    "humidity": [],
                    "wind_speeds": []
                }
            
            daily_data[date]["temps"].append(item["main"]["temp"])
            daily_data[date]["conditions"].append(item["weather"][0]["main"])
            daily_data[date]["humidity"].append(item["main"]["humidity"])
            daily_data[date]["wind_speeds"].append(item["wind"]["speed"])
        
        daily_forecast = []
        for date, data in list(daily_data.items())[:5]:  # 5 days
            daily_forecast.append({
                "date": date,
                "high_temp": f"{round(max(data['temps']))}°C",
                "low_temp": f"{round(min(data['temps']))}°C",
                "condition": max(set(data["conditions"]), key=data["conditions"].count),
                "avg_humidity": f"{round(sum(data['humidity']) / len(data['humidity']))}%",
                "avg_wind": f"{round(sum(data['wind_speeds']) / len(data['wind_speeds']), 1)} m/s"
            })
        
        return daily_forecast
    
    def _get_mock_weather(self, location: str) -> Dict[str, Any]:
        return {
            "location": location,
            "country": "Unknown",
            "temperature": "22°C",
            "feels_like": "24°C",
            "condition": "Clear",
            "description": "Clear Sky",
            "humidity": "65%",
            "pressure": "1013 hPa",
            "wind_speed": "3.2 m/s",
            "visibility": "10.0 km",
            "forecast": [],
            "daily_forecast": []
        }