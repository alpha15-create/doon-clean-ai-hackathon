from typing import List, Optional
from pydantic import BaseModel

class AIAnalysisResult(BaseModel):
    wasteType: str
    confidence: int
    severity: str
    estimatedQuantity: str
    priorityScore: int
    hazardLevel: Optional[str] = "Medium"
    recyclable: Optional[bool] = True
    detectedItems: Optional[List[str]] = []
    recommendation: Optional[str] = None
    detectedCount: Optional[int] = 1

    # Snake_case aliases if backend callers need them
    waste_type: Optional[str] = None
    priority_score: Optional[int] = None
    estimated_quantity: Optional[str] = None
