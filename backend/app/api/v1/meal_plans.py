from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.meal_plan import MealPlan
from app.schemas.meal_plan import MealPlanGenerateRequest, MealPlanResponse
from app.api.deps import get_current_user, get_ai
from app.services.ai.base import BaseAIProvider

router = APIRouter()


@router.post("/generate", response_model=MealPlanResponse, status_code=status.HTTP_201_CREATED)
async def generate_meal_plan(
    request: MealPlanGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    ai_provider: BaseAIProvider = Depends(get_ai)
):
    try:
        data = await ai_provider.generate_meal_plan(
            diet_type=request.diet_type,
            calories=request.target_calories,
            days_count=request.days_count,
            allergies=request.allergies or [],
            cuisines=request.preferred_cuisines or [],
            available_ingredients=request.available_ingredients or []
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Meal plan generation failed: {str(e)}"
        )

    plan = MealPlan(
        user_id=current_user.id,
        title=data.get("title", f"{request.diet_type} Plan ({request.days_count} Days)"),
        diet_type=data.get("diet_type", request.diet_type),
        target_calories=data.get("target_calories", request.target_calories),
        days_count=data.get("days_count", request.days_count),
        plan_data=data.get("plan_data", {}),
        preferences_used={
            "allergies": request.allergies,
            "cuisines": request.preferred_cuisines,
            "available_ingredients": request.available_ingredients
        },
        summary_nutrition=data.get("summary_nutrition", {})
    )

    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


@router.get("", response_model=List[MealPlanResponse])
def get_user_meal_plans(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(MealPlan)\
        .filter(MealPlan.user_id == current_user.id)\
        .order_by(MealPlan.created_at.desc())\
        .limit(limit)\
        .all()


@router.get("/{id}", response_model=MealPlanResponse)
def get_meal_plan_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plan = db.query(MealPlan).filter(
        MealPlan.id == id,
        MealPlan.user_id == current_user.id
    ).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Meal plan not found.")
    return plan


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meal_plan(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plan = db.query(MealPlan).filter(
        MealPlan.id == id,
        MealPlan.user_id == current_user.id
    ).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Meal plan not found.")
    db.delete(plan)
    db.commit()
    return None
