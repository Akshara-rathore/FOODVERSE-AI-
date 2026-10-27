import asyncio
import io
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi import HTTPException
from fastapi.datastructures import UploadFile

from app.core.database import Base
from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest
from app.schemas.recipe import RecipeGenerateRequest
from app.schemas.meal_plan import MealPlanGenerateRequest
from app.schemas.user import UserUpdate
from app.api.v1.auth import register, login
from app.api.v1.users import update_user_profile, get_user_profile
from app.api.v1.food import analyze_food_image, get_food_history, delete_food_analysis
from app.api.v1.recipes import generate_recipe, get_user_recipes, toggle_favorite_recipe, delete_recipe
from app.api.v1.meal_plans import generate_meal_plan, get_user_meal_plans, delete_meal_plan
from app.api.v1.freshness import analyze_freshness
from app.api.v1.hygiene import analyze_kitchen_hygiene
from app.api.v1.health import health_check
from app.api.v1.history import get_user_history_overview
from app.services.ai.factory import get_ai_provider

engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture
def db():
    Base.metadata.create_all(bind=engine)
    session = TestingSession()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def test_user(db):
    req = RegisterRequest(name="Chef Gourmet", email="gourmet@foodverse.ai", password="SecretMasterPassword123")
    register(req, db)
    return db.query(User).filter(User.email == "gourmet@foodverse.ai").first()


def test_auth_registration_and_login(db):
    req = RegisterRequest(name="Elena Rostova", email="elena@foodverse.ai", password="PasswordSecure456")
    res = register(req, db)
    assert "access_token" in res
    assert res["token_type"] == "bearer"

    login_req = LoginRequest(email="elena@foodverse.ai", password="PasswordSecure456")
    login_res = login(login_req, db)
    assert "access_token" in login_res

    with pytest.raises(HTTPException) as exc:
        register(req, db)
    assert exc.value.status_code == 400

    with pytest.raises(HTTPException) as exc:
        login(LoginRequest(email="elena@foodverse.ai", password="WrongPassword!"), db)
    assert exc.value.status_code == 401


def test_user_profile_management(db, test_user):
    profile = get_user_profile(test_user)
    assert profile.email == "gourmet@foodverse.ai"

    update_data = UserUpdate(name="Executive Chef Gourmet", preferences={"diet": "Keto", "daily_calories": 2500})
    updated = update_user_profile(update_data, db, test_user)
    assert updated.name == "Executive Chef Gourmet"
    assert updated.preferences["diet"] == "Keto"


def test_food_analysis_flow(db, test_user):
    ai = get_ai_provider()
    fake_content = b"\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xFF\xDB\x00C\x00"
    upload = UploadFile(file=io.BytesIO(fake_content), filename="superfood_salad.jpg")

    record = asyncio.run(analyze_food_image(
        file=upload,
        custom_name="Quinoa & Salmon Bowl",
        db=db,
        current_user=test_user,
        ai_provider=ai
    ))
    assert record.food_name == "Quinoa & Salmon Bowl"
    assert record.calories > 0
    assert record.user_id == test_user.id

    history = get_food_history(limit=10, db=db, current_user=test_user)
    assert len(history) == 1
    assert history[0].id == record.id

    delete_food_analysis(record.id, db, test_user)
    assert len(get_food_history(limit=10, db=db, current_user=test_user)) == 0


def test_recipe_generation_flow(db, test_user):
    ai = get_ai_provider()
    req = RecipeGenerateRequest(
        ingredients=["tofu", "broccoli", "sesame oil"],
        dietary_preferences=["vegan"],
        max_cook_time_minutes=25,
        difficulty="Easy",
        servings=2,
        cuisine="Asian"
    )
    recipe = asyncio.run(generate_recipe(req, db, test_user, ai))
    assert recipe.title is not None
    assert len(recipe.ingredients) > 0
    assert len(recipe.instructions) > 0

    fav = toggle_favorite_recipe(recipe.id, db, test_user)
    assert fav.is_favorite is True

    recipes = get_user_recipes(limit=10, db=db, current_user=test_user)
    assert len(recipes) == 1

    delete_recipe(recipe.id, db, test_user)
    assert len(get_user_recipes(limit=10, db=db, current_user=test_user)) == 0


def test_meal_plan_flow(db, test_user):
    ai = get_ai_provider()
    req = MealPlanGenerateRequest(
        diet_type="Mediterranean",
        target_calories=2200,
        days_count=3,
        allergies=["shellfish"],
        preferred_cuisines=["Greek", "Italian"]
    )
    plan = asyncio.run(generate_meal_plan(req, db, test_user, ai))
    assert plan.target_calories == 2200
    assert plan.days_count == 3
    assert "day_1" in plan.plan_data

    plans = get_user_meal_plans(limit=10, db=db, current_user=test_user)
    assert len(plans) == 1

    delete_meal_plan(plan.id, db, test_user)
    assert len(get_user_meal_plans(limit=10, db=db, current_user=test_user)) == 0


def test_freshness_and_hygiene(db, test_user):
    ai = get_ai_provider()
    fake_content = b"\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xFF\xDB\x00C\x00"
    
    upload_fresh = UploadFile(file=io.BytesIO(fake_content), filename="fresh_apple.jpg")
    fresh_res = asyncio.run(analyze_freshness(upload_fresh, "Apple", db, test_user, ai))
    assert fresh_res.freshness_score >= 0
    assert "NOTICE" in fresh_res.safety_disclaimer or "DISCLAIMER" in fresh_res.safety_disclaimer

    upload_hyg = UploadFile(file=io.BytesIO(fake_content), filename="kitchen_counter.jpg")
    hyg_res = asyncio.run(analyze_kitchen_hygiene(upload_hyg, db, test_user, ai))
    assert hyg_res.overall_score >= 0
    assert len(hyg_res.corrective_actions) >= 1

    summary = get_user_history_overview(db, test_user)
    assert summary["total_freshness_checks"] >= 1
    assert summary["total_hygiene_audits"] >= 1


def test_health_check(db):
    res = health_check(db)
    assert res["status"] in ["healthy", "degraded"]
    assert res["database"] == "connected"
    assert "ai_provider" in res
