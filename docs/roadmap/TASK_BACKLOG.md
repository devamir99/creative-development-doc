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
- **Status:** `COMPLETED`
- **Depends on:** ENG-001
- **Objective:** Accessible control primitives for playgrounds (button, slider, select, readout) under `src/components/ui/` (or agreed path), token-driven.
- **Acceptance:**
  - [x] Keyboard-usable controls (`LabButton`, `LabSlider`, `LabSelect`, `LabReadout`)
  - [x] Used or ready for shell (TimingPlayground uses Button/Readout; Slider/Select ready)
  - [x] No fake decorative controls
  - [x] Documented in `docs/architecture/UI_PRIMITIVES.md`

### ENG-004 — Playground shell infrastructure
- **Status:** `COMPLETED`
- **Depends on:** ENG-003
- **Objective:** Shared `PlaygroundShell` (stage, toolbar, Reset, Replay, Pause slot, controls region, code panel slot, error boundary).
- **Acceptance:**
  - [x] Contracts match `PLAYGROUND_SYSTEM.md`
  - [x] Timing demo migrated onto shell (Reset / Replay / controls / code panel)
  - [x] Error boundary with Retry
  - [x] Vazirmatn Turbopack font failure fixed (related blocker during verification)

### ENG-005 — Code snippet sync + copy utilities
- **Status:** `COMPLETED`
- **Depends on:** ENG-004
- **Objective:** Utilities/components so displayed code matches live params; Copy works.
- **Acceptance:**
  - [x] Documented API (`docs/architecture/CODE_SYNC.md`)
  - [x] `formatSnippet` + `copyText` in `src/lib/playground`
  - [x] Unit-smoke via Timing demo + `formatSnippet` node check
  - [x] Code panel uses shared copy helper

---

## Vertical slice — Motion (Phase 05)

### DOC-MOTION-001 — Timing lesson (English, full template)
- **Status:** `COMPLETED`
- **Depends on:** ENG-002, ENG-004 (demo may ship as DEMO-MOTION-001)
- **Objective:** Migrate `content/docs/motion/timing.mdx` to the English lesson standard (ADR-005; template in `LESSON_TEMPLATE.md`).
- **Acceptance:**
  - [x] Skeleton sections present (intro → related + exercise)
  - [x] Clear English; no marketing fluff
  - [x] Playground embedded; parameters documented

### DEMO-MOTION-001 — Timing playground (shell integration)
- **Status:** `COMPLETED`
- **Depends on:** ENG-004, ENG-005 (partial OK if sync deferred with note)
- **Objective:** Upgrade Timing playground to shell standards (reset/replay, a11y, reduced-motion).
- **Acceptance:**
  - [x] Controls work (presets / reset / replay)
  - [x] Cleanup OK (`useGSAP`)
  - [x] Registered in `mdx.tsx`
  - [x] `prefers-reduced-motion` static fallback + preset a11y group

### DOC-MOTION-002 — Easing lesson (English)
- **Status:** `COMPLETED`
- **Depends on:** DOC-MOTION-001
- **Objective:** New Easing MDX lesson (English, ADR-005) meeting quality standard.
- **Acceptance:**
  - [x] Linked from motion `meta.json`
  - [x] Related Timing + full English template sections
  - [x] Playground explicitly deferred to DEMO-MOTION-002 (no broken MDX tag)

### DEMO-MOTION-002 — Easing playground (gold slice)
- **Status:** `COMPLETED`
- **Depends on:** DOC-MOTION-002, ENG-005
- **Objective:** Presets, duration, replay, side-by-side, motion + curve viz, synced code.
- **Acceptance:**
  - [x] Ease + duration presets, Replay / Reset
  - [x] Side-by-side selected ease vs linear
  - [x] SVG curve viz (progress vs time)
  - [x] Synced code via `formatSnippet` + Copy
  - [x] Reduced-motion fallback; registered in `mdx.tsx`
  - [x] Completes Eng Phase 05 gold slice with DOC-MOTION-002

---

## Foundational modules (Phase 06) — queued after vertical slice

Execute **one lesson** (DOC + DEMO if required) per run unless backlog item says otherwise.

### Camera (samples — expand inventory as shipped)

| ID | Task | Depends | Status |
| --- | --- | --- | --- |
| DOC-CAM-001 | Camera fundamentals (English) | Phase 05 done | `COMPLETED` |
| DEMO-CAM-FOV | FOV playground (R3F) | DOC-CAM-001 + ENG-004 | `COMPLETED` |
| DEMO-CAM-DOLLY-ZOOM | Dolly vs Zoom (true optical difference) | DEMO-CAM-FOV | `COMPLETED` |
| DEMO-CAM-ORBIT | Orbit camera | ENG-004 | `COMPLETED` |
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
| **ID** | `DEMO-CAM-DOF` |
| **Title** | DOF / rack focus |
| **Depends on** | ENG-004 (`COMPLETED`) |
| **Blocked?** | No |
