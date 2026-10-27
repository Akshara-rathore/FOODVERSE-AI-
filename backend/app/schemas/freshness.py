from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict


class FreshnessResponse(BaseModel):
    id: int
    user_id: int
    image_url: Optional[str] = None
    food_item: str
    freshness_score: float
    status: str
    visual_indicators: List[str] = []
    color_metrics: Dict[str, Any] = {}
    texture_observations: Optional[str] = None
    shelf_life_days: int
    storage_recommendation: Optional[str] = None
    safety_disclaimer: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
