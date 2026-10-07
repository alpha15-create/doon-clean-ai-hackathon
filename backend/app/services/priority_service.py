from typing import Tuple

class PriorityService:
    @staticmethod
    def calculate_priority(
        waste_type: str,
        severity: str,
        estimated_quantity: str,
        detected_count: int = 1,
        duplicate_count: int = 0,
        zone: str = "Central"
    ) -> Tuple[str, int]:
        """
        Calculate an explainable priority score (0 - 100) and priority tier.
        0-30 = Low, 31-60 = Medium, 61-80 = High, 81-100 = Critical.
        """
        score = 40  # Baseline

        # 1. Severity weight (up to +35 pts)
        sev_norm = (severity or "Medium").lower()
        if "crit" in sev_norm:
            score += 35
        elif "high" in sev_norm:
            score += 25
        elif "med" in sev_norm:
            score += 15
        else:
            score += 5

        # 2. Waste Type risk weight (up to +15 pts)
        wt = (waste_type or "").lower()
        if "hazard" in wt or "medical" in wt or "chem" in wt:
            score += 15
        elif "construct" in wt or "debris" in wt or "c&d" in wt:
            score += 12
        elif "plastic" in wt:
            score += 10
        elif "e-waste" in wt or "electronic" in wt:
            score += 8
        elif "organic" in wt:
            score += 6
        else:
            score += 5

        # 3. Estimated quantity weight (up to +10 pts)
        qty = (estimated_quantity or "").lower()
        if "heavy" in qty or "ton" in qty:
            score += 10
        elif "large" in qty:
            score += 7
        elif "medium" in qty:
            score += 4
        else:
            score += 2

        # 4. Duplicate cluster frequency (+3 per duplicate, max +10)
        score += min(duplicate_count * 3, 10)

        # 5. Zone sensitivity (Central market corridors have higher traffic density)
        if zone in ["Central", "South-East"]:
            score += 4

        # Clamp score between 10 and 100
        score = max(10, min(100, score))

        # Assign Tier
        if score >= 81:
            tier = "Critical"
        elif score >= 61:
            tier = "High"
        elif score >= 31:
            tier = "Medium"
        else:
            tier = "Low"

        return tier, score

priority_service = PriorityService()
