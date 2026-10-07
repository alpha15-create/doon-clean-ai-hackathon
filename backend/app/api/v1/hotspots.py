from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.hotspot_service import hotspot_service
from app.utils.helpers import api_response

router = APIRouter(prefix="/hotspots", tags=["Hotspots"])

@router.get("")
def get_hotspots(db: Session = Depends(get_db)):
    hotspots = hotspot_service.compute_hotspots(db)
    return api_response(hotspots)
