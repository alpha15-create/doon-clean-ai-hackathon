from typing import Optional, List
import io
from PIL import Image
import numpy as np

class ImageEmbeddingService:
    @staticmethod
    def extract_color_histogram(image_bytes: bytes) -> Optional[List[float]]:
        """
        Lightweight MVP image feature extractor using color histogram.
        Avoids requiring heavy PyTorch ResNet models for first deployment.
        """
        try:
            with Image.open(io.BytesIO(image_bytes)) as img:
                img = img.resize((64, 64)).convert("RGB")
                arr = np.array(img)
                # Compute normalized R, G, B histograms
                hist_r, _ = np.histogram(arr[:, :, 0], bins=8, range=(0, 256), density=True)
                hist_g, _ = np.histogram(arr[:, :, 1], bins=8, range=(0, 256), density=True)
                hist_b, _ = np.histogram(arr[:, :, 2], bins=8, range=(0, 256), density=True)
                vector = np.concatenate([hist_r, hist_g, hist_b]).tolist()
                return [round(float(v), 5) for v in vector]
        except Exception:
            return None

embedding_service = ImageEmbeddingService()
