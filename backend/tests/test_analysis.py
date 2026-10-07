import io
from PIL import Image

def test_analyze_image_mock(client):
    # Create simple in-memory test image
    img = Image.new("RGB", (100, 100), color=(73, 109, 137))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)

    files = {"image": ("plastic_test.jpg", buf, "image/jpeg")}
    response = client.post("/api/analyze", files=files)
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    data = body["data"]
    assert "wasteType" in data
    assert "confidence" in data
    assert "severity" in data
    assert "priorityScore" in data
    assert isinstance(data["detectedItems"], list)
