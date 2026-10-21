# Agent Checkpoint

**Mode:** AUTONOMOUS
**Updated:** 2026-10-21

## State

| Field | Value |
|---|---|
| Current batch | Complete — FarsiUI adoption (ADR-007) done |
| Last completed | FUI-1 — FarsiUI installed, components/skills added, FA home + typeset, FA index polish |
| Validation | tsc + ESLint passed; parity 65/65 OK; `/fa` new FarsiUI home 200, `/en` unchanged, FA/EN docs 200 |
| Next | User runs commit blocks in `GIT_COMMIT_PLAN.md` (FA 0–7 + FarsiUI batch) |

## Notes

- ADR-006 bilingual; ADR-007 FarsiUI in `src/components/farsiui/` with lab token remap
- Agent never runs git add/commit/push
- npm: bypass Runflare mirror with `--registry=https://registry.npmjs.org/`
- Vazirmatn single `arabic` subset + variable weight (Next 16 Turbopack constraint)
