from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime

Base = declarative_base()


class Trip(Base):
    """
    Database model for storing trip information
    """
    __tablename__ = "trips"
    
    id = Column(Integer, primary_key=True, index=True)
    destination = Column(String(255), nullable=False, index=True)
    start_date = Column(String(20), nullable=False)  # YYYY-MM-DD format
    end_date = Column(String(20), nullable=False)   # YYYY-MM-DD format
    budget = Column(Float, nullable=False)
    travelers = Column(Integer, default=1)
    
    # Trip plan data
    plan = Column(Text, nullable=True)  # JSON string of the complete plan
    itinerary = Column(Text, nullable=True)  # JSON string of day-by-day itinerary
    cost_breakdown = Column(Text, nullable=True)  # JSON string of cost details
    
    # Research data
    weather_data = Column(Text, nullable=True)  # JSON string of weather info
    flight_data = Column(Text, nullable=True)  # JSON string of flight options
    hotel_data = Column(Text, nullable=True)  # JSON string of hotel options
    
    # User preferences
    preferences = Column(Text, nullable=True)  # JSON string of user preferences
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    
    # User information
    user_id = Column(String(255), nullable=True, index=True)  # For future user system
    session_id = Column(String(255), nullable=True, index=True)  # For session tracking
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": self.id,
            "destination": self.destination,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "budget": self.budget,
            "travelers": self.travelers,
            "plan": self.plan,
            "itinerary": self.itinerary,
            "cost_breakdown": self.cost_breakdown,
            "weather_data": self.weather_data,
            "flight_data": self.flight_data,
            "hotel_data": self.hotel_data,
            "preferences": self.preferences,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "is_active": self.is_active,
            "user_id": self.user_id,
            "session_id": self.session_id
        }


class UserFeedback(Base):
    """
    Database model for storing user feedback
    """
    __tablename__ = "user_feedback"
    
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, nullable=False, index=True)
    
    # Feedback content
    rating = Column(Integer, nullable=True)  # 1-5 scale
    feedback_text = Column(Text, nullable=True)
    feedback_type = Column(String(50), default="general")  # general, itinerary, cost, etc.
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(String(255), nullable=True, index=True)
    session_id = Column(String(255), nullable=True, index=True)
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": self.id,
            "trip_id": self.trip_id,
            "rating": self.rating,
            "feedback_text": self.feedback_text,
            "feedback_type": self.feedback_type,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "user_id": self.user_id,
            "session_id": self.session_id
        }


class ConversationSession(Base):
    """
    Database model for tracking conversation sessions
    """
    __tablename__ = "conversation_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), unique=True, nullable=False, index=True)
    
    # Session metadata
    user_id = Column(String(255), nullable=True, index=True)
    destination = Column(String(255), nullable=True, index=True)
    trip_id = Column(Integer, nullable=True, index=True)
    
    # Session statistics
    total_messages = Column(Integer, default=0)
    session_duration_minutes = Column(Float, nullable=True)
    
    # Timestamps
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True)
    last_activity = Column(DateTime(timezone=True), server_default=func.now())
    
    # Session data
    session_data = Column(Text, nullable=True)  # JSON string of session metadata
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": self.id,
            "session_id": self.session_id,
            "user_id": self.user_id,
            "destination": self.destination,
            "trip_id": self.trip_id,
            "total_messages": self.total_messages,
            "session_duration_minutes": self.session_duration_minutes,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "ended_at": self.ended_at.isoformat() if self.ended_at else None,
            "last_activity": self.last_activity.isoformat() if self.last_activity else None,
            "session_data": self.session_data
        }


class APIUsage(Base):
    """
    Database model for tracking API usage
    """
    __tablename__ = "api_usage"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # API call details
    endpoint = Column(String(255), nullable=False, index=True)
    method = Column(String(10), nullable=False)  # GET, POST, etc.
    status_code = Column(Integer, nullable=False)
    response_time_ms = Column(Float, nullable=True)
    
    # Request details
    user_id = Column(String(255), nullable=True, index=True)
    session_id = Column(String(255), nullable=True, index=True)
    ip_address = Column(String(45), nullable=True)  # IPv6 compatible
    
    # Timestamps
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Additional metadata
    request_size_bytes = Column(Integer, nullable=True)
    response_size_bytes = Column(Integer, nullable=True)
    error_message = Column(Text, nullable=True)
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": self.id,
            "endpoint": self.endpoint,
            "method": self.method,
            "status_code": self.status_code,
            "response_time_ms": self.response_time_ms,
            "user_id": self.user_id,
            "session_id": self.session_id,
            "ip_address": self.ip_address,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "request_size_bytes": self.request_size_bytes,
            "response_size_bytes": self.response_size_bytes,
            "error_message": self.error_message
        }
