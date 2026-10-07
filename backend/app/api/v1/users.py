from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.dependencies import get_current_user, require_admin
from app.models.user import User
from app.utils.helpers import api_response

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("")
def list_users(
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    users = db.query(User).all()
    formatted = [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "isActive": u.is_active,
            "createdAt": u.created_at.isoformat()
        }
        for u in users
    ]
    return api_response(formatted)
