from typing import Dict, List

WASTE_CATEGORIES = {
    "plastic": "Plastic Waste",
    "organic": "Organic / Food Waste",
    "paper": "Paper & Cardboard",
    "glass": "Glass Waste",
    "metal": "Scrap Metal",
    "e-waste": "E-Waste",
    "construction": "Construction Debris (C&D)",
    "mixed": "Mixed Municipal Solid Waste",
    "other": "Other Waste",
}

class WasteClassifier:
    @staticmethod
    def get_supported_categories() -> List[str]:
        return list(WASTE_CATEGORIES.values())

    @staticmethod
    def normalize_category(raw_label: str) -> str:
        label = (raw_label or "").lower()
        for key, val in WASTE_CATEGORIES.items():
            if key in label:
                return val
        return "Mixed Municipal Solid Waste"

classifier = WasteClassifier()
