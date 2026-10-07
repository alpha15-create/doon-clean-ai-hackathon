from typing import Optional, List, Any
from pydantic import BaseModel

class LocationSchema(BaseModel):
    address: Optional[str] = "Dehradun, Uttarakhand"
    landmark: Optional[str] = "Dehradun"
    lat: float
    lng: float
    zone: Optional[str] = "Central"

class CitizenSummary(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = "Citizen User"
    phone: Optional[str] = None
    email: Optional[str] = None

class AssignedTeamSummary(BaseModel):
    id: str
    name: str
    leader: Optional[str] = None

class TimelineEntry(BaseModel):
    status: str
    time: str
    note: str

class ReportCreateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = "Reported via DoonClean AI citizen portal."
    imageUrl: Optional[str] = None
    wasteType: Optional[str] = "Plastic Waste"
    aiConfidence: Optional[int] = 92
    severity: Optional[str] = "High"
    estimatedQuantity: Optional[str] = "Medium (~60 kg)"
    priorityScore: Optional[int] = 82
    location: Optional[LocationSchema] = None
    citizen: Optional[CitizenSummary] = None

class ReportStatusUpdateRequest(BaseModel):
    status: str
    note: Optional[str] = ""

class ReportPriorityUpdateRequest(BaseModel):
    severity: str
    priorityScore: Optional[int] = None

class ReportResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    imageUrl: str
    wasteType: str
    aiConfidence: int
    severity: str
    estimatedQuantity: str
    priorityScore: int
    status: str
    location: LocationSchema
    citizen: Optional[CitizenSummary] = None
    assignedTeam: Optional[AssignedTeamSummary] = None
    isDuplicate: bool = False
    duplicateCount: int = 0
    createdAt: str
    updatedAt: str
    timeline: List[TimelineEntry] = []
