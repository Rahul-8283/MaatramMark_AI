# <img src="Frontend/public/favicon.png" width="48" height="48" align="center" onerror="this.src='Frontend/favicon.png'"/> MaatramMARK

> **Autonomous AI agent for hyperlocal business growth through smart content, automation, and continuous learning.**

MaatramMARK is an advanced AI-powered branding, content generation, and strategy engine designed to help local businesses scale their social media presence. It automates market research, creates unique branding assets, delivers daily tailored marketing campaigns, writes short-form reels scripts, and uses real-world engagement metrics to train and optimize its own recommendation engine.

---

<p align="center">
  <img src="https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62B" alt="Vite 7" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS v4" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.11" />
  <img src="https://img.shields.io/badge/FastAPI-0.100%2B-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Tavily-Search_API-orange?style=for-the-badge" alt="Tavily API" />
  <img src="https://img.shields.io/badge/ClipDrop-Image_API-black?style=for-the-badge" alt="ClipDrop API" />
  <img src="https://img.shields.io/badge/RAG-Retrieval--Augmented%20Generation-007acc?style=for-the-badge" alt="RAG" />
</p>

<p align="center">
  🔗 <b>Live URL:</b> <a href="https://maatrammark.vercel.app/">https://maatrammark.vercel.app/</a> <br/>
  📂 <b>Backend Repository:</b> <a href="https://github.com/djivites/MaatramMarkAI_AI-service/">https://github.com/djivites/MaatramMarkAI_AI-service/</a>
</p>

---

## 🛠️ Complete Tech Stack Details

### Frontend (User Interface)
* **Core Framework:** React 19 (TypeScript) & Vite
* **Styling & Theme:** TailwindCSS (v4 Utility CSS) & Vanilla CSS for premium dark/gold theme blurs
* **Animations:** Framer Motion (smooth entrance and page transition overlays)
* **Icons:** Lucide React
* **Routing:** React Router DOM (v7)
* **State Management:** Zustand
* **API Client:** Axios (configured with Supabase JWT interceptors)

### Backend (AI Service)
* **Web Framework:** FastAPI (Python 3.11+)
* **Database Driver:** Supabase Python SDK (`supabase-py`)
* **AI Orchestration & LLMs:** OpenRouter (routing dynamically between models like `Llama 3.2 3B Instruct`, `DeepSeek V4 Flash`, and fallback free options)
* **Search & Niche Research:** Tavily API (hyperlocal trend and competitor analysis search engine)
* **Visual Asset Generation:** ClipDrop API / Stable Diffusion (generating posters and logo vectors)

### Database (Data Store)
* **Engine:** Supabase PostgreSQL (Postgres SQL)
* **Security:** Row Level Security (RLS) policies

---

## 🗄️ Database Schema & Architecture

The application operates on a structured PostgreSQL database with 12 interconnected tables:

* **`users`**: Base user registration table mapping UUIDs from Supabase Auth.
* **`business_info`**: Detailed profile of the onboarded business (name, type, location).
* **`strategy`**: AI-generated strategy blueprints (target audience definitions, brand tone, content style guidelines).
* **`research`**: Hyperlocal research memory (trending niche topics, relevant hashtags, key local competitors).
* **`branding`**: Design definitions containing primary, secondary, and accent colors, taglines, and personality keywords.
* **`daily_content`**: Day-to-day planner outputting generated marketing concepts, copy briefs, and DALL-E/ClipDrop image prompts.
* **`image_generations`**: Version history of all text-to-image poster and logo iterations.
* **`posts`**: Gallery queue where user confirms visual designs as finalized drafts.
* **`logos`**: Gallery storing finalized vector brand logos.
* **`analytics`**: Performance logs storing engagement statistics (likes, comments, shares, reach) from social platforms.
* **`feedback_memory`**: AI optimization registry that records learned content schedules and optimized content types.
* **`reels`**: Storyboards holding generated short-form video scripts (hooks, action cues, and audio suggestions).

---

## 🚀 Key Features

* **Hyperlocal Trend Engine:** Scans real-time community events and niche-specific shifts via Tavily and aligns them with business goals.
* **Smart Logo & Visual Creator:** Instantly generates customizable promotional flyers and logos that dynamically apply the custom brand colors stored in the database.
* **Short-form Reels Scriptwriter:** Automatically drafts viral-style video scripts containing step-by-step visual scenes, sound suggestions, and scroll-stopping 3-second hooks.
* **AI Learning Loop:** Enter actual engagement statistics from your posted content. The AI parses the numbers, optimizes recommended posting hours, defines successful styles, and updates the dashboard strategy blueprints.

---

## 💻 Getting Started

### Prerequisites
* Python 3.11+
* Node.js v18+

### Setup Environment Variables

#### 1. Backend `.env` (`/MaatramMarkAI_AI-service/ai_service/.env`):
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key
OPENROUTER_API_KEY=your_openrouter_key
TAVILY_API_KEY=your_tavily_key
CLIPDROP_API_KEY=your_clipdrop_key
```

#### 2. Frontend `.env` (`/MaatramMark_AI/Frontend/.env`):
```env
VITE_BACKEND_URL_DEV=http://127.0.0.1:8000
VITE_BACKEND_URL_PROD=your_production_backend_url
VITE_MODE=development
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

#### 1. Start the Backend API:
```bash
# In the backend repository
cd MaatramMarkAI_AI-service/ai_service
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### 2. Start the Frontend Application:
```bash
# In this repository
cd Frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.
