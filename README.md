# LMNAs AI-First Website Starter

A Next.js starter for an **AI-first website experience** where each CTA launches a guided benefit flow inside a chat drawer.

The app demonstrates:
- CTA-triggered conversational UX
- Session bootstrap + identity capture
- Strapi-backed question management with local fallback
- n8n orchestration for benefit analysis
- RudderStack event + identify tracking
- LENS CRM lead upsert
- Optional Redis-backed enrichment cache

---

## 1) Prerequisites

- **Node.js 20+** (recommended)
- **npm 10+**
- Optional local services for full functionality:
  - Strapi
  - n8n
  - Redis
  - LENS CRM API (or a mock endpoint)
  - Whois/IP API key (for geo enrichment)

Check your versions:

```bash
node -v
npm -v
```

---

## 2) Install and run

```bash
# 1) install dependencies
npm install

# 2) create environment file
touch .env.local

# 3) start development server
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

---

## 3) Environment configuration

Create `.env.local` in the repo root.

```bash
# Session + security
SESSION_SECRET=replace-with-a-long-random-secret

# Strapi (dynamic question source)
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=

# n8n workflow orchestration
N8N_BENEFIT_WEBHOOK_URL=http://localhost:5678/webhook/benefit
N8N_API_KEY=

# Redis (optional; falls back to in-memory cache if not present)
REDIS_URL=redis://localhost:6379

# CRM integration
LENS_CRM_API_URL=http://localhost:4000
LENS_CRM_API_KEY=replace-with-api-key

# Analytics
RUDDERSTACK_WRITE_KEY=

# Optional geo enrichment during session bootstrap
WHOIS_IP_API_KEY=
```

### Which variables are required?

- **Minimum to boot UI only:** none (app can start without integrations).
- **To run `/api/benefit/run` successfully:** `N8N_BENEFIT_WEBHOOK_URL`.
- **To capture identity successfully via `/api/identity/capture`:**
  - LENS env vars (`LENS_CRM_API_URL`, `LENS_CRM_API_KEY`) must be set.
- **To use Strapi questions:** `STRAPI_URL` (and optional `STRAPI_TOKEN`).
- **To persist distributed geo cache:** `REDIS_URL`.
- **To emit analytics:** `RUDDERSTACK_WRITE_KEY`.

---

## 4) Integration setup

## 4.1 Strapi (benefit discovery questions)

The app reads questions from Strapi endpoint:

`GET {STRAPI_URL}/api/benefit-questions`

with filters by `benefitType` and sorting by `order`.

### Collection type
Create a collection called `benefit-question` with fields:
- `benefitType` (enumeration; values should match app benefit types)
- `questionId` (text/uid)
- `key` (text)
- `question` (text)
- `inputType` (`text`, `number`, `options`)
- `options` (JSON array or comma-separated string)
- `order` (integer)

If Strapi is not configured/unavailable, the app falls back to local static questions in:

`data/workflows/benefitWorkflows.ts`

---

## 4.2 n8n (benefit orchestration)

`/api/benefit/run` posts payload to `N8N_BENEFIT_WEBHOOK_URL`.

### Expected behavior
Your n8n workflow should return JSON in this shape:

```json
{
  "followup_required": false,
  "followupQuestions": [
    { "id": "q1", "prompt": "Optional follow-up" }
  ],
  "result": {
    "score": 78,
    "summary": "You can reduce quote cycle by 15%.",
    "recommendation": "Automate pricing approvals."
  }
}
```

`followup_required` can be `true` or `false`.

---

## 4.3 RudderStack (analytics)

When `RUDDERSTACK_WRITE_KEY` is set, the app sends:
- `benefit_session_started`
- `benefit_followup_triggered`
- `benefit_completed`
- `benefit_identity_captured`

It also sends `identify` after identity capture.

No key => analytics calls are safely skipped.

---

## 4.4 LENS CRM (lead upsert)

`POST /api/lens/lead/upsert` calls:

`POST {LENS_CRM_API_URL}/leads/upsert`

with bearer auth from `LENS_CRM_API_KEY`.

Response must include:

```json
{ "leadId": "string-id" }
```

`/api/identity/capture` depends on this route and will fail if LENS is not configured/reachable.

---

## 4.5 Redis (optional cache)

If `REDIS_URL` is set and `ioredis` is available, cache is persisted in Redis.
Otherwise, app automatically falls back to in-memory cache (good for local/dev only).

Used for geo enrichment cache keys like:
- `geo:ip:<ip>`
- `geo:email:<email>`

---

## 5) Local functional checklist (step-by-step)

1. Start app:
   ```bash
   npm run dev
   ```
2. Open website and click any **Launch with AI** CTA.
3. Chat drawer should open and run session bootstrap.
4. Click **Run Benefit** to trigger `/api/benefit/run`.
5. If n8n is connected, you should see follow-up/result payload rendering.
6. (Optional) call identity API to verify LENS + RudderStack path.

---

## 6) API smoke tests you can run

> Run these while `npm run dev` is active.

### 6.1 Bootstrap a session

```bash
curl -i -X POST http://localhost:3000/api/session/bootstrap
```

Expected:
- `200 OK`
- `Set-Cookie: lmnas_session=...`

### 6.2 Read session

```bash
curl -i http://localhost:3000/api/session/me
```

If cookie is present from bootstrap, returns session data.

### 6.3 Run benefit workflow

```bash
curl -i -X POST http://localhost:3000/api/benefit/run \
  -H "Content-Type: application/json" \
  -d '{
    "benefitSlug":"roi-calculator",
    "sessionId":"replace-with-session-id",
    "stage":"standard_completed",
    "answers":[{"questionId":"headcount","value":8}]
  }'
```

Expected:
- `200` when n8n is configured and reachable.
- `500` with `BENEFIT_RUN_FAILED` when n8n is missing/unreachable.

### 6.4 Capture identity (requires LENS integration)

```bash
curl -i -X POST http://localhost:3000/api/identity/capture \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Jane Doe",
    "email":"jane@example.com",
    "source":"benefit_result",
    "benefitSlug":"roi-calculator"
  }'
```

Expected:
- `200` when LENS upsert succeeds.
- `502` (`LEAD_UPSERT_FAILED`) when LENS not configured/reachable.

---

## 7) Development commands

```bash
# start dev server
npm run dev

# lint code
npm run lint

# production build
npm run build

# run production server after build
npm run start
```

---

## 8) Troubleshooting

- **Chat opens but no result:** Check `N8N_BENEFIT_WEBHOOK_URL` and n8n response schema.
- **Identity capture fails:** Verify `LENS_CRM_API_URL` + `LENS_CRM_API_KEY` and `/leads/upsert` response.
- **No dynamic questions:** Verify `STRAPI_URL`, collection schema, and published entries.
- **No analytics data:** Confirm `RUDDERSTACK_WRITE_KEY`.
- **Geo enrichment empty:** Set `WHOIS_IP_API_KEY`; local dev may not provide stable forwarded IP.

---

## 9) Notes on current starter behavior

- The chat drawer flow is implemented in `components/ai/AIChatDrawer.tsx` and starts when a user chooses a benefit calculator CTA.
- The drawer greets the user, fetches Strapi-backed discovery questions via `/api/chat/start` + `/api/chat/stream`, and renders each question with `components/ai/AIInput.tsx` based on `inputType` (`text`, `number`, `options`).
- After discovery answers are submitted, `/api/benefit/run` is called: follow-up payloads are shown with `components/ai/FollowUpQuestionRenderer.tsx`, otherwise final outcomes are shown with `components/ai/ResultSummaryRenderer.tsx`.
- Session persistence uses signed cookies; Redis is used only for geo cache optimization.

This project is a strong base to evolve into a complete AI-first conversion website with integrated orchestration, analytics, and CRM handoff.
