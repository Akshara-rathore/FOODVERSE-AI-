from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional


class BaseAIProvider(ABC):
    """Abstract base class for all FoodVerse AI intelligence providers."""

    @abstractmethod
    async def recognize_food(self, image_bytes: bytes, filename: str) -> Dict[str, Any]:
        """Recognize food from image and estimate nutritional attributes."""
        pass

    @abstractmethod
    async def analyze_freshness(self, image_bytes: bytes, food_type: Optional[str] = None) -> Dict[str, Any]:
        """Assess visual freshness and safety limitations of food item."""
        pass

    @abstractmethod
    async def audit_kitchen_hygiene(self, frames: List[bytes], is_video: bool = False) -> Dict[str, Any]:
        """Inspect kitchen surface cleanliness, cross-contamination, and hazards."""
        pass

    @abstractmethod
    async def generate_recipe(
        self,
        ingredients: List[str],
        dietary_preferences: List[str],
        cook_time: int,
        difficulty: str,
        servings: int,
        cuisine: str
    ) -> Dict[str, Any]:
        """Generate structured recipe tailored to available ingredients and constraints."""
        pass

    @abstractmethod
    async def generate_meal_plan(
        self,
        diet_type: str,
        calories: int,
        days_count: int,
        allergies: List[str],
        cuisines: List[str],
        available_ingredients: List[str]
    ) -> Dict[str, Any]:
        """Generate structured day-by-day meal plan matching caloric and macro goals."""
        pass

    @abstractmethod
    async def assistant_chat(
        self,
        message: str,
        history: List[Dict[str, str]],
        image_bytes: Optional[bytes] = None
    ) -> str:
        """Conversational food, nutrition, culinary, and hygiene advisor."""
        pass
