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

1️⃣2️⃣ MVP DELIVERY PHASES
Phase 1 — AI Core
Chat Drawer
Context Injection
Streaming Chat

Phase 2 — First Benefit
ROI Calculator
n8n Workflow
RAG Integration

Phase 3 — AI Website
Replace Forms
Smart CTAs
Conversion Analytics

1️⃣3️⃣ CODEX EXECUTION TASKS

TASK-001 Build AIChatDrawer component
TASK-002 Create CTAContextProvider
TASK-003 Implement BenefitLauncher component
TASK-004 Build Chat Streaming API
TASK-005 Implement n8n webhook handler
TASK-006 Create RAG Prompt Builder
TASK-007 Implement ROI Calculator workflow
TASK-008 Create Strapi backend for Benefit Creator question management

1️⃣4️⃣ ACCEPTANCE CRITERIA

User clicks CTA → Chat opens within 300ms
Chat begins with contextual greeting
Workflow runs automatically
Results generated inside chat
User can convert without leaving chat
