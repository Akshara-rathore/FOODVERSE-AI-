import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db
from app.core.config import settings
from app.services.ai.factory import get_ai_provider

router = APIRouter()


@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"error: {str(e)}"

    provider = get_ai_provider()

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "environment": settings.ENVIRONMENT,
        "database": db_status,
        "ai_provider": {
            "configured_provider": settings.AI_PROVIDER,
            "is_live_configured": provider.is_configured,
            "offline_fallback_enabled": settings.ENABLE_OFFLINE_DEMO_FALLBACK,
            "model": settings.GEMINI_MODEL if settings.AI_PROVIDER == "gemini" else settings.OPENAI_MODEL
        },
        "version": "1.0.0"
    }
