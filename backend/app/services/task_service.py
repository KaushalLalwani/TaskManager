from sqlalchemy.orm import Session
from app.models.user import Task, User
from app.schemas.task import TaskCreate, TaskUpdate


def get_task(db: Session, task_id: int) -> Task:
    return db.query(Task).filter(Task.id == task_id).first()


def get_user_tasks(db: Session, user_id: int, skip: int = 0, limit: int = 10):
    return db.query(Task).filter(Task.owner_id == user_id).offset(skip).limit(limit).all()


def get_all_tasks(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Task).offset(skip).limit(limit).all()


def create_task(db: Session, task: TaskCreate, user_id: int) -> Task:
    db_task = Task(
        title=task.title,
        description=task.description,
        completed=task.completed,
        owner_id=user_id
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task(db: Session, task: Task, task_update: TaskUpdate) -> Task:
    update_data = task_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: Task) -> bool:
    db.delete(task)
    db.commit()
    return True
