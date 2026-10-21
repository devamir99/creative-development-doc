# Project Status — Creative Lab

**Last updated:** 2026-10-21
**State:** Bilingual EN/FA (ADR-006) + FarsiUI adoption (ADR-007) complete; awaiting user commits

## Snapshot

| Item | Value |
|---|---|
| MDX pages | 65 EN + 65 FA (parity 65/65) |
| Section metas | 11 EN + 11 FA |
| Interactive playground files | 36 (all localized via `useLocale`) |
| Language | English + Persian (ADR-006): `/en` + `/fa`; legacy `/docs` → 308 `/en/docs`; `/` → 308 `/en` |
| Search | Locale-filtered (`?locale=en|fa`); multilingual tokenizer |
| SEO | `sitemap.xml`, `robots.txt`, per-page canonical + hreflang (`en`, `fa`, `x-default`) |
| Parity QA | `npm run check:fa-parity` |
| FA UI kit | FarsiUI in `src/components/farsiui/` (button/card/badge/separator), tokens remapped to lab dark/yellow |
| FA polish | Typeset rhythm (leading 2.05), FarsiUI home, polished FA index texts, FarsiUI agent skills in `.cursor/` |
| Docs sidebar | Section folders open by default (`defaultOpenLevel: 1`) |
| Video references | ~42 visual lessons have a curated YouTube link |

## Curriculum (all with lessons + demos or structured briefs)

Camera (10) · Editing (5) · Composition (10) · Motion (10) · Storytelling (5) · Lighting (5) · Creative Web (6) · Direction (5) · Projects (5 incl. showroom) · Reference (glossary, cheat sheet, checklists)

## Last validation (2026-10-21 — FA-7)

| Check | Result |
|---|---|
| `npm run check:fa-parity` | passed — 65/65, meta 11/11, 0 absolute `/docs/` in FA, playground tags preserved |
| Typecheck | passed |
| ESLint (phase-7 files) | passed |
| Search locale filter | passed — `locale=fa` returns only `/fa/...` (0 EN leak) |
| Sitemap / robots | passed — `/sitemap.xml` 200 with en+fa+xhtml alternates; `/robots.txt` 200 |
| hreflang | passed — canonical + `en`/`fa`/`x-default` alternate links on FA docs pages |
| Legacy redirects | passed — `/` and `/docs/*` → 308 `/en…` |
| FA content routes | passed — sample FA pages 200 with Persian |

## Audit fixes (2026-10-21 — AUDIT-FIX-1)

Claude full-audit findings #1–#19/#21–#24 fixed: 578 MDX links → `.mdx` file-relative (parity now resolves links), production build requires `NEXT_PUBLIC_SITE_URL`, shell chrome is locale-directed with Persian typography, dark theme forced, real 404s, demo bugs (kinetic/J-L/scroll/translate/orbit/camera-pause), FarsiUI leaks scoped, `role=group` stages, FA search normalization (ي/ك/ZWNJ), localized home metadata. Validated: tsc/ESLint/parity + HTTP (404s, FA links, Arabic search, home hreflang).

## Remaining (optional only)

- Production build with `NEXT_PUBLIC_SITE_URL` set (not run — machine OOM risk during audit)
- Browser/WebGL interactive spot-check across all demos (QA-002)
- Formal a11y audit (QA-003); nice-to-haves from audit (lazy playground registry, frameloop demand)
