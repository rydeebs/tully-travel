# Tully — Operating System

An internal dashboard for Tully's leadership team: one left-hand sidebar over the systems-and-data backbone for Sales, Operations and Finance.

| Tab | What it is | Data |
|---|---|---|
| **Overview** (`#overview`) | This week at Tully: bookings vs. forecast, the KPIs that matter, what needs a human, live activity | Illustrative |
| **Proposal Engine** (`#proposals`) | The Proposal Draft Agent below, with this week's engine stats above it | Live (Claude) |
| **Agentic Operations** (`#agents`) | The agent fleet, approval inbox, run log, and the **Invoice Reconciler**, a real agent | Live agent + illustrative fleet |
| **CRM** (`#crm`) | Pipeline funnel, enriched and scored inbound leads, retention, designer leaderboard, deals going quiet | Illustrative (HubSpot sketch) |
| **ERP · Back Office** (`#erp`) | Connected-system health (ClientBase, Trams, Travefy), bookings in flight, departures, supplier reliability | Illustrative |
| **Finance** (`#finance`) | Margin by Collection, commission ageing, month-end close, 13-week cash | Illustrative |

Illustrative data is deterministic, so the demo looks the same every run. Tabs deep-link by hash, and a draft in progress survives switching tabs.

### The Invoice Reconciler (live agent)

Pick one of three supplier commission statements (Singita, Explora Journeys, Four Seasons) and select **Run the agent**. `POST /api/agents/reconcile` sends the statement and the matching Trams ledger records to Claude, which returns each line's outcome (matched, short-paid, rate mismatch, missing from statement, not in ledger) and a courteous dispute email for Finance to approve. The server recomputes all totals itself rather than trusting model arithmetic. Nothing is sent to a supplier.

- Agent prompt: `server/agents/reconcile.ts`. Schemas: `src/shared/reconcile.ts`. Sample statements, ledger and sample results: `src/shared/reconcileSamples.ts`.
- Without an API key (or with `?sample`), it runs on precomputed sample results and says so on screen.

### Dashboard code

- Shell, tabs and hash routing: `src/dashboard/Shell.tsx`, `tabs.ts`, `useHashTab.ts`
- Primitives: `PageHeader`, `Section`, `Kpi`/`KpiRow`, `Table`/`StatusTag`, `Feed`, and hand-rolled SVG `charts.tsx` (no chart library), all built on the design tokens
- Tabs: `src/dashboard/tabs/*`; illustrative data: `src/dashboard/data/*`

---

## Proposal Draft Agent

A Travel Designer's assistant. You give it a short client brief, and it composes a structured, editable **first draft** of a luxury itinerary in Tully's house voice.

It is not a client-facing booking tool. The draft is a starting point for a Tully Travel Designer, who brings the access, judgment, and final curation. That framing shows in the header, on every draft, and in the closing disclaimer band.

## Run it

Requires Node 20.12 or later (built on Node 24).

```bash
npm install
cp .env.example .env      # then add your key (see below)
npm run dev               # http://localhost:5173 (opens on the Overview)
```

A single process serves the React app and the API on one port. For a production build:

```bash
npm run build
npm start
```

## Deploy to Vercel

`vercel.json` builds the React app with Vite into `dist/` and serves the API as one Vercel Function (`api/index.ts`), which mounts the same Express app the local server uses (`server/app.ts`). Every `/api/*` request is rewritten to it, with a 300-second limit so long drafts can finish.

```bash
vercel                    # first run links a project, then deploys a preview
vercel env add ANTHROPIC_API_KEY production
vercel --prod
```

Add `ANTHROPIC_API_KEY` (and optionally `ANTHROPIC_MODEL`) under Project Settings → Environment Variables, then redeploy. Without it the deployed app runs in sample mode. The live endpoints spend your Anthropic credit, so keep Deployment Protection on (Vercel Authentication or a password) for anything you share.

## Where to set `ANTHROPIC_API_KEY`

Put it in **`.env`** at the project root:

```
ANTHROPIC_API_KEY=sk-ant-...
# optional
ANTHROPIC_MODEL=claude-opus-5
PORT=5173
```

The key is read only by the server (`server/anthropic.ts`) and is never sent to the browser. `.env` is git-ignored. Exporting `ANTHROPIC_API_KEY` in your shell also works.

Without a key, the app still runs. The brief screen offers a clearly labeled **sample draft** for the prefilled Kenya + Seychelles brief. You can also force it at any time with `http://localhost:5173/?sample`, which is useful as a safety net for a live demo without reliable wifi.

## The house voice

**`src/prompts/houseVoice.ts`** is Tully's brand voice as an editable config, not a black box. It holds:

- the system prompt: tone, "draft for a Designer" framing, geography and pacing rules, no invented prices or availability, and stays phrased as "properties such as…"
- the two registers behind the **Understated / Evocative** toggle

Edit it and the next draft uses your changes.

## How it works

| Step | What happens |
|---|---|
| Brief | Six fields, prefilled with an example. **Draft the journey** calls `POST /api/draft`. |
| Draft | Claude returns JSON constrained to the proposal schema (`src/shared/proposal.ts`). The server validates it with Zod, retries once if malformed, and normalizes it. |
| Edit | Click any title, overview, narrative, highlight, stay, or touch to edit it in place. Edits live in page state only. |
| Regenerate | **Regenerate this day** or **Regenerate section** calls `POST /api/regenerate` with the current, edited draft as context, and merges back only that piece. |
| Voice | **Understated / Evocative** calls `POST /api/revoice`, which rewrites the copy in that register and keeps the structure and your edits. |
| Export | A clean, branded proposal view. **Print or save as PDF** uses print styles. |

## Guardrails

- Brief data stays in the browser session and the in-flight request. There is no database and no storage, and the server logs only route, status, and timing, never request content.
- The model is told never to state prices, confirmed availability, or booking references.
- API and parse errors appear as calm, on-brand messages.
- `prefers-reduced-motion` is respected.

## Design system

Everything is built from the handoff in `design_handoff_tully_system/`: `src/styles/tokens.css` (imported once) and the seven components in `src/components/`. There are two small documented extensions: `Card ratio={null}` omits the image well, and select fields carry a 1px CSS chevron.

## A five-minute demo

1. Open on **Overview**: the week in one read. Hover the bookings chart; watch the activity feed tick.
2. **Agentic Operations**: choose the Singita statement and **Run the agent**. It finds a 10% vs 12% short-pay and a booking missing from the statement, then drafts the dispute for Julie Boucher's approval.
3. Skim **CRM**, **ERP** and **Finance**: the systems the agents feed.
4. **Proposal Engine**: run the proposal demo below.

### Proposal Engine steps

1. Open the app. The brief is prefilled, so select **Draft the journey**.
2. Scroll the draft: the day-by-day itinerary, places to stay "by feel", and access and touches.
3. Click the title and make it your own. Edit a highlight on Day 4.
4. Select **Regenerate this day** on Day 5. Only that day changes.
5. Switch the voice to **Evocative**.
6. Select **Export** and then **Print or save as PDF**.
