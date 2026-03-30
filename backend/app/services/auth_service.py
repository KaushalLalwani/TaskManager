from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import verify_password, get_password_hash, create_access_token
from datetime import timedelta


def get_user_by_email(db: Session, email: str) -> User:
    return db.query(User).filter(User.email == email).first()


def get_user_by_username(db: Session, username: str) -> User:
    return db.query(User).filter(User.username == username).first()


def get_user_by_id(db: Session, user_id: int) -> User:
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, user: UserCreate) -> User:
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=get_password_hash(user.password),
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str) -> User:
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def generate_token(user_id: int) -> str:
    access_token_expires = timedelta(minutes=30)
    return create_access_token(
        data={"sub": str(user_id)},
        expires_delta=access_token_expires
    )
