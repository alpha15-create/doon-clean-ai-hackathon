def test_get_all_reports(client):
    response = client.get("/api/reports")
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert isinstance(body["data"], list)
    assert len(body["data"]) > 0

def test_get_report_by_id(client):
    response = client.get("/api/reports/rep_01")
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["data"]["id"] in ["rep_01", "RPT-2026-0842"]
    assert "wasteType" in body["data"]
    assert "timeline" in body["data"]

def test_create_report_json(client):
    # Log in as citizen
    login_res = client.post("/api/auth/login", json={"email": "citizen@doonclean.ai", "password": "citizen123"})
    token = login_res.json()["data"]["token"]

    payload = {
        "title": "Overflowing bin on Gandhi Road",
        "description": "Garbage bin overflowing on pedestrian sidewalk.",
        "wasteType": "Plastic Waste",
        "location": {
            "address": "Gandhi Road, Dehradun",
            "landmark": "Near Prince Chowk",
            "lat": 30.3182,
            "lng": 78.0354,
            "zone": "Central"
        }
    }
    create_res = client.post(
        "/api/reports",
        json=payload,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert create_res.status_code in [200, 201]
    body = create_res.json()
    assert body["success"] is True
    assert body["data"]["wasteType"] == "Plastic Waste"
    assert "priorityScore" in body["data"]

def test_update_report_status(client):
    # Log in as admin
    login_res = client.post("/api/auth/login", json={"email": "admin@doonclean.ai", "password": "admin123"})
    token = login_res.json()["data"]["token"]

    status_payload = {
        "status": "In Progress",
        "note": "Sanitation crew en route"
    }
    res = client.put(
        "/api/reports/rep_01/status",
        json=status_payload,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200
    body = res.json()
    assert body["success"] is True
    assert body["data"]["status"] == "In Progress"
