import re
from pydantic import BaseModel, Field, field_validator
from typing import Optional

EMAIL_REGEX = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"


class LoginRequest(BaseModel):
    email: str = Field(..., description="User email address")
    password: str = Field(..., min_length=6)

    @field_validator("email")
    def validate_email(cls, v):
        v = v.strip().lower()
        if not re.match(EMAIL_REGEX, v):
            raise ValueError("Invalid email format.")
        return v


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., description="User email address")
    password: str = Field(..., min_length=6)

    @field_validator("email")
    def validate_email(cls, v):
        v = v.strip().lower()
        if not re.match(EMAIL_REGEX, v):
            raise ValueError("Invalid email format.")
        return v


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None
