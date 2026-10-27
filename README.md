# FoodVerse AI — Intelligent Food Platform

FoodVerse AI is a complete, production-ready, full-stack multi-modal food intelligence platform. It combines computer vision food recognition, nutritional breakdown calibrated against verified USDA reference data, optical freshness assessment, kitchen hygiene auditing, cooking assistance, personalized meal planning, and an interactive culinary AI assistant.

---

## 1. Feature List

* **Food Recognition & Nutrition Scanner**:
  * Drag-and-drop or select dish photos.
  * Real-time recognition, confidence score, and estimated portion size.
  * Nutritional calculation: Calories, Protein, Carbohydrates, Fats, Dietary Fiber, Sugar, and Sodium.
  * Interactive macro breakdown charts (Recharts) and micronutrient profiles.
  * Explicit notices distinguishing visual estimates from medical prescriptions.

* **Optical Freshness Assessment**:
  * Evaluates visual surface decay, enzymatic browning, and dehydration.
  * Computes a calibrated Freshness Index (0-100) and shelf-life horizon in days.
  * Delivers storage temperature guidance and critical food-safety limitation disclaimers.

* **Kitchen Hygiene Auditing**:
  * Ingests food preparation images and short walkthrough video clips (`.mp4`, `.mov`, `.avi`).
  * Validates file size and samples key video frames with OpenCV.
  * Detects cross-contamination risks, surface cleanliness, and timestamps observed anomalies.
  * Generates an actionable corrective sanitation checklist.

* **Smart Cooking Assistant**:
  * Creates custom chef-crafted recipes tailored to ingredients on hand.
  * Filters by cooking time, difficulty, serving count, and dietary constraints (e.g. Vegetarian, Keto, Gluten-Free).
  * Outlines preparation steps with chef pro tips, estimated macros, and favorite cookbook storage.

* **Personalized Meal Planner**:
  * Generates structured 1-Day, 3-Day, or 7-Day meal plans matching custom caloric budgets (1200 - 4000 kcal).
  * Organizes daily schedules into Breakfast, Lunch, Dinner, and Afternoon Snacks.
  * Respects allergen exclusions (e.g. Peanuts, Shellfish, Dairy).

* **Multimodal AI Assistant**:
  * Interactive dialogue on culinary techniques, nutrition science, and food preservation.
  * Includes pre-built prompt suggestions and speech output toggle via the Web Speech API.

* **User History & Data Isolation**:
  * Persists past food analyses, freshness checks, recipes, meal plans, and hygiene audits.
  * Category tabs, detail inspection, and deletion support strictly scoped to the logged-in user.

* **Profile & Settings**:
  * Manage account name, default diet focus, and daily calorie targets.
  * Live status indicator reflecting connected AI provider and database health.

---

## 2. Technology Stack

### Frontend
* **Framework**: React 18 with Vite
* **Language**: TypeScript
* **Styling**: Tailwind CSS with custom design system tokens
* **Icons**: Lucide React
* **Charts**: Recharts
* **Routing**: React Router v6
* **Testing**: Vitest & Testing Library with jsdom

### Backend
* **Framework**: Python 3.13 & FastAPI
* **Validation**: Pydantic v2 with strict schemas
* **ORM & Database**: SQLAlchemy 2.0 with SQLite (local development) and PostgreSQL (production)
* **Migrations**: Alembic
* **Authentication**: JWT (PyJWT HS256) with bcrypt password hashing
* **Image Processing**: Pillow & OpenCV (for video frame sampling)
* **Testing**: Pytest & FastAPI TestClient

---

## 3. UI Design System Tokens

The application employs a signature palette designed for a modern food-tech SaaS:

| Token | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Background** | `#F7F7FC` | Main application backdrop |
| **Surface** | `#FFFFFF` | Cards, forms, modals, and panels |
| **Primary** | `#5546A6` | Lavender/purple primary actions and navigation |
| **Primary Light** | `#EEEAFB` | Selected states and tinted pill backgrounds |
| **Secondary** | `#8375D1` | Secondary actions and chart accents |
| **Accent Coral** | `#F07868` | Food-related highlights, warnings, and accents |
| **Main Text** | `#202039` | Primary headings and labels |
| **Secondary Text** | `#77778F` | Supporting metadata and descriptions |
| **Border** | `#E7E5F0` | Dividers and container boundaries |
| **Success** | `#27866B` | Positive states and fresh items |
| **Warning** | `#D18A32` | Caution and prompt consumption states |
| **Error** | `#C74755` | Spoiled items and destructive actions |
| **Dark Navigation**| `#22213B` | Midnight navy sidebar |

Typography:
* **Headings**: `Plus Jakarta Sans`
* **Body / Numbers**: `DM Sans`

---

## 4. Directory Structure

```
Food/
├── backend/
│   ├── alembic/              # Alembic database migrations
│   │   ├── versions/
│   │   └── env.py
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py       # Auth dependencies (get_current_user, get_db)
│   │   │   └── v1/           # Versioned REST endpoints (auth, food, recipes, etc.)
│   │   ├── core/
│   │   │   ├── config.py     # Pydantic BaseSettings loading from .env
│   │   │   ├── database.py   # SQLAlchemy engine & session factory
│   │   │   ├── logging.py    # Structured logger
│   │   │   └── security.py   # bcrypt password hashing & JWT handling
│   │   ├── models/           # SQLAlchemy ORM entities (User, Food, Recipe, etc.)
│   │   ├── schemas/          # Pydantic request & response validation schemas
│   │   ├── services/
│   │   │   ├── ai/           # Provider interface, Gemini, OpenAI, Factory
│   │   │   ├── nutrition/    # USDA reference composite dataset
│   │   │   └── storage_service.py # Upload sanitization & frame extraction
│   │   └── main.py           # FastAPI application entrypoint & static mounts
│   ├── tests/                # Pytest unit & integration test suite
│   ├── .env.example          # Environment variable template
│   ├── alembic.ini           # Alembic migration configuration
│   ├── Dockerfile            # Container definition for backend
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI (Button, Card, Badge, Input, Alert)
│   │   │   └── layout/       # Sidebar, TopBar, DashboardLayout
│   │   ├── context/          # AuthContext & Session management
│   │   ├── pages/            # LandingPage, FoodScanner, Freshness, Hygiene, etc.
│   │   ├── services/         # Centralized Axios API client
│   │   ├── tests/            # Vitest component & page unit tests
│   │   ├── types/            # TypeScript interfaces aligned with backend
│   │   ├── App.tsx           # React Router route hierarchy
│   │   └── main.tsx          # DOM root mount
│   ├── Dockerfile            # Multi-stage production container
│   ├── nginx.conf            # Nginx reverse proxy configuration
│   ├── package.json          # Node dependencies & test scripts
│   ├── tailwind.config.js    # Design system tokens configuration
│   ├── tsconfig.json         # TypeScript compiler configuration
│   └── vite.config.js        # Vite build & proxy settings
├── docker-compose.yml        # Multi-container orchestration (PostgreSQL + API + UI)
├── ARCHITECTURE.md           # In-depth system architecture documentation
└── README.md                 # Project documentation
```

---

## 5. Prerequisites

* **Node.js**: v18.0+ (Tested on v24.21.0)
* **Python**: 3.11+ (Tested on Python 3.13.5)
* **npm**: v9.0+
* **Git** (optional)
* **Docker & Docker Compose** (optional, for containerized run)

---

## 6. Local Installation & Setup

### Step 1: Clone or Navigate to the Workspace
```bash
cd Food
```

### Step 2: Configure Backend Environment
Copy the example environment configuration into `backend/.env`:
```bash
cd backend
cp .env.example .env
```
Inside `backend/.env`, you can customize settings. Defaults for local development use SQLite:
```env
ENVIRONMENT=development
HOST=127.0.0.1
PORT=8000
DEBUG=true
JWT_SECRET=foodverse-local-dev-secret-key-32chars-minimum-long
DATABASE_URL=sqlite:///./foodverse.db
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
AI_PROVIDER=gemini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
ENABLE_OFFLINE_DEMO_FALLBACK=true
```

*(Note: If `GEMINI_API_KEY` is not provided, the platform automatically activates the USDA reference baseline mode, enabling testing without external fees or quota limits).*

### Step 3: Install Backend Dependencies & Apply Database Migrations
```bash
# In backend directory
pip install -r requirements.txt
alembic upgrade head
```

### Step 4: Install Frontend Dependencies
```bash
# Navigate to frontend directory
cd ../frontend
npm install
```

---

## 7. Running the Application

### Start the Backend Server
```bash
# From the project root or backend directory:
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI backend will start on `http://127.0.0.1:8000`.
* Interactive OpenAPI Documentation: `http://127.0.0.1:8000/docs`
* ReDoc Documentation: `http://127.0.0.1:8000/redoc`
* Health Check Endpoint: `http://127.0.0.1:8000/api/v1/health`

### Start the Frontend Dev Server
In a separate terminal:
```bash
cd frontend
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 8. Running Automated Tests

### Run Backend Tests (Pytest)
```bash
python -m pytest backend/tests/test_api_endpoints.py -v
```
*Covers registration, authentication, token issuance, user profiles, food analysis persistence, recipe generation, meal planning, freshness checks, hygiene audits, and health endpoints.*

### Run Frontend Tests (Vitest)
```bash
cd frontend
npm run test
```
*Covers UI components, public landing page, login & registration form validation.*

### Run Frontend TypeScript Check
```bash
cd frontend
npm run lint
```

---

## 9. Production Build & Deployment

### Frontend Production Build
```bash
cd frontend
npm run build
```
Generates optimized static assets in `frontend/dist/`. Compatible with Vercel, Netlify, Cloudflare Pages, or AWS S3/CloudFront.

### Docker Multi-Container Deployment
To launch the complete production stack (PostgreSQL 16 database, FastAPI backend, and Nginx frontend):
```bash
docker-compose up --build -d
```
* The frontend will be accessible at `http://localhost:3000`.
* The backend API will be available at `http://localhost:8000`.

---

## 10. AI Provider Configuration Guide

FoodVerse AI supports live multimodal AI models through Google Gemini (`gemini-2.5-flash`, `gemini-1.5-flash`).

1. Obtain a free or paid API key from [Google AI Studio](https://aistudio.google.com/).
2. Open `backend/.env`.
3. Set your key:
   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=AIzaSy...
   GEMINI_MODEL=gemini-2.5-flash
   ```
4. Restart the backend service. The application TopBar will immediately reflect `Live Gemini AI Active`.

---

## 11. Security & Privacy Disclaimers

1. **Password Safety**: Passwords are cryptographically salted and hashed using `bcrypt` (12 rounds) and never stored in plaintext.
2. **Media Sanitization**: Uploaded filenames are scrubbed and saved with randomly generated UUIDs inside an isolated upload directory. Path traversal attempts are rejected.
3. **Data Scoping**: Every private query scopes records strictly to the JWT authenticated user (`User.id`).
4. **Food Safety Disclaimer**: Automated freshness and hygiene outputs are visual heuristics and do NOT substitute for certified microbiological laboratory pathogen tests (Salmonella, Listeria, E. coli) or official health department inspections.
