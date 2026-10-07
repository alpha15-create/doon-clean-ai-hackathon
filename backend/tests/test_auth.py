import os

def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "DoonClean AI" in data["service"]

def test_login_success(client):
    payload = {
        "email": "admin@doonclean.ai",
        "password": "admin123"
    }
    response = client.post("/api/auth/login", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert "token" in body["data"]
    assert body["data"]["user"]["role"] == "admin"

def test_login_invalid_password(client):
    payload = {
        "email": "admin@doonclean.ai",
        "password": "wrongpassword"
    }
    response = client.post("/api/auth/login", json=payload)
    assert response.status_code == 401
    body = response.json()
    assert body["success"] is False

def test_register_and_get_me(client):
    email = f"test_{os.urandom(4).hex()}@doonclean.ai"
    reg_payload = {
        "fullName": "Test Resident",
        "email": email,
        "password": "securepassword123",
        "phone": "+91 99999 11111",
        "role": "citizen"
    }
    reg_res = client.post("/api/auth/register", json=reg_payload)
    assert reg_res.status_code == 200
    reg_body = reg_res.json()
    assert reg_body["success"] is True
    token = reg_body["data"]["token"]

    # Verify me endpoint
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    me_body = me_res.json()
    assert me_body["data"]["email"] == email
