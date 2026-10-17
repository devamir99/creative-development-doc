# Task Backlog — Creative Lab

Actionable tasks only. Statuses: `NOT STARTED` | `IN PROGRESS` | `COMPLETED` | `BLOCKED`.

**Execution rule:** One task (or one explicitly paired DOC+DEMO if listed as a single backlog item) per agent run. Do not auto-advance.

---

## Engineering — Phase 00

### ENG-000 — Discovery docs + inventory
- **Status:** `COMPLETED`
- **Depends on:** —
- **Objective:** Inspect repository; produce roadmap, backlog, architecture, curriculum inventory, ADRs, agent continuity rule; identify first implementation task; do **not** change application features.
- **Acceptance:**
  - [x] `docs/roadmap/MASTER_ROADMAP.md`
  - [x] `docs/roadmap/TASK_BACKLOG.md`
  - [x] `docs/progress/PROJECT_STATUS.md`
  - [x] Architecture + inventory + ≥1 ADR
  - [x] Agent rule enforcing read-status → one task → no git write → stop
  - [x] Next task named (`ENG-001`)

---

## Engineering — Phase 01 (Foundation)

### ENG-001 — Design tokens + RTL / docs chrome hardening
- **Status:** `COMPLETED`
- **Depends on:** ENG-000
- **Objective:** Align semantic tokens with design vision (accent `#6D33FA`), prepare `lang`/dir strategy for Persian docs without breaking Fumadocs, tighten existing landing/docs chrome to use tokens only.
- **Primary files (expected):** `src/app/globals.css`, `src/app/layout.tsx`, possibly `src/lib/layout.shared.tsx`, `src/app/page.tsx` (token classes only), ADR update if needed.
- **Acceptance:**
  - [x] Accent and surfaces expressed via CSS variables / `@theme` (no scattered one-off accent hardcodes in touched files)
  - [x] Documented RTL approach applied at least at root or docs layout level as decided
  - [x] Timing playground still renders; `npm run lint` / build or typecheck recorded
  - [x] No new playground abstractions yet

### ENG-002 — Documentation system polish (template + nav hygiene)
- **Status:** `COMPLETED`
- **Depends on:** ENG-001
- **Objective:** Formalize Persian lesson MDX template; align `meta.json` titles; document MDX component registration pattern; search language plan.
- **Acceptance:**
  - [x] Template doc + one example stub or pointer
  - [x] `meta.json` titles / separators aligned (Persian chrome)
  - [x] MDX registration pattern documented (`CONTENT_SYSTEM` + `mdx.tsx`)
  - [x] Search strategy noted (`ADR-004` + multilingual `createFromSource`)

### ENG-003 — Design system control primitives
- **Status:** `NOT STARTED`
- **Depends on:** ENG-001
- **Objective:** Accessible control primitives for playgrounds (button, slider, select, readout) under `src/components/ui/` (or agreed path), token-driven.
- **Acceptance:** Keyboard-usable controls; used or ready for shell; no fake decorative controls.

### ENG-004 — Playground shell infrastructure
- **Status:** `NOT STARTED`
- **Depends on:** ENG-003
- **Objective:** Shared `PlaygroundShell` (stage, toolbar, Reset, Replay, Pause slot, controls region, code panel slot, error boundary).
- **Acceptance:** Contracts match `PLAYGROUND_SYSTEM.md`; Timing demo can migrate or wrap in a follow-up task (prefer migrate in ENG-004 or immediate DEMO task).

### ENG-005 — Code snippet sync + copy utilities
- **Status:** `NOT STARTED`
- **Depends on:** ENG-004
- **Objective:** Utilities/components so displayed code matches live params; Copy works.
- **Acceptance:** Documented API; unit-smoke via demo usage or minimal harness.

---

## Vertical slice — Motion (Phase 05)

### DOC-MOTION-001 — Timing lesson (Persian, full template)
- **Status:** `NOT STARTED`
- **Depends on:** ENG-002, ENG-004 (demo may ship as DEMO-MOTION-001)
- **Objective:** Migrate `content/docs/motion/timing.mdx` to Persian lesson standard.
- **Acceptance:** Skeleton sections present; RTL readable; no marketing fluff.

### DEMO-MOTION-001 — Timing playground (shell integration)
- **Status:** `NOT STARTED`
- **Depends on:** ENG-004, ENG-005 (partial OK if sync deferred with note)
- **Objective:** Upgrade Timing playground to shell standards (reset/replay, a11y, reduced-motion).
- **Acceptance:** Controls work; cleanup OK; registered in `mdx.tsx`.

### DOC-MOTION-002 — Easing lesson (Persian)
- **Status:** `NOT STARTED`
- **Depends on:** DOC-MOTION-001
- **Objective:** New Easing MDX lesson (Persian) meeting quality standard.
- **Acceptance:** Linked from motion `meta.json`; related Timing.

### DEMO-MOTION-002 — Easing playground (gold slice)
- **Status:** `NOT STARTED`
- **Depends on:** DOC-MOTION-002, ENG-005
- **Objective:** Presets, duration, replay, side-by-side, motion + curve viz, synced code.
- **Acceptance:** Gold-bar checklist in MASTER_PROMPT §8–9; Completes Eng Phase 05 when DOC+DEMO pass.

---

## Foundational modules (Phase 06) — queued after vertical slice

Execute **one lesson** (DOC + DEMO if required) per run unless backlog item says otherwise.

### Camera (samples — expand inventory as shipped)

| ID | Task | Depends | Status |
| --- | --- | --- | --- |
| DOC-CAM-001 | Camera fundamentals (Persian) | Phase 05 done | `NOT STARTED` |
| DEMO-CAM-FOV | FOV playground (R3F) | DOC-CAM-* + ENG-004 | `NOT STARTED` |
| DEMO-CAM-DOLLY-ZOOM | Dolly vs Zoom (true optical difference) | DEMO-CAM-FOV | `NOT STARTED` |
| DEMO-CAM-ORBIT | Orbit camera | ENG-004 | `NOT STARTED` |
| DEMO-CAM-DOF | DOF / rack focus | ENG-004 | `NOT STARTED` |

### Editing

| ID | Task | Depends | Status |
| --- | --- | --- | --- |
| DOC-EDIT-001 | Cuts & continuity (Persian) | Phase 05 | `NOT STARTED` |
| DEMO-EDIT-TIMELINE | Cut visualizer | DOC-EDIT-001 | `NOT STARTED` |
| DEMO-EDIT-JL | J/L cut demo | DOC-EDIT-001 | `NOT STARTED` |

### Composition (migrate English stubs)

| ID | Task | Depends | Status |
| --- | --- | --- | --- |
| DOC-COMP-001 | Focal point (Persian migrate) | Phase 05 | `NOT STARTED` |
| DEMO-COMP-FOCAL | Focal point playground | DOC-COMP-001 | `NOT STARTED` |
| DOC-COMP-002 | Balance (Persian migrate) | DOC-COMP-001 | `NOT STARTED` |
| DEMO-COMP-BALANCE | Balance / weight demo | DOC-COMP-002 | `NOT STARTED` |
| DOC-COMP-003 | Tension | DOC-COMP-002 | `NOT STARTED` |
| DOC-COMP-004 | Center vs off-center | DOC-COMP-003 | `NOT STARTED` |

---

## Later phases (placeholder IDs)

| ID | Summary | Phase | Status |
| --- | --- | --- | --- |
| DOC-MOTION-003+ | Spacing, anticipation, stagger, parallax, … | 07 | `NOT STARTED` |
| DOC-STORY-* | Storytelling modules | 08 | `NOT STARTED` |
| DOC-LIGHT-* | Lighting / color modules | 08 | `NOT STARTED` |
| DOC-WEB-* / DEMO-WEB-* | Creative web / shaders | 09 | `NOT STARTED` |
| DOC-DIR-* / DOC-PROJ-* | Direction & projects | 10 | `NOT STARTED` |
| QA-001 | Full a11y + perf audit | 11 | `NOT STARTED` |

---

## Next executable task

| Field | Value |
| --- | --- |
| **ID** | `ENG-003` |
| **Title** | Design system control primitives |
| **Depends on** | ENG-001 (`COMPLETED`) |
| **Blocked?** | No |
