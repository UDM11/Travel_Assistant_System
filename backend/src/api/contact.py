from fastapi import APIRouter, HTTPException
from src.models.contact import ContactMessage
from src.storage.contact_storage import ContactStorage

router = APIRouter()
storage = ContactStorage()

@router.post("/contact")
async def submit_contact_message(message: ContactMessage):
    """Store contact message"""
    try:
        message_record = storage.add_message(
            name=message.name,
            email=message.email,
            message=message.message
        )
        
        return {
            "success": True,
            "message": "Message sent successfully!",
            "id": message_record["id"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save message: {str(e)}")

@router.get("/contact/messages")
async def get_contact_messages():
    """Get all contact messages (admin endpoint)"""
    return {
        "messages": storage.get_all_messages(),
        "total": storage.get_message_count()
    }