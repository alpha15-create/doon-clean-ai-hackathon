# DoonClean AI — Smart Waste Management & Response System for Dehradun

A modern civic-technology frontend platform for the city of Dehradun, Uttarakhand, integrating **Citizen Crowdsourced Reporting**, **Computer Vision (YOLOv8) Waste & Severity Classification**, **Spatial Hotspot Clustering**, and **Municipal Fleet Dispatch & Routing**.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🛠 Tech Stack

- **React 19** + **Vite 8**
- **Tailwind CSS v4** (Civic Emerald theme, mobile-responsive layout)
- **React Router DOM v7** (Role-based protected routes)
- **React Leaflet & Leaflet** (Interactive maps, geotagging, hotspot circles, SVG map pins)
- **Recharts** (Municipal analytics, intake volume trends, waste category shares)
- **Axios** (Centralized API client with offline mock fallback)
- **Lucide React** (Modern clean iconography)

---

## 👥 Hackathon One-Click Demo Accounts

For hackathon evaluators and demo judges, one-click autofill credentials are built directly into the login screen:

| Role | Email | Password | Primary Features |
|---|---|---|---|
| **Citizen** | `citizen@doonclean.ai` | `password123` | Photo upload, GPS geotagging, 5-step report, 6-stage status timeline |
| **Admin** | `admin@doonclean.ai` | `password123` | Control room, Recharts metrics, complaint verification, fleet dispatch, hotspot density |
| **Collector** | `collector@doonclean.ai` | `password123` | Mobile-first driver console, pickup route map, one-tap clearance updates |

> **Pro Tip**: Use the **"Demo Role Switch"** button in the top navbar to instantly toggle between Citizen, Admin, and Collector views at any moment during a presentation!

---

## 🗺 Application Routes

### Public Routes
- `/` — Landing Page (Hero, How It Works, Features, Sample Metrics, Live Waste Map preview)
- `/login` — Authentication with 1-click demo autofill
- `/register` — Citizen registration with input validation

### Citizen Portal (`/citizen`)
- `/citizen` — Dashboard (Overview, active complaints, mini map, civic points)
- `/citizen/report` — **5-Step Report Waste Workflow** (Photo upload with demo presets, GPS location picker, description, AI inference breakdown preview, submission confirmation)
- `/citizen/reports` — My Reports (Filter by status/priority, search, pagination)
- `/citizen/reports/:id` — Report Details (Visual 6-stage lifecycle progress timeline, incident photo, AI metrics, location pin)

### Admin Operations (`/admin`)
- `/admin` — Sanitation Command Center (5 KPI cards, 4 Recharts charts, urgent action queue)
- `/admin/complaints` — Complaint Management (Search, sort, filter, quick verify, change status modal, fleet assign modal)
- `/admin/complaints/:id` — Complaint Inspection (Full details, duplicate warning, override priority, verify dialog)
- `/admin/hotspots` — Spatial Hotspot Intelligence (DBSCAN clusters across Dehradun, radius circles, cluster metrics)
- `/admin/analytics` — Zonal Citywide Analytics (Time filters: Today, 7D, 30D, 3M, regional clearance rates)
- `/admin/collection` — Fleet & Dispatch (Workload capacities, task queues, AI shortest path route generator)

### Sanitation Collector Portal (`/collector`)
- `/collector` — Driver Duty Console (Today's pickup waypoints, assigned vehicle telemetry)
- `/collector/tasks` — My Pickup Tasks (Filter by pending / in-progress / resolved, mobile quick action buttons)
- `/collector/tasks/:id` — Task Details (Turn-by-turn Google Maps link, accumulation photo, field resolution)

---

## 🔄 Backend & API Architecture

The frontend is architected to communicate strictly through `src/services/api.js` via Axios with the future FastAPI + Supabase backend:

```
React (UI Components)
      ↓
src/services/api.js (Centralized Client & Bearer JWT)
      ↓
FastAPI Backend (http://localhost:8000)
      ↓
Supabase Database & Storage
```

### Seamless Offline / Mock Mode
- Configured via `VITE_USE_MOCK=true` in `.env`.
- If the backend server is offline or unreachable, `api.js` transparently falls back to stateful localStorage mock data so demonstrations and judges' testing always work seamlessly without crashes or blank screens.
- When FastAPI is deployed, set `VITE_USE_MOCK=false` to switch to live production backend.

---

## 🛡 Security & Compliance
- No database credentials or Supabase service-role keys are bundled in frontend code.
- JWT tokens are isolated and injected via Axios request interceptors.
- All sample statistics and geospatial hotspots are labeled as prototype/demo data.
