from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.dependencies import get_optional_current_user
from app.models.user import User
from app.services.notification_service import notification_service
from app.utils.helpers import api_response

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("")
def get_notifications(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.id if current_user else None
    notifs = notification_service.get_notifications(db, user_id)
    return api_response(notifs)
