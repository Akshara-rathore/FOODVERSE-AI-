from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict


class HygieneAuditResponse(BaseModel):
    id: int
    user_id: int
    media_url: Optional[str] = None
    media_type: str
    frames_analyzed: int
    overall_score: float
    cleanliness_rating: str
    contamination_risk: str
    surface_cleanliness: Dict[str, Any] = {}
    cross_contamination_risks: List[str] = []
    storage_compliance: Dict[str, Any] = {}
    detected_hazards: List[Dict[str, Any]] = []
    corrective_actions: List[str] = []
    disclaimer: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
