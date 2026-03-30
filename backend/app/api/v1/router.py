from fastapi import APIRouter
from app.api.v1.endpoints import auth, tasks, users

api_router = APIRouter(prefix="/api/v1")

# Include routers
api_router.include_router(auth.router, prefix="/auth")
api_router.include_router(tasks.router, prefix="/tasks")
api_router.include_router(users.router, prefix="/users")
