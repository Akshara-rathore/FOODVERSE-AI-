from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, JSON, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    preferences = Column(JSON, default=dict)
    created_at = Column(DateTime, default=utcnow, nullable=False)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow, nullable=False)

    # Relationships
    food_analyses = relationship("FoodAnalysis", back_populates="user", cascade="all, delete-orphan")
    freshness_analyses = relationship("FreshnessAnalysis", back_populates="user", cascade="all, delete-orphan")
    hygiene_audits = relationship("HygieneAudit", back_populates="user", cascade="all, delete-orphan")
    recipes = relationship("Recipe", back_populates="user", cascade="all, delete-orphan")
    meal_plans = relationship("MealPlan", back_populates="user", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
