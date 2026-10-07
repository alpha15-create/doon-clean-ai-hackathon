from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import hash_password

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email.strip().lower()).first()

def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def create_user(
    db: Session,
    name: str,
    email: str,
    password: str,
    phone: Optional[str] = None,
    role: str = "citizen"
) -> User:
    user = User(
        name=name.strip(),
        email=email.strip().lower(),
        phone=phone.strip() if phone else None,
        password_hash=hash_password(password),
        role=role,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
