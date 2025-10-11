from sqlalchemy.orm import Session
from app.db.session import create_tables, engine
from app.models.trip import Base, Trip, UserFeedback, ConversationSession, APIUsage
from app.memory.vectorstore import VectorStore
import logging

logger = logging.getLogger(__name__)


def init_db():
    """
    Initialize database with tables and sample data
    """
    try:
        # Create all tables
        create_tables()
        logger.info("✅ Database tables created successfully")
        
        # Initialize vector store with sample data
        vector_store = VectorStore()
        vector_store.initialize_sample_data()
        
        logger.info("✅ Database initialization completed")
        
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {str(e)}")
        raise e


def create_sample_trip(db: Session) -> Trip:
    """
    Create a sample trip for testing
    """
    try:
        sample_trip = Trip(
            destination="Paris",
            start_date="2024-06-01",
            end_date="2024-06-07",
            budget=2500.0,
            travelers=2,
            plan='{"summary": "7-day trip to Paris with cultural highlights and fine dining"}',
            itinerary='[{"day": 1, "morning": {"activities": ["Visit Eiffel Tower"], "cost": 25}}]',
            cost_breakdown='{"total_cost": 2400, "breakdown": {"flights": 800, "hotels": 700, "meals": 600, "activities": 300}}',
            preferences='{"interests": ["culture", "food"], "comfort_level": "mid_range"}',
            user_id="sample_user",
            session_id="sample_session"
        )
        
        db.add(sample_trip)
        db.commit()
        db.refresh(sample_trip)
        
        logger.info(f"✅ Sample trip created with ID: {sample_trip.id}")
        return sample_trip
        
    except Exception as e:
        logger.error(f"❌ Failed to create sample trip: {str(e)}")
        db.rollback()
        raise e


def cleanup_old_sessions(db: Session, days_old: int = 30):
    """
    Clean up old conversation sessions
    """
    try:
        from datetime import datetime, timedelta
        
        cutoff_date = datetime.utcnow() - timedelta(days=days_old)
        
        # Delete old sessions
        old_sessions = db.query(ConversationSession).filter(
            ConversationSession.last_activity < cutoff_date
        ).delete()
        
        db.commit()
        
        logger.info(f"✅ Cleaned up {old_sessions} old conversation sessions")
        return old_sessions
        
    except Exception as e:
        logger.error(f"❌ Failed to cleanup old sessions: {str(e)}")
        db.rollback()
        raise e


def get_database_stats(db: Session) -> dict:
    """
    Get database statistics
    """
    try:
        stats = {
            "trips": db.query(Trip).count(),
            "user_feedback": db.query(UserFeedback).count(),
            "conversation_sessions": db.query(ConversationSession).count(),
            "api_usage": db.query(APIUsage).count(),
            "active_trips": db.query(Trip).filter(Trip.is_active == True).count()
        }
        
        return stats
        
    except Exception as e:
        logger.error(f"❌ Failed to get database stats: {str(e)}")
        return {"error": str(e)}
