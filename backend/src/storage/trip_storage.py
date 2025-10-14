import json
import os
from typing import List, Dict
from datetime import datetime

class TripStorage:
    def __init__(self, file_path: str = "trips.json"):
        self.file_path = file_path
        self.trips: List[Dict] = []
        self.load_trips()
    
    def load_trips(self):
        """Load trips from JSON file"""
        if os.path.exists(self.file_path):
            try:
                with open(self.file_path, 'r') as f:
                    self.trips = json.load(f)
            except:
                self.trips = []
    
    def save_trips(self):
        """Save trips to JSON file"""
        with open(self.file_path, 'w') as f:
            json.dump(self.trips, f, indent=2)
    
    def add_trip(self, trip_data: Dict) -> Dict:
        """Add a new trip"""
        trip_record = {
            "id": len(self.trips) + 1,
            **trip_data,
            "created_at": datetime.utcnow().isoformat()
        }
        
        self.trips.append(trip_record)
        self.save_trips()
        return trip_record
    
    def get_all_trips(self) -> List[Dict]:
        """Get all trips"""
        return sorted(self.trips, key=lambda x: x['created_at'], reverse=True)
    
    def get_trip_by_id(self, trip_id: int) -> Dict:
        """Get trip by ID"""
        for trip in self.trips:
            if trip['id'] == trip_id:
                return trip
        return None