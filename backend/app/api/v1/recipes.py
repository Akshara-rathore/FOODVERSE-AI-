from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.recipe import Recipe
from app.schemas.recipe import RecipeGenerateRequest, RecipeResponse
from app.api.deps import get_current_user, get_ai
from app.services.ai.base import BaseAIProvider

router = APIRouter()


@router.post("/generate", response_model=RecipeResponse, status_code=status.HTTP_201_CREATED)
async def generate_recipe(
    request: RecipeGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    ai_provider: BaseAIProvider = Depends(get_ai)
):
    try:
        data = await ai_provider.generate_recipe(
            ingredients=request.ingredients,
            dietary_preferences=request.dietary_preferences or [],
            cook_time=request.max_cook_time_minutes or 45,
            difficulty=request.difficulty or "Medium",
            servings=request.servings or 2,
            cuisine=request.cuisine or "Any"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Recipe generation failed: {str(e)}"
        )

    recipe = Recipe(
        user_id=current_user.id,
        title=data.get("title", "Chef's Creation"),
        description=data.get("description", "Delicious customized recipe."),
        prep_time_minutes=data.get("prep_time_minutes", 15),
        cook_time_minutes=data.get("cook_time_minutes", 25),
        servings=data.get("servings", request.servings or 2),
        difficulty=data.get("difficulty", request.difficulty or "Medium"),
        cuisine=data.get("cuisine", request.cuisine or "Global"),
        ingredients=data.get("ingredients", []),
        instructions=data.get("instructions", []),
        nutrition_estimate=data.get("nutrition_estimate", {}),
        tags=data.get("tags", []),
        is_favorite=False
    )

    db.add(recipe)
    db.commit()
    db.refresh(recipe)
    return recipe


@router.get("", response_model=List[RecipeResponse])
def get_user_recipes(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Recipe)\
        .filter(Recipe.user_id == current_user.id)\
        .order_by(Recipe.created_at.desc())\
        .limit(limit)\
        .all()


@router.get("/{id}", response_model=RecipeResponse)
def get_recipe_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    recipe = db.query(Recipe).filter(
        Recipe.id == id,
        Recipe.user_id == current_user.id
    ).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found.")
    return recipe


@router.patch("/{id}/favorite", response_model=RecipeResponse)
def toggle_favorite_recipe(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    recipe = db.query(Recipe).filter(
        Recipe.id == id,
        Recipe.user_id == current_user.id
    ).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found.")
    recipe.is_favorite = not recipe.is_favorite
    db.commit()
    db.refresh(recipe)
    return recipe


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recipe(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    recipe = db.query(Recipe).filter(
        Recipe.id == id,
        Recipe.user_id == current_user.id
    ).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found.")
    db.delete(recipe)
    db.commit()
    return None
