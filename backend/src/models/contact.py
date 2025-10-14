from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ContactMessage(BaseModel):
    name: str
    email: str
    message: str

class ContactMessageResponse(BaseModel):
    id: int
    name: str
    email: str
    message: str
    created_at: str
    status: str = "new"