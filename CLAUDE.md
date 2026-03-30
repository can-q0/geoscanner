# GEO Scanner

Freemium SaaS that analyzes websites for AI search visibility across ChatGPT, Perplexity, Google AI Overviews, Gemini, and Bing Copilot.

## Architecture

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind 4, Clerk auth, Prisma 7 ORM
- **Backend**: Python FastAPI, asyncpg, Anthropic SDK (Claude API)
- **Database**: Neon PostgreSQL (shared by frontend Prisma + backend asyncpg)
- **Payment**: iyzico (Turkish payment processor, token-based checkout)
- **Deployment**: Vercel (frontend) + Railway (backend)

```
Browser → Next.js (Vercel) → FastAPI (Railway) → Claude API
              ↓                      ↓
          Clerk Auth           Neon PostgreSQL
              ↓
         iyzico Payments
```

## Business Model

- 1 free quick scan per user (~60s, score + top 3 findings)
- Full report: $5 one-time (~10min, rewrites + schema code + action plan + PDF)
- No subscription — per-scan AI compute costs make flat fees unsustainable

## Data Model

- **User**: clerkId, email, name
- **Scan**: url, domain, scanType ("quick"/"full"), status, progress (0-100), geoScore, scoresSummary (JSON), resultsFull (JSON), pdfUrl, isPaid
- **Payment**: userId, scanId, amountCents, currency, iyzicoToken, status

## Scan Flow

1. `POST /api/scan` → check free limit → create scan → trigger backend
2. Backend `/scan/quick` runs async: fetch page → score citability → Claude analysis → compute GEO score
3. Frontend polls `/api/scan/[id]` for progress updates
4. Full reports: same flow but deeper analysis via `/scan/full`, generates PDF

## Key Directories

```
backend/
  main.py              FastAPI app entry
  routers/             API endpoints (health, scan)
  workers/             Background tasks (quick_scan, full_audit)
  services/            Business logic (page_fetcher, citability, claude_analyzer, scoring)
  prompts/             System prompts for each GEO dimension
  schema/              JSON-LD templates (organization, product, etc.)

frontend/src/
  app/                 Next.js pages (App Router)
    api/               API routes (scan, payment)
    scan/[id]/         Scan results page
    dashboard/         User dashboard
    pricing/           Pricing page
  components/          React components (19 total)
  lib/                 Utilities (db, auth, api)
  hooks/               Custom hooks (useScanStatus)
```

## Conventions

- Frontend components: PascalCase (e.g., `ScanForm.tsx`)
- Backend modules: snake_case (e.g., `quick_scan.py`)
- CSS: custom properties in `globals.css`, dark/light theme via `data-theme` attribute on `<html>`
- Auth: Clerk middleware protects `/dashboard/*`, `/settings/*`, `/api/scan/*`, `/api/payment/*`
- Backend auth: `x-api-key` header validated on all routes except `/health`

## Important Notes

- **Next.js 16 has breaking changes** — always check `frontend/AGENTS.md` and `node_modules/next/dist/docs/` before writing Next.js code
- **Fonts loaded via `next/font`** — CSS variables `--font-display`, `--font-body`, `--font-mono` are injected on `<html>`, not imported in CSS
- **iyzico payment is stubbed** — dev mode auto-completes; real integration not yet implemented
- **Two scan workers exist**: `quick_scan.py` (free, fast) and `full_audit.py` (paid, comprehensive) — full audit is written but untested
- **Theme system**: `ThemeProvider` context + `data-theme` attribute + flash prevention script in layout
- **Toast system**: `useToast()` hook from `Toast.tsx`, already wired into `ScanForm`
- **Prisma generated files are gitignored** — run `npx prisma generate` after clone
