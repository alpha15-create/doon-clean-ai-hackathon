def test_dashboard_overview(client):
    response = client.get("/api/dashboard")
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    data = body["data"]
    assert "totalReports" in data
    assert "pendingReports" in data
    assert "resolved" in data
    assert "resolutionRate" in data

def test_dashboard_analytics(client):
    response = client.get("/api/dashboard/analytics?range=7d")
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    data = body["data"]
    assert "dailyReports" in data or "reportsByZone" in data or "wasteDistribution" in data

def test_hotspots_list(client):
    response = client.get("/api/hotspots")
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert isinstance(body["data"], list)
