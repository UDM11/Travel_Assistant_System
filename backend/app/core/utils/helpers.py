from datetime import datetime, timedelta
from typing import Dict, Any, List
import json
import hashlib

def calculate_trip_days(start_date: str, end_date: str) -> int:
    """Calculate number of days between two dates"""
    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    return (end - start).days + 1

def generate_trip_id(destination: str, start_date: str, user_id: str = "anonymous") -> str:
    """Generate unique trip ID"""
    data = f"{destination}_{start_date}_{user_id}_{datetime.utcnow().isoformat()}"
    return hashlib.md5(data.encode()).hexdigest()[:12]

def format_currency(amount: float, currency: str = "USD") -> str:
    """Format currency amount"""
    return f"{currency} {amount:,.2f}"

def validate_date_range(start_date: str, end_date: str) -> bool:
    """Validate that end date is after start date"""
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
        return end >= start
    except ValueError:
        return False

def sanitize_input(text: str) -> str:
    """Basic input sanitization"""
    return text.strip().replace("<", "&lt;").replace(">", "&gt;")

def create_response(success: bool, data: Any = None, message: str = "", error: str = "") -> Dict[str, Any]:
    """Create standardized API response"""
    response = {
        "success": success,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    if data is not None:
        response["data"] = data
    if message:
        response["message"] = message
    if error:
        response["error"] = error
        
    return response