# Product Requirements Document — Front-End Test Priorities

**Product:** Pulse (autolinkedin)  
**Document type:** QA / front-end test charter  
**Scope:** Browser-based validation of the Next.js App Router UI (excluding backend-only scheduler execution unless surfaced in UI).  
**Revision:** 2026-05-09  

---

## 1. Purpose

Define the **five highest-importance front-end tests** to run before release or during regression. These cover authentication, third-party connection, core creator workflows, and navigation boundaries where users most often lose trust or block on errors.

---

## 2. Goals

- Catch regressions on **critical paths** (sign-in → app shell → primary features).
- Validate **OAuth redirect and return UX** without assuming LinkedIn API stability in staging.
- Ensure **scheduling and content surfaces** remain usable with realistic loading, empty, and error states.

---

## 3. Top five front-end tests

### Test 1 — Authentication: sign-in and sign-up


| Field              | Detail                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| **Priority**       | P0                                                                                             |
| **Routes**         | `/sign-in`, `/sign-up`                                                                         |
| **Why it matters** | Entire product is unreachable without reliable auth; failures here block all other validation. |


**Scenarios**

1. Happy path: valid credentials create or sign in a user and land in the authenticated experience (`/app` or first-run destination).
2. Validation: empty fields, weak or mismatched passwords (sign-up), invalid email shape — UI shows clear, field-level feedback without silent failure.
3. Session: refresh and deep-link to a protected route while logged in — user stays authenticated or is redirected appropriately with a recoverable path back.

**Acceptance criteria**

- Forms submit without console errors; success and error messages match the server/action outcome.
- OAuth buttons (if shown) navigate to the provider and return without breaking the layout.
- No infinite loading spinners on failed submit.

---

### Test 2 — Protected app shell and routing


| Field              | Detail                                                                                                                                 |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Priority**       | P0                                                                                                                                     |
| **Routes**         | `/app`, `/app/content`, `/app/schedule`, `/app/settings`, `/app/settings/connections`, `/app/settings/preferences`, `/app/preferences` |
| **Why it matters** | Broken navigation or leaked marketing chrome inside the app erodes trust and hides dead links until production.                        |


**Scenarios**

1. Unauthenticated visitor hits `/app/`* — redirect to sign-in (or equivalent) with return URL preserved where applicable.
2. Authenticated user: primary nav links resolve; active section is visually indicated; no 404s on advertised destinations.
3. Marketing root `/` remains distinct from `/app` (correct branding and CTAs).

**Acceptance criteria**

- Consistent layout (header/sidebar) across app routes; no duplicate scroll traps or overlapping overlays.
- Back/forward browser navigation does not duplicate form submissions or lose draft state unexpectedly (document any known limitations).

---

### Test 3 — LinkedIn connection flow (connect + reconnect messaging)


| Field              | Detail                                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| **Priority**       | P0                                                                                                                        |
| **Routes**         | `/app/settings/connections`, OAuth entry (`/api/linkedin/connect`), callback (`/api/linkedin/callback`)                   |
| **Why it matters** | Publishing depends on a valid connection; the UI must guide users through connect, success, and failure/reconnect states. |


**Scenarios**

1. Start connect from settings — user is sent to LinkedIn consent and returns to the app with connection status updated (success path).
2. Decline or cancel OAuth — app shows a non-technical failure state and a retry affordance.
3. Simulate or observe disconnected/expired token messaging (if exposed in UI) — copy instructs user to reconnect without raw errors.

**Acceptance criteria**

- Connection panel reflects backend state after reload (connected vs not connected).
- Redirect URIs and environment assumptions documented for testers (`NEXT_PUBLIC_APP_URL`, registered callback).
- No secrets or tokens visible in the DOM or network responses surfaced in UI copy.

---

### Test 4 — Content workspace: topics, drafts, and drawer UX


| Field              | Detail                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| **Priority**       | P1                                                                                                           |
| **Routes**         | `/app/content`                                                                                               |
| **Why it matters** | Core value proposition is ideation and drafting; regressions here directly reduce perceived product quality. |


**Scenarios**

1. Empty state: first-time user sees guidance and can progress to first draft or sample flow without confusion.
2. Open draft drawer (or equivalent): edit text, close/reopen — changes persist per product rules (server vs local).
3. AI or generation actions (if present): loading states, cancellation or timeout behavior, and error toasts do not corrupt existing drafts.

**Acceptance criteria**

- Primary actions are keyboard-accessible where reasonable (focus order, Escape closes overlays).
- Long post bodies scroll inside intended containers; mobile viewport remains usable at primary breakpoints used by the team.

---

### Test 5 — Schedule and queue: composer, configuration, and queue board


| Field              | Detail                                                                                       |
| ------------------ | -------------------------------------------------------------------------------------------- |
| **Priority**       | P1                                                                                           |
| **Routes**         | `/app/schedule`                                                                              |
| **Why it matters** | Scheduling is the bridge to automation; UI bugs here cause missed posts or duplicate queues. |


**Scenarios**

1. Compose or attach a draft to a slot — validation prevents impossible schedules (past times, missing body, etc.) with readable errors.
2. Queue board: queued vs published (or other statuses) display distinctly; reorder or edit behaves as designed.
3. Schedule configuration form: save/load preferences; changing timezone or slots updates preview or summary if provided.

**Acceptance criteria**

- Server actions or mutations show optimistic UI only where implemented; otherwise explicit pending states.
- After actions, list/state refreshes without full-page reload unless intentional.

---

## 4. Out of scope (for this PRD)

- InsForge edge function `scheduler-tick` execution and cron reliability (track under backend/ops unless UI exposes failures).
- LinkedIn API quota or rate-limit behavior beyond what the UI surfaces.

---

## 5. Success metrics for the test pass

- All **P0** tests pass on the target browser matrix (define separately: e.g. latest Chrome + Safari + mobile Safari).
- Zero undocumented **blockers** on sign-in, app routing, or LinkedIn connect for a fresh test account.
- **P1** tests pass or failures are logged with severity and reproduction steps tied to a route and user state.