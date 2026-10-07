from typing import List, Optional, Any
from pydantic import BaseModel

class RouteGenerateRequest(BaseModel):
    taskIds: Optional[List[str]] = []
    teamId: Optional[str] = None

class RouteStopSchema(BaseModel):
    stopOrder: int
    reportId: str
    lat: float
    lng: float
    address: Optional[str] = None

class RouteResponseData(BaseModel):
    routeId: str
    totalDistanceKm: float
    estimatedTimeMinutes: int
    waypointsCount: int
    co2SavedKg: float
    stops: Optional[List[RouteStopSchema]] = []
