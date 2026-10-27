from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.user import utcnow


class FoodAnalysis(Base):
    __tablename__ = "food_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    image_url = Column(String(500), nullable=True)
    food_name = Column(String(255), nullable=False, index=True)
    category = Column(String(100), default="General")
    confidence = Column(Float, default=0.0)
    serving_size = Column(String(100), default="1 serving (100g)")
    
    # Nutritional Breakdown
    calories = Column(Float, default=0.0)
    protein = Column(Float, default=0.0)
    carbs = Column(Float, default=0.0)
    fat = Column(Float, default=0.0)
    fiber = Column(Float, default=0.0)
    sugar = Column(Float, default=0.0)
    sodium_mg = Column(Float, default=0.0)
    
    micronutrients = Column(JSON, default=dict)
    health_score = Column(Integer, default=70)
    dietary_attributes = Column(JSON, default=list)  # e.g., ["vegan", "gluten-free"]
    notes = Column(Text, nullable=True)
    is_estimated = Column(Integer, default=1)  # 1 = AI estimate, 0 = verified database
    
    created_at = Column(DateTime, default=utcnow, nullable=False)

    user = relationship("User", back_populates="food_analyses")
