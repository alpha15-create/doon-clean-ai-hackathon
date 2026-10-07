from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database.database import Base

class WasteAnalysis(Base):
    __tablename__ = "waste_analysis"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    report_id = Column(String(36), ForeignKey("reports.id", ondelete="CASCADE"), unique=True, nullable=False)

    waste_type = Column(String(100), nullable=False)
    confidence = Column(Integer, default=90, nullable=False)
    detected_count = Column(Integer, default=1)
    estimated_quantity = Column(String(100), default="Medium (~60 kg)")
    severity = Column(String(20), default="High", nullable=False)
    priority_score = Column(Integer, default=80, nullable=False)
    hazard_level = Column(String(30), default="Medium")
    recyclable = Column(Boolean, default=True)
    detected_items = Column(Text, default="[]")  # JSON encoded list of detected item tags
    recommendation = Column(Text, nullable=True)
    ai_model = Column(String(50), default="mock_yolov8_ensemble")

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    report = relationship("Report", back_populates="analysis")
