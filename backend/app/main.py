from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import os

from app.config import settings
from app.core.utils.logger import app_logger
from app.api.routes import trip_routes
from app.models.schemas import ContactMessage
from app.core.utils.helpers import create_response
from datetime import datetime

# Storage for contact messages (use database in production)
contact_messages = []

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    app_logger.info("Starting Travel Assistant Agent...")
    os.makedirs("logs", exist_ok=True)
    os.makedirs("data", exist_ok=True)
    yield
    # Shutdown
    app_logger.info("Shutting down Travel Assistant Agent...")

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

# Include API routers
app.include_router(trip_routes.router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "message": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "running",
        "docs": "/docs"
    }

@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.VERSION
    }

# Contact endpoints (keeping for compatibility)
@app.post("/api/v1/contact")
async def submit_contact_message(message: ContactMessage):
    try:
        message_record = {
            "id": len(contact_messages) + 1,
            "name": message.name,
            "email": message.email,
            "message": message.message,
            "created_at": datetime.utcnow().isoformat(),
            "status": "new"
        }
        contact_messages.append(message_record)
        
        app_logger.info(f"Contact message received from {message.name}")
        return create_response(
            success=True, 
            data={"id": message_record["id"]}, 
            message="Message sent successfully!"
        )
        
    except Exception as e:
        app_logger.error(f"Contact message error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to save message")

@app.get("/api/v1/contact/messages")
async def get_contact_messages():
    return create_response(
        success=True,
        data={"messages": contact_messages, "total": len(contact_messages)}
    )

if __name__ == "__main__":
    app_logger.info(f"Starting {settings.PROJECT_NAME} on {settings.HOST}:{settings.PORT}")
    app_logger.info(f"API Documentation: http://{settings.HOST}:{settings.PORT}/docs")
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )