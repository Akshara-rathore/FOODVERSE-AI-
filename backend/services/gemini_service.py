import os

# Placeholder demo implementations for Gemini AI integration.
# In a real deployment, these would call the Google Gemini API using
# the provided API key and proper request formatting.

DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() == "true"

def analyze_image_demo(image_bytes: bytes, analysis_type: str):
    """Return deterministic demo data based on analysis_type.
    This allows the frontend to function without external API calls.
    """
    if analysis_type == "nutrition":
        return {"calories": 250, "protein": 10, "carbs": 30, "fat": 8, "fiber": 5}
    if analysis_type == "freshness":
        return {"bruising": "low", "discoloration": "none", "mold": "none", "wilting": "minimal"}
    if analysis_type == "hygiene":
        return {"cleanliness": "good", "hazards": []}
    return {}

def analyze_chat_demo(prompt: str):
    return {"response": f"Demo answer to '{prompt}'. This could be a recipe, substitution, or cooking tip."}

def plan_meal_demo(preferences: dict):
    # Return a static weekly plan example.
    return {"plan": "Monday: Oatmeal, Lunch: Grilled chicken salad, ..."}
