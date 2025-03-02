from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class DomainBase(BaseModel):
    domain: str

class DomainCreate(DomainBase):
    pass

class DomainUpdate(DomainBase):
    nameservers: Optional[List[str]] = None

class DomainInDBBase(DomainBase):
    id: str = Field(..., alias="_id")
    user_id: str
    nameservers: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True

class Domain(DomainInDBBase):
    pass

class DomainInDB(DomainInDBBase):
    pass