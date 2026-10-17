# Project Status — Creative Lab

**Last updated:** 2026-10-17  
**Current engineering phase:** 06 Foundational Modules  
**Active / next task:** `DEMO-CAM-DOLLY-ZOOM` — Dolly vs Zoom (true optical difference)  
**Execution state:** Waiting for user approval to start `DEMO-CAM-DOLLY-ZOOM`

---

## Snapshot

| Item | Value |
| --- | --- |
| Camera FOV | R3F playground shipped (`/docs/camera/fov`, dynamic import) |
| Locale / accent | English LTR · yellow accent (ADR-005) |
| Blockers | None |

---

## Completed

| ID | Name | Notes |
| --- | --- | --- |
| … through DOC-CAM-001 | Prior work | |
| DEMO-CAM-FOV | FOV playground (R3F) | Lazy `FovScene`, fixed position, FOV slider/presets |

---

## Next up (prerequisites satisfied)

1. **`DEMO-CAM-DOLLY-ZOOM`** — must show true optical/spatial difference (not fake scale)  
   - Depends on: DEMO-CAM-FOV ✓

---

## Last validation (DEMO-CAM-FOV)

| Check | Result |
| --- | --- |
| Typecheck | passed |
| Lint | passed |
| Build | passed |
| Browser / WebGL | not run — open `/docs/camera/fov` |

---

## Notes for next agent

1. Dolly vs Zoom: compare moving camera vs changing FOV with matched framing — parallax must differ.
2. Reuse lazy Canvas pattern from `fov-playground.tsx`.
3. Suggest git only; never commit/push.
4. STOP after one task.
