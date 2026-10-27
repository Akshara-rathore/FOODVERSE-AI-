from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class MealPlanGenerateRequest(BaseModel):
    diet_type: str = "Balanced"
    target_calories: int = Field(default=2000, ge=1000, le=5000)
    days_count: int = Field(default=3, ge=1, le=7)
    allergies: Optional[List[str]] = []
    preferred_cuisines: Optional[List[str]] = []
    available_ingredients: Optional[List[str]] = []


class MealPlanResponse(BaseModel):
    id: int
    user_id: int
    title: str
    diet_type: str
    target_calories: int
    days_count: int
    plan_data: Dict[str, Any]
    preferences_used: Dict[str, Any] = {}
    summary_nutrition: Dict[str, Any] = {}
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
