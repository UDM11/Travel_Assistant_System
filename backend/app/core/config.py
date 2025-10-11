from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Travel Assistant Agent"
    VERSION: str = "1.0.0"
    
    # CORS Configuration
    FRONTEND_URL: str = "http://localhost:5173"
    BACKEND_CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]
    
    # Database Configuration
    DATABASE_URL: str = "sqlite:///./travel.db"
    
    # Redis Configuration
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # ChromaDB Configuration
    CHROMA_PATH: str = "./data/chroma"
    
    # OpenAI Configuration
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"
    OPENAI_MODEL: str = "gpt-4o-mini"
    
    # External API Keys
    WEATHER_API_KEY: Optional[str] = None
    FLIGHT_API_KEY: Optional[str] = None
    HOTEL_API_KEY: Optional[str] = None
    
    # Agent Configuration
    AGENT_TEMPERATURE: float = 0.5
    MAX_TOKENS: int = 2000
    
    # Memory Configuration
    CONVERSATION_MEMORY_SIZE: int = 10
    VECTOR_STORE_COLLECTION: str = "travel_knowledge"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
