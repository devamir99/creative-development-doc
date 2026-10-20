# Agent Checkpoint

**Mode:** AUTONOMOUS
**Updated:** 2026-10-20

## State

| Field | Value |
|---|---|
| Last completed | Upgraded interactive camera/motion demos to cinematic WebGL stages |
| Validation | `tsc --noEmit` ✓ · eslint on changed demos ✓ |
| Next | User commit (GIT_COMMIT_PLAN Batch G); optional QA-002 browser pass |

## Notes

- Shared `CameraDepthSet`: capsule hero + mid props + far skyline + rim light
- `CameraMovementPlayground`: full R3F (pan/tilt/dolly/truck/pedestal/orbit/zoom/handheld)
- `ShotTypesPlayground`: R3F framing distance + low/eye/high
- `EasingPlayground`: WebGL runway (eased yellow vs linear wire) + lanes + curve
- Do not git add/commit/push (agent rule)
