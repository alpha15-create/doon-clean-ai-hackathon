from typing import Tuple

class SeverityCalculator:
    @staticmethod
    def calculate_severity(
        waste_type: str,
        detected_count: int = 1,
        estimated_weight_kg: float = 50.0
    ) -> Tuple[str, str]:
        """
        Calculate severity level: Low, Medium, High, Critical
        Returns: (severity, hazard_level)
        """
        wt = (waste_type or "").lower()

        if "hazard" in wt or "medical" in wt:
            return "Critical", "Critical"
        
        if "construct" in wt or "debris" in wt or estimated_weight_kg > 400:
            return "High", "Critical"
        
        if "plastic" in wt:
            if detected_count > 20 or estimated_weight_kg > 80:
                return "High", "Medium"
            return "Medium", "Medium"
        
        if "e-waste" in wt:
            return "High", "High"
        
        if "organic" in wt:
            if estimated_weight_kg > 100:
                return "High", "Medium"
            return "Medium", "Low"

        return "Medium", "Medium"

severity_calculator = SeverityCalculator()
