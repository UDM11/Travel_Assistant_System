from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
import uvicorn
import json
import os

app = FastAPI(title="Travel Assistant API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TripRequest(BaseModel):
    destination: str
    start_date: str
    end_date: str
    budget: float
    travelers: int
    preferences: dict = {}
    interests: list = []

class ContactMessage(BaseModel):
    name: str
    email: str
    message: str

# File paths
TRIPS_FILE = "trips.json"
CONTACT_FILE = "contact_messages.json"

# Load data from files
def load_data():
    global trips, contact_messages
    
    # Load trips
    if os.path.exists(TRIPS_FILE):
        try:
            with open(TRIPS_FILE, 'r') as f:
                trips = json.load(f)
        except:
            trips = []
    else:
        trips = []
    
    # Load contact messages
    if os.path.exists(CONTACT_FILE):
        try:
            with open(CONTACT_FILE, 'r') as f:
                contact_messages = json.load(f)
        except:
            contact_messages = []
    else:
        contact_messages = []

# Save data to files
def save_trips():
    with open(TRIPS_FILE, 'w') as f:
        json.dump(trips, f, indent=2)

def save_contact_messages():
    with open(CONTACT_FILE, 'w') as f:
        json.dump(contact_messages, f, indent=2)

# Initialize data
trips = []
contact_messages = []
load_data()

@app.get("/")
async def root():
    return {"message": "Travel Assistant API", "version": "1.0.0", "status": "running"}

@app.post("/api/v1/trip/plan")
async def plan_trip(request: TripRequest):
    start = datetime.strptime(request.start_date, "%Y-%m-%d")
    end = datetime.strptime(request.end_date, "%Y-%m-%d")
    days = (end - start).days + 1
    
    itinerary = []
    for i in range(min(days, 7)):
        itinerary.append({
            "day": i + 1,
            "date": (start + timedelta(days=i)).strftime("%Y-%m-%d"),
            "activities": [
                {"time": "09:00-12:00", "activity": f"Explore {request.destination} attractions"},
                {"time": "14:00-17:00", "activity": f"Visit local markets"},
                {"time": "19:00-21:00", "activity": f"Enjoy local cuisine"}
            ]
        })
    
    cost_breakdown = {
        "accommodation": request.budget * 0.4,
        "food": request.budget * 0.3,
        "transportation": request.budget * 0.2,
        "activities": request.budget * 0.1,
        "total": request.budget
    }
    
    trip = {
        "id": len(trips) + 1,
        "destination": request.destination,
        "start_date": request.start_date,
        "end_date": request.end_date,
        "budget": request.budget,
        "travelers": request.travelers,
        "plan": f"Welcome to {request.destination}! {days}-day adventure awaits.",
        "itinerary": itinerary,
        "cost_breakdown": cost_breakdown,
        "created_at": datetime.utcnow().isoformat()
    }
    
    trips.append(trip)
    save_trips()
    return {"success": True, "data": trip}

@app.get("/api/v1/trip")
async def get_trips():
    return {"success": True, "data": {"trips": trips, "total": len(trips)}}

@app.post("/api/v1/contact")
async def submit_contact_message(message: ContactMessage):
    message_record = {
        "id": len(contact_messages) + 1,
        "name": message.name,
        "email": message.email,
        "message": message.message,
        "created_at": datetime.utcnow().isoformat(),
        "status": "new"
    }
    contact_messages.append(message_record)
    save_contact_messages()
    return {"success": True, "message": "Message sent successfully!", "id": message_record["id"]}

@app.get("/api/v1/contact/messages")
async def get_contact_messages():
    return {"success": True, "data": {"messages": contact_messages, "total": len(contact_messages)}}

@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

if __name__ == "__main__":
    print("Travel Assistant API starting on http://127.0.0.1:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000)