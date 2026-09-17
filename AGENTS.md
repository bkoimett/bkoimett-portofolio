# CRITICAL RULES - MUST FOLLOW

## PROJECT

- Portfolio website. Frontend: Vite + React (JS). Backend: Express + MongoDB.
- Auth: custom JWT (no BetterAuth). No ORM — use the Mongoose models directly.

## RESPONSES

- Keep responses concise and to the point - unless the user asks otherwise
- Don't re-explain code you just wrote; summarize the change in 1-3 lines

## PLANNING MODE

- Always ask clarifying questions before assuming design, content, or scope
- Never assume tech stack or add new dependencies without asking
- Use deep-dive sub-agents only for genuinely non-trivial research (new feature areas, security review) — skip them for small, well-scoped changes to save tokens
- For small fixes (bug fixes, copy changes, styling tweaks), skip planning ceremony and just implement

## CHANGE / EDIT MODE

- For small, well-scoped changes, implement directly — sub-agent coordination overhead isn't worth it on a project this size
- Reserve sub-agents for larger parallelizable work (e.g. multi-page refactors, simultaneous frontend+backend changes)
- Use the best model for the task - premium models for complex logic (auth, data flow), mid-tier for docs/content/styling
- After completing any feature or fix, run: `npm run lint` and `npm run build` (frontend), and the backend's lint/test script if present
- Never leave `console.log` debugging statements in committed code

## SECURITY (portfolio-specific, given past findings)

- Never log credentials, tokens, or password lengths — not even in dev
- Auth error messages must not reveal whether a username exists
- Any endpoint returning draft/unpublished content must require auth
- Always wrap JWT verification in try/catch — malformed tokens must degrade gracefully, never 500
- Keep CORS scoped to the actual deployed frontend origin(s), not wide open
- No hardcoded credentials — use environment variables

## API CONVENTIONS

- All frontend requests go through the single shared API client (not ad-hoc axios/fetch calls) — do not duplicate base-URL logic
- MongoDB documents use `_id`, not `id` — never assume `.id` exists on API responses

## TESTING

- Use whatever testing tools are already installed (e.g. supertest) for backend changes
- Never assume a change works — test it, at least manually via curl/browser
- If no relevant testing tool exists for a change, ask the user whether to skip testing or add one

## UI DESIGN

- Always follow the UI design system when creating or reviewing components or pages
- Design System: @DESIGN.md
- Keep this file and @DESIGN.md in sync with the actual codebase — update them as part of any change that alters stack, structure, or conventions, don't let them drift