import logging
import sys
from datetime import datetime
from typing import Dict, Any
import json

from app.core.config import settings


def setup_logging():
    """
    Setup logging configuration
    """
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler("travel_assistant.log")
        ]
    )
    
    # Set specific loggers
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    logging.getLogger("fastapi").setLevel(logging.INFO)
    logging.getLogger("sqlalchemy").setLevel(logging.WARNING)
    
    return logging.getLogger(__name__)


def log_api_call(
    endpoint: str,
    method: str,
    status_code: int,
    response_time: float,
    user_id: str = None,
    session_id: str = None,
    error: str = None
):
    """
    Log API call information
    """
    logger = logging.getLogger("api")
    
    log_data = {
        "timestamp": datetime.utcnow().isoformat(),
        "endpoint": endpoint,
        "method": method,
        "status_code": status_code,
        "response_time_ms": response_time,
        "user_id": user_id,
        "session_id": session_id,
        "error": error
    }
    
    if status_code >= 400:
        logger.error(f"API Error: {json.dumps(log_data)}")
    else:
        logger.info(f"API Call: {json.dumps(log_data)}")


def log_agent_activity(
    agent_name: str,
    activity: str,
    duration: float = None,
    success: bool = True,
    error: str = None
):
    """
    Log agent activity
    """
    logger = logging.getLogger("agents")
    
    log_data = {
        "timestamp": datetime.utcnow().isoformat(),
        "agent": agent_name,
        "activity": activity,
        "duration_seconds": duration,
        "success": success,
        "error": error
    }
    
    if success:
        logger.info(f"Agent Activity: {json.dumps(log_data)}")
    else:
        logger.error(f"Agent Error: {json.dumps(log_data)}")


def log_trip_creation(
    destination: str,
    budget: float,
    travelers: int,
    success: bool = True,
    error: str = None
):
    """
    Log trip creation events
    """
    logger = logging.getLogger("trips")
    
    log_data = {
        "timestamp": datetime.utcnow().isoformat(),
        "destination": destination,
        "budget": budget,
        "travelers": travelers,
        "success": success,
        "error": error
    }
    
    if success:
        logger.info(f"Trip Created: {json.dumps(log_data)}")
    else:
        logger.error(f"Trip Creation Failed: {json.dumps(log_data)}")


def format_error_response(error: str, detail: str = None) -> Dict[str, Any]:
    """
    Format standardized error response
    """
    return {
        "error": error,
        "detail": detail or error,
        "timestamp": datetime.utcnow().isoformat(),
        "status": "error"
    }


def format_success_response(data: Any, message: str = None) -> Dict[str, Any]:
    """
    Format standardized success response
    """
    return {
        "data": data,
        "message": message or "Success",
        "timestamp": datetime.utcnow().isoformat(),
        "status": "success"
    }


def validate_date_range(start_date: str, end_date: str) -> bool:
    """
    Validate that end date is after start date
    """
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
        return end > start
    except ValueError:
        return False


def calculate_trip_duration(start_date: str, end_date: str) -> int:
    """
    Calculate trip duration in days
    """
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
        return (end - start).days
    except ValueError:
        return 0


def sanitize_input(text: str, max_length: int = 1000) -> str:
    """
    Sanitize user input
    """
    if not text:
        return ""
    
    # Remove potentially harmful characters
    sanitized = text.strip()[:max_length]
    
    # Remove common SQL injection patterns
    dangerous_patterns = ["'", '"', ";", "--", "/*", "*/", "xp_", "sp_"]
    for pattern in dangerous_patterns:
        sanitized = sanitized.replace(pattern, "")
    
    return sanitized


def generate_session_id() -> str:
    """
    Generate a unique session ID
    """
    import uuid
    return str(uuid.uuid4())


def get_system_info() -> Dict[str, Any]:
    """
    Get system information for health checks
    """
    import platform
    import psutil
    
    return {
        "platform": platform.platform(),
        "python_version": platform.python_version(),
        "cpu_count": psutil.cpu_count(),
        "memory_total": psutil.virtual_memory().total,
        "memory_available": psutil.virtual_memory().available,
        "disk_usage": psutil.disk_usage('/').percent,
        "uptime": "unknown"  # Would need to track this separately
    }
