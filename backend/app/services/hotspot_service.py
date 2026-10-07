import numpy as np
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.report import Report
from sklearn.cluster import DBSCAN
from collections import Counter

# Static predefined known landmark clusters for Dehradun as realistic seed/baseline
DEFAULT_DEHRADUN_CLUSTERS = [
    {
        "id": "cluster_01",
        "name": "Paltan Bazaar & Clock Tower Corridor",
        "center": [30.3222, 78.0405],
        "radius": 450,
        "reportCount": 38,
        "averagePriority": 86,
        "priorityLevel": "High",
        "dominantWaste": "Plastic Waste",
        "cleanFrequency": "Daily x2",
        "zone": "Central",
        "description": "High pedestrian density and commercial market waste accumulation around evening hours."
    },
    {
        "id": "cluster_02",
        "name": "Rispana River Bridge & Bypass",
        "center": [30.2982, 78.0531],
        "radius": 600,
        "reportCount": 29,
        "averagePriority": 91,
        "priorityLevel": "Critical",
        "dominantWaste": "Construction Debris (C&D)",
        "cleanFrequency": "Daily",
        "zone": "South-East",
        "description": "Chronic illegal tipping zone near river embankments. High environmental and flood hazard."
    },
    {
        "id": "cluster_03",
        "name": "ISBT & Majra Terminal Surroundings",
        "center": [30.2715, 78.0005],
        "radius": 500,
        "reportCount": 22,
        "averagePriority": 78,
        "priorityLevel": "High",
        "dominantWaste": "Mixed Municipal Solid Waste",
        "cleanFrequency": "Daily",
        "zone": "South",
        "description": "High transit passenger litter and commercial food stall wrappers."
    },
    {
        "id": "cluster_04",
        "name": "Sahastradhara Road Vegetable Mandi",
        "center": [30.3421, 78.0772],
        "radius": 400,
        "reportCount": 16,
        "averagePriority": 62,
        "priorityLevel": "Medium",
        "dominantWaste": "Organic / Food Waste",
        "cleanFrequency": "Alternate Days",
        "zone": "East",
        "description": "Perishable organic produce piles and packaging near morning wholesale market."
    },
    {
        "id": "cluster_05",
        "name": "Prem Nagar University Circle",
        "center": [30.3341, 77.9575],
        "radius": 550,
        "reportCount": 19,
        "averagePriority": 70,
        "priorityLevel": "Medium",
        "dominantWaste": "Plastic Waste",
        "cleanFrequency": "Tri-weekly",
        "zone": "West",
        "description": "Student hostel corridor with high food packaging and beverage container litter."
    }
]

class HotspotService:
    @staticmethod
    def compute_hotspots(db: Session) -> List[Dict[str, Any]]:
        """
        Dynamically run DBSCAN on active database reports or merge with default clusters.
        """
        reports = db.query(Report).all()
        if len(reports) < 3:
            return DEFAULT_DEHRADUN_CLUSTERS

        # Extract coordinates in radians for Haversine metric
        coords = np.array([[r.latitude, r.longitude] for r in reports])
        kms_per_radian = 6371.0088
        epsilon = 0.5 / kms_per_radian  # 500 meters neighborhood

        try:
            dbscan = DBSCAN(eps=epsilon, min_samples=2, metric='haversine')
            labels = dbscan.fit_predict(np.radians(coords))
            
            unique_labels = set(labels)
            clusters = []

            for label in unique_labels:
                if label == -1:
                    continue  # Noise points
                
                cluster_reports = [reports[i] for i, l in enumerate(labels) if l == label]
                if not cluster_reports:
                    continue

                avg_lat = float(np.mean([r.latitude for r in cluster_reports]))
                avg_lng = float(np.mean([r.longitude for r in cluster_reports]))
                avg_prio = int(np.mean([r.priority_score for r in cluster_reports]))
                
                # Dominant waste
                waste_counter = Counter([r.waste_type for r in cluster_reports])
                dom_waste = waste_counter.most_common(1)[0][0] if waste_counter else "Mixed Waste"
                zone = cluster_reports[0].zone

                prio_level = "Critical" if avg_prio >= 85 else ("High" if avg_prio >= 65 else "Medium")

                clusters.append({
                    "id": f"cluster_{label + 1}",
                    "name": f"{cluster_reports[0].landmark or 'Dehradun'} Cluster",
                    "center": [round(avg_lat, 4), round(avg_lng, 4)],
                    "radius": 450,
                    "reportCount": len(cluster_reports),
                    "averagePriority": avg_prio,
                    "priorityLevel": prio_level,
                    "dominantWaste": dom_waste,
                    "cleanFrequency": "Daily",
                    "zone": zone,
                    "description": f"DBSCAN detected accumulation cluster of {len(cluster_reports)} waste incidents."
                })

            if clusters:
                return clusters
        except Exception as e:
            print(f"[HotspotService] DBSCAN error: {e}")

        return DEFAULT_DEHRADUN_CLUSTERS

hotspot_service = HotspotService()
