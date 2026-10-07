from typing import Optional
from pydantic import BaseModel

class CollectionTeamSchema(BaseModel):
    id: str
    name: str
    zone: str
    leader: str
    phone: str
    vehicle: str
    activeTasks: int = 0
    status: str = "Available"
    capacity: str = "60%"
    avatar: str = "🚚"

class AssignTeamRequest(BaseModel):
    reportId: str
    teamId: str

class UpdateTaskStatusRequest(BaseModel):
    status: str
    note: Optional[str] = None
