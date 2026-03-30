import pytest
from fastapi import HTTPException

from app.dependencies.role import check_task_owner_or_admin
from app.models.user import User
from app.schemas.task import TaskCreate, TaskUpdate
from app.schemas.user import UserCreate, UserLoginRequest
from app.services.auth_service import authenticate_user, create_user, generate_token
from app.services.task_service import create_task, delete_task, get_user_tasks, update_task
from app.core.security import decode_token


def test_user_registration_and_authentication(db_session):
    user = create_user(
        db_session,
        UserCreate(email="user@example.com", username="userdemo", password="password123"),
    )

    authenticated = authenticate_user(db_session, "user@example.com", "password123")

    assert user.id is not None
    assert user.hashed_password != "password123"
    assert authenticated is not None
    assert authenticated.id == user.id


def test_generated_token_decodes_with_string_subject():
    token = generate_token(123)
    payload = decode_token(token)

    assert payload is not None
    assert payload["sub"] == "123"


def test_task_crud_for_user(db_session):
    user = create_user(
        db_session,
        UserCreate(email="tasks@example.com", username="taskowner", password="password123"),
    )

    task = create_task(
        db_session,
        TaskCreate(title="Prepare submission", description="Finish assignment"),
        user.id,
    )

    tasks = get_user_tasks(db_session, user.id)
    assert len(tasks) == 1
    assert tasks[0].title == "Prepare submission"

    updated = update_task(db_session, task, TaskUpdate(completed=True))
    assert updated.completed is True

    assert delete_task(db_session, updated) is True
    assert get_user_tasks(db_session, user.id) == []


def test_role_check_rejects_non_owner_non_admin():
    owner = User(id=1, email="owner@example.com", username="owner", hashed_password="hash")
    outsider = User(id=2, email="user@example.com", username="outsider", hashed_password="hash")
    task = type("TaskStub", (), {"owner_id": 1})()

    with pytest.raises(HTTPException) as exc:
        check_task_owner_or_admin(task=task, current_user=outsider)

    assert exc.value.status_code == 403


def test_role_check_allows_admin():
    admin = User(
        id=2,
        email="admin@example.com",
        username="admin",
        hashed_password="hash",
        is_admin=True,
    )
    task = type("TaskStub", (), {"owner_id": 1})()

    assert check_task_owner_or_admin(task=task, current_user=admin) is task


def test_schema_validation_rejects_short_password():
    with pytest.raises(Exception):
        UserCreate(email="invalid@example.com", username="validuser", password="short")

    with pytest.raises(Exception):
        UserLoginRequest(email="invalid@example.com", password="short")
