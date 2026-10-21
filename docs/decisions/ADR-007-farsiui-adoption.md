# ADR-007 — FarsiUI adoption for the Persian locale

**Status:** Accepted (builds on ADR-006)
**Date:** 2026-10-21

## Context

After the EN/FA bilingual release (ADR-006), the owner asked to adopt
[FarsiUI](https://farsiui.ir/docs) — a Persian-first, RTL-first React/Tailwind
component library with a shadcn-style CLI (components are copied into the
project and owned) — to make the `/fa` experience cleaner and more polished,
plus an editorial polish pass over Persian entry-point texts.

A partial `farsiui init` had already run interactively and had overwritten
`src/components/ui/button.tsx` (our `LabButton`) and the light `:root` theme.

## Decision

1. **Namespace isolation:** FarsiUI components live in `src/components/farsiui/`
   (`components.json` alias `ui` → `@/components/farsiui`). Existing
   `Lab*` primitives in `src/components/ui/` are untouched; the overwritten
   `LabButton` was restored from git.
2. **Identity remap, not theme replacement:** FarsiUI semantic tokens are
   remapped in `globals.css` (`:root, .dark`) onto the lab palette —
   always-dark background, electric-yellow primary/accent. FarsiUI ships a
   light/blue theme; we never adopt its colors.
3. **Components added (only what is used):** `button`, `card`, `badge`,
   `separator` — used on the Persian home (`/[lang]` FA branch). EN home and
   Fumadocs chrome are unchanged. Playground shells keep ADR-006 LTR isolation
   and existing `Lab*` controls.
4. **Typography (FarsiUI Typeset model):** FA reading rhythm is driven by
   `--typeset-size / --typeset-leading (2.05) / --typeset-flow`, scoped to
   `html[lang="fa"] .prose`; FA headings use Vazirmatn with no letter-spacing.
   Vazirmatn loading stays single-`arabic`-subset (ADR-006 Turbopack rule).
5. **Skills installed:** FarsiUI agent skills `persian-typography`,
   `persian-rtl-ui`, `persian-formal`, `persian-seo` (+ rules
   `agents-md-persian`) under `.cursor/skills/` and `.cursor/rules/`.
   Jalali/calendar skills are intentionally not adopted — the handbook has
   no dates.
6. **Editorial polish:** Persian home copy and the 11 section index pages
   were polished (formal-but-warm voice); lessons keep ADR-006 translations.

## Consequences

- New deps from `farsiui init`: `farsiui`, `@base-ui/react`,
  `class-variance-authority`, `cn`, `tw-animate-css` (+ `src/lib/utils.ts`).
- npm in this environment must bypass the credit-exhausted Runflare mirror:
  `npx --registry=https://registry.npmjs.org/ farsiui@latest ...`
- Adding more FarsiUI components: `farsiui add <name>` lands in
  `src/components/farsiui/` — re-check token remap after any future `init`.
