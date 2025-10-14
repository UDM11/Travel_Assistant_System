import json
import os
from typing import List, Dict
from datetime import datetime

class ContactStorage:
    def __init__(self, file_path: str = "contact_messages.json"):
        self.file_path = file_path
        self.messages: List[Dict] = []
        self.load_messages()
    
    def load_messages(self):
        """Load messages from JSON file"""
        if os.path.exists(self.file_path):
            try:
                with open(self.file_path, 'r') as f:
                    self.messages = json.load(f)
            except:
                self.messages = []
    
    def save_messages(self):
        """Save messages to JSON file"""
        with open(self.file_path, 'w') as f:
            json.dump(self.messages, f, indent=2)
    
    def add_message(self, name: str, email: str, message: str) -> Dict:
        """Add a new contact message"""
        message_record = {
            "id": len(self.messages) + 1,
            "name": name,
            "email": email,
            "message": message,
            "created_at": datetime.utcnow().isoformat(),
            "status": "new"
        }
        
        self.messages.append(message_record)
        self.save_messages()
        return message_record
    
    def get_all_messages(self) -> List[Dict]:
        """Get all contact messages"""
        return self.messages
    
    def get_message_count(self) -> int:
        """Get total number of messages"""
        return len(self.messages)