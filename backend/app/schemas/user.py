from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, Dict, Any
import re

EMAIL_REGEX = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"


class UserBase(BaseModel):
    email: str
    name: str
    preferences: Optional[Dict[str, Any]] = {}


class UserUpdate(BaseModel):
    name: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    preferences: Dict[str, Any] = {}
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
