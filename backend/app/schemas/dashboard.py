from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class DashboardOverviewData(BaseModel):
    totalReports: int
    pendingReports: int
    highPriority: int
    inProgress: int
    resolved: int
    resolutionRate: str
    activeHotspots: int

class ReportTimePoint(BaseModel):
    date: str
    reports: int
    resolved: int

class CategoryShare(BaseModel):
    name: str
    count: int
    percentage: int
    fill: str

class StatusCount(BaseModel):
    name: str
    count: int
    fill: str

class PriorityCount(BaseModel):
    name: str
    count: int
    fill: str

class ZoneMetric(BaseModel):
    zone: str
    reports: int
    resolved: int
    rate: str

class DashboardAnalyticsData(BaseModel):
    summary: Dict[str, Any]
    reportsOverTime: List[ReportTimePoint]
    wasteDistribution: List[CategoryShare]
    statusDistribution: List[StatusCount]
    priorityDistribution: List[PriorityCount]
    zoneBreakdown: List[ZoneMetric]
