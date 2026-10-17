# ADR-003 — RTL and locale strategy

**Status:** Accepted (apply baseline in `ENG-001`; refine search in `ENG-002`)  
**Date:** 2026-10-17

## Context

Audience is Persian-speaking developers. Seed app uses `lang="en"` and LTR. Fumadocs search is configured with `language: "english"`.

## Decision

1. Set document language toward Persian (`lang="fa"`) when ENG-001 hardens chrome, unless a short transitional dual-locale approach is required for remaining English seeds.
2. Prefer `dir="rtl"` at root **or** docs layout once Persian is primary; keep code blocks and playground monospace panels logically LTR (`dir="ltr"` / `unicode-bidi` as needed).
3. Do not flip Fumadocs internals blindly — verify sidebar/TOC readability after the change.
4. Defer search re-language / dual index to ENG-002 with a follow-up ADR if the API requires non-obvious config.

## Consequences

- Mixed English seed pages may look RTL until migrated — acceptable if readability remains OK; migrate per DOC tasks.
- Timing playground layout must be checked after dir change.
- Agents must not revert to `lang="en"` without a new ADR.
