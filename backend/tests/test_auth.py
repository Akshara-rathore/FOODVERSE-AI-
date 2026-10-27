def test_register_success(client):
    response = client.post(
        "/api/v1/auth/register",
        json={"name": "Sarah Connor", "email": "sarah@foodverse.ai", "password": "SecurePassword99"}
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_register_duplicate_email(client, test_user):
    response = client.post(
        "/api/v1/auth/register",
        json={"name": "Duplicate User", "email": test_user.email, "password": "AnyPassword123"}
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]


def test_login_success(client, test_user):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": test_user.email, "password": "CulinarySecret123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data


def test_login_invalid_password(client, test_user):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": test_user.email, "password": "WrongPassword!"}
    )
    assert response.status_code == 401


def test_get_current_user_me(client, auth_headers, test_user):
    response = client.get("/api/v1/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user.email
    assert data["name"] == test_user.name


def test_unauthorized_access(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
