from email_validator import EmailNotValidError, validate_email
from pydantic import BaseModel, ConfigDict, Field, field_validator
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    email: str
    username: str = Field(min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_.-]+$")

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, value: str) -> str:
        try:
            return validate_email(value, check_deliverability=False).normalized
        except EmailNotValidError as exc:
            raise ValueError(str(exc)) from exc


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserUpdate(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = Field(default=None, min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_.-]+$")
    password: Optional[str] = Field(default=None, min_length=8, max_length=128)

    @field_validator("email")
    @classmethod
    def validate_optional_email_format(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value
        try:
            return validate_email(value, check_deliverability=False).normalized
        except EmailNotValidError as exc:
            raise ValueError(str(exc)) from exc


class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    updated_at: datetime


class UserLoginRequest(BaseModel):
    email: str
    password: str = Field(min_length=8, max_length=128)

    @field_validator("email")
    @classmethod
    def validate_login_email_format(cls, value: str) -> str:
        try:
            return validate_email(value, check_deliverability=False).normalized
        except EmailNotValidError as exc:
            raise ValueError(str(exc)) from exc


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
