1️⃣ SPEC METADATA
SPEC_ID: LMNAS-AI-FIRST-WEBSITE-V1
OWNER: LMNAs Product Team
STACK:
  - NextJS 14+ (App Router)
  - TailwindCSS
  - n8n Workflows
  - RAG Service (Node / Python API)
  - Vector DB (Supabase / Qdrant / Pinecone)
  - Streaming Chat UI

PRIMARY_GOAL:
Build AI-first website where every CTA opens contextual AI conversation driving users to North Star actions.

NORTH_STAR_ACTIONS:
  - Book Demo
  - Run Pipeline Audit
  - Generate ROI Report
  - Create LENS Assessment

2️⃣ PRODUCT VISION
Users should not browse pages.
Users should interact with AI.

Website = Conversational interface.
Pages = Context providers.
CTAs = AI entry points.

3️⃣ CORE UX FLOW
User lands on page
   ↓
Clicks Benefit Creator CTA
   ↓
AI Chat Opens Below Fold
   ↓
CTA Context Injected into Chat
   ↓
AI Asks Structured Discovery Questions
   ↓
n8n Workflow Executes
   ↓
RAG + Business Logic Runs
   ↓
User Gets Personalized Outcome
   ↓
North Star Conversion

4️⃣ SYSTEM ARCHITECTURE
Frontend Modules
/components/ai
   AIChatDrawer.tsx
   AIMessage.tsx
   AIInput.tsx
   AIStreaming.tsx

/components/benefits
   BenefitCard.tsx
   BenefitLauncher.tsx

/components/context
   CTAContextProvider.tsx

Backend Services
AI Gateway API
  - POST /chat/start
  - POST /chat/stream
  - POST /benefit/run

RAG Service
  - loadContext()
  - retrieveKnowledge()
  - buildPrompt()

n8n Integration
  - webhook trigger
  - workflow execution
  - result return

5️⃣ BENEFIT CREATOR MODULES

Module Types

ROI Calculator
Pipeline Audit
CPQ Maturity Scan
Sales Cycle Analyzer
Tender Complexity Score

Benefit Execution Flow
CTA Click →
Chat Context Inject →
Discovery Questions →
n8n Workflow →
RAG Analysis →
Result Rendering

6️⃣ CONTEXT INJECTION MODEL
context = {
  benefitType: "ROI_CALCULATOR",
  industry: "Transformer Manufacturing",
  entryPage: "/sales-acceleration",
  leadSource: "Website CTA",
  userIntent: "Evaluate ROI"
}

7️⃣ CHAT EXPERIENCE RULES
Chat must:
- Auto-open from CTA
- Stream responses
- Ask guided questions
- Show progress steps
- Persist conversation state

8️⃣ NEXTJS IMPLEMENTATION SPEC

Global AI Layout
app/layout.tsx
   <AIContextProvider>
   <AIChatDrawer />

CTA Trigger Pattern
onClickBenefitCTA(type):
   setAIContext(type)
   openChatDrawer()

Chat State Store
useAIStore
  - messages
  - context
  - workflowStatus
  - loadingState

9️⃣ n8n INTEGRATION SPEC
Trigger:
POST /webhook/benefit

Payload:
{
  userData,
  benefitType,
  answers
}

Response:
{
  analysis,
  score,
  recommendation
}

🔟 RAG SERVICE SPEC
Input:
  CTA Context
  User Responses
  Industry Knowledge

Process:
  Vector Retrieval
  Prompt Assembly
  LLM Generation

Output:
  Guided Questions
  Insights
  Recommendations

1️⃣1️⃣ VISUAL EXPERIENCE RULES
One Primary Interaction Layer = AI Chat
Maximum Click Depth = 2
No multi-page forms
Progress shown conversationally

PHASE 1 — AI Core Interaction Layer
Deliverables
AIChatDrawer
CTAContextProvider
Streaming Chat API
Context injection
Session bootstrap integration
RudderStack session_started event
Demo Outcome
User clicks CTA
Chat opens
Context-aware greeting
Session created
Anonymous tracking begins

PHASE 2 — First Benefit Intelligence Loop (Closed AI Cycle)
Deliverables
Strapi question integration
ROI Calculator logic
n8n workflow
RAG prompt builder
Structured JSON parsing
Follow-up AI question loop
Final structured result
Demo Outcome
User:
Answers standard questions
AI asks follow-up
ROI + benefitScore generated
Narrative insight displayed

PHASE 3 — Revenue Capture & Identity Stitching (Critical)
Deliverables
Identity capture modal
/api/identity/capture
RudderStack identify call
LENS CRM lead upsert
Store lensLeadId in session
Enrichment reuse logic
Geo caching
benefit_completed event
Demo Outcome
User sees result →
Prompted to get full report →
Enters email →
Behind the scenes:
✔ Session updated
✔ Anonymous stitched
✔ CRM lead created
✔ Geo stored once
✔ Future events tied to real identity

PHASE 4 — AI Website Transformation
Deliverables
Replace contact forms with AI entry points
Smart CTAs based on:
Geo
Previous benefit score
Industry inference
Returning user greeting
Personalised benefit prefill
Conversion analytics dashboard
Demo Outcome
Returning user sees:
Welcome back Arun
Last time you calculated CPQ ROI in Asia region.
Want to refine it for EU expansion?

PHASE 5 — Executive Intelligence Layer (Optional but Powerful)
Once team matures.
Deliverables
Lead scoring model (benefitScore + engagement depth)
CRM sync back into AI prompts
Sales readiness indicator
“Hot Lead” tagging
Dashboard for internal team
Now marketing + sales + AI are connected.

Phase 2 — First Benefit
ROI Calculator
n8n Workflow
RAG Integration

Phase 3 — AI Website
Replace Forms
Smart CTAs
Conversion Analytics


## 12. n8n RAG Integration – Benefit Intelligence Orchestrator

### 12.1 Purpose

Integrate n8n as the orchestration layer between:

- Frontend (`lmnas-ai-starter`)
- Strapi (standard benefit questions)
- LLM provider (OpenAI or compatible)
- RAG Knowledge Base
- Lead / Session / Identity systems

n8n will:

1. Receive user answers to standard benefit questions
2. Enrich with benefit-specific RAG context
3. Call LLM for analysis
4. Decide if additional tactical/strategic questions are required
5. Return either:
   - Follow-up questions
   - Final structured benefit result

---

### 12.2 High-Level Architecture

Frontend (Next.js)
↓
API Route (/api/benefit/run)
↓
n8n Webhook
↓
RAG Retrieval (Vector Store)
↓
LLM Analysis
↓
Decision Engine
↓
Structured Response
↓
Frontend Rendering

---

### 12.3 Backend API Route

**Path:**

/app/api/benefit/run/route.ts

**Responsibilities:**

- Accept payload from chat session
- Call n8n webhook
- Return structured response to frontend

**Request Payload:**

```ts
{
  benefitSlug: string,
  sessionId: string,
  answers: {
    questionId: string,
    value: string | number
  }[],
  stage: "standard_completed" | "followup"
}
Expected n8n Response:
{
  status: "followup_required" | "completed",
  followupQuestions?: [
    {
      id: string,
      type: "tactical" | "strategic",
      question: string,
      inputType: "text" | "number" | "option"
    }
  ],
  result?: { ... }
}

13. User Identity, Session & Lead Orchestration Layer
13.1 Objective
Upgrade the Benefit Creator into a:
Identity-aware, revenue-triggering, session-persistent system.
When user provides:
Name
Email
We must:
Persist identity in secure session
Associate with RudderStack anonymousId
Create/Upsert lead in LENS CRM
Perform IP + Geo enrichment only once
Store enrichment in session
Personalize future visits

13.2 Architecture Overview
Browser
  ↓
Next.js App Router
  ↓
Server Session (Encrypted Cookie)
  ↓
Identity Store (Redis or DB-backed)
  ↓
RudderStack (CDP)
  ↓
LENS CRM Lead Creation
  ↓
Geo/IP Enrichment (One-time)

13.3 Modern Session Strategy
Use:
iron-session + Redis-backed store
Session cookie settings:
httpOnly
secure
sameSite=lax
Data Model:
export interface UserSession {
  sessionId: string
  anonymousId: string

  identity?: {
    name: string
    email: string
    lensLeadId?: string
  }

  enrichment?: { ... }

  benefitHistory?: {
    benefitSlug: string
    lastCalculatedAt: string
    lastScore?: number
  }[]
}

13.5 Session Initialization
On first visit:
Generate sessionId & anonymousId
Store in session
Send to RudderStack identify call

13.6 Identity Capture Flow
API:
POST /api/identity/capture
Payload:
{
  name: string,
  email: string,
  source: "benefit_result" | "booking" | "report_download"
}
Server tasks:
Update session.identity
RudderStack identify
Upsert lead in LENS CRM
Store lensLeadId in session

13.7 Geo/IP Enrichment Optimization
We only call IP enrichment once per session or once per identity.
Deduplication Logic:

IF session.enrichment?.ip === currentIP
   → skip
ELSE IF session.identity?.email exists
   → check Redis geo:email:{email}
ELSE
   → enrich once for anonymous session geo:ip:{ip}
Redis TTL: 30 days

13.9 Greeting Returning Users
API:
GET /api/session/me
If identity exists:
Personalized greeting
Else:
Generic greeting

13.11 RudderStack Events
Track:
benefit_session_started
benefit_followup_triggered
benefit_completed
benefit_identity_captured
Use:
anonymousId until identity known
email for userId after identify

13.12 LENS CRM Lead Orchestration
API Route:
/api/lens/lead/upsert
Logic:
Upsert lead if email exists
Include source, geo, campaign

13.14 Security Requirements
Session cookie secure
Email stored server-only
CRM API keys are server-only
Environment Variables
N8N_BENEFIT_WEBHOOK_URL=
N8N_API_KEY=
SESSION_SECRET=
REDIS_URL=
LENS_CRM_API_URL=
LENS_CRM_API_KEY=
WHOIS_IP_API_KEY=


14 CODEX EXECUTION TASKS
Core Chat & UX
TASK-001 Build AIChatDrawer component
TASK-002 Create CTAContextProvider
TASK-003 Implement BenefitLauncher component
TASK-004 Extend Chat State Machine for multi-stage benefit flow
TASK-005 Build FollowUpQuestionRenderer component
TASK-006 Implement ResultSummaryRenderer (score, ROI, narrative)
Strapi Integration
TASK-007 Create Strapi backend integration for benefit-creator questions
TASK-008 Add benefitSlug-based question loading
TASK-009 Add strong typing and zod validation for Strapi responses
n8n Orchestration Layer
TASK-010 Implement /api/benefit/run route
TASK-011 Implement n8n webhook handler integration
TASK-012 Create RAG Prompt Builder module
TASK-013 Implement structured JSON parser with retry fallback
TASK-014 Implement follow-up decision handling logic
TASK-015 Add benefitSessionStore module
Session & Identity Layer
TASK-016 Implement iron-session integration
TASK-017 Integrate Redis-backed session persistence
TASK-018 Create /api/session/bootstrap route
TASK-019 Create /api/session/me route
TASK-020 Create /api/identity/capture route
TASK-021 Implement session typing (UserSession interface)
Geo/IP Enrichment Optimization
TASK-022 Implement IP detection middleware
TASK-023 Implement one-time enrichment logic
TASK-024 Implement Redis geo caching strategy
TASK-025 Add enrichment deduplication logic
TASK-026 Add enrichment TTL management (30 days)
RudderStack Integration
TASK-027 Integrate RudderStack identify flow
TASK-028 Track benefit_session_started event
TASK-029 Track benefit_followup_triggered event
TASK-030 Track benefit_completed event
TASK-031 Track benefit_identity_captured event
TASK-032 Ensure anonymousId → email stitching works correctly
LENS CRM Integration
TASK-033 Create /api/lens/lead/upsert route
TASK-034 Implement CRM upsert logic
TASK-035 Store lensLeadId in session
TASK-036 Add retry + structured error logging
TASK-037 Add source & campaign tagging (benefitSlug-based)
Personalization & Return Experience
TASK-038 Implement returning user greeting component
TASK-039 Personalize benefit chat prompt using session history
TASK-040 Pre-fill known user context into AI prompt
TASK-041 Persist benefitHistory in session
Observability & Security
TASK-042 Implement structured server logging
TASK-043 Add zod validation for all API inputs
TASK-044 Implement graceful fallback if n8n unavailable
TASK-045 Secure session cookies (httpOnly, secure, sameSite)
TASK-046 Ensure no sensitive data exposed client-side

15 ACCEPTANCE CRITERIA
Performance & UX
Chat opens within 300ms after CTA click
Session initializes within first server response
Standard benefit questions load correctly from Strapi
Follow-up questions render dynamically if required
Final benefit result renders without page reload
AI Orchestration
n8n receives structured payload
LLM returns valid structured JSON
Follow-up questions triggered only when needed
ROI + benefitScore calculated successfully
AI narrative includes contextual reasoning
Identity & Lead Capture
After result display, system prompts for name & email
Identity capture updates session securely
RudderStack identify event triggered with anonymousId stitching
LENS CRM lead is created or updated successfully
lensLeadId stored in session
Geo/IP Enrichment
IP enrichment executed only once per session
No duplicate whoisIP calls for same IP
Redis geo cache reused for returning users
Enrichment reused when identity exists
Credit consumption reduced significantly
Personalization
Returning user greeted by name
Previously calculated benefit remembered
Session persists benefit history
AI prompt enriched with prior engagement data
Conversion Flow
User can:
Book appointment
Request full report
Submit contact details
Conversion happens inside chat
No redirect required for core action
Security & Stability
Session cookie is secure and httpOnly
CRM API keys never exposed client-side
API routes validate input strictly
System handles n8n failure gracefully
System handles invalid LLM JSON safely