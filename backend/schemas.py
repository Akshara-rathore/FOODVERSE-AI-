from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class User(BaseModel):
    username: str
    email: EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class AnalysisResult(BaseModel):
    # Generic placeholder for different analysis types
    type: str = Field(..., description="One of: nutrition, freshness, hygiene")
    data: dict = Field(..., description="Key/value results from Gemini or demo data")

class ImageUploadResponse(BaseModel):
    filename: str
    analysis: AnalysisResult
