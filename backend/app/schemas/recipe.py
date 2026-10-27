from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class RecipeGenerateRequest(BaseModel):
    ingredients: List[str] = Field(..., min_length=1)
    dietary_preferences: Optional[List[str]] = []
    max_cook_time_minutes: Optional[int] = 45
    difficulty: Optional[str] = "Medium"
    servings: Optional[int] = 2
    cuisine: Optional[str] = "Any"


class RecipeResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    prep_time_minutes: int
    cook_time_minutes: int
    servings: int
    difficulty: str
    cuisine: str
    ingredients: List[Dict[str, Any]] = []
    instructions: List[Dict[str, Any]] = []
    nutrition_estimate: Dict[str, Any] = {}
    tags: List[str] = []
    is_favorite: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
