from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="citizen", nullable=False)  # citizen, admin, collector
    avatar = Column(String(500), nullable=True)
    points = Column(String(20), default="50", nullable=True)
    level = Column(String(100), default="Eco Contributor (Level 1)", nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    reports = relationship("Report", back_populates="citizen", foreign_keys="Report.user_id")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
