# ADR-001 — Accent color via semantic tokens

**Status:** Superseded by ADR-005 (yellow accent) — token *pattern* still applies  
**Date:** 2026-10-17

## Context

Foundation seed uses teal accent `#7dd3c0` (`--lab-accent`) across landing glow, buttons, and Timing playground.

`MASTER_PROMPT.md` design vision specifies purposeful violet `#6D33FA` via **semantic design tokens**, not scattered hardcodes.

## Decision

1. Treat `--lab-accent` (and related dim/glow tokens) as the single source of accent truth in `globals.css`.
2. In `ENG-001`, migrate token values to violet `#6D33FA` (and coherent dim/glow companions).
3. Update touched UI to consume tokens / Tailwind `lab-*` theme colors only.
4. Do not leave dual “brand accents” (teal + violet) without an explicit later ADR.

## Consequences

- Visual shift on landing and Timing demo when ENG-001 lands — expected.
- Fumadocs default theme accents may still differ slightly; align gradually without forking entire fumadocs CSS in ENG-001.
- Documentation and status must mention the migration so agents do not “restore teal” as a bugfix.
