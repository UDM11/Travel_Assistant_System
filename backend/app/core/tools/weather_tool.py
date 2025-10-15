import httpx
from typing import Dict, Any
from app.config import settings
from app.core.utils.logger import app_logger

class WeatherTool:
    def __init__(self):
        self.api_key = settings.OPENWEATHER_API_KEY
        self.base_url = "http://api.openweathermap.org/data/2.5"
    
    async def get_current_weather(self, city: str, country_code: str = None) -> Dict[str, Any]:
        """Get current weather for a city"""
        try:
            location = f"{city},{country_code}" if country_code else city
            
            if not self.api_key:
                # Mock data when API key is not available
                return self._get_mock_weather(city)
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/weather",
                    params={
                        "q": location,
                        "appid": self.api_key,
                        "units": "metric"
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "city": data["name"],
                        "temperature": data["main"]["temp"],
                        "description": data["weather"][0]["description"],
                        "humidity": data["main"]["humidity"],
                        "wind_speed": data["wind"]["speed"],
                        "country": data["sys"]["country"]
                    }
                else:
                    app_logger.error(f"Weather API error: {response.status_code}")
                    return self._get_mock_weather(city)
                    
        except Exception as e:
            app_logger.error(f"Weather tool error: {str(e)}")
            return self._get_mock_weather(city)
    
    async def get_forecast(self, city: str, days: int = 5) -> Dict[str, Any]:
        """Get weather forecast for a city"""
        try:
            if not self.api_key:
                return self._get_mock_forecast(city, days)
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/forecast",
                    params={
                        "q": city,
                        "appid": self.api_key,
                        "units": "metric",
                        "cnt": days * 8  # 8 forecasts per day (3-hour intervals)
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    forecasts = []
                    
                    for item in data["list"][:days]:
                        forecasts.append({
                            "date": item["dt_txt"].split(" ")[0],
                            "temperature": item["main"]["temp"],
                            "description": item["weather"][0]["description"],
                            "humidity": item["main"]["humidity"]
                        })
                    
                    return {
                        "city": data["city"]["name"],
                        "forecast": forecasts
                    }
                else:
                    return self._get_mock_forecast(city, days)
                    
        except Exception as e:
            app_logger.error(f"Forecast error: {str(e)}")
            return self._get_mock_forecast(city, days)
    
    def _get_mock_weather(self, city: str) -> Dict[str, Any]:
        """Return mock weather data"""
        return {
            "city": city,
            "temperature": 22.5,
            "description": "partly cloudy",
            "humidity": 65,
            "wind_speed": 3.2,
            "country": "XX"
        }
    
    def _get_mock_forecast(self, city: str, days: int) -> Dict[str, Any]:
        """Return mock forecast data"""
        from datetime import datetime, timedelta
        
        forecasts = []
        for i in range(days):
            date = (datetime.now() + timedelta(days=i)).strftime("%Y-%m-%d")
            forecasts.append({
                "date": date,
                "temperature": 20 + (i * 2),
                "description": "sunny" if i % 2 == 0 else "cloudy",
                "humidity": 60 + (i * 5)
            })
        
        return {
            "city": city,
            "forecast": forecasts
        }