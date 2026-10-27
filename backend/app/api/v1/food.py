from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.food import FoodAnalysis
from app.schemas.food import FoodAnalysisResponse
from app.api.deps import get_current_user, get_ai
from app.services.ai.base import BaseAIProvider
from app.services.storage_service import storage_service

router = APIRouter()


@router.post("/analyze", response_model=FoodAnalysisResponse, status_code=status.HTTP_201_CREATED)
async def analyze_food_image(
    file: UploadFile = File(...),
    custom_name: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    ai_provider: BaseAIProvider = Depends(get_ai)
):
    # Save uploaded image safely
    filepath, relative_url, content = await storage_service.save_upload_file(file)

    # Perform AI recognition
    try:
        recognition = await ai_provider.recognize_food(content, file.filename or "food.jpg")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Vision recognition failed: {str(e)}"
        )

    # Allow custom override if user provided a specific dish label
    food_name = custom_name.strip() if custom_name else recognition.get("food_name", "Unidentified Dish")

    record = FoodAnalysis(
        user_id=current_user.id,
        image_url=relative_url,
        food_name=food_name,
        category=recognition.get("category", "General"),
        confidence=float(recognition.get("confidence", 0.85)),
        serving_size=recognition.get("serving_size", "1 serving (100g)"),
        calories=float(recognition.get("calories", 0.0)),
        protein=float(recognition.get("protein", 0.0)),
        carbs=float(recognition.get("carbs", 0.0)),
        fat=float(recognition.get("fat", 0.0)),
        fiber=float(recognition.get("fiber", 0.0)),
        sugar=float(recognition.get("sugar", 0.0)),
        sodium_mg=float(recognition.get("sodium_mg", 0.0)),
        health_score=int(recognition.get("health_score", 70)),
        dietary_attributes=recognition.get("dietary_attributes", []),
        micronutrients=recognition.get("micronutrients", {}),
        notes=recognition.get("notes", "Automated nutritional estimate"),
        is_estimated=int(recognition.get("is_estimated", 1))
    )

    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/history", response_model=List[FoodAnalysisResponse])
def get_food_history(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    records = db.query(FoodAnalysis)\
        .filter(FoodAnalysis.user_id == current_user.id)\
        .order_by(FoodAnalysis.created_at.desc())\
        .limit(limit)\
        .all()
    return records


@router.get("/{id}", response_model=FoodAnalysisResponse)
def get_food_analysis_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(FoodAnalysis).filter(
        FoodAnalysis.id == id,
        FoodAnalysis.user_id == current_user.id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Food analysis record not found.")
    return record


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_food_analysis(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(FoodAnalysis).filter(
        FoodAnalysis.id == id,
        FoodAnalysis.user_id == current_user.id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Food analysis record not found.")
    db.delete(record)
    db.commit()
    return None
