from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.services.task_service import (
    get_user_tasks,
    create_task,
    update_task,
    delete_task,
    get_all_tasks
)
from app.dependencies.auth import get_current_user, get_admin_user
from app.dependencies.role import get_task_by_id_or_404, check_task_owner_or_admin
from app.models.user import User, Task

router = APIRouter(tags=["tasks"])


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_new_task(
    task: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new task"""
    return create_task(db, task, current_user.id)


@router.get("/", response_model=list[TaskResponse])
def list_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's tasks"""
    return get_user_tasks(db, current_user.id, skip, limit)


@router.get("/all", response_model=list[TaskResponse])
def list_all_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all tasks (admin only)"""
    return get_all_tasks(db, skip, limit)


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task: Task = Depends(check_task_owner_or_admin)
):
    """Get a specific task"""
    return task


@router.put("/{task_id}", response_model=TaskResponse)
def update_existing_task(
    task_update: TaskUpdate,
    task: Task = Depends(check_task_owner_or_admin),
    db: Session = Depends(get_db)
):
    """Update a task"""
    return update_task(db, task, task_update)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_task(
    task: Task = Depends(check_task_owner_or_admin),
    db: Session = Depends(get_db)
):
    """Delete a task"""
    delete_task(db, task)
