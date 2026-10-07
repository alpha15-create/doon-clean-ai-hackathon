from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.reports import router as reports_router
from app.api.v1.analysis import router as analysis_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.hotspots import router as hotspots_router
from app.api.v1.collection import router as collection_router
from app.api.v1.routes import router as routes_router
from app.api.v1.users import router as users_router
from app.api.v1.notifications import router as notifications_router

api_v1_router = APIRouter()

api_v1_router.include_router(auth_router)
api_v1_router.include_router(reports_router)
api_v1_router.include_router(analysis_router)
api_v1_router.include_router(dashboard_router)
api_v1_router.include_router(hotspots_router)
api_v1_router.include_router(collection_router)
api_v1_router.include_router(routes_router)
api_v1_router.include_router(users_router)
api_v1_router.include_router(notifications_router)
