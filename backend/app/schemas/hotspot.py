from typing import List, Optional
from pydantic import BaseModel

class HotspotCluster(BaseModel):
    id: str
    name: str
    center: List[float]  # [lat, lng]
    radius: int
    reportCount: int
    averagePriority: int
    priorityLevel: str
    dominantWaste: str
    cleanFrequency: str
    zone: str
    description: str
