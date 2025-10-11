import httpx
import asyncio
from typing import Dict, Any, List
from datetime import datetime, timedelta

from app.core.config import settings


class WeatherService:
    """
    Service for fetching weather data
    """
    
    def __init__(self):
        self.api_key = settings.WEATHER_API_KEY
        self.base_url = "http://api.openweathermap.org/data/2.5"
    
    async def get_weather_forecast(
        self,
        destination: str,
        start_date: str,
        end_date: str
    ) -> Dict[str, Any]:
        """
        Get weather forecast for destination
        """
        try:
            if not self.api_key:
                return await self._get_mock_weather(destination, start_date, end_date)
            
            # Get coordinates for destination
            coords = await self._get_coordinates(destination)
            if not coords:
                return await self._get_mock_weather(destination, start_date, end_date)
            
            # Get current weather
            current_weather = await self._get_current_weather(coords["lat"], coords["lon"])
            
            # Get forecast
            forecast = await self._get_forecast(coords["lat"], coords["lon"])
            
            return {
                "destination": destination,
                "coordinates": coords,
                "current": current_weather,
                "forecast": forecast,
                "recommendations": self._generate_weather_recommendations(current_weather, forecast)
            }
            
        except Exception as e:
            print(f"⚠️ Weather service error: {str(e)}")
            return await self._get_mock_weather(destination, start_date, end_date)
    
    async def _get_coordinates(self, destination: str) -> Dict[str, float]:
        """Get coordinates for destination"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/weather",
                    params={
                        "q": destination,
                        "appid": self.api_key
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "lat": data["coord"]["lat"],
                        "lon": data["coord"]["lon"]
                    }
                return None
                
        except Exception as e:
            print(f"⚠️ Coordinates lookup failed: {str(e)}")
            return None
    
    async def _get_current_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        """Get current weather conditions"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/weather",
                    params={
                        "lat": lat,
                        "lon": lon,
                        "appid": self.api_key,
                        "units": "metric"
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "temperature": data["main"]["temp"],
                        "feels_like": data["main"]["feels_like"],
                        "humidity": data["main"]["humidity"],
                        "description": data["weather"][0]["description"],
                        "wind_speed": data["wind"]["speed"],
                        "visibility": data.get("visibility", 0) / 1000  # Convert to km
                    }
                return None
                
        except Exception as e:
            print(f"⚠️ Current weather fetch failed: {str(e)}")
            return None
    
    async def _get_forecast(self, lat: float, lon: float) -> List[Dict[str, Any]]:
        """Get 5-day weather forecast"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/forecast",
                    params={
                        "lat": lat,
                        "lon": lon,
                        "appid": self.api_key,
                        "units": "metric"
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    forecast = []
                    
                    for item in data["list"][:8]:  # Next 24 hours (3-hour intervals)
                        forecast.append({
                            "datetime": item["dt_txt"],
                            "temperature": item["main"]["temp"],
                            "description": item["weather"][0]["description"],
                            "humidity": item["main"]["humidity"],
                            "wind_speed": item["wind"]["speed"]
                        })
                    
                    return forecast
                return []
                
        except Exception as e:
            print(f"⚠️ Forecast fetch failed: {str(e)}")
            return []
    
    async def _get_mock_weather(
        self,
        destination: str,
        start_date: str,
        end_date: str
    ) -> Dict[str, Any]:
        """Generate mock weather data when API is unavailable"""
        return {
            "destination": destination,
            "coordinates": {"lat": 0.0, "lon": 0.0},
            "current": {
                "temperature": 22,
                "feels_like": 24,
                "humidity": 65,
                "description": "partly cloudy",
                "wind_speed": 3.5,
                "visibility": 10
            },
            "forecast": [
                {
                    "datetime": f"{start_date} 09:00:00",
                    "temperature": 20,
                    "description": "sunny",
                    "humidity": 60,
                    "wind_speed": 2.5
                },
                {
                    "datetime": f"{start_date} 15:00:00",
                    "temperature": 25,
                    "description": "partly cloudy",
                    "humidity": 70,
                    "wind_speed": 4.0
                }
            ],
            "recommendations": [
                "Pack light layers for temperature changes",
                "Bring sunscreen for outdoor activities",
                "Consider indoor alternatives if weather changes"
            ],
            "note": "Mock weather data - API key not configured"
        }
    
    def _generate_weather_recommendations(
        self,
        current: Dict[str, Any],
        forecast: List[Dict[str, Any]]
    ) -> List[str]:
        """Generate weather-based recommendations"""
        recommendations = []
        
        if current:
            temp = current.get("temperature", 20)
            description = current.get("description", "").lower()
            
            if temp < 10:
                recommendations.append("Pack warm clothing and layers")
            elif temp > 30:
                recommendations.append("Pack light, breathable clothing and sunscreen")
            
            if "rain" in description:
                recommendations.append("Bring rain gear and waterproof shoes")
            elif "sunny" in description:
                recommendations.append("Don't forget sunglasses and hat")
            elif "wind" in description:
                recommendations.append("Consider wind-resistant clothing")
        
        return recommendations
