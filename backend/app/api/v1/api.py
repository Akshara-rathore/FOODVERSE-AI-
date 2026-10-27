from fastapi import APIRouter
from app.api.v1 import (
    auth,
    users,
    food,
    freshness,
    hygiene,
    recipes,
    meal_plans,
    assistant,
    history,
    health
)

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(food.router, prefix="/food", tags=["Food Analysis"])
api_router.include_router(freshness.router, prefix="/freshness", tags=["Freshness Assessment"])
api_router.include_router(hygiene.router, prefix="/hygiene", tags=["Kitchen Hygiene"])
api_router.include_router(recipes.router, prefix="/recipes", tags=["Cooking & Recipes"])
api_router.include_router(meal_plans.router, prefix="/meal-plans", tags=["Meal Planning"])
api_router.include_router(assistant.router, prefix="/assistant", tags=["Multimodal Assistant"])
api_router.include_router(history.router, prefix="/history", tags=["User History"])
