from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.trip import Trip
from app.schemas.trip import TripResponse

router = APIRouter()


@router.get("/", response_model=List[TripResponse])
async def get_trips(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all saved trips with pagination
    """
    try:
        trips = db.query(Trip).offset(skip).limit(limit).all()
        return [
            TripResponse(
                id=trip.id,
                destination=trip.destination,
                start_date=trip.start_date,
                end_date=trip.end_date,
                budget=trip.budget,
                plan=trip.plan,
                cost_breakdown=trip.cost_breakdown,
                created_at=trip.created_at
            )
            for trip in trips
        ]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve trips: {str(e)}"
        )


@router.get("/{trip_id}", response_model=TripResponse)
async def get_trip(
    trip_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific trip by ID
    """
    try:
        trip = db.query(Trip).filter(Trip.id == trip_id).first()
        if not trip:
            raise HTTPException(
                status_code=404,
                detail="Trip not found"
            )
        
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
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve trip: {str(e)}"
        )


@router.delete("/{trip_id}")
async def delete_trip(
    trip_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a specific trip
    """
    try:
        trip = db.query(Trip).filter(Trip.id == trip_id).first()
        if not trip:
            raise HTTPException(
                status_code=404,
                detail="Trip not found"
            )
        
        db.delete(trip)
        db.commit()
        
        return {"message": "Trip deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete trip: {str(e)}"
        )
