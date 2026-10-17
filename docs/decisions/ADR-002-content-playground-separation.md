# ADR-002 — Content vs playground separation

**Status:** Accepted  
**Date:** 2026-10-17

## Context

Lessons need rich interactivity without turning the documentation tree into a SPA of Client Components. Heavy WebGL must not load on text-only pages.

## Decision

1. **MDX** in `content/docs` is the pedagogical source of truth.
2. **Demos** live under `src/demos/<domain>/` and are registered explicitly in `src/components/mdx.tsx`.
3. **Shared chrome** lives under `src/components/playground/` (ENG-004+).
4. Default to Server Components; demos opt into client boundaries.
5. Escalate rendering tech only as far as pedagogy requires (CSS → GSAP → Canvas → R3F).

## Consequences

- Clear ownership and code-splitting path.
- Slight registration boilerplate per demo (acceptable).
- Seed Timing playground’s custom chrome is transitional until shell lands.
