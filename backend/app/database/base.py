from app.database.database import Base
from app.models.user import User
from app.models.report import Report
from app.models.waste_analysis import WasteAnalysis
from app.models.duplicate_report import DuplicateReport
from app.models.collection_team import CollectionTeam
from app.models.collection_task import CollectionTask
from app.models.route import Route
from app.models.route_stop import RouteStop
from app.models.notification import Notification

__all__ = [
    "Base",
    "User",
    "Report",
    "WasteAnalysis",
    "DuplicateReport",
    "CollectionTeam",
    "CollectionTask",
    "Route",
    "RouteStop",
    "Notification",
]
