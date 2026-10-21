# ADR-006 — Bilingual English/Persian product

**Status:** Accepted (supersedes locale clauses of ADR-005; yellow accent remains)
**Date:** 2026-10-21

## Context

The owner requested a complete Persian twin of the English handbook, with identical curriculum/demo coverage and separate commits per implementation phase.

Current product rule (ADR-005) forbids restoring `lang="fa"` or Persian RTL without a new ADR.

## Decision

1. **Locales:** `en` (default) and `fa` are equal user-facing locales.
2. **URL:** Symmetric routes `/en/...` and `/fa/...`; docs live at `/en/docs/**` and `/fa/docs/**`. Legacy `/docs/**` redirects permanently to `/en/docs/**`; `/` redirects to `/en`.
3. **Content naming:** English remains unsuffixed (`timing.mdx`, `meta.json`); Persian twins use Fumadocs dot parser (`timing.fa.mdx`, `meta.fa.json`).
4. **Direction:** `lang="fa"` + `dir="rtl"` under `/fa`; English stays LTR. Code, code panels, playground/canvas shells stay LTR-isolated (`dir="ltr"` / `lab-ltr`) even in FA.
5. **Playground localization:** Demos read locale via React context (no props in MDX). All learner-visible labels, title, descriptions, captions, readouts, and educational code comments are localized; executable identifiers, API names, GSAP ease strings remain English/Latin digits.
6. **Typography:** Persian UI/body uses Vazirmatn, loaded with a single Google Fonts subset `arabic` + variable weight to avoid the known Next/Turbopack multi-subset failure. Syne stays for Latin display/brand; IBM Plex Mono stays for code.
7. **Search/SEO:** Search must be locale-filtered at launch. Each locale gets localized metadata, canonical, hreflang (`en`, `fa`, `x-default`), sitemap, and robots. Untranslated FA pages may fall back to English during migration phases; final release requires full 65/65 parity.

## Consequences

- App Router moves under `src/app/[lang]/`; typed routes/docs helpers are updated accordingly.
- Root [`src/lib/source.ts`](../src/lib/source.ts) gets `loader({ i18n })` before `*.fa.mdx` files are introduced.
- Deterministic permanent redirect for `/docs/**` must not depend on Accept-Language for legacy URLs; root-level locale negotiation is allowed only for `/`.
