from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import datetime

from app.config import settings
from app.models.schemas import ContactMessage, LoginRequest, RegisterRequest
from app.services.database import load_data, save_contact_messages, save_users
from app.services.travel_service import TravelService
from app.api.routes.trip_routes import router as trip_router

app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

# Initialize travel service
travel_service = TravelService()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trip_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": settings.PROJECT_NAME, "version": settings.VERSION, "status": "running"}

@app.post("/api/v1/contact")
async def submit_contact_message(message: ContactMessage):
    _, contact_messages, _ = load_data()
    message_record = {
        "id": len(contact_messages) + 1,
        "name": message.name,
        "email": message.email,
        "message": message.message,
        "created_at": datetime.utcnow().isoformat(),
        "status": "new"
    }
    contact_messages.append(message_record)
    save_contact_messages(contact_messages)
    return {"success": True, "message": "Message sent successfully!", "id": message_record["id"]}

@app.get("/api/v1/contact/messages")
async def get_contact_messages():
    _, contact_messages, _ = load_data()
    return {"success": True, "data": {"messages": contact_messages, "total": len(contact_messages)}}

@app.post("/api/v1/auth/login")
async def login(request: LoginRequest):
    try:
        _, _, users = load_data()
        user = next((u for u in users if u["email"] == request.email), None)
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        if user["password"] != request.password:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        return {
            "success": True,
            "message": "Login successful",
            "user": {
                "id": user["id"],
                "email": user["email"],
                "name": user["name"]
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Login failed")

@app.post("/api/v1/auth/register")
async def register(request: RegisterRequest):
    try:
        _, _, users = load_data()
        if any(u["email"] == request.email for u in users):
            raise HTTPException(status_code=400, detail="Email already registered")
        
        new_user = {
            "id": len(users) + 1,
            "email": request.email,
            "password": request.password,
            "name": request.name,
            "created_at": datetime.utcnow().isoformat()
        }
        
        users.append(new_user)
        save_users(users)
        
        return {
            "success": True,
            "message": "Registration successful",
            "user": {
                "id": new_user["id"],
                "email": new_user["email"],
                "name": new_user["name"]
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Registration failed")

@app.post("/api/v1/plan-trip")
async def plan_trip(trip_request: dict):
    try:
        result = await travel_service.plan_trip(trip_request)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

if __name__ == "__main__":
    print(f"Travel Assistant API starting on http://{settings.HOST}:{settings.PORT}")
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)