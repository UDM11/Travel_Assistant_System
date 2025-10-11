from fastapi import APIRouter
from app.api.v1.endpoints import health, plan, trips

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(plan.router, prefix="/plan", tags=["planning"])
api_router.include_router(trips.router, prefix="/trips", tags=["trips"])
