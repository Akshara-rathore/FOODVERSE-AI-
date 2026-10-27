from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.freshness import FreshnessAnalysis
from app.schemas.freshness import FreshnessResponse
from app.api.deps import get_current_user, get_ai
from app.services.ai.base import BaseAIProvider
from app.services.storage_service import storage_service

router = APIRouter()


@router.post("/analyze", response_model=FreshnessResponse, status_code=status.HTTP_201_CREATED)
async def analyze_freshness(
    file: UploadFile = File(...),
    food_type: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    ai_provider: BaseAIProvider = Depends(get_ai)
):
    filepath, relative_url, content = await storage_service.save_upload_file(file)

    try:
        result = await ai_provider.analyze_freshness(content, food_type)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Freshness optical assessment failed: {str(e)}"
        )

    record = FreshnessAnalysis(
        user_id=current_user.id,
        image_url=relative_url,
        food_item=result.get("food_item", food_type or "Inspected Item"),
        freshness_score=float(result.get("freshness_score", 85.0)),
        status=result.get("status", "Fresh"),
        visual_indicators=result.get("visual_indicators", []),
        color_metrics=result.get("color_metrics", {}),
        texture_observations=result.get("texture_observations", "No significant visual anomalies."),
        shelf_life_days=int(result.get("shelf_life_days", 3)),
        storage_recommendation=result.get("storage_recommendation", "Store in clean refrigerated environment."),
        safety_disclaimer=result.get(
            "safety_disclaimer",
            "CRITICAL NOTICE: Visual inspection cannot test for microbiological pathogens or foodborne bacteria. Always adhere to strict food handling standards."
        )
    )

    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/history", response_model=List[FreshnessResponse])
def get_freshness_history(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(FreshnessAnalysis)\
        .filter(FreshnessAnalysis.user_id == current_user.id)\
        .order_by(FreshnessAnalysis.created_at.desc())\
        .limit(limit)\
        .all()


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_freshness_analysis(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(FreshnessAnalysis).filter(
        FreshnessAnalysis.id == id,
        FreshnessAnalysis.user_id == current_user.id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Freshness record not found.")
    db.delete(record)
    db.commit()
    return None
