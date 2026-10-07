from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.route_service import route_service
from app.utils.helpers import api_response

router = APIRouter(prefix="/routes", tags=["Routing"])

@router.post("/generate")
async def generate_collection_route(request: Request, db: Session = Depends(get_db)):
    body = await request.json() if request.headers.get("content-type") == "application/json" else {}
    task_ids = body.get("taskIds") or body.get("task_ids") or []
    team_id = body.get("teamId") or body.get("team_id")

    route_data = route_service.generate_optimal_route(db, task_ids, team_id)
    return api_response(route_data, message="Optimized shortest sanitation route generated")
