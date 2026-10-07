from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database.database import Base

class CollectionTask(Base):
    __tablename__ = "collection_tasks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    report_id = Column(String(36), ForeignKey("reports.id", ondelete="CASCADE"), nullable=False, index=True)
    team_id = Column(String(36), ForeignKey("collection_teams.id", ondelete="CASCADE"), nullable=False, index=True)

    status = Column(String(30), default="Assigned", nullable=False)  # Assigned, Accepted, In Progress, Collected, Resolved
    notes = Column(Text, nullable=True)

    assigned_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    completed_at = Column(DateTime, nullable=True)

    report = relationship("Report", back_populates="tasks")
    team = relationship("CollectionTeam", back_populates="tasks")
