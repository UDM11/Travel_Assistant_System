from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
import asyncio
from datetime import datetime

from app.agents.orchestrator import TripOrchestrator
from app.schemas.trip import TripRequest, TripResponse
from app.db.session import get_db
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/trip", response_model=TripResponse)
async def plan_trip(
    request: TripRequest,
    db: Session = Depends(get_db)
):
    """
    Generate a complete trip plan using AI agents
    """
    try:
        # Initialize orchestrator
        orchestrator = TripOrchestrator()
        
        # Execute the planning pipeline
        result = await orchestrator.plan_trip(
            destination=request.destination,
            start_date=request.start_date,
            end_date=request.end_date,
            budget=request.budget,
            preferences=request.preferences,
            travelers=request.travelers
        )
        
        # Save to database
        trip_data = {
            "destination": request.destination,
            "start_date": request.start_date,
            "end_date": request.end_date,
            "budget": request.budget,
            "plan": result["plan"],
            "cost_breakdown": result["cost_breakdown"],
            "created_at": datetime.utcnow()
        }
        
        # Create trip record
        from app.models.trip import Trip
        trip = Trip(**trip_data)
        db.add(trip)
        db.commit()
        db.refresh(trip)
        
        return TripResponse(
            id=trip.id,
            destination=trip.destination,
            start_date=trip.start_date,
            end_date=trip.end_date,
            budget=trip.budget,
            plan=trip.plan,
            cost_breakdown=trip.cost_breakdown,
            created_at=trip.created_at
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to plan trip: {str(e)}"
        )


@router.get("/status/{task_id}")
async def get_planning_status(task_id: str):
    """
    Get the status of a trip planning task
    """
    # This would integrate with a task queue like Celery
    # For now, return a simple status
    return {
        "task_id": task_id,
        "status": "completed",
        "progress": 100
    }
