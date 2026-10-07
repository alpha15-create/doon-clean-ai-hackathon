from typing import Tuple
from app.core.exceptions import ValidationException

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

def validate_image_file(filename: str, content_type: str, file_size: int) -> bool:
    """Validate uploaded image extension, MIME type, and size."""
    if not filename:
        raise ValidationException("Image filename is required")
    
    ext = filename.split(".")[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise ValidationException(f"Unsupported image format '.{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}")
    
    if content_type and content_type.lower() not in ALLOWED_MIME_TYPES:
        raise ValidationException(f"Unsupported content type '{content_type}'. Must be JPEG, PNG, or WEBP")
    
    if file_size > MAX_IMAGE_SIZE_BYTES:
        raise ValidationException(f"Image size exceeds 10 MB limit (Current: {file_size / (1024*1024):.2f} MB)")
    
    return True

def validate_coordinates(lat: float, lng: float) -> Tuple[float, float]:
    """Validate latitude and longitude ranges."""
    if not (-90.0 <= lat <= 90.0):
        raise ValidationException(f"Latitude must be between -90 and 90. Got: {lat}")
    if not (-180.0 <= lng <= 180.0):
        raise ValidationException(f"Longitude must be between -180 and 180. Got: {lng}")
    return lat, lng
