from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.user import UserResponse
from app.services.auth_service import get_user_by_id
from app.dependencies.auth import get_admin_user
from app.models.user import User

router = APIRouter(tags=["users"])


@router.get("/", response_model=list[UserResponse])
def list_users(
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all users (admin only)"""
    users = db.query(User).all()
    return users


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get a specific user (admin only)"""
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user
