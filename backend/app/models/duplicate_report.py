from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from app.database.database import Base

class DuplicateReport(Base):
    __tablename__ = "duplicate_reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    primary_report_id = Column(String(36), ForeignKey("reports.id", ondelete="CASCADE"), nullable=False, index=True)
    duplicate_report_id = Column(String(36), ForeignKey("reports.id", ondelete="CASCADE"), nullable=False, index=True)

    distance_meters = Column(Float, nullable=False)
    time_diff_hours = Column(Float, nullable=False)
    similarity_score = Column(Float, default=0.85)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
