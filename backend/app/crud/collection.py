from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.collection_team import CollectionTeam
from app.models.collection_task import CollectionTask
from app.models.report import Report

def get_all_teams(db: Session) -> List[CollectionTeam]:
    return db.query(CollectionTeam).all()

def get_team_by_id(db: Session, team_id: str) -> Optional[CollectionTeam]:
    return db.query(CollectionTeam).filter(CollectionTeam.id == team_id).first()

def get_collector_tasks(db: Session, team_id: Optional[str] = None) -> List[Report]:
    query = db.query(Report)
    if team_id:
        query = query.filter(Report.assigned_team_id == team_id)
    else:
        query = query.filter(Report.status.in_(["Assigned", "In Progress", "Resolved"]))
    return query.order_by(Report.created_at.desc()).all()

def create_or_update_task(db: Session, report_id: str, team_id: str, notes: str = "") -> CollectionTask:
    task = db.query(CollectionTask).filter(
        CollectionTask.report_id == report_id,
        CollectionTask.team_id == team_id
    ).first()
    if not task:
        task = CollectionTask(
            report_id=report_id,
            team_id=team_id,
            status="Assigned",
            notes=notes
        )
        db.add(task)
    else:
        task.status = "Assigned"
        task.notes = notes
    db.commit()
    db.refresh(task)
    return task

def update_task_status(db: Session, task_id: str, status: str, notes: Optional[str] = None) -> Optional[CollectionTask]:
    task = db.query(CollectionTask).filter(CollectionTask.id == task_id).first()
    if not task:
        return None
    task.status = status
    if notes:
        task.notes = notes
    if status.lower() in ["collected", "completed", "resolved"]:
        task.completed_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(task)
    return task
