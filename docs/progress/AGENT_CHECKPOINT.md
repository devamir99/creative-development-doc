# Agent Checkpoint

**Mode:** AUTONOMOUS
**Updated:** 2026-10-21

## State

| Field | Value |
|---|---|
| Current batch | FA program complete — no remaining FA phases |
| Last completed | FA-7 — locale search docs, sitemap/robots, hreflang SEO, `check:fa-parity` |
| Validation | FA-7: parity OK 65/65; tsc + ESLint passed; search locale filter, sitemap/robots, hreflang, legacy redirects all passed |
| Next | User runs the 8 FA commit blocks in `GIT_COMMIT_PLAN.md` (agent never git-writes) |

## Notes

- ADR-006 supersedes ADR-005 locale clause; accent stays yellow
- Agent never runs git add/commit/push; user commit blocks are in GIT_COMMIT_PLAN
- FA MDX: relative links only; snippet comments FA, identifiers English
- Vazirmatn single `arabic` subset + variable weight (Next 16 Turbopack constraint)
- Production: set `NEXT_PUBLIC_SITE_URL` for absolute sitemap/canonical hosts
