from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field

class TaskBase(BaseModel):
    task_id: str
    status: str  # pending, success, failure
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

class TaskCreate(TaskBase):
    pass

class TaskInDBBase(TaskBase):
    id: str = Field(..., alias="_id")
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True

class Task(TaskInDBBase):
    pass

class TaskInDB(TaskInDBBase):
    pass