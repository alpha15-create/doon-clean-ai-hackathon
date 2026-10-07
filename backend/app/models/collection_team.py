from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Float, DateTime
from sqlalchemy.orm import relationship
from app.database.database import Base

class CollectionTeam(Base):
    __tablename__ = "collection_teams"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    zone = Column(String(100), nullable=False)
    leader = Column(String(100), nullable=False)
    contact = Column(String(30), nullable=False)
    vehicle = Column(String(100), nullable=False)
    status = Column(String(30), default="Available", nullable=False)  # Available, In Transit, Busy, Offline
    capacity = Column(String(30), default="60%")
    current_latitude = Column(Float, nullable=True)
    current_longitude = Column(Float, nullable=True)
    avatar = Column(String(10), default="🚚")

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    reports = relationship("Report", back_populates="assigned_team")
    tasks = relationship("CollectionTask", back_populates="team", cascade="all, delete-orphan")
    routes = relationship("Route", back_populates="team", cascade="all, delete-orphan")
