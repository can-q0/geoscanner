# GEO Scanner

**AI Search Visibility Analyzer** -- Analyze how your website appears to ChatGPT, Perplexity, Google AI Overviews, Gemini, and Bing Copilot.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-009688?logo=fastapi)
![Claude API](https://img.shields.io/badge/Claude_API-Anthropic-d4a574?logo=anthropic)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

---

## What It Does

GEO Scanner is a freemium SaaS that evaluates websites for visibility across AI-powered search engines. Users enter a URL and receive a GEO score (0--100) with a breakdown across six analysis dimensions in approximately 60 seconds. For a deeper assessment, a paid full report provides AI-generated rewrite suggestions, JSON-LD schema code, a 30-day action plan, and a downloadable PDF -- delivered in roughly 10 minutes.

## Features

- **GEO Score (0--100)** computed in ~60 seconds on the free tier
- **6-dimension analysis**: citability, brand authority, E-E-A-T, technical SEO, schema markup, and platform-specific optimization
- **5 AI platform coverage**: ChatGPT, Perplexity, Google AI Overviews, Gemini, Bing Copilot
- **Full reports** with AI rewrite suggestions, JSON-LD schema code, and a prioritized 30-day action plan
- **PDF report generation** for client-ready deliverables
- **Dark / light theme** with system preference detection
- **Real-time scan progress** with status polling
- **Clerk authentication** with sign-in / sign-up flows
- **iyzico payment integration** for paid report upgrades

## Architecture

```
Browser --> Next.js (Vercel) --> FastAPI (Railway) --> Claude API
               |                       |
          Clerk Auth            Neon PostgreSQL
               |
        iyzico Payments
```

The frontend handles authentication, payment flows, and scan result presentation. The backend fetches and parses target pages, runs AI analysis via the Claude API, computes scores, and generates PDF reports. Both services share a Neon PostgreSQL database -- Prisma on the frontend side, asyncpg on the backend.

## Getting Started

### Prerequisites

| Tool       | Version   |
|------------|-----------|
| Node.js    | 20+       |
| Python     | 3.12+     |
| PostgreSQL | 15+ (or a Neon account) |

### Clone

```bash
git clone <repo-url> geoscanner
cd geoscanner
```

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then fill in values
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env   # then fill in values
npx prisma generate
npx prisma migrate deploy
npm run dev
```

### Environment Variables

#### Backend (`backend/.env`)

| Variable           | Purpose                                              |
|--------------------|------------------------------------------------------|
| `DATABASE_URL`     | Neon PostgreSQL connection string                    |
| `ANTHROPIC_API_KEY`| Anthropic API key for Claude                         |
| `API_SECRET_KEY`   | Shared secret for frontend-to-backend authentication |
| `FRONTEND_URL`     | Frontend origin for CORS (e.g. `http://localhost:3000`) |

#### Frontend (`frontend/.env`)

| Variable                             | Purpose                                          |
|--------------------------------------|--------------------------------------------------|
| `DATABASE_URL`                       | Neon PostgreSQL connection string (for Prisma)   |
| `NEXT_PUBLIC_API_URL`                | Backend API base URL (e.g. `http://localhost:8000`) |
| `API_SECRET_KEY`                     | Shared secret sent to backend in `x-api-key` header |
| `NEXT_PUBLIC_APP_URL`                | Public app URL (e.g. `http://localhost:3000`)    |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`  | Clerk publishable key                            |
| `CLERK_SECRET_KEY`                   | Clerk secret key                                 |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`      | Clerk sign-in route (default `/sign-in`)         |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`      | Clerk sign-up route (default `/sign-up`)         |
| `IYZICO_API_KEY`                     | iyzico payment API key                           |
| `IYZICO_SECRET_KEY`                  | iyzico payment secret key                        |

## Project Structure

```
geoscanner/
├── backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── config.py               # Environment variable loading
│   ├── database.py             # asyncpg connection pool
│   ├── Dockerfile              # Container build for Railway
│   ├── requirements.txt
│   ├── routers/
│   │   ├── health.py           # Health check endpoint
│   │   └── scan.py             # Scan CRUD and trigger endpoints
│   ├── workers/
│   │   ├── quick_scan.py       # Free tier scan pipeline
│   │   └── full_audit.py       # Paid full audit pipeline
│   ├── services/
│   │   ├── page_fetcher.py     # URL fetching and HTML parsing
│   │   ├── citability_service.py
│   │   ├── brand_service.py
│   │   ├── llmstxt_service.py
│   │   ├── claude_analyzer.py  # Claude API integration
│   │   └── scoring.py          # GEO score computation
│   ├── prompts/                # Claude prompt templates (audit, brand, citability, etc.)
│   ├── schema/                 # Reference JSON-LD schema templates
│   ├── scripts/                # Standalone utility scripts
│   └── models/
│       └── schemas.py          # Pydantic request/response models
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # Landing page
│   │   │   ├── layout.tsx      # Root layout (Clerk, theme, fonts)
│   │   │   ├── dashboard/      # User dashboard
│   │   │   ├── scan/           # Scan progress and results pages
│   │   │   ├── payment/        # iyzico payment flow
│   │   │   ├── pricing/        # Pricing page
│   │   │   ├── api/            # Next.js API routes (payment, scan proxy)
│   │   │   ├── sign-in/        # Clerk sign-in
│   │   │   ├── sign-up/        # Clerk sign-up
│   │   │   ├── about/          # About page
│   │   │   ├── privacy/        # Privacy policy
│   │   │   ├── terms/          # Terms of service
│   │   │   └── settings/       # User settings
│   │   ├── components/         # UI components (Navbar, Footer, ScoreGauge, ScanForm, etc.)
│   │   ├── hooks/              # Custom hooks (useScanStatus)
│   │   └── lib/                # Utilities (API client, auth helpers, DB client)
│   ├── prisma/
│   │   └── schema.prisma       # Data model (User, Scan, Payment)
│   ├── public/                 # Static assets and platform logos
│   ├── package.json
│   └── next.config.ts
└── README.md
```

## Scripts

### Frontend

| Command                       | Description                          |
|-------------------------------|--------------------------------------|
| `npm run dev`                 | Start Next.js dev server             |
| `npm run build`               | Production build                     |
| `npm run start`               | Start production server              |
| `npm run lint`                | Run ESLint                           |
| `npx prisma generate`        | Generate Prisma client               |
| `npx prisma migrate deploy`  | Apply database migrations            |
| `npx prisma migrate dev`     | Create and apply a new migration     |

### Backend

| Command                                     | Description                          |
|---------------------------------------------|--------------------------------------|
| `uvicorn main:app --reload`                 | Start FastAPI dev server             |
| `pip install -r requirements.txt`           | Install Python dependencies          |

## License

All rights reserved. This is a private project.
