from typing import Optional
from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.core.security import decode_access_token
from app.core.exceptions import UnauthorizedException, ForbiddenException
from app.models.user import User

def get_token_from_header(authorization: Optional[str] = Header(None)) -> Optional[str]:
    if not authorization:
        return None
    parts = authorization.split()
    if len(parts) == 2 and parts[0].lower() == "bearer":
        return parts[1]
    return authorization

def get_current_user(
    token: Optional[str] = Depends(get_token_from_header),
    db: Session = Depends(get_db)
) -> User:
    if not token:
        raise UnauthorizedException("Authentication token required")
    
    # Handle mock tokens gracefully for hackathon demos if needed
    if token.startswith("mock_jwt_token_"):
        role_hint = token.replace("mock_jwt_token_", "").split("_")[0]
        # Look for matching role user in DB or create fallback
        user = db.query(User).filter(User.role == role_hint).first()
        if user:
            return user
        # Fallback to first user
        fallback = db.query(User).first()
        if fallback:
            return fallback

    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise UnauthorizedException("Invalid or expired authentication token")
    
    user_id = payload["sub"]
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise UnauthorizedException("User associated with token no longer exists")
    if not user.is_active:
        raise UnauthorizedException("User account is inactive")
    
    return user

def get_optional_current_user(
    token: Optional[str] = Depends(get_token_from_header),
    db: Session = Depends(get_db)
) -> Optional[User]:
    try:
        return get_current_user(token, db)
    except Exception:
        return None

def require_citizen(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role not in ["citizen", "admin"]:
        raise ForbiddenException("Access restricted to citizens")
    return current_user

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise ForbiddenException("Administrative privileges required")
    return current_user

def require_collector(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role not in ["collector", "admin"]:
        raise ForbiddenException("Access restricted to sanitation collectors")
    return current_user
