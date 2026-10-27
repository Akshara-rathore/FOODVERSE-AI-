from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.user import utcnow


class FreshnessAnalysis(Base):
    __tablename__ = "freshness_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    image_url = Column(String(500), nullable=True)
    food_item = Column(String(255), nullable=False)
    freshness_score = Column(Float, default=0.0)  # 0 to 100
    status = Column(String(50), default="Fresh")  # Fresh, Consume Soon, Spoiled, Inconclusive
    
    visual_indicators = Column(JSON, default=list)  # list of strings
    color_metrics = Column(JSON, default=dict)      # color distribution, discoloration
    texture_observations = Column(Text, nullable=True)
    shelf_life_days = Column(Integer, default=3)
    storage_recommendation = Column(Text, nullable=True)
    safety_disclaimer = Column(Text, nullable=False)
    
    created_at = Column(DateTime, default=utcnow, nullable=False)

    user = relationship("User", back_populates="freshness_analyses")
