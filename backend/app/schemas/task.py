from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional


class TaskBase(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = False


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=120)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = None


class TaskResponse(TaskBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime
