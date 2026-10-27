from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from backend.auth import get_current_user
from backend.schemas import ImageUploadResponse, AnalysisResult
from backend.services.gemini_service import analyze_image_demo, analyze_chat_demo, plan_meal_demo

router = APIRouter()

@router.post("/nutrition", response_model=ImageUploadResponse)
async def nutrition_analysis(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    # For demo, use placeholder analysis
    analysis = AnalysisResult(type="nutrition", data={"calories": 250, "protein": 10, "carbs": 30, "fat": 8, "fiber": 5})
    return ImageUploadResponse(filename=file.filename, analysis=analysis)

@router.post("/freshness", response_model=ImageUploadResponse)
async def freshness_analysis(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    analysis = AnalysisResult(type="freshness", data={"bruising": "low", "discoloration": "none", "mold": "none", "wilting": "minimal"})
    return ImageUploadResponse(filename=file.filename, analysis=analysis)

@router.post("/hygiene", response_model=ImageUploadResponse)
async def hygiene_analysis(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    analysis = AnalysisResult(type="hygiene", data={"cleanliness": "good", "hazards": []})
    return ImageUploadResponse(filename=file.filename, analysis=analysis)

@router.post("/chat", response_model=ImageUploadResponse)
async def ai_chat(query: str, user: dict = Depends(get_current_user)):
    # Demo chat response
    analysis = AnalysisResult(type="chat", data={"response": "Here is a simple recipe..."})
    return ImageUploadResponse(filename="chat", analysis=analysis)

@router.post("/mealplan", response_model=ImageUploadResponse)
async def meal_plan(request: dict, user: dict = Depends(get_current_user)):
    analysis = AnalysisResult(type="mealplan", data={"plan": "Sample weekly plan..."})
    return ImageUploadResponse(filename="mealplan", analysis=analysis)
