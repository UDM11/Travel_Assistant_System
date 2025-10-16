from typing import Dict, Any, List
from datetime import datetime, timedelta
import json

def format_currency(amount: float, currency: str = "USD") -> str:
    return f"${amount:,.2f} {currency}"

def parse_date(date_string: str) -> datetime:
    try:
        return datetime.fromisoformat(date_string)
    except ValueError:
        return datetime.now()

def calculate_trip_duration(start_date: str, end_date: str) -> int:
    start = parse_date(start_date)
    end = parse_date(end_date)
    return (end - start).days

def validate_trip_data(trip_data: Dict[str, Any]) -> bool:
    required_fields = ["destination", "start_date", "end_date"]
    return all(field in trip_data for field in required_fields)

def sanitize_input(text: str) -> str:
    return text.strip().replace("<", "&lt;").replace(">", "&gt;")

def generate_trip_id() -> str:
    return f"trip_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

def load_json_file(file_path: str) -> Dict[str, Any]:
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_json_file(data: Dict[str, Any], file_path: str) -> bool:
    try:
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        return True
    except Exception:
        return False