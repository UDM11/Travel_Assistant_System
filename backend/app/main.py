from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.core.config import settings
from app.api.v1.router import api_router
from app.db.init_db import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting Travel Assistant Agent...")
    init_db()
    print("Database initialized")
    yield
    # Shutdown
    print("Shutting down Travel Assistant Agent...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-powered travel planning assistant with multi-agent architecture",
    lifespan=lifespan
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {
        "message": "Travel Assistant Agent API",
        "version": settings.VERSION,
        "docs": "/docs"
    }


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
