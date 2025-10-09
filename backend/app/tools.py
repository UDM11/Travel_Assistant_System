import requests
import os
from dotenv import load_dotenv

load_dotenv()
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
FLIGHTS_API_KEY = os.getenv("FLIGHTS_API_KEY")
HOTELS_API_KEY = os.getenv("HOTELS_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


import requests
import os

def get_weather(city):
    api_key = os.getenv("WEATHER_API_KEY")
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
    response = requests.get(url)
    data = response.json()
    if data.get("cod") != 200:
        return f"Error fetching weather data: {data.get('message', 'Unknown error')}"
    weather = data["weather"][0]["description"]
    temp = data["main"]["temp"]
    return f"Weather in {city}: {weather}, {temp}°C"



# Step 1: Get access token
def get_amadeus_token():
    url = "https://test.api.amadeus.com/v1/security/oauth2/token"
    data = {
        "grant_type": "client_credentials",
        "client_id": AMADEUS_CLIENT_ID,
        "client_secret": AMADEUS_CLIENT_SECRET
    }
    response = requests.post(url, data=data)
    response.raise_for_status()
    return response.json()["access_token"]

# Step 2: Fetch flights
def get_flights(origin, destination, departure_date, adults=1):
    token = get_amadeus_token()
    url = "https://test.api.amadeus.com/v2/shopping/flight-offers"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    params = {
        "originLocationCode": origin,
        "destinationLocationCode": destination,
        "departureDate": departure_date,
        "adults": adults,
        "max": 5  # top 5 results
    }
    response = requests.get(url, headers=headers, params=params)
    if response.status_code != 200:
        return f"Error fetching flights: {response.text}"
    
    data = response.json()
    if "data" not in data or len(data["data"]) == 0:
        return "No flight information available."

    flights = []
    for offer in data["data"]:
        price = offer["price"]["total"]
        airline = offer["validatingAirlineCodes"][0] if offer.get("validatingAirlineCodes") else "Unknown"
        direct = "Direct" if offer["itineraries"][0]["segments"][0]["numberOfStops"] == 0 else "Indirect"
        flights.append(f"{airline} - ${price}, {direct}")

    return "\n".join(flights)


# Step 1: Get access token (reuse from flights)
def get_amadeus_token():
    url = "https://test.api.amadeus.com/v1/security/oauth2/token"
    data = {
        "grant_type": "client_credentials",
        "client_id": AMADEUS_CLIENT_ID,
        "client_secret": AMADEUS_CLIENT_SECRET
    }
    response = requests.post(url, data=data)
    response.raise_for_status()
    return response.json()["access_token"]

# Step 2: Fetch hotels
def get_hotels(city_code, check_in_date, check_out_date, adults=1):
    token = get_amadeus_token()
    url = "https://test.api.amadeus.com/v2/shopping/hotel-offers"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    params = {
        "cityCode": city_code,  # IATA city code, e.g., KTM
        "checkInDate": check_in_date,
        "checkOutDate": check_out_date,
        "adults": adults,
        "roomQuantity": 1,
        "bestRateOnly": True,
        "view": "FULL"
    }
    response = requests.get(url, headers=headers, params=params)
    if response.status_code != 200:
        return f"Error fetching hotels: {response.text}"

    data = response.json()
    if "data" not in data or len(data["data"]) == 0:
        return "No hotels found."

    hotels = []
    for hotel in data["data"]:
        name = hotel["hotel"]["name"]
        price = hotel["offers"][0]["price"]["total"] if hotel["offers"] else "N/A"
        hotels.append(f"{name} - ${price} per night")

    return "\n".join(hotels)


