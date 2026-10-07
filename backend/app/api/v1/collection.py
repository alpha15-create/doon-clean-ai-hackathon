from typing import Optional
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.crud.collection import get_all_teams, get_team_by_id, update_task_status
from app.crud.reports import get_report_by_id, assign_report_team, update_report_status
from app.services.report_service import report_service
from app.services.notification_service import notification_service
from app.utils.helpers import api_response, api_error_response
from app.schemas.collection import AssignTeamRequest

router = APIRouter(prefix="/collection", tags=["Collection"])

@router.get("")
def list_teams(db: Session = Depends(get_db)):
    teams = get_all_teams(db)
    formatted = [
        {
            "id": t.id,
            "name": t.name,
            "zone": t.zone,
            "leader": t.leader,
            "phone": t.contact,
            "vehicle": t.vehicle,
            "activeTasks": len(t.reports) if hasattr(t, "reports") else 2,
            "status": t.status,
            "capacity": t.capacity,
            "avatar": t.avatar
        }
        for t in teams
    ]
    return api_response(formatted)

@router.post("/assign")
async def assign_team(request: Request, db: Session = Depends(get_db)):
    body = await request.json()
    report_id = body.get("reportId") or body.get("report_id")
    team_id = body.get("teamId") or body.get("team_id")

    if not report_id or not team_id:
        return api_error_response("Both reportId and teamId are required", code="INVALID_PAYLOAD")

    report = get_report_by_id(db, report_id)
    if not report:
        return api_error_response(f"Report '{report_id}' not found", code="NOT_FOUND")

    team = get_team_by_id(db, team_id)
    if not team:
        return api_error_response(f"Team '{team_id}' not found", code="NOT_FOUND")

    updated = assign_report_team(db, report, team.id)

    notification_service.create_notification(
        db,
        title="Fleet Dispatched",
        message=f"Report {report.report_code} assigned to {team.name}.",
        notif_type="info",
        user_id=report.user_id,
        report_id=report.id
    )

    return api_response(report_service.format_report_response(updated), message="Team assigned successfully")

@router.put("/{id}/status")
async def update_collection_status(id: str, request: Request, db: Session = Depends(get_db)):
    body = await request.json()
    new_status = body.get("status", "In Progress")
    notes = body.get("notes") or body.get("note", "")

    # Check if id refers to a report
    report = get_report_by_id(db, id)
    if report:
        updated = update_report_status(db, report, new_status, notes)
        return api_response(report_service.format_report_response(updated), message="Status updated successfully")

    # Or check if id refers to a task
    task = update_task_status(db, id, new_status, notes)
    if task:
        return api_response({"taskId": task.id, "status": task.status}, message="Task status updated successfully")

    return api_error_response(f"Record with id '{id}' not found", code="NOT_FOUND")
