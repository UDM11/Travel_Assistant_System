from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Travel Assistant Agent"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Server
    HOST: str = "127.0.0.1"
    PORT: int = 8001
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]
    
    # API Keys
    OPENAI_API_KEY: str = ""
    OPENWEATHER_API_KEY: str = ""
    AMADEUS_API_KEY: str = ""
    AMADEUS_API_SECRET: str = ""
    
    # Database
    CHROMA_PERSIST_DIRECTORY: str = "./data/chroma"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "./logs/app.log"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()