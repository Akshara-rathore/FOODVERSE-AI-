from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.user import utcnow


class MealPlan(Base):
    __tablename__ = "meal_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    diet_type = Column(String(100), default="Balanced")
    target_calories = Column(Integer, default=2000)
    days_count = Column(Integer, default=3)
    
    plan_data = Column(JSON, default=dict)  # {'day_1': {'breakfast': {...}, 'lunch': {...}, 'dinner': {...}, 'snacks': [...]}}
    preferences_used = Column(JSON, default=dict)
    summary_nutrition = Column(JSON, default=dict)
    
    created_at = Column(DateTime, default=utcnow, nullable=False)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow, nullable=False)

    user = relationship("User", back_populates="meal_plans")
