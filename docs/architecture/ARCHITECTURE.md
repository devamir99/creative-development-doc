# Architecture — Creative Lab

## Purpose

Creative Lab is a **handbook + interactive laboratory**: Fumadocs lessons (MDX) embed **lesson-specific demos** that share a **playground engine**. Content and demos stay separable so curriculum can grow without rewriting the app shell.

## High-level diagram

```text
┌─────────────────────────────────────────────────────────┐
│  Next.js App Router                                      │
│  /[lang]    → localized landing (en | fa)                │
│  /[lang]/docs/** → Fumadocs DocsLayout + MDX pages       │
│  /api/search→ locale-aware search from source loader     │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────┐     ┌────────────────────────┐
│ content/docs/** (MDX)     │────▶│ src/lib/source.ts      │
│ meta.json trees           │     │ defineDocs + loader    │
└───────────────┬───────────┘     └────────────────────────┘
                │ getMDXComponents
                ▼
┌───────────────────────────┐     ┌────────────────────────┐
│ src/components/mdx.tsx    │────▶│ src/demos/<domain>/*   │
│ registers demo components │     │ lesson-specific UI     │
└───────────────────────────┘     └───────────┬────────────┘
                                              │ uses
                                              ▼
                                  ┌────────────────────────┐
                                  │ src/components/        │
                                  │  playground/ (future)  │
                                  │  ui/ (future)          │
                                  └────────────────────────┘
```

## Layer responsibilities

| Layer | Path | Responsibility |
| --- | --- | --- |
| Routes | `src/app` | Layouts, providers, landing, docs shell, API |
| Content | `content/docs` | Curriculum MDX + `meta.json` navigation |
| Source | `src/lib/source.ts` | Fumadocs content loader (`baseUrl: /docs`) |
| MDX map | `src/components/mdx.tsx` | Register interactive components for MDX |
| Demos | `src/demos/**` | Domain demos (motion, camera, …) — Client Components when needed |
| Playground | `src/components/playground/**` | Shared shell/contracts (**ENG-004+**) |
| UI primitives | `src/components/ui/**` | Controls, a11y (**ENG-003+**) |
| Styles / tokens | `src/app/globals.css` | Semantic lab tokens + Fumadocs CSS imports |
| Planning | `docs/**` | Roadmap, status, ADRs — not runtime |

## Content vs playground separation

- **MDX** owns pedagogy (Persian prose, structure, takeaways).
- **Demos** own interactivity (stage + controls + motion/WebGL).
- **Shell** owns chrome (reset/replay/code panel) so demos stay thin.
- Do **not** put large GSAP/Three trees in root layout.
- Prefer `dynamic(() => import(...), { ssr: false })` (or project-equivalent) for heavy demos when introduced.

## Rendering rules

- Default: Server Components.
- `"use client"` only for browser APIs, GSAP, R3F, pointers, local interactive state.
- Do not make entire docs client-rendered.
- Zustand only when playground state must be shared across distant components.

## Config notes (current)

- `next.config.mjs`: `createMDX()`, `cacheComponents`, `partialPrefetching`, Tailwind via Turbopack CSS loader.
- Fonts: Syne (display/Latin) + IBM Plex Mono (code) + Vazirmatn (Persian fa).
- Theme: Fumadocs `RootProvider`, default dark.

## Evolution path

1. **ENG-001** — tokens / RTL chrome on existing surfaces  
2. **ENG-003–005** — UI + playground engine  
3. Migrate Timing demo onto shell; add Easing (vertical slice)  
4. Expand demos per inventory; keep MDX registration explicit  

## Non-goals (near term)

- Auth, CMS, multi-tenant
- Replacing Fumadocs
- Mass rewrite of all English seeds in one task
