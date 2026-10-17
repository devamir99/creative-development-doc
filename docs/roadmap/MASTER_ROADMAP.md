# Master Roadmap — Creative Lab

> Living document. Update status when tasks complete.  
> Source of truth for phase order; actionable work lives in `TASK_BACKLOG.md`.

**Statuses:** `NOT STARTED` | `IN PROGRESS` | `COMPLETED` | `BLOCKED`

---

## 0. Repository baseline (inspected)

| Area | State |
| --- | --- |
| Framework | Next.js **16.4.2** App Router, React 19.3, TypeScript, Tailwind CSS 4 |
| Docs stack | Fumadocs (`fumadocs-mdx` + `fumadocs-ui` + `fumadocs-core`), `/docs`, `/api/search` |
| Motion / 3D | `gsap`, `@gsap/react`, `three`, `@react-three/fiber`, `@react-three/drei` installed |
| State | `zustand` installed (unused until shared playground state needs it) |
| Home | Custom Creative Lab landing at `/` |
| Seed content | `content/docs/**` for camera, editing, composition, motion, storytelling, lighting, creative-web |
| First demo | `src/demos/motion/timing-playground.tsx` embedded in Timing MDX |
| Planning docs | Created by **ENG-000** (this phase) |
| Gaps | No shared playground engine; English seed prose; `lang="en"`; accent teal (`#7dd3c0`) vs prompt violet (`#6D33FA`); no RTL; composition/editing marked “Done” on home but lack gold-standard demos |

**Rule:** Build on this foundation — do not recreate the app from scratch.

---

## 1. Engineering phases

| Phase | Name | Goal | Status | Depends on |
| --- | --- | --- | --- | --- |
| **00** | Discovery & Architecture | Inspect repo; write roadmap, backlog, architecture, inventory, agent rules | `COMPLETED` | — |
| **01** | Project Foundation | Harden tokens, typography, RTL readiness, folder conventions on existing app | `COMPLETED` (ENG-001) | 00 |
| **02** | Documentation System | Fumadocs polish: nav meta, search language plan, lesson template, MDX map hygiene | `COMPLETED` (ENG-002) | 01 |
| **03** | Design System | Control primitives, a11y patterns, playground chrome tokens | `COMPLETED` (ENG-003) | 01 |
| **04** | Playground Infrastructure | Shared shell (stage, controls, reset/replay, code panel, error boundary, lazy load) | `COMPLETED` (ENG-004) | 03 |
| **05** | Vertical Slice | One gold lesson: Motion → Timing & Easing (English + demos + code sync) | `COMPLETED` | 04 |
| **06** | Foundational Modules | Camera → Editing → Composition (lesson batches) | `COMPLETED` (core set; more camera depth optional) | 05 |
| **07** | Motion Modules | Remaining motion lessons | `COMPLETED` (stagger/anticipation/parallax; more optional) | 05 |
| **08** | Storytelling & Lighting | Educational phases 05–06 | `COMPLETED` (pacing/motif + three-point; atmosphere optional) | 06–07 |
| **09** | Creative Web | GSAP systems, R3F, shaders, interactions | `COMPLETED` (ScrollTrigger + raycast; shaders optional) | 07–08 |
| **10** | Direction & Projects | Creative Direction + real project case studies | `COMPLETED` (briefs; showroom optional) | 09 |
| **11** | QA & Polish | Audit, perf, a11y, search, consistency | `IN PROGRESS` (build/lint/tsc ✓; browser QA pending) | 10 |

**Priority:** Infrastructure → one gold-standard lesson → expand curriculum.

---

## 2. Educational phases (content)

| Edu Phase | Domain | Eng phase owner | Status | Notes |
| --- | --- | --- | --- | --- |
| 01 | Camera & Cinematography | 06 | `COMPLETED` (core) | FOV, Dolly/Zoom, Orbit, DOF; shot types optional |
| 02 | Editing & Transitions | 06 | `COMPLETED` (core) | Cuts, J/L, Transitions playgrounds |
| 03 | Composition | 06 | `COMPLETED` (core) | Focal, Balance, Thirds, Tension, Center |
| 04 | Motion Design | 05 + 07 | `COMPLETED` (core) | Timing, Easing, Stagger, Anticipation, Parallax |
| 05 | Visual Storytelling | 08 | `COMPLETED` (core) | Pacing playground + Motif lesson |
| 06 | Lighting, Color & Atmosphere | 08 | `IN PROGRESS` | Three-point ✓; fog/bloom optional |
| 07 | Creative Web | 09 | `COMPLETED` (core) | ScrollTrigger + Raycast; shaders optional |
| 08 | Creative Direction | 10 | `COMPLETED` (core) | Visual language + Critique |
| 09 | Real-World Projects | 10 | `COMPLETED` (core) | Landing, Product 3D, Portfolio briefs |

Full lesson/demo matrix: `docs/inventory/CURRICULUM_INVENTORY.md`.

---

## 3. Milestones (acceptance-oriented)

### M0 — Planning continuity — `COMPLETED`

- [x] Roadmap, backlog, status, architecture, inventory, ADRs, agent rule
- [x] First implementation task identified (`ENG-001`)

### M1 — Foundation & chrome — acceptance — `COMPLETED`

- [x] Semantic design tokens aligned with vision (accent `#6D33FA` via tokens)
- [x] Root RTL strategy applied (`lang="fa"` `dir="rtl"`; LTR code/playground)
- [x] App still builds; Timing playground uses tokens + `dir="ltr"`
- [x] ENG-002 lesson template + nav/search hygiene
- [x] ENG-003 control primitives (`src/components/ui`)

### M2 — Playground engine — acceptance — `COMPLETED` (infra)

- [x] Shared `PlaygroundShell` usable from MDX (via registered demos)
- [x] Reset / Replay / controls / code panel contracts in `PLAYGROUND_SYSTEM.md`
- [x] ENG-005 code sync utilities (`formatSnippet` / `copyText`)
- [ ] Heavy demos load via dynamic import pattern (when first R3F demo lands)

### M3 — Gold vertical slice — acceptance — `COMPLETED`

- [x] English Timing + Easing lessons meeting lesson quality standard
- [x] Working demos with reset/replay, code sync, reduced-motion
- [x] Easing: side-by-side vs linear + curve viz + synced code
- [x] Validation checks recorded in `PROJECT_STATUS.md`

### M4+ — Curriculum expansion

- One lesson (or tightly coupled DOC+DEMO pair) per agent run
- Inventory statuses updated per shipment

---

## 4. Dependency graph (implementation sequence)

```text
ENG-000 (planning) ✓
    └── ENG-001 (tokens + RTL/docs chrome) ✓
            ├── ENG-002 (docs system / lesson template) ✓
            ├── ENG-003 (design system controls) ✓
            └── ENG-004 (playground shell) ✓
                    ├── ENG-005 (code sync + copy utils) ✓
                    └── DOC/DEMO-MOTION-001 → DOC/DEMO-MOTION-002 (vertical slice) ✓
                            └── … → DEMO-CAM-ORBIT ✓ → DEMO-CAM-DOF  ← next
```

---

## 5. Risks

| Risk | Mitigation |
| --- | --- |
| Seed “status Done” contradicts gold bar | Treat seed as scaffold; migrate per lesson task |
| Accent teal vs violet in prompt | ADR-001; migrate in ENG-001 |
| Persian + Fumadocs search (`language: english`) | Plan Persian index / dual strategy in Eng-02 |
| Premature R3F on text pages | Dynamic import + no global Canvas |
| Agent scope creep | `.cursor/rules` + stop-after-one-task policy |
| Next.js 16 API drift | Read `node_modules/next/dist/docs/` + keep `AGENTS.md` |

---

## 6. Continuation protocol

1. Read `docs/progress/PROJECT_STATUS.md`
2. Read next task in `docs/roadmap/TASK_BACKLOG.md`
3. Follow architecture docs
4. Implement **only** that task
5. Validate, update status/roadmap
6. Suggest `git add` / `git commit` for user — **never** run them
7. **STOP**
