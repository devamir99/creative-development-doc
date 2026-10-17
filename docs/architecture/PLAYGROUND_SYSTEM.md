# Playground System — Contracts

> Target architecture for **ENG-004+**. Current seed (`TimingPlayground`) is a standalone Client Component and should eventually wrap or migrate into this shell.

## Goals

- Reusable chrome for lesson demos  
- Real controls only (no decorative fakes)  
- Consistent Reset / Replay / optional Pause  
- Optional live code panel synced to parameters  
- Safe cleanup; reduced-motion respect  
- Lazy-load heavy tech (R3F / large GSAP timelines)

## Proposed module layout

```text
src/components/playground/
  playground-shell.tsx      # chrome + slots
  playground-stage.tsx      # framed stage region
  playground-toolbar.tsx    # reset / replay / pause
  playground-code-panel.tsx # snippet + copy
  playground-error-boundary.tsx
src/components/ui/          # primitives (ENG-003) — see UI_PRIMITIVES.md
src/demos/<domain>/         # lesson-specific stage + control wiring
```

Control primitives (`LabButton`, `LabSlider`, `LabSelect`, `LabReadout`) live under `src/components/ui/` and must be preferred over one-off button/range markup in new demos.

## Shell contract (target API sketch)

```tsx
type PlaygroundShellProps = {
  title: string;
  description?: string;
  onReset?: () => void;
  onReplay?: () => void;
  onPause?: () => void;
  isPaused?: boolean;
  stage: React.ReactNode;
  controls?: React.ReactNode;
  code?: { language: string; value: string };
  className?: string;
};
```

Exact props may evolve in ENG-004; update this doc when implemented.

## Behavioral requirements

| Behavior | Requirement |
| --- | --- |
| Reset | Restores default parameters **and** stage state |
| Replay | Restarts animation without necessarily resetting params |
| Pause | Optional; only when motion benefits |
| Code sync | When applicable: stage + readouts + snippet stay consistent |
| Reduced motion | Honor `prefers-reduced-motion`; provide non-animated fallback or static explanation |
| Keyboard | Controls focusable and operable |
| Cleanup | GSAP contexts killed; Three geometries/materials disposed on unmount |
| Errors | Boundary with readable Persian/English fallback — never blank crash |

## Tech escalation ladder

Prefer simplest tool that teaches the concept:

1. CSS / SVG  
2. GSAP  
3. Canvas 2D  
4. R3F / Three / shaders  

## Categories (as needed)

Camera · Composition · Timeline · Easing · Scroll · Lighting · WebGL · Shader

## MDX registration

Every public playground component must be exported and added to `getMDXComponents` in `src/components/mdx.tsx`.

## Current deviation

`src/demos/motion/timing-playground.tsx` implements its own chrome. Acceptable until ENG-004/DEMO-MOTION-001; do not proliferate more one-off shells without shared abstraction once shell exists.
