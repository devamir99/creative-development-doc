# Project Status — Creative Lab

**Last updated:** 2026-10-17  
**Current engineering phase:** 06 Foundational Modules  
**Active / next task:** `DEMO-CAM-ORBIT` — Orbit camera  
**Execution state:** Waiting for user approval to start `DEMO-CAM-ORBIT`

---

## Snapshot

| Item | Value |
| --- | --- |
| Dolly vs Zoom | Side-by-side R3F; matched subject size; real parallax difference |
| Locale / accent | English LTR · yellow accent (ADR-005) |
| Blockers | None |

---

## Completed (recent)

| ID | Name | Notes |
| --- | --- | --- |
| DEMO-CAM-FOV | FOV playground | |
| DEMO-CAM-DOLLY-ZOOM | Dolly vs Zoom | Shared depth set; framing math smoke-tested |

---

## Next up

1. **`DEMO-CAM-ORBIT`** — Orbit camera playground (R3F)  
   - Depends on: ENG-004 ✓  

---

## Last validation (DEMO-CAM-DOLLY-ZOOM)

| Check | Result |
| --- | --- |
| Typecheck | passed |
| Lint | passed |
| Build | passed |
| Framing math smoke | passed |
| Browser / WebGL | not run — `/docs/camera/dolly-zoom` |

---

## Notes for next agent

1. Reuse `CameraDepthSet` / lazy Canvas pattern.
2. Suggest git only; never commit/push.
3. STOP after one task.
