import json
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.waste_analysis import WasteAnalysis

def create_waste_analysis(db: Session, report_id: str, analysis_data: Dict[str, Any]) -> WasteAnalysis:
    items = analysis_data.get("detectedItems") or analysis_data.get("detected_items") or []
    analysis = WasteAnalysis(
        report_id=report_id,
        waste_type=analysis_data.get("wasteType") or analysis_data.get("waste_type") or "Plastic Waste",
        confidence=int(analysis_data.get("confidence", 90)),
        detected_count=int(analysis_data.get("detectedCount", 1)),
        estimated_quantity=analysis_data.get("estimatedQuantity") or analysis_data.get("estimated_quantity") or "Medium (~60 kg)",
        severity=analysis_data.get("severity") or "High",
        priority_score=int(analysis_data.get("priorityScore") or analysis_data.get("priority_score", 80)),
        hazard_level=analysis_data.get("hazardLevel") or "Medium",
        recyclable=analysis_data.get("recyclable", True),
        detected_items=json.dumps(items) if isinstance(items, list) else str(items),
        recommendation=analysis_data.get("recommendation", "Standard municipal collection.")
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis

def get_analysis_by_report_id(db: Session, report_id: str) -> Optional[WasteAnalysis]:
    return db.query(WasteAnalysis).filter(WasteAnalysis.report_id == report_id).first()
