# FoodVerse AI — System Architecture & Design Specification

## 1. Architectural Overview

FoodVerse AI is architected as a decoupled, full-stack multi-modal food intelligence platform designed for performance, modularity, type safety, and security.

```
+-----------------------------------------------------------------------------------+
|                                  USER / CLIENT                                    |
|                      Desktop / Tablet / Mobile Browser                            |
+-----------------------------------------------------------------------------------+
                                       |
                                       | HTTPS / REST / JSON
                                       v
+-----------------------------------------------------------------------------------+
|                        FRONTEND APPLICATION (React 18 + Vite)                     |
|                                                                                   |
|  - UI Layer: Tailwind CSS (Lavender #5546A6, Coral #F07868, Midnight Navy #22213B)|
|  - Router: React Router v6 (Public, Protected Guards)                             |
|  - Visualizations: Recharts Macro & Caloric Visualizers                           |
|  - State & Auth: AuthContext with JWT in LocalStorage                             |
|  - API Client: Centralized Axios client with automatic Bearer injection          |
+-----------------------------------------------------------------------------------+
                                       |
                                       | Proxy /api/v1 -> Backend (Port 8000)
                                       v
+-----------------------------------------------------------------------------------+
|                         BACKEND SERVICE (FastAPI + Python 3.13)                  |
|                                                                                   |
|  - API Routing: Versioned Routers (/api/v1/...)                                   |
|  - Security: PyJWT (HS256) + bcrypt password hashing                              |
|  - Persistence: SQLAlchemy ORM 2.0 with Alembic Migrations                        |
|  - Storage: Sandboxed Upload Management (UUID, format validation, size caps)      |
|  - Error Handling: Centralized exception handler & structured logging             |
+-----------------------------------------------------------------------------------+
              |                                            |
              | SQL Dialect                                | Multi-Modal Vision & Prompts
              v                                            v
+-----------------------------+             +---------------------------------------+
|      DATABASE LAYER         |             |           AI PROVIDER LAYER           |
|                             |             |                                       |
| - Local Dev: SQLite         |             | - BaseAIProvider Interface            |
| - Production: PostgreSQL 16 |             | - GeminiProvider (google.genai SDK)   |
| - Alembic Schema Migrations |             | - OpenAIProvider Adapter              |
|                             |             | - USDA Reference Composite Calibration|
+-----------------------------+             +---------------------------------------+
```

---

## 2. Multi-Modal AI Provider Subsystem

The AI layer is structured around the `BaseAIProvider` abstraction to prevent vendor lock-in:

1. **`BaseAIProvider` (Abstract Interface)**:
   - `recognize_food`: Vision inference for food recognition, macro calculation, and nutritional scoring.
   - `analyze_freshness`: Optical inspection of surface discoloration, dehydration, and mold risks.
   - `audit_kitchen_hygiene`: Multi-frame inspection of prep surfaces, cutting boards, and cross-contamination hazards.
   - `generate_recipe`: Natural language recipe generation matching ingredient availability and dietary filters.
   - `generate_meal_plan`: Structured multi-day diet scheduling matching caloric targets.
   - `assistant_chat`: Conversational guidance with history buffer and culinary system instructions.

2. **Provider Implementations**:
   - `GeminiProvider`: Connects to Google's Gemini models (`gemini-2.5-flash` or `gemini-1.5-flash`) via the modern `google.genai` SDK. Outputs structured JSON matching strict Pydantic schemas.
   - `OpenAIProvider`: Compatible alternative adapter.
   - `ReferenceNutritionService` (`USDA_REFERENCE_DATABASE`): An embedded database of over 100 verified standard food composites (fruits, vegetables, meats, dairy, grains) used for baseline calibration and offline reference mode when API keys are not supplied.

---

## 3. Storage & Media Ingestion Subsystem

The `StorageService` manages all user-submitted images and videos:
- **Sanitized UUID Storage**: Files are saved with randomized hex UUIDs (`uuid.uuid4().hex.ext`) to prevent path traversal (`../../`) and filename collisions.
- **Format Validation**: Strict allowlist of extensions: `jpg`, `jpeg`, `png`, `webp`, `mp4`, `mov`, `avi`.
- **Upload Size Limits**: Configurable ceiling (default 25MB for images, 35MB for hygiene videos).
- **Video Frame Extraction**: Employs OpenCV frame sampling across video durations to extract key frames for multi-spectral inspection without overloading network bandwidth.

---

## 4. Database Schema & Multi-Tenant Data Isolation

All private records belong to an authenticated `User` and enforce strict foreign key constraints:

- `User`: Primary user account, bcrypt hash, dietary preferences JSON.
- `FoodAnalysis`: Image reference, recognized dish, calories, protein, carbs, fat, fiber, sugar, sodium, micronutrients JSON.
- `FreshnessAnalysis`: Image reference, freshness score (0-100), visual indicators list, shelf-life estimate, safety disclaimers.
- `HygieneAudit`: Image/video reference, frames analyzed, overall score, cleanliness rating, contamination risks, corrective actions list.
- `Recipe`: Title, prep & cook time, servings, difficulty, ingredients JSON, instructions JSON, nutrition estimate, favorite flag.
- `MealPlan`: Target calories, diet type, duration, day-by-day JSON schedule.
- `Conversation` & `ChatMessage`: Chat threads, user questions, assistant responses, and metadata.

User isolation is enforced at the database query level on every endpoint (`filter(Model.user_id == current_user.id)`).

---

## 5. UI/UX Design System

- **Palette Tokens**:
  - Background: `#F7F7FC`
  - Surface: `#FFFFFF`
  - Primary Lavender: `#5546A6` (Light: `#EEEAFB`, Dark: `#3F3282`)
  - Accent Coral: `#F07868` (Light: `#FDEAE7`, Dark: `#D95847`)
  - Secondary: `#8375D1`
  - Midnight Navy: `#22213B`
  - Success Green: `#27866B`
  - Warning Amber: `#D18A32`
  - Error Red: `#C74755`
- **Typography**:
  - Headings: `Plus Jakarta Sans`
  - Body & UI: `DM Sans`
