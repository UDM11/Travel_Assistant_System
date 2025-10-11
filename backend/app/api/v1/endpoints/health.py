from fastapi import APIRouter, HTTPException
from datetime import datetime
import psutil
import os

router = APIRouter()


@router.get("/")
async def health_check():
    """Health check endpoint"""
    try:
        # Get system information
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "version": "1.0.0",
            "system": {
                "cpu_percent": cpu_percent,
                "memory_percent": memory.percent,
                "disk_percent": disk.percent,
                "uptime": os.getenv("UPTIME", "unknown")
            }
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Health check failed: {str(e)}")


@router.get("/ready")
async def readiness_check():
    """Readiness check for Kubernetes/Docker"""
    return {"status": "ready", "timestamp": datetime.utcnow().isoformat()}
