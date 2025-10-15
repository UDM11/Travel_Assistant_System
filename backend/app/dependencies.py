from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import jwt
from app.config import settings

security = HTTPBearer(auto_error=False)

async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    """Optional authentication dependency"""
    if not credentials:
        return None
    
    try:
        # Decode JWT token (implement as needed)
        payload = jwt.decode(credentials.credentials, "secret", algorithms=["HS256"])
        return payload.get("sub")
    except jwt.PyJWTError:
        return None

def require_auth(user = Depends(get_current_user)):
    """Require authentication"""
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    return user