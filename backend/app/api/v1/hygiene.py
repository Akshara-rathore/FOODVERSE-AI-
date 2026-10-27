from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.hygiene import HygieneAudit
from app.schemas.hygiene import HygieneAuditResponse
from app.api.deps import get_current_user, get_ai
from app.services.ai.base import BaseAIProvider
from app.services.storage_service import storage_service

router = APIRouter()


@router.post("/analyze", response_model=HygieneAuditResponse, status_code=status.HTTP_201_CREATED)
async def analyze_kitchen_hygiene(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    ai_provider: BaseAIProvider = Depends(get_ai)
):
    filepath, relative_url, content = await storage_service.save_upload_file(file, max_size_mb=35)
    ext = file.filename.split(".")[-1].lower() if file.filename and "." in file.filename else ""
    is_video = ext in ["mp4", "mov", "avi"]

    frames = storage_service.extract_frames(filepath, ext)

    try:
        result = await ai_provider.audit_kitchen_hygiene(frames, is_video=is_video)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Hygiene audit failed: {str(e)}"
        )

    record = HygieneAudit(
        user_id=current_user.id,
        media_url=relative_url,
        media_type="video" if is_video else "image",
        frames_analyzed=len(frames),
        overall_score=float(result.get("overall_score", 85.0)),
        cleanliness_rating=result.get("cleanliness_rating", "Good"),
        contamination_risk=result.get("contamination_risk", "Low"),
        surface_cleanliness=result.get("surface_cleanliness", {}),
        cross_contamination_risks=result.get("cross_contamination_risks", []),
        storage_compliance=result.get("storage_compliance", {}),
        detected_hazards=result.get("detected_hazards", []),
        corrective_actions=result.get("corrective_actions", []),
        disclaimer=result.get(
            "disclaimer",
            "DISCLAIMER: Advisory visual audit only. Does not replace accredited food safety health inspector certifications."
        )
    )

    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/history", response_model=List[HygieneAuditResponse])
def get_hygiene_history(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(HygieneAudit)\
        .filter(HygieneAudit.user_id == current_user.id)\
        .order_by(HygieneAudit.created_at.desc())\
        .limit(limit)\
        .all()


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_hygiene_audit(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(HygieneAudit).filter(
        HygieneAudit.id == id,
        HygieneAudit.user_id == current_user.id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Hygiene audit record not found.")
    db.delete(record)
    db.commit()
    return None
