# ADR-004 — Search language strategy

**Status:** Implemented (`ENG-002`)  
**Date:** 2026-10-17

## Context

`/api/search` used `createFromSource(source, { language: "english" })`.  
Curriculum is migrating to Persian while retaining English technical terms (Timing, FOV, …). Orama/Fumadocs do not ship a dedicated Persian stemmer. Forcing English stemming is a poor fit for Persian prose.

Fumadocs documents that the default **multilingual** mode uses Unicode word segmentation and works across locales without extra config.

## Decision

1. Call `createFromSource(source)` with **no** English-only language override.
2. Rely on multilingual Unicode segmentation for Persian body text + English tokens in the same index.
3. Do **not** introduce i18n locale routing solely for search in this phase.
4. Revisit only if search quality regresses after substantial Persian content lands — options then: custom tokenizer, tag filters, or external search.

## Consequences

- Persian queries and English technical terms can coexist in one index.
- No English plural stemming (`recording` ↔ `recordings`) unless a stemmer is added later.
- Search client / Fumadocs UI needs no change for this baseline.
