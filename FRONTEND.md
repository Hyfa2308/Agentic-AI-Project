# AssistIQ frontend

React 19, TypeScript, Vite, TanStack Start/Router, Tailwind v4 and reusable shadcn/AI Elements controls. The template's router is preserved; no backend replacement was added.

## Folder structure
- `src/routes/`: Overview (`/`), AI chat (`/chat`), customer portal (`/portal`), human dashboard (`/dashboard`), About (`/about`); root document and metadata.
- `src/components/assistiQ/`: Shared navigation, page headings, status badges, statistics, loading/empty/error surfaces and ticket table/details.
- `src/components/ui/`: Reusable accessible interface controls.
- `src/components/ai-elements/`: Conversation, markdown messages, composer and thinking state primitives.
- `src/services/`: Centralized fetch client, replaceable mock service, demo fixtures and shared query definitions.
- `src/types/`: ChatRequest, ChatResponse, ChatMessage, Analysis, Conversation and Ticket contracts.
- `src/lib/`: Utilities and per-page metadata.
- `src/assets/`: AssistIQ brand mark and generated support headset photo.
- `src/styles.css`: Semantic light/dark design tokens and responsive layouts.
- `.env.example`: Public API configuration, no secrets.

## Connect FastAPI
Copy `.env.example` to `.env`, set `VITE_API_BASE_URL=https://your-api.example.com` and `VITE_USE_MOCK_API=false`, then restart the development process. Never put private keys in Vite variables. An empty URL always selects demo mode. With a URL and mock mode disabled, calls never fall back to simulated responses.

Proposed contract (adapt to your backend in `src/services/api.ts`):
- GET `/conversations` → Conversation[]
- POST `/conversations` with `{}` → Conversation
- POST `/chat` with `{ conversationId, message }` → ChatResponse
- GET `/tickets` → Ticket[]
- PATCH `/tickets/{id}` with `{ status }` → Ticket

JSON field definitions live in `src/types/support.ts`. Message timestamps are ISO 8601. Backend must enable CORS for the frontend origin and implement real AI, authentication, authorization, persistence, validation and idempotent retry behavior. No credentials are sent by this initial unauthenticated client. Use the API service to add your chosen auth once specified.

Initial demo behavior: temporary chat threads, simulated replies/metadata/handoff, ticket filtering/detail view, status changes and CSV export. The mock service is isolated from live requests. Demo analytics are illustrative, not measured. Live performance analytics are not connected. No real human handoff, AI model, production login or database is included.

## Local commands
`bun dev`, `bun test`, `bun run lint`. The Lovable harness handles build/type validation.
