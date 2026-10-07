import io
import pytest
from PIL import Image
from app.services.storage_service import storage_service

@pytest.mark.anyio
async def test_storage_fallback():
    # Test uploading image bytes to fallback storage
    img = Image.new("RGB", (60, 60), color=(20, 150, 80))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    content = buf.getvalue()

    url, path = await storage_service.upload_image(content, "test_upload.jpg")
    assert url is not None
    assert "/uploads/" in url or "supabase" in url
    assert "test_upload" in url or "DWN" in path
