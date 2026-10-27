from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.food import FoodAnalysis
from app.models.freshness import FreshnessAnalysis
from app.models.hygiene import HygieneAudit
from app.models.recipe import Recipe
from app.models.meal_plan import MealPlan
from app.schemas.history import HistorySummaryResponse
from app.api.deps import get_current_user

router = APIRouter()


@router.get("", response_model=HistorySummaryResponse)
def get_user_history_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    foods = db.query(FoodAnalysis).filter(FoodAnalysis.user_id == current_user.id).order_by(FoodAnalysis.created_at.desc()).limit(10).all()
    freshness = db.query(FreshnessAnalysis).filter(FreshnessAnalysis.user_id == current_user.id).order_by(FreshnessAnalysis.created_at.desc()).limit(10).all()
    hygiene = db.query(HygieneAudit).filter(HygieneAudit.user_id == current_user.id).order_by(HygieneAudit.created_at.desc()).limit(10).all()
    recipes = db.query(Recipe).filter(Recipe.user_id == current_user.id).order_by(Recipe.created_at.desc()).limit(10).all()
    meal_plans = db.query(MealPlan).filter(MealPlan.user_id == current_user.id).order_by(MealPlan.created_at.desc()).limit(10).all()

    total_food = db.query(FoodAnalysis).filter(FoodAnalysis.user_id == current_user.id).count()
    total_fresh = db.query(FreshnessAnalysis).filter(FreshnessAnalysis.user_id == current_user.id).count()
    total_hyg = db.query(HygieneAudit).filter(HygieneAudit.user_id == current_user.id).count()
    total_rec = db.query(Recipe).filter(Recipe.user_id == current_user.id).count()
    total_plans = db.query(MealPlan).filter(MealPlan.user_id == current_user.id).count()

    return {
        "total_food_scans": total_food,
        "total_freshness_checks": total_fresh,
        "total_hygiene_audits": total_hyg,
        "total_recipes": total_rec,
        "total_meal_plans": total_plans,
        "recent_food_analyses": foods,
        "recent_freshness_analyses": freshness,
        "recent_hygiene_audits": hygiene,
        "recent_recipes": recipes,
        "recent_meal_plans": meal_plans
    }
