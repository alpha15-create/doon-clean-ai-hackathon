import base64
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Request
from app.ai.waste_detector import waste_detector
from app.utils.helpers import api_response

router = APIRouter(prefix="/analyze", tags=["AI Analysis"])

@router.post("")
async def analyze_waste(
    request: Request,
    image: Optional[UploadFile] = File(None)
):
    image_bytes = None
    filename = "waste.jpg"

    if image:
        image_bytes = await image.read()
        filename = image.filename or filename
    else:
        # Check if sent as JSON body or base64
        content_type = request.headers.get("content-type", "")
        if "application/json" in content_type:
            try:
                body = await request.json()
                raw_data = body.get("image") or body.get("imageUrl") or ""
                if "base64," in raw_data:
                    b64_str = raw_data.split("base64,")[1]
                    image_bytes = base64.b64decode(b64_str)
            except Exception:
                pass

    analysis = waste_detector.analyze_image(image_bytes, filename)
    return api_response(analysis, message="Image analyzed successfully")
