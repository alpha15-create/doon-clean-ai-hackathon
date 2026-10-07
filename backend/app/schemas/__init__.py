from app.schemas.auth import LoginRequest, RegisterRequest, UserPublic, AuthResponseData, StandardApiResponse
from app.schemas.user import UserBase, UserCreate, UserResponse
from app.schemas.waste import AIAnalysisResult
from app.schemas.report import (
    LocationSchema,
    CitizenSummary,
    AssignedTeamSummary,
    TimelineEntry,
    ReportCreateRequest,
    ReportStatusUpdateRequest,
    ReportPriorityUpdateRequest,
    ReportResponse,
)
from app.schemas.dashboard import DashboardOverviewData, DashboardAnalyticsData
from app.schemas.hotspot import HotspotCluster
from app.schemas.collection import CollectionTeamSchema, AssignTeamRequest, UpdateTaskStatusRequest
from app.schemas.route import RouteGenerateRequest, RouteResponseData
from app.schemas.notification import NotificationItem

__all__ = [
    "LoginRequest",
    "RegisterRequest",
    "UserPublic",
    "AuthResponseData",
    "StandardApiResponse",
    "UserBase",
    "UserCreate",
    "UserResponse",
    "AIAnalysisResult",
    "LocationSchema",
    "CitizenSummary",
    "AssignedTeamSummary",
    "TimelineEntry",
    "ReportCreateRequest",
    "ReportStatusUpdateRequest",
    "ReportPriorityUpdateRequest",
    "ReportResponse",
    "DashboardOverviewData",
    "DashboardAnalyticsData",
    "HotspotCluster",
    "CollectionTeamSchema",
    "AssignTeamRequest",
    "UpdateTaskStatusRequest",
    "RouteGenerateRequest",
    "RouteResponseData",
    "NotificationItem",
]
