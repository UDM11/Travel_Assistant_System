from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class User(BaseModel):
    id: Optional[int] = None
    name: str
    email: EmailStr
    password: str
    created_at: Optional[str] = None
    is_active: Optional[bool] = True
    
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: str
    is_active: bool
    
class UserPreferences(BaseModel):
    user_id: int
    budget_range: Optional[str] = "medium"
    travel_style: Optional[str] = "leisure"
    preferred_activities: Optional[List[str]] = []