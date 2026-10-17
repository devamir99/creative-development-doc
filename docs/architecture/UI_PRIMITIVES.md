# UI Primitives — Playground controls

**Status:** Shipped in `ENG-003`  
**Path:** `src/components/ui/`

Token-driven, keyboard-usable controls for playground toolbars. Not a general app design system — keep them thin and pedagogical.

## Components

| Export | File | Role |
| --- | --- | --- |
| `LabButton` | `button.tsx` | Actions / presets (`solid` \| `outline` \| `ghost`, `pressed`) |
| `LabSlider` | `slider.tsx` | Labeled range input + live value |
| `LabSelect` | `select.tsx` | Labeled native `<select>` |
| `LabReadout` | `readout.tsx` | Label + value display (server-safe) |

Barrel: `import { LabButton, LabSlider, LabSelect, LabReadout } from "@/components/ui"`.

## Rules

- Use CSS variables / `lab-*` theme colors only — no one-off brand hex.
- Real controls only (no decorative non-functional UI).
- Prefer native elements (`button`, `input[type=range]`, `select`) for accessibility.
- Visible `:focus-visible` ring via accent token.
- Labels are required for slider/select (`htmlFor` / `id`).
- Playground stages stay LTR; these controls work in both directions.

## Current usage

- `TimingPlayground` uses `LabButton` + `LabReadout` (smoke test for ENG-003).
- `LabSlider` / `LabSelect` are ready for `ENG-004` PlaygroundShell and later demos.

## Out of scope (later)

- Full playground shell chrome (`ENG-004`)
- Code panel / copy (`ENG-005`)
- Leva or external control panels
