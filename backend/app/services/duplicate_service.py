from datetime import datetime, timedelta, timezone
from typing import Tuple, Optional, List
from sqlalchemy.orm import Session
from app.models.report import Report
from app.models.duplicate_report import DuplicateReport
from app.utils.geo import haversine_distance_meters

DUPLICATE_DISTANCE_THRESHOLD_METERS = 75.0  # Within 75m
DUPLICATE_TIME_WINDOW_HOURS = 24.0          # Within 24 hours

class DuplicateService:
    @staticmethod
    def check_duplicate(
        db: Session,
        lat: float,
        lng: float,
        waste_type: str,
        current_report_id: Optional[str] = None
    ) -> Tuple[bool, int, Optional[str]]:
        """
        Check for existing unresolved reports within 75 meters logged in the past 24 hours.
        Returns: (is_duplicate: bool, duplicate_count: int, primary_report_id: Optional[str])
        """
        cutoff = datetime.now(timezone.utc) - timedelta(hours=DUPLICATE_TIME_WINDOW_HOURS)
        query = db.query(Report).filter(
            Report.created_at >= cutoff,
            Report.status.notin_(["Resolved", "Rejected"])
        )
        if current_report_id:
            query = query.filter(Report.id != current_report_id)

        candidates: List[Report] = query.all()
        nearby_matches = []

        for candidate in candidates:
            dist = haversine_distance_meters(lat, lng, candidate.latitude, candidate.longitude)
            if dist <= DUPLICATE_DISTANCE_THRESHOLD_METERS:
                nearby_matches.append((candidate, dist))

        if nearby_matches:
            # Sort by distance
            nearby_matches.sort(key=lambda x: x[1])
            primary = nearby_matches[0][0]
            return True, len(nearby_matches), primary.id

        return False, 0, None

duplicate_service = DuplicateService()
