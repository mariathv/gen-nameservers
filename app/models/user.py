from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    email: EmailStr
    is_active: bool = True

class UserCreate(UserBase):
    password: str
    full_name: Optional[str] = None

class UserUpdate(UserBase):
    password: Optional[str] = None
    full_name: Optional[str] = None

class UserInDBBase(UserBase):
    id: str = Field(..., alias="_id")
    full_name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True

class User(UserInDBBase):
    pass

class UserInDB(UserInDBBase):
    hashed_password: str