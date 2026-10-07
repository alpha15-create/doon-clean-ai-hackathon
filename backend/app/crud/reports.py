from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.report import Report
from app.models.collection_team import CollectionTeam

def get_report_by_id(db: Session, report_id: str) -> Optional[Report]:
    # Support lookup either by UUID or report_code (e.g. DWN-1001)
    return db.query(Report).filter(
        (Report.id == report_id) | (Report.report_code == report_id)
    ).first()

def get_reports(
    db: Session,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    waste_type: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100
) -> List[Report]:
    query = db.query(Report)

    if status and status.lower() != "all":
        query = query.filter(Report.status.ilike(status))
    if priority and priority.lower() != "all":
        query = query.filter(Report.severity.ilike(priority))
    if waste_type and waste_type.lower() != "all":
        query = query.filter(Report.waste_type.ilike(f"%{waste_type}%"))
    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            (Report.report_code.ilike(s)) |
            (Report.title.ilike(s)) |
            (Report.landmark.ilike(s)) |
            (Report.address.ilike(s)) |
            (Report.waste_type.ilike(s))
        )

    return query.order_by(desc(Report.created_at)).limit(limit).all()

def get_user_reports(db: Session, user_id: str) -> List[Report]:
    return db.query(Report).filter(
        Report.user_id == user_id
    ).order_by(desc(Report.created_at)).all()

def create_report(db: Session, report_data: dict) -> Report:
    report = Report(**report_data)
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

def update_report_status(db: Session, report: Report, new_status: str, note: str = "") -> Report:
    report.status = new_status
    report.updated_at = datetime.now(timezone.utc)
    if new_status.lower() == "verified":
        report.verified_at = datetime.now(timezone.utc)
    elif new_status.lower() == "resolved":
        report.resolved_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(report)
    return report

def update_report_priority(db: Session, report: Report, severity: str, priority_score: Optional[int] = None) -> Report:
    report.severity = severity
    if priority_score is not None:
        report.priority_score = priority_score
    report.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(report)
    return report

def assign_report_team(db: Session, report: Report, team_id: str) -> Report:
    report.assigned_team_id = team_id
    report.status = "Assigned"
    report.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(report)
    return report
