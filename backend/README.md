# DOONCLEAN AI — Backend

> **Smart Waste Management & Rapid Response System for Dehradun Municipal Corporation (Nagar Nigam)**

A high-performance, asynchronous REST API backend built with **FastAPI**, **SQLAlchemy 2.0**, and **Pydantic v2**. Designed to power the DoonClean AI React frontend with real-time AI waste detection, automated geospatial duplicate detection, severity & priority scoring, fleet management, and dynamic route optimization.

---

## 🛠️ Technology Stack

- **Framework:** FastAPI (Python 3.11+) with asynchronous ASGI (`uvicorn`)
- **Database ORM:** SQLAlchemy 2.x & Alembic migrations
- **Databases Supported:**
  - **PostgreSQL** via **Supabase** (Production)
  - **SQLite** (`sqlite:///./doonclean.db`) for immediate local zero-config development
- **Object Storage:**
  - **Supabase Storage** bucket (`waste-reports`)
  - **Local filesystem** fallback (`uploads/`) with static file serving
- **Security & Auth:** Secure BCrypt password hashing & PyJWT tokens
- **Computer Vision / AI:**
  - Modular AI architecture supporting **Mock AI** (`AI_MODE=mock`) and **Ultralytics YOLO** (`AI_MODE=yolo`)
  - Waste classification, confidence estimation, hazard analysis, and dynamic recommendations
- **Geospatial & Analytics:**
  - Haversine distance spatial clustering (<75 meters within 24h for duplicate report detection)
  - Scikit-learn DBSCAN for hotspot cluster generation across Dehradun municipal wards
  - Greedy nearest-neighbor TSP solver for collection route optimization

---

## 🚀 Quick Start (Zero Configuration)

### 1. Prerequisites
- Python 3.11 or higher
- Git

### 2. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Initialize Database & Seed Demo Data
Run the automated seed script to populate realistic Dehradun locations (Clock Tower, Rajpur Road, ISBT, Paltan Bazaar, Sahastradhara, Rispana River, etc.):
```bash
python seed/seed_data.py
```

### 4. Start the Backend Server
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Once running, the backend is available at:
- **API Root:** [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check:** [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

## 🔑 Demo Accounts

The seed script creates the following ready-to-test accounts:

| Role | Email | Password | Name / Designation |
| :--- | :--- | :--- | :--- |
| **Citizen** | `citizen@doonclean.ai` | `citizen123` | Aarav Sharma (Eco Contributor) |
| **Admin** | `admin@doonclean.ai` | `admin123` | Admin Dehradun Nagar Nigam |
| **Collector** | `collector@doonclean.ai` | `collector123` | Rajesh Kumar (Zone Lead) |

*(Note: Any new citizen account can also be registered directly via `/api/auth/register`)*

---

## ⚙️ Configuration (`.env`)

Copy `.env.example` to `.env` to configure external services:

```ini
# Server Settings
HOST=0.0.0.0
PORT=8000
DEBUG=True

# Database (PostgreSQL / Supabase)
# Leave empty or set to sqlite:///./doonclean.db for local file database
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres

# Supabase Storage (Optional - falls back to local uploads/ directory)
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_KEY
SUPABASE_STORAGE_BUCKET=waste-reports

# Authentication
SECRET_KEY=doonclean_ai_super_secret_jwt_key_for_hackathon_demo_2026
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# AI Configuration
# 'mock' = zero heavy dependencies, instant evaluation
# 'yolo' = Ultralytics YOLO inference model
AI_MODE=mock
AI_MODEL_PATH=models/waste_detector.pt

# CORS Origins
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```

---

## 🤖 AI Detection & Architecture

DoonClean AI features a pluggable AI architecture:

- **Mock AI Mode (`AI_MODE=mock`):**
  Uses realistic multi-class heuristics to identify Plastic Waste, Municipal Solid Waste, Construction Debris, Organic Waste, Hazard Levels, and equipment recommendations. Instant execution with no GPU or external weight downloads required.
- **YOLO Mode (`AI_MODE=yolo`):**
  To use a custom trained PyTorch or YOLOv8 checkpoint:
  1. Install `ultralytics`: `pip install ultralytics torch`
  2. Place model weights at `backend/models/waste_detector.pt`
  3. Set `AI_MODE=yolo` in `.env`
  4. The model automatically performs object detection and bounding box inference.

---

## 📡 API Endpoints Overview

All responses adhere to the standard JSON format expected by the frontend:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Authentication (`/api/auth`)
- `POST /api/auth/login` — Login with email and password
- `POST /api/auth/register` — Citizen registration
- `GET /api/auth/me` — Current authenticated user profile

### Reports (`/api/reports`)
- `GET /api/reports` — List waste reports with optional status, priority, and search filters
- `GET /api/reports/my` — Get reports submitted by current citizen
- `GET /api/reports/{id}` — Get single report details including timeline and AI inference
- `POST /api/reports` — Create a report (accepts multipart file or JSON with base64 image)
- `PUT /api/reports/{id}/status` — Update report status (`Verified`, `In Progress`, `Resolved`)

### AI Analysis (`/api/analyze`)
- `POST /api/analyze` — Run waste detection inference on uploaded photo

### Dashboard & Analytics (`/api/dashboard`)
- `GET /api/dashboard` — High-level KPI overview (total, pending, high priority, resolved, resolution rate)
- `GET /api/dashboard/analytics` — Temporal and geospatial charts (7d, 30d, 90d)

### Hotspots & Geospatial (`/api/hotspots`)
- `GET /api/hotspots` — Active waste hotspot clusters calculated using DBSCAN

### Fleet & Collection (`/api/collection`, `/api/routes`)
- `GET /api/collection` — List municipal collection squads & vehicle statuses
- `POST /api/collection/assign` — Assign report to a sanitation team
- `PUT /api/collection/{id}/status` — Update sanitation task status
- `POST /api/routes/generate` — Generate optimized TSP shortest collection route

### Notifications (`/api/notifications`)
- `GET /api/notifications` — Notification alerts for citizens and municipal admins

---

## 🧪 Running Tests

The test suite covers authentication, reports lifecycle, AI inference, dashboard metrics, route generation, and storage fallbacks:

```bash
python -m pytest tests -v
```

All 15 tests run and pass synchronously against the test fixtures.

---

## 🗄️ Database Migrations (Alembic)

To create a new migration after updating SQLAlchemy models:
```bash
python -m alembic revision --autogenerate -m "Describe migration"
```

To apply pending migrations:
```bash
python -m alembic upgrade head
```
