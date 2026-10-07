from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    report_code = Column(String(20), unique=True, index=True, nullable=False)  # DWN-1001
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=False)
    storage_path = Column(String(500), nullable=True)

    # Geographic location
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    landmark = Column(String(200), nullable=True)
    address = Column(String(300), nullable=True)
    zone = Column(String(50), default="Central", nullable=False)  # Central, North, South, East, West, South-East

    # Lifecycle & Urgency
    status = Column(String(30), default="Reported", index=True, nullable=False)  # Reported, AI Analyzed, Verified, Assigned, In Progress, Resolved, Rejected
    waste_type = Column(String(100), default="Plastic Waste", nullable=False)
    ai_confidence = Column(Integer, default=90)
    severity = Column(String(20), default="High", nullable=False)  # Low, Medium, High, Critical
    estimated_quantity = Column(String(100), default="Medium (~60 kg)")
    priority_score = Column(Integer, default=80, index=True, nullable=False)

    # Duplication check
    is_duplicate = Column(Boolean, default=False)
    duplicate_count = Column(Integer, default=0)

    # Fleet assignment
    assigned_team_id = Column(String(36), ForeignKey("collection_teams.id", ondelete="SET NULL"), nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    verified_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)

    # Relationships
    citizen = relationship("User", back_populates="reports", foreign_keys=[user_id])
    assigned_team = relationship("CollectionTeam", back_populates="reports")
    analysis = relationship("WasteAnalysis", back_populates="report", uselist=False, cascade="all, delete-orphan")
    tasks = relationship("CollectionTask", back_populates="report", cascade="all, delete-orphan")
    route_stops = relationship("RouteStop", back_populates="report")
