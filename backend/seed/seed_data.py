"""
Seed script to populate initial users, collection teams, and realistic Dehradun waste reports.
Run via: python seed/seed_data.py
"""
import sys
import os
import json
from datetime import datetime, timezone

# Add backend directory to path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.database.database import SessionLocal, init_db
from app.models.user import User
from app.models.collection_team import CollectionTeam
from app.models.report import Report
from app.models.waste_analysis import WasteAnalysis
from app.models.collection_task import CollectionTask
from app.models.notification import Notification
from app.core.security import get_password_hash


def seed():
    print("Initializing database tables...")
    init_db()

    db = SessionLocal()
    try:
        # Check if users already seeded
        existing_admin = db.query(User).filter(User.email == "admin@doonclean.ai").first()
        if existing_admin:
            print("Database already contains seed data! Skipping...")
            return

        print("Seeding Users...")
        admin = User(
            id="usr_admin",
            name="Admin Dehradun Nagar Nigam",
            email="admin@doonclean.ai",
            password_hash=get_password_hash("admin123"),
            phone="+91 135 2712345",
            role="admin",
            avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
            points=500,
            level="Chief Municipal Officer",
            is_active=True
        )

        collector = User(
            id="usr_collector",
            name="Rajesh Kumar (Zone Lead)",
            email="collector@doonclean.ai",
            password_hash=get_password_hash("collector123"),
            phone="+91 98765 43210",
            role="collector",
            avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
            points=320,
            level="Senior Sanitation Lead",
            is_active=True
        )

        citizen = User(
            id="usr_citizen",
            name="Aarav Sharma",
            email="citizen@doonclean.ai",
            password_hash=get_password_hash("citizen123"),
            phone="+91 98970 12345",
            role="citizen",
            avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
            points=120,
            level="Eco Warrior (Level 3)",
            is_active=True
        )

        db.add_all([admin, collector, citizen])
        db.commit()

        print("Seeding Collection Teams...")
        teams = [
            CollectionTeam(
                id="team_01",
                name="Zone A Rapid Sanitation",
                zone="Central",
                leader="Rajesh Kumar",
                contact="+91 98765 43210",
                vehicle="UK07-GA-1024 (Electric Tipper)",
                status="Available",
                capacity="1.5 Tons",
                avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
            ),
            CollectionTeam(
                id="team_02",
                name="Rajpur Green Squad",
                zone="North",
                leader="Sunita Verma",
                contact="+91 98765 43211",
                vehicle="UK07-GB-4512 (Compactor Truck)",
                status="On Duty",
                capacity="3.0 Tons",
                avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
            ),
            CollectionTeam(
                id="team_03",
                name="Dharampur Eco Response",
                zone="East",
                leader="Vikram Negi",
                contact="+91 98765 43212",
                vehicle="UK07-GC-7821 (Hydraulic Dumper)",
                status="Available",
                capacity="2.5 Tons",
                avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
            ),
            CollectionTeam(
                id="team_04",
                name="ISBT Rapid Response",
                zone="South",
                leader="Amit Rawat",
                contact="+91 98765 43213",
                vehicle="UK07-GD-3390 (Tipper Van)",
                status="On Duty",
                capacity="1.8 Tons",
                avatar="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80"
            )
        ]
        db.add_all(teams)
        db.commit()

        print("Seeding Dehradun Waste Reports & AI Analyses...")
        reports_data = [
            {
                "id": "rep_01",
                "code": "RPT-2026-0842",
                "title": "Overflowing Plastic Waste near Clock Tower",
                "description": "Severe accumulation of single-use beverage containers and packaging blocking the north pedestrian sidewalk.",
                "image_url": "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80",
                "status": "Reported",
                "lat": 30.3244,
                "lng": 78.0418,
                "address": "Clock Tower North, Dehradun",
                "landmark": "Near GPO / Paltan Bazaar Entry",
                "zone": "Central",
                "team_id": None,
                "waste": {
                    "waste_type": "Plastic Waste",
                    "confidence": 94.2,
                    "severity": "High",
                    "estimated_quantity": "Large (~95 kg)",
                    "priority_score": 84,
                    "hazard_level": "Medium",
                    "recyclable": True,
                    "detected_items": ["PET Bottles (24)", "Polyethene Bags (35+)", "Food Containers (12)"],
                    "recommendation": "Requires electric tipper with high-density plastic segregation bins."
                }
            },
            {
                "id": "rep_02",
                "code": "RPT-2026-0839",
                "title": "Commercial Litter along Rajpur Road",
                "description": "Cartons, food packaging and beverage cans scattered near shopping complex parking entrance.",
                "image_url": "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
                "status": "In Progress",
                "lat": 30.3456,
                "lng": 78.0612,
                "address": "Rajpur Road Commercial Corridor",
                "landmark": "Near Silvercity Mall",
                "zone": "North",
                "team_id": "team_02",
                "waste": {
                    "waste_type": "Mixed Municipal Solid Waste",
                    "confidence": 89.5,
                    "severity": "Medium",
                    "estimated_quantity": "Medium (~60 kg)",
                    "priority_score": 68,
                    "hazard_level": "Medium",
                    "recyclable": False,
                    "detected_items": ["Carton scraps", "Food wraps", "Plastic cups"],
                    "recommendation": "Standard municipal vehicle collection."
                }
            },
            {
                "id": "rep_03",
                "code": "RPT-2026-0835",
                "title": "Heavy Construction Debris at Haridwar Bypass",
                "description": "Demolition concrete rubble and broken masonry dumped on roadside shoulder.",
                "image_url": "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80",
                "status": "Assigned",
                "lat": 30.2876,
                "lng": 78.0054,
                "address": "Haridwar Bypass Road",
                "landmark": "Near ISBT Flyover Pillar 14",
                "zone": "South",
                "team_id": "team_04",
                "waste": {
                    "waste_type": "Construction Debris (C&D)",
                    "confidence": 96.8,
                    "severity": "Critical",
                    "estimated_quantity": "Heavy (>500 kg)",
                    "priority_score": 92,
                    "hazard_level": "Critical",
                    "recyclable": False,
                    "detected_items": ["Concrete rubble", "Cement chunks", "Bricks", "Rebar"],
                    "recommendation": "Requires hydraulic JCB loader and heavy dumper."
                }
            },
            {
                "id": "rep_04",
                "code": "RPT-2026-0828",
                "title": "Vegetable Market Organic Waste at Paltan Bazaar",
                "description": "Rotting vegetables, fruit peelings and cardboard packaging from wholesale vendors.",
                "image_url": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
                "status": "Reported",
                "lat": 30.3211,
                "lng": 78.0389,
                "address": "Paltan Bazaar Market Lane",
                "landmark": "Clock Tower to Kotwali stretch",
                "zone": "Central",
                "team_id": None,
                "waste": {
                    "waste_type": "Organic / Food Waste",
                    "confidence": 91.2,
                    "severity": "High",
                    "estimated_quantity": "Medium-Large (~120 kg)",
                    "priority_score": 78,
                    "hazard_level": "High",
                    "recyclable": True,
                    "detected_items": ["Rotting produce", "Plantain leaves", "Corrugated boxes"],
                    "recommendation": "Direct routing to Kargi composting facility."
                }
            },
            {
                "id": "rep_05",
                "code": "RPT-2026-0814",
                "title": "Metal Scrap Dump near Dharampur Chowk",
                "description": "Abandoned corrugated iron sheets, rusted pipes and wires on roadside.",
                "image_url": "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80",
                "status": "Resolved",
                "lat": 30.3092,
                "lng": 78.0521,
                "address": "Dharampur Chowk Link Road",
                "landmark": "Opposite Electricity Substation",
                "zone": "East",
                "team_id": "team_03",
                "waste": {
                    "waste_type": "Metal Scrap",
                    "confidence": 88.0,
                    "severity": "Low",
                    "estimated_quantity": "Small (~35 kg)",
                    "priority_score": 42,
                    "hazard_level": "Low",
                    "recyclable": True,
                    "detected_items": ["Rusted GI sheets", "Wire bundles"],
                    "recommendation": "Scrap recycling depot transport."
                }
            },
            {
                "id": "rep_06",
                "code": "RPT-2026-0809",
                "title": "Sahastradhara Tourist Corridor Plastic Litter",
                "description": "Accumulation of disposable water bottles, snack pouches and takeaway boxes along scenic road.",
                "image_url": "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80",
                "status": "Reported",
                "lat": 30.3621,
                "lng": 78.1143,
                "address": "Sahastradhara Tourist Road",
                "landmark": "Near Mile Marker 4 Viewpoint",
                "zone": "North",
                "team_id": None,
                "waste": {
                    "waste_type": "Plastic Waste",
                    "confidence": 95.1,
                    "severity": "High",
                    "estimated_quantity": "Medium (~80 kg)",
                    "priority_score": 85,
                    "hazard_level": "Medium",
                    "recyclable": True,
                    "detected_items": ["Water bottles", "Chip packets", "Polystyrene plates"],
                    "recommendation": "Rapid squad collection before wind dispersal into riverbed."
                }
            },
            {
                "id": "rep_07",
                "code": "RPT-2026-0798",
                "title": "Illegal Dumping along Rispana River Bank",
                "description": "Critical municipal and plastic waste dumped near riverbank culvert, threatening water channel flow.",
                "image_url": "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
                "status": "In Progress",
                "lat": 30.3012,
                "lng": 78.0432,
                "address": "Rispana River Bank Bridge",
                "landmark": "Haridwar Road Crossway",
                "zone": "Central",
                "team_id": "team_01",
                "waste": {
                    "waste_type": "Mixed Municipal Solid Waste",
                    "confidence": 93.4,
                    "severity": "Critical",
                    "estimated_quantity": "Heavy (~300 kg)",
                    "priority_score": 95,
                    "hazard_level": "Critical",
                    "recyclable": False,
                    "detected_items": ["Mixed household refuse", "Plastic sacs", "C&D fines"],
                    "recommendation": "Emergency compactor intervention with environmental barricade."
                }
            },
            {
                "id": "rep_08",
                "code": "RPT-2026-0785",
                "title": "Canal Road Construction Material Spill",
                "description": "Masonry mortar chunks and broken clay tiles cleared from nearby renovation site.",
                "image_url": "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80",
                "status": "Resolved",
                "lat": 30.3398,
                "lng": 78.0187,
                "address": "Ballupur to Canal Road Link",
                "landmark": "Near Canal Bridge Bend",
                "zone": "West",
                "team_id": "team_03",
                "waste": {
                    "waste_type": "Construction Debris (C&D)",
                    "confidence": 92.0,
                    "severity": "Medium",
                    "estimated_quantity": "Medium (~110 kg)",
                    "priority_score": 64,
                    "hazard_level": "Low",
                    "recyclable": False,
                    "detected_items": ["Clay tiles", "Mortar lumps"],
                    "recommendation": "Cleared by Zone C cleanup crew."
                }
            }
        ]

        for item in reports_data:
            rep = Report(
                id=item["id"],
                report_code=item["code"],
                user_id=citizen.id,
                title=item["title"],
                description=item["description"],
                image_url=item["image_url"],
                latitude=item["lat"],
                longitude=item["lng"],
                address=item["address"],
                landmark=item["landmark"],
                zone=item["zone"],
                status=item["status"],
                assigned_team_id=item["team_id"],
                is_duplicate=False,
                duplicate_count=0
            )
            db.add(rep)
            db.flush()

            w = item["waste"]
            analysis = WasteAnalysis(
                report_id=rep.id,
                waste_type=w["waste_type"],
                confidence=int(round(w["confidence"])),
                severity=w["severity"],
                estimated_quantity=w["estimated_quantity"],
                priority_score=int(w["priority_score"]),
                hazard_level=w["hazard_level"],
                recyclable=w["recyclable"],
                detected_items=json.dumps(w["detected_items"]),
                recommendation=w["recommendation"],
                ai_model="mock_yolov8_ensemble"
            )
            db.add(analysis)

            # If assigned or in progress, create collection task
            if item["team_id"]:
                task = CollectionTask(
                    report_id=rep.id,
                    team_id=item["team_id"],
                    status=item["status"],
                    notes="Assigned to municipal route response crew."
                )
                db.add(task)

        # Add initial notifications
        notifications = [
            Notification(
                user_id=citizen.id,
                report_id="rep_01",
                title="AI Verification Complete",
                message="Your Clock Tower report was analyzed (High priority, 94% confidence). Nagar Nigam dispatched.",
                type="success"
            ),
            Notification(
                user_id=admin.id,
                report_id="rep_07",
                title="Critical Priority Alert",
                message="Rispana River Bank illegal dumping scored 95/100 priority score.",
                type="warning"
            ),
            Notification(
                user_id=collector.id,
                report_id="rep_02",
                title="Task Assignment",
                message="New task assigned: Rajpur Road Commercial Litter.",
                type="info"
            )
        ]
        db.add_all(notifications)

        db.commit()
        print("Database seeded successfully with users, teams, reports, AI inferences, and tasks!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed()
