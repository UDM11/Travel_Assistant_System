import json
import os

TRIPS_FILE = "trips.json"
CONTACT_FILE = "contact_messages.json"
USERS_FILE = "users.json"

def load_data():
    trips = []
    contact_messages = []
    users = []
    
    if os.path.exists(TRIPS_FILE):
        try:
            with open(TRIPS_FILE, 'r') as f:
                trips = json.load(f)
        except:
            trips = []
    
    if os.path.exists(CONTACT_FILE):
        try:
            with open(CONTACT_FILE, 'r') as f:
                contact_messages = json.load(f)
        except:
            contact_messages = []
    
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE, 'r') as f:
                users = json.load(f)
        except:
            users = []
    
    return trips, contact_messages, users

def save_trips(trips):
    with open(TRIPS_FILE, 'w') as f:
        json.dump(trips, f, indent=2)

def save_contact_messages(contact_messages):
    with open(CONTACT_FILE, 'w') as f:
        json.dump(contact_messages, f, indent=2)

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)