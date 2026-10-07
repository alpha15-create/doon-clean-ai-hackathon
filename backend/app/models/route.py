from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Route(Base):
    __tablename__ = "routes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    route_code = Column(String(30), unique=True, index=True, nullable=False)  # ROUTE-1001
    team_id = Column(String(36), ForeignKey("collection_teams.id", ondelete="CASCADE"), nullable=False, index=True)

    total_stops = Column(Integer, default=0, nullable=False)
    estimated_distance_km = Column(Float, default=0.0)
    estimated_time_minutes = Column(Integer, default=0)
    co2_saved_kg = Column(Float, default=0.0)
    status = Column(String(30), default="Generated")  # Generated, In Progress, Completed

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    team = relationship("CollectionTeam", back_populates="routes")
    stops = relationship("RouteStop", back_populates="route", cascade="all, delete-orphan", order_by="RouteStop.stop_order")
