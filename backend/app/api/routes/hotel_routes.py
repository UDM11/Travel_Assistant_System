"""
Hotel API Routes
RESTful endpoints for hotel search and integration with frontend.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from pydantic import BaseModel
from ...services.hotel_service import HotelService

router = APIRouter(prefix="/api/hotels", tags=["hotels"])
hotel_service = HotelService()

class HotelSearchRequest(BaseModel):
    destination: str
    check_in: Optional[str] = None
    check_out: Optional[str] = None
    travelers: int = 2
    rooms: int = 1

@router.get("/search")
async def search_hotels(
    destination: str = Query(..., description="Destination city"),
    check_in: Optional[str] = Query(None, description="Check-in date (YYYY-MM-DD)"),
    check_out: Optional[str] = Query(None, description="Check-out date (YYYY-MM-DD)"),
    travelers: int = Query(2, description="Number of travelers"),
):
    """Search for hotels in a destination."""
    try:
        result = await hotel_service.search_and_format_hotels(
            destination=destination,
            check_in=check_in,
            check_out=check_out,
            travelers=travelers
        )
        
        if result["success"]:
            return {
                "status": "success",
                "data": {
                    "hotels": result["hotels"],
                    "summary": result["summary"],
                    "total_found": len(result["hotels"]),
                    "api_source": result["api_source"]
                }
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hotel search failed: {str(e)}")

@router.get("/details/{hotel_id}")
async def get_hotel_details(hotel_id: str):
    """Get detailed information about a specific hotel."""
    try:
        result = await hotel_service.get_hotel_details_for_frontend(hotel_id)
        
        if result["success"]:
            return {
                "status": "success",
                "data": result["hotel"]
            }
        else:
            raise HTTPException(status_code=404, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get hotel details: {str(e)}")

@router.get("/recent")
async def get_recent_hotel_searches(limit: int = Query(5, description="Number of recent searches")):
    """Get recent hotel searches from trips."""
    try:
        recent_hotels = hotel_service.get_recent_hotel_searches(limit)
        return {
            "status": "success",
            "data": {
                "recent_searches": recent_hotels,
                "total": len(recent_hotels)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get recent searches: {str(e)}")

@router.put("/trips/{trip_id}/hotels")
async def update_trip_hotels(trip_id: int, hotel_data: dict):
    """Update a trip with hotel information."""
    try:
        success = hotel_service.update_trip_with_hotels(trip_id, hotel_data)
        
        if success:
            return {
                "status": "success",
                "message": f"Trip {trip_id} updated with hotel information"
            }
        else:
            raise HTTPException(status_code=404, detail="Trip not found or update failed")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update trip: {str(e)}")

@router.get("/summary/{destination}")
async def get_hotel_summary(
    destination: str,
    check_in: Optional[str] = Query(None),
    check_out: Optional[str] = Query(None)
):
    """Get hotel summary for a destination (for trip planning)."""
    try:
        result = await hotel_service.search_and_format_hotels(
            destination=destination,
            check_in=check_in,
            check_out=check_out,
            travelers=2
        )
        
        return {
            "status": "success",
            "data": {
                "summary": result["summary"],
                "api_source": result["api_source"]
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get hotel summary: {str(e)}")