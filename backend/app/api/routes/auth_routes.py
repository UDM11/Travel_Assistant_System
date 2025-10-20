from fastapi import APIRouter, HTTPException
from datetime import datetime
import hashlib
from app.models.user_model import User, UserResponse
from app.services.database import load_data, save_users

router = APIRouter()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@router.post("/auth/signup")
async def signup(user_data: dict):
    _, _, users = load_data()
    
    # Check if user already exists
    for existing_user in users:
        if existing_user["email"] == user_data["email"]:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    new_user = {
        "id": len(users) + 1,
        "name": user_data["name"],
        "email": user_data["email"],
        "password": hash_password(user_data["password"]),
        "created_at": datetime.utcnow().isoformat(),
        "is_active": True
    }
    
    users.append(new_user)
    save_users(users)
    
    return {
        "success": True,
        "message": "Account created successfully",
        "data": {
            "id": new_user["id"],
            "name": new_user["name"],
            "email": new_user["email"],
            "created_at": new_user["created_at"]
        }
    }

@router.post("/auth/login")
async def login(login_data: dict):
    _, _, users = load_data()
    
    hashed_password = hash_password(login_data["password"])
    
    for user in users:
        if user["email"] == login_data["email"] and user["password"] == hashed_password:
            return {
                "success": True,
                "message": "Login successful",
                "data": {
                    "id": user["id"],
                    "name": user["name"],
                    "email": user["email"],
                    "created_at": user["created_at"]
                }
            }
    
    raise HTTPException(status_code=401, detail="Invalid email or password")

@router.get("/auth/users")
async def get_users():
    _, _, users = load_data()
    
    # Return users without passwords
    safe_users = []
    for user in users:
        safe_users.append({
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "created_at": user["created_at"],
            "is_active": user["is_active"]
        })
    
    return {"success": True, "data": safe_users}