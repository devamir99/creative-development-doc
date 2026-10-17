# Playground System — Contracts

**Status:** Shell shipped in `ENG-004`. Code sync + copy utilities in `ENG-005` (see `CODE_SYNC.md`).

## Goals

- Reusable chrome for lesson demos  
- Real controls only (no decorative fakes)  
- Consistent Reset / Replay / optional Pause  
- Optional live code panel synced via `formatSnippet` + `copyText`  
- Safe cleanup; reduced-motion respect (per-demo)  
- Lazy-load heavy tech (R3F / large GSAP timelines) when introduced  

## Module layout

```text
src/components/playground/
  playground-shell.tsx          # chrome + slots
  playground-stage.tsx          # framed stage region
  playground-toolbar.tsx        # reset / replay / pause
  playground-code-panel.tsx     # snippet + copy
  playground-error-boundary.tsx
  index.ts
src/lib/playground/
  format-snippet.ts             # {{param}} → live code
  copy-text.ts                  # clipboard helper
  index.ts
src/components/ui/              # primitives — see UI_PRIMITIVES.md
src/demos/<domain>/             # lesson-specific stage + control wiring
```

Prefer `LabButton`, `LabSlider`, `LabSelect`, `LabReadout` over one-off control markup.

## Shell API

```tsx
import { PlaygroundShell } from "@/components/playground";

<PlaygroundShell
  title="Live Playground"
  description="What to observe…"
  onReset={handleReset}
  onReplay={handleReplay}
  onPause={handlePause}       // optional
  isPaused={isPaused}         // optional
  stage={<… />}
  stageLabel="Accessible stage name"
  controls={<… />}            // Lab* controls
  code={{ language: "js", value: snippet }}
/>
```

| Prop | Role |
| --- | --- |
| `title` / `description` | Header chrome |
| `onReset` | Defaults + stage restart |
| `onReplay` | Restart motion; keep params |
| `onPause` / `isPaused` | Optional pause/resume |
| `stage` | Visual region (wrapped in `PlaygroundStage`) |
| `controls` | Parameter UI |
| `code` | Optional panel with Copy |

Shell root is always `dir="ltr"` + `lab-ltr`.

## Behavioral requirements

| Behavior | Requirement |
| --- | --- |
| Reset | Restores default parameters **and** stage state |
| Replay | Restarts animation without necessarily resetting params |
| Pause | Optional; only when motion benefits |
| Code sync | Use `formatSnippet` so stage + readouts + snippet stay consistent |
| Reduced motion | Honor in demos (`prefers-reduced-motion`) |
| Keyboard | Controls focusable via UI primitives |
| Cleanup | Demo responsibility (GSAP / Three dispose) |
| Errors | `PlaygroundErrorBoundary` — English message + Retry |

## Tech escalation ladder

1. CSS / SVG → 2. GSAP → 3. Canvas 2D → 4. R3F / shaders

## MDX registration

Register demos in `src/components/mdx.tsx` (`getMDXComponents`).

## Reference migration

`TimingPlayground` uses `PlaygroundShell` + `formatSnippet` (Reset, Replay, controls, synced code, Copy).
