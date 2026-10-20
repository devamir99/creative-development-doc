# Project Status — Creative Lab

**Last updated:** 2026-10-20
**State:** Complete handbook + sidebar fix + YouTube video refs on visual lessons — awaiting user commit

## Snapshot

| Item | Value |
|---|---|
| MDX pages | 65 |
| Interactive playground files | 36 |
| Total MDX lines | ~4,781 |
| Language | English (ADR-005) |
| Docs sidebar | Section folders open by default (`defaultOpenLevel: 1`) |
| Video references | ~42 visual lessons have a curated YouTube link |

## Curriculum (all with lessons + demos or structured briefs)

Camera (10) · Editing (5) · Composition (10) · Motion (10) · Storytelling (5) · Lighting (5) · Creative Web (6) · Direction (5) · Projects (5 incl. showroom) · Reference (glossary, cheat sheet, checklists)

## Last validation (2026-10-20)

| Check | Result |
|---|---|
| Typecheck | passed (handbook batch) |
| Lint | passed (handbook batch) |
| Build (webpack) | passed — 71 routes (handbook batch) |
| Build (Turbopack default) | blocked by pre-existing `next/font/google` Turbopack resolution error in `src/app/layout.tsx` (unchanged) |
| Sidebar SSR | passed — `/docs` HTML includes section children when folders open |
| Sidebar toggle | passed — CDP click closes/reopens Camera folder |
| Browser/WebGL demos | not run |

## Remaining (optional only)

- Browser spot-check of WebGL demos
- Fix Turbopack font issue upstream / self-host fonts if it persists
