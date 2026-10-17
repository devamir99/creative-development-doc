# Project Status — Creative Lab

**Last updated:** 2026-10-17  
**Current engineering phase:** 06 Foundational Modules  
**Active / next task:** `DEMO-CAM-FOV` — FOV playground (R3F)  
**Execution state:** Waiting for user approval to start `DEMO-CAM-FOV`

---

## Snapshot

| Item | Value |
| --- | --- |
| Phase 05 | Timing + Easing gold slice complete |
| Camera | Fundamentals lesson shipped (`/docs/camera/fundamentals`) |
| Locale / accent | English LTR · yellow accent (ADR-005) |
| Blockers | None |

---

## Completed

| ID | Name | Notes |
| --- | --- | --- |
| ENG-000 … ENG-005 | Infra | |
| DOC/DEMO-MOTION-001/002 | Vertical slice | |
| DOC-CAM-001 | Camera fundamentals (English) | Full template; demos deferred |

---

## In progress

_None (DOC-CAM-001 just completed)._

---

## Next up (prerequisites satisfied)

1. **`DEMO-CAM-FOV`** — FOV playground (R3F)  
   - Depends on: DOC-CAM-001 ✓, ENG-004 ✓  
   - Dynamic-import Canvas; do not load WebGL on unrelated pages

---

## Blocked

_None._

---

## Last validation (DOC-CAM-001)

| Check | Result |
| --- | --- |
| Build | passed |
| Browser | not run — open `/docs/camera/fundamentals` |

---

## Notes for next agent

1. First R3F demo: lazy-load, dispose, reduced-motion, PlaygroundShell.
2. Dolly vs Zoom must wait until FOV exists if it depends on DEMO-CAM-FOV.
3. Suggest git only; never commit/push.
4. STOP after one task.

---

## Suggested user phrase after committing

> تسک را تایید کردم و commit زدم. برو سراغ تسک بعدی طبق `PROJECT_STATUS.md`. فقط همان یک تسک.
