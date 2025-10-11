from pydantic import BaseModel, Field, validator
from typing import Dict, Any, List, Optional
from datetime import datetime, date
from enum import Enum


class ComfortLevel(str, Enum):
    BUDGET = "budget"
    MID_RANGE = "mid_range"
    LUXURY = "luxury"


class TravelStyle(str, Enum):
    ADVENTURE = "adventure"
    RELAXATION = "relaxation"
    CULTURAL = "cultural"
    BUSINESS = "business"
    FAMILY = "family"
    SOLO = "solo"
    COUPLE = "couple"


# Request Schemas
class TripRequest(BaseModel):
    """Schema for trip planning requests"""
    destination: str = Field(..., min_length=2, max_length=255, description="Destination city or country")
    start_date: str = Field(..., description="Start date in YYYY-MM-DD format")
    end_date: str = Field(..., description="End date in YYYY-MM-DD format")
    budget: float = Field(..., gt=0, description="Total budget for the trip")
    travelers: int = Field(1, ge=1, le=20, description="Number of travelers")
    
    # Optional preferences
    preferences: Optional[Dict[str, Any]] = Field(default_factory=dict, description="User preferences")
    interests: Optional[List[str]] = Field(default_factory=list, description="List of interests")
    comfort_level: Optional[ComfortLevel] = Field(ComfortLevel.MID_RANGE, description="Comfort level preference")
    travel_style: Optional[TravelStyle] = Field(TravelStyle.CULTURAL, description="Travel style preference")
    
    @validator('start_date', 'end_date')
    def validate_date_format(cls, v):
        try:
            datetime.strptime(v, '%Y-%m-%d')
            return v
        except ValueError:
            raise ValueError('Date must be in YYYY-MM-DD format')
    
    @validator('end_date')
    def validate_end_after_start(cls, v, values):
        if 'start_date' in values:
            start = datetime.strptime(values['start_date'], '%Y-%m-%d')
            end = datetime.strptime(v, '%Y-%m-%d')
            if end <= start:
                raise ValueError('End date must be after start date')
        return v


class TripUpdateRequest(BaseModel):
    """Schema for updating existing trips"""
    destination: Optional[str] = Field(None, min_length=2, max_length=255)
    start_date: Optional[str] = Field(None)
    end_date: Optional[str] = Field(None)
    budget: Optional[float] = Field(None, gt=0)
    travelers: Optional[int] = Field(None, ge=1, le=20)
    preferences: Optional[Dict[str, Any]] = Field(None)


class FeedbackRequest(BaseModel):
    """Schema for user feedback"""
    trip_id: int = Field(..., description="ID of the trip")
    rating: Optional[int] = Field(None, ge=1, le=5, description="Rating from 1-5")
    feedback_text: Optional[str] = Field(None, max_length=1000, description="Text feedback")
    feedback_type: Optional[str] = Field("general", description="Type of feedback")


# Response Schemas
class TripResponse(BaseModel):
    """Schema for trip responses"""
    id: int
    destination: str
    start_date: str
    end_date: str
    budget: float
    travelers: int
    plan: Optional[str] = None
    itinerary: Optional[str] = None
    cost_breakdown: Optional[str] = None
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class TripDetailResponse(TripResponse):
    """Extended trip response with additional details"""
    weather_data: Optional[str] = None
    flight_data: Optional[str] = None
    hotel_data: Optional[str] = None
    preferences: Optional[str] = None
    updated_at: Optional[datetime] = None
    is_active: Optional[bool] = None
    user_id: Optional[str] = None
    session_id: Optional[str] = None


class HealthResponse(BaseModel):
    """Schema for health check responses"""
    status: str
    timestamp: str
    version: str
    system: Dict[str, Any]


class PlanningStatusResponse(BaseModel):
    """Schema for planning status responses"""
    task_id: str
    status: str
    progress: int
    estimated_completion: Optional[str] = None


class CostBreakdownResponse(BaseModel):
    """Schema for cost breakdown responses"""
    breakdown: Dict[str, float]
    total_cost: float
    cost_per_person: float
    cost_per_day: float
    travelers: int
    currency: str = "USD"
    calculated_at: str


class ItineraryDayResponse(BaseModel):
    """Schema for individual itinerary day"""
    day: int
    date: str
    morning: Dict[str, Any]
    afternoon: Dict[str, Any]
    evening: Dict[str, Any]
    meals: Dict[str, Any]
    transportation: Dict[str, Any]
    daily_total: float


class ItineraryResponse(BaseModel):
    """Schema for complete itinerary"""
    destination: str
    duration_days: int
    itinerary: List[ItineraryDayResponse]
    cost_breakdown: CostBreakdownResponse
    budget_compliance: Dict[str, Any]
    created_at: str


class RecommendationResponse(BaseModel):
    """Schema for recommendations"""
    title: str
    description: str
    category: str
    priority: Optional[int] = None


class PackingListResponse(BaseModel):
    """Schema for packing list"""
    clothing: List[str]
    electronics: List[str]
    toiletries: List[str]
    documents: List[str]
    miscellaneous: List[str]


class TripSummaryResponse(BaseModel):
    """Schema for complete trip summary"""
    summary: str
    itinerary: List[ItineraryDayResponse]
    cost_breakdown: CostBreakdownResponse
    recommendations: List[RecommendationResponse]
    packing_list: PackingListResponse
    trip_overview: Dict[str, Any]


# Error Schemas
class ErrorResponse(BaseModel):
    """Schema for error responses"""
    error: str
    detail: str
    timestamp: str
    request_id: Optional[str] = None


class ValidationErrorResponse(BaseModel):
    """Schema for validation error responses"""
    error: str = "Validation Error"
    details: List[Dict[str, Any]]
    timestamp: str


# Statistics Schemas
class TripStatsResponse(BaseModel):
    """Schema for trip statistics"""
    total_trips: int
    total_destinations: int
    average_budget: float
    most_popular_destination: str
    average_trip_duration: float
    total_travelers: int


class APIStatsResponse(BaseModel):
    """Schema for API statistics"""
    total_requests: int
    successful_requests: int
    failed_requests: int
    average_response_time: float
    most_used_endpoint: str
    requests_per_hour: float
