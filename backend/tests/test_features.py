import io


def test_food_analysis_and_history(client, auth_headers):
    # Create fake image bytes
    fake_img = io.BytesIO(b"\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xFF\xDB\x00C\x00")
    files = {"file": ("test_salad.jpg", fake_img, "image/jpeg")}
    data = {"custom_name": "Artisan Avocado Bowl"}

    res = client.post("/api/v1/food/analyze", headers=auth_headers, files=files, data=data)
    assert res.status_code == 201
    result = res.json()
    assert result["food_name"] == "Artisan Avocado Bowl"
    assert "calories" in result
    record_id = result["id"]

    # Check history
    hist = client.get("/api/v1/food/history", headers=auth_headers)
    assert hist.status_code == 200
    assert len(hist.json()) >= 1
    assert hist.json()[0]["id"] == record_id

    # Check retrieve by id
    item = client.get(f"/api/v1/food/{record_id}", headers=auth_headers)
    assert item.status_code == 200
    assert item.json()["id"] == record_id


def test_recipe_generation_and_favorite(client, auth_headers):
    payload = {
        "ingredients": ["salmon", "asparagus", "olive oil"],
        "dietary_preferences": ["gluten-free"],
        "max_cook_time_minutes": 30,
        "difficulty": "Easy",
        "servings": 2,
        "cuisine": "Mediterranean"
    }
    res = client.post("/api/v1/recipes/generate", headers=auth_headers, json=payload)
    assert res.status_code == 201
    recipe = res.json()
    assert "title" in recipe
    assert len(recipe["instructions"]) > 0
    recipe_id = recipe["id"]

    # Toggle favorite
    fav = client.patch(f"/api/v1/recipes/{recipe_id}/favorite", headers=auth_headers)
    assert fav.status_code == 200
    assert fav.json()["is_favorite"] is True

    # List recipes
    all_recipes = client.get("/api/v1/recipes", headers=auth_headers)
    assert all_recipes.status_code == 200
    assert len(all_recipes.json()) >= 1


def test_meal_plan_generation(client, auth_headers):
    payload = {
        "diet_type": "High Protein",
        "target_calories": 2400,
        "days_count": 3,
        "allergies": ["peanuts"],
        "preferred_cuisines": ["Italian", "Asian"]
    }
    res = client.post("/api/v1/meal-plans/generate", headers=auth_headers, json=payload)
    assert res.status_code == 201
    plan = res.json()
    assert plan["days_count"] == 3
    assert "day_1" in plan["plan_data"]
    assert "day_2" in plan["plan_data"]


def test_history_aggregation(client, auth_headers):
    res = client.get("/api/v1/history", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "total_food_scans" in data
    assert "total_recipes" in data
    assert "total_meal_plans" in data
