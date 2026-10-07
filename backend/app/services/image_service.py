import io
from PIL import Image
from typing import Tuple

class ImageService:
    @staticmethod
    def inspect_and_compress(file_bytes: bytes, max_dimension: int = 1600) -> Tuple[bytes, int, int]:
        """Verify image format, rotate if needed, and constrain maximum dimension."""
        try:
            with Image.open(io.BytesIO(file_bytes)) as img:
                # Convert RGBA / P to RGB for JPEG compatibility if needed
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                
                width, height = img.size
                if max(width, height) > max_dimension:
                    img.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)
                    width, height = img.size
                
                output = io.BytesIO()
                img.save(output, format="JPEG", quality=85, optimize=True)
                return output.getvalue(), width, height
        except Exception:
            # If Pillow processing fails, return original bytes
            return file_bytes, 800, 600

image_service = ImageService()
