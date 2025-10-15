from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.schemas import TripRequest, TripResponse
from app.services.trip_service import TripService
from app.core.utils.logger import app_logger
from app.core.utils.helpers import create_response

router = APIRouter(prefix="/trip", tags=["trips"])
trip_service = TripService()

@router.post("/plan", response_model=dict)
async def plan_trip(request: TripRequest):
    """Plan a complete trip with AI agents"""
    try:
        app_logger.info(f"Planning trip to {request.destination}")
        
        # Plan the trip using the trip service
        trip_data = await trip_service.plan_trip(request)
        
        app_logger.info(f"Trip planned successfully with ID: {trip_data['id']}")
        return create_response(success=True, data=trip_data, message="Trip planned successfully")
        
    except Exception as e:
        app_logger.error(f"Trip planning error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Trip planning failed: {str(e)}")

@router.get("/", response_model=dict)
async def get_all_trips():
    """Get all planned trips"""
    try:
        trips = await trip_service.get_all_trips()
        return create_response(success=True, data={"trips": trips, "total": len(trips)})
        
    except Exception as e:
        app_logger.error(f"Error fetching trips: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch trips")

@router.get("/{trip_id}", response_model=dict)
async def get_trip(trip_id: int):
    """Get a specific trip by ID"""
    try:
        trip = await trip_service.get_trip_by_id(trip_id)
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")
        
        return create_response(success=True, data=trip)
        
    except HTTPException:
        raise
    except Exception as e:
        app_logger.error(f"Error fetching trip {trip_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch trip")

@router.delete("/{trip_id}", response_model=dict)
async def delete_trip(trip_id: int):
    """Delete a trip"""
    try:
        success = await trip_service.delete_trip(trip_id)
        if not success:
            raise HTTPException(status_code=404, detail="Trip not found")
        
        return create_response(success=True, message="Trip deleted successfully")
        
    except HTTPException:
        raise
    except Exception as e:
        app_logger.error(f"Error deleting trip {trip_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete trip")

@router.put("/{trip_id}", response_model=dict)
async def update_trip(trip_id: int, request: TripRequest):
    """Update an existing trip"""
    try:
        updated_trip = await trip_service.update_trip(trip_id, request)
        if not updated_trip:
            raise HTTPException(status_code=404, detail="Trip not found")
        
        return create_response(success=True, data=updated_trip, message="Trip updated successfully")
        
    except HTTPException:
        raise
    except Exception as e:
        app_logger.error(f"Error updating trip {trip_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update trip")