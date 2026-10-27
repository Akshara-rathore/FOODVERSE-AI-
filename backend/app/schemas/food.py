from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict


class MicronutrientInfo(BaseModel):
    vitamin_a: Optional[str] = "N/A"
    vitamin_c: Optional[str] = "N/A"
    calcium: Optional[str] = "N/A"
    iron: Optional[str] = "N/A"
    potassium: Optional[str] = "N/A"


class FoodAnalysisCreate(BaseModel):
    food_name: str
    category: Optional[str] = "General"
    confidence: Optional[float] = 0.85
    serving_size: Optional[str] = "1 serving (100g)"
    calories: float = 0.0
    protein: float = 0.0
    carbs: float = 0.0
    fat: float = 0.0
    fiber: float = 0.0
    sugar: Optional[float] = 0.0
    sodium_mg: Optional[float] = 0.0
    health_score: Optional[int] = 70
    dietary_attributes: Optional[List[str]] = []
    micronutrients: Optional[Dict[str, Any]] = {}
    notes: Optional[str] = None
    image_url: Optional[str] = None
    is_estimated: Optional[int] = 1


class FoodAnalysisResponse(BaseModel):
    id: int
    user_id: int
    image_url: Optional[str] = None
    food_name: str
    category: str
    confidence: float
    serving_size: str
    calories: float
    protein: float
    carbs: float
    fat: float
    fiber: float
    sugar: float
    sodium_mg: float
    health_score: int
    dietary_attributes: List[str] = []
    micronutrients: Dict[str, Any] = {}
    notes: Optional[str] = None
    is_estimated: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
