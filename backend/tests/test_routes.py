def test_get_collection_teams(client):
    response = client.get("/api/collection")
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert isinstance(body["data"], list)
    assert len(body["data"]) >= 4

def test_generate_optimized_route(client):
    payload = {
        "taskIds": ["rep_01", "rep_02", "rep_03"]
    }
    response = client.post("/api/routes/generate", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    data = body["data"]
    assert "routeId" in data
    assert "totalDistanceKm" in data
    assert "waypoints" in data or "waypointsCount" in data
