from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.schemas.food import FoodAnalysisResponse
from app.schemas.freshness import FreshnessResponse
from app.schemas.hygiene import HygieneAuditResponse
from app.schemas.recipe import RecipeResponse
from app.schemas.meal_plan import MealPlanResponse


class HistorySummaryResponse(BaseModel):
    total_food_scans: int
    total_freshness_checks: int
    total_hygiene_audits: int
    total_recipes: int
    total_meal_plans: int
    recent_food_analyses: List[FoodAnalysisResponse] = []
    recent_freshness_analyses: List[FreshnessResponse] = []
    recent_hygiene_audits: List[HygieneAuditResponse] = []
    recent_recipes: List[RecipeResponse] = []
    recent_meal_plans: List[MealPlanResponse] = []
