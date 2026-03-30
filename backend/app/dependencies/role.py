from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User, Task


def get_task_by_id_or_404(task_id: int, db: Session = Depends(get_db)) -> Task:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task


def check_task_owner_or_admin(
    task: Task = Depends(get_task_by_id_or_404),
    current_user: User = Depends(get_current_user)
) -> Task:
    if task.owner_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )
    return task
