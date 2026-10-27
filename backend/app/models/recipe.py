from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.user import utcnow


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    prep_time_minutes = Column(Integer, default=15)
    cook_time_minutes = Column(Integer, default=20)
    servings = Column(Integer, default=2)
    difficulty = Column(String(50), default="Medium")  # Easy, Medium, Hard
    cuisine = Column(String(100), default="Global")
    
    ingredients = Column(JSON, default=list)  # [{'item': 'Olive oil', 'amount': '2 tbsp', 'notes': ''}]
    instructions = Column(JSON, default=list) # [{'step': 1, 'instruction': '...', 'tip': '...'}]
    nutrition_estimate = Column(JSON, default=dict) # {'calories': 450, 'protein': 25, 'carbs': 40, 'fat': 12}
    tags = Column(JSON, default=list)         # ['high-protein', 'quick', 'gluten-free']
    is_favorite = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=utcnow, nullable=False)

    user = relationship("User", back_populates="recipes")
