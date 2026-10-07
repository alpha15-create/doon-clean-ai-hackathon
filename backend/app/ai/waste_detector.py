import random
from typing import Dict, Any, Optional
from app.config import settings
from app.ai.model_loader import model_loader
from app.ai.classifier import classifier
from app.ai.severity import severity_calculator
from app.services.priority_service import priority_service

MOCK_INFERENCES = [
    {
        "wasteType": "Plastic Waste",
        "confidence": 94,
        "severity": "High",
        "estimatedQuantity": "Large (~95 kg)",
        "priorityScore": 84,
        "hazardLevel": "Medium",
        "recyclable": True,
        "detectedItems": ["PET Bottles (24)", "Polyethene Bags (35+)", "Food Packaging (12)"],
        "recommendation": "Requires electric tipper with high-density plastic segregation bins.",
        "detectedCount": 24,
    },
    {
        "wasteType": "Mixed Municipal Solid Waste",
        "confidence": 91,
        "severity": "High",
        "estimatedQuantity": "Medium-Large (~150 kg)",
        "priorityScore": 79,
        "hazardLevel": "High",
        "recyclable": False,
        "detectedItems": ["Mixed packaging", "Organic food scraps", "Cardboard boxes", "Discarded textiles"],
        "recommendation": "Immediate municipal compactor truck pickup required to avoid stray animal scattering.",
        "detectedCount": 16,
    },
    {
        "wasteType": "Construction Debris (C&D)",
        "confidence": 97,
        "severity": "High",
        "estimatedQuantity": "Heavy (>500 kg)",
        "priorityScore": 91,
        "hazardLevel": "Critical",
        "recyclable": False,
        "detectedItems": ["Concrete rubble", "Cement plaster chunks", "Bricks", "Rebar shards"],
        "recommendation": "Requires hydraulic JCB loader and dedicated C&D dump transport.",
        "detectedCount": 8,
    },
    {
        "wasteType": "Organic / Food Waste",
        "confidence": 95,
        "severity": "Medium",
        "estimatedQuantity": "Medium (~85 kg)",
        "priorityScore": 64,
        "hazardLevel": "Low",
        "recyclable": True,
        "detectedItems": ["Rotting vegetable heaps", "Fruit peels", "Sugarcane bagasse"],
        "recommendation": "Route to Central Doon bio-methanation and composting facility.",
        "detectedCount": 14,
    },
    {
        "wasteType": "E-Waste",
        "confidence": 89,
        "severity": "Medium",
        "estimatedQuantity": "Small-Medium (~40 kg)",
        "priorityScore": 68,
        "hazardLevel": "High",
        "recyclable": True,
        "detectedItems": ["Circuit boards", "Monitor casing", "Power cables", "Lead batteries"],
        "recommendation": "Safely transport to Authorized Recycling Hub, Selaqui.",
        "detectedCount": 6,
    }
]

class WasteDetector:
    def analyze_image(self, image_bytes: Optional[bytes] = None, filename: str = "") -> Dict[str, Any]:
        """
        Analyze waste image using YOLO if enabled & loaded, or realistic mock simulation.
        """
        yolo_model = model_loader.load_yolo_model()
        if yolo_model is not None and image_bytes:
            try:
                # Real YOLO inference execution
                import io
                from PIL import Image
                img = Image.open(io.BytesIO(image_bytes))
                results = yolo_model(img)
                # Parse bounding boxes and classes
                detections = []
                for r in results:
                    for c in r.boxes.cls:
                        class_name = yolo_model.names[int(c)]
                        detections.append(class_name)

                waste_type = classifier.normalize_category(detections[0] if detections else "Plastic Waste")
                count = len(detections) or 5
                sev, hazard = severity_calculator.calculate_severity(waste_type, count)
                tier, prio_score = priority_service.calculate_priority(waste_type, sev, "Medium (~60 kg)", count)

                return {
                    "wasteType": waste_type,
                    "confidence": 92,
                    "severity": sev,
                    "estimatedQuantity": "Medium (~60 kg)",
                    "priorityScore": prio_score,
                    "hazardLevel": hazard,
                    "recyclable": waste_type == "Plastic Waste",
                    "detectedItems": list(set(detections)) if detections else [waste_type],
                    "recommendation": f"Dispatched for {waste_type} municipal sorting.",
                    "detectedCount": count,
                }
            except Exception as e:
                print(f"[WasteDetector] YOLO inference error: {e}. Falling back to mock detection.")

        # Default realistic mock detection
        choice = random.choice(MOCK_INFERENCES).copy()
        return choice

waste_detector = WasteDetector()
