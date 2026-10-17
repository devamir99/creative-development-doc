# ADR-005 — English UI + yellow accent

**Status:** Accepted (supersedes accent target in ADR-001 and locale baseline in ADR-003)  
**Date:** 2026-10-17

## Context

Product direction from the owner: English reads better for this lab’s UI/design, and the brand accent should be electric yellow `rgb(250, 250, 5)` instead of violet.

## Decision

1. **Locale chrome:** `lang="en"`, default LTR. Remove Persian root/`dir="rtl"` and Vazirmatn body font. Keep Syne + IBM Plex Mono.
2. **Nav / meta titles:** English.
3. **Accent tokens:** `--lab-accent: rgb(250 250 5)`; `--lab-accent-fg: #09090b` (dark text on yellow); dim companion for surfaces.
4. **Lesson content language:** Prefer English for new/migrated lessons unless a future task explicitly reintroduces bilingual content. Planning templates may still mention Persian historically — treat English as current product language.
5. Playground shells remain `dir="ltr"` / `lab-ltr` for safety.

## Consequences

- ADR-001’s violet target is obsolete; token *mechanism* (semantic CSS vars) remains.
- ADR-003’s Persian/RTL baseline is obsolete; LTR isolate rules for code stay useful.
- Agents must not restore violet `#6D33FA` or `lang="fa"` without a new ADR.
