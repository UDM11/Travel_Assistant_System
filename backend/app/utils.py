from datetime import datetime, timedelta

def format_itinerary(itinerary: dict) -> str:
    """
    Formats a trip itinerary dictionary into a readable string.
    Example itinerary dict:
    {
        "destination": "Pokhara",
        "days": 3,
        "flights": ["Flight AB123 $200"],
        "hotels": ["Hotel XYZ $100/night"],
        "activities": ["Paragliding", "Lakeside walk"]
    }
    """
    output = f"Trip Itinerary for {itinerary.get('destination', 'Unknown')}\n"
    output += f"Duration: {itinerary.get('days', 0)} days\n\n"
    
    if itinerary.get("flights"):
        output += "Flights:\n"
        for flight in itinerary["flights"]:
            output += f"- {flight}\n"
        output += "\n"
    
    if itinerary.get("hotels"):
        output += "Hotels:\n"
        for hotel in itinerary["hotels"]:
            output += f"- {hotel}\n"
        output += "\n"
    
    if itinerary.get("activities"):
        output += "Activities:\n"
        for activity in itinerary["activities"]:
            output += f"- {activity}\n"
    
    if itinerary.get("budget"):
        output += f"\nEstimated Budget: ${itinerary['budget']}\n"
    
    return output

def parse_date(date_str: str) -> datetime:
    """
    Convert a date string in format YYYY-MM-DD to datetime object.
    """
    return datetime.strptime(date_str, "%Y-%m-%d")

def calculate_end_date(start_date: str, days: int) -> str:
    """
    Returns the end date as a string in YYYY-MM-DD format given start date and trip duration.
    """
    start = parse_date(start_date)
    end = start + timedelta(days=days)
    return end.strftime("%Y-%m-%d")

def estimate_trip_budget(days: int, hotel_cost_per_day: float, flight_cost: float) -> float:
    """
    Simple budget calculation: total hotel cost + flight cost.
    """
    return days * hotel_cost_per_day + flight_cost

def validate_city(city: str) -> bool:
    """
    Simple city name validation (can be expanded with a real city database).
    """
    return isinstance(city, str) and len(city) > 1
