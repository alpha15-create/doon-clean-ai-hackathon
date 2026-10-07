import os
from typing import Optional, Any
from app.config import settings

class ModelLoader:
    _model: Optional[Any] = None

    @classmethod
    def load_yolo_model(cls) -> Optional[Any]:
        """
        Conditionally loads Ultralytics YOLO model if AI_MODE=yolo and weight exists.
        Falls back safely to None (mock mode) otherwise.
        """
        if settings.AI_MODE.lower() != "yolo":
            return None
        
        if cls._model is not None:
            return cls._model

        model_path = settings.AI_MODEL_PATH
        if not os.path.exists(model_path):
            print(f"[ModelLoader] YOLO weights not found at '{model_path}'. Running in mock AI mode.")
            return None

        try:
            from ultralytics import YOLO
            cls._model = YOLO(model_path)
            print(f"[ModelLoader] Successfully loaded YOLO model from {model_path}")
            return cls._model
        except Exception as e:
            print(f"[ModelLoader] Could not load YOLO model: {e}. Falling back to mock AI mode.")
            return None

model_loader = ModelLoader()
