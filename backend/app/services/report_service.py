from typing import Dict, Any, List
from app.models.report import Report

class ReportService:
    @staticmethod
    def format_report_response(report: Report) -> Dict[str, Any]:
        """Convert a SQLAlchemy Report instance into the exact JSON structure consumed by React."""
        timeline: List[Dict[str, str]] = []
        if report.created_at:
            timeline.append({
                "status": "reported",
                "time": report.created_at.isoformat(),
                "note": "Complaint submitted with geolocation and photo"
            })
            timeline.append({
                "status": "ai_analyzed",
                "time": report.created_at.isoformat(),
                "note": f"YOLO inference: {report.waste_type} ({report.ai_confidence}% confidence). Priority: {report.priority_score}/100."
            })
        if report.verified_at:
            timeline.append({
                "status": "verified",
                "time": report.verified_at.isoformat(),
                "note": "Sanitation Officer verified report validity"
            })
        if report.assigned_team:
            timeline.append({
                "status": "assigned",
                "time": report.updated_at.isoformat(),
                "note": f"Dispatched to {report.assigned_team.name}"
            })
        if report.status == "In Progress":
            timeline.append({
                "status": "in_progress",
                "time": report.updated_at.isoformat(),
                "note": "Sanitation vehicle arrived on-site"
            })
        elif report.status == "Resolved":
            timeline.append({
                "status": "resolved",
                "time": (report.resolved_at or report.updated_at).isoformat(),
                "note": "Waste collected and area cleared"
            })

        assigned_team_data = None
        if report.assigned_team:
            assigned_team_data = {
                "id": report.assigned_team.id,
                "name": report.assigned_team.name,
                "leader": report.assigned_team.leader
            }

        citizen_data = None
        if report.citizen:
            citizen_data = {
                "id": report.citizen.id,
                "name": report.citizen.name,
                "phone": report.citizen.phone,
                "email": report.citizen.email
            }
        else:
            citizen_data = {
                "id": "usr_default",
                "name": "Citizen User",
                "phone": "+91 98765 43210",
                "email": "citizen@doonclean.ai"
            }

        return {
            "id": report.report_code or report.id,
            "_uuid": report.id,
            "title": report.title,
            "description": report.description or "No description provided.",
            "imageUrl": report.image_url,
            "wasteType": report.waste_type,
            "aiConfidence": report.ai_confidence or 92,
            "severity": report.severity or "High",
            "estimatedQuantity": report.estimated_quantity or "Medium (~60 kg)",
            "priorityScore": report.priority_score or 80,
            "status": report.status,
            "location": {
                "address": report.address or f"{report.landmark or 'Dehradun'}, Uttarakhand",
                "landmark": report.landmark or "Dehradun",
                "lat": float(report.latitude),
                "lng": float(report.longitude),
                "zone": report.zone or "Central"
            },
            "citizen": citizen_data,
            "assignedTeam": assigned_team_data,
            "isDuplicate": bool(report.is_duplicate),
            "duplicateCount": int(report.duplicate_count or 0),
            "createdAt": report.created_at.isoformat() if report.created_at else "",
            "updatedAt": report.updated_at.isoformat() if report.updated_at else "",
            "timeline": timeline
        }

report_service = ReportService()
