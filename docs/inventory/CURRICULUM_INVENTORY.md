# Curriculum Inventory

Coverage matrix: concept → demo needed → recommended tech → status.

**Statuses:** `SEED` (English/stub) | `NOT STARTED` | `IN PROGRESS` | `SHIPPED` (meets lesson + demo bar) | `N/A`

Counts (planned targets, refined over time):

| Domain | Lessons (approx) | Demos required (approx) | Seed pages now | Shipped gold |
| --- | --- | --- | --- | --- |
| Camera | 8–12 | 10+ | 1 index | 0 |
| Editing | 6–8 | 6+ | 1 index | 0 |
| Composition | 8–10 | 8+ | 5 | 0 |
| Motion | 10–14 | 10+ | 2 (index + timing) | 0 (timing seed only) |
| Storytelling | 5–7 | 3+ | 1 index | 0 |
| Lighting | 6–8 | 6+ | 1 index | 0 |
| Creative Web | 8–12 | 8+ | 1 index | 0 |
| Direction | 4–6 | 0–2 | 0 | 0 |
| Projects | 4 | case-study builds | 0 | 0 |

---

## Phase 01 — Camera & Cinematography

| Lesson / concept | Demo? | Tech | Status | Notes |
| --- | --- | --- | --- | --- |
| Fundamentals / index | Y later | — | SEED | `camera/index.mdx` |
| Shot types comparison | Y | R3F | NOT STARTED | |
| Angles playground | Y | R3F | NOT STARTED | |
| FOV | Y | R3F | NOT STARTED | |
| Dolly vs Zoom | Y | R3F | NOT STARTED | True optical/spatial difference |
| Ortho vs Perspective | Y | R3F | NOT STARTED | |
| Orbit | Y | R3F | NOT STARTED | |
| Path / camera along path | Y | R3F | NOT STARTED | |
| DOF | Y | R3F | NOT STARTED | |
| Rack Focus | Y | R3F | NOT STARTED | |
| Blocking | Y | R3F | NOT STARTED | |
| Scroll cameras | Y | R3F + scroll | NOT STARTED | Advanced |

## Phase 02 — Editing & Transitions

| Lesson / concept | Demo? | Tech | Status | Notes |
| --- | --- | --- | --- | --- |
| Index / overview | N | — | SEED | |
| Cut types / timeline visualizer | Y | CSS/GSAP | NOT STARTED | |
| Continuity / 180° rule | Y | SVG/CSS | NOT STARTED | |
| J/L cuts | Y | Timeline UI | NOT STARTED | |
| Match cut | Y | CSS/GSAP | NOT STARTED | |
| Dissolve / wipe / mask | Y | CSS/SVG | NOT STARTED | |
| Montage rhythm | Y | GSAP | NOT STARTED | Original assets only |

## Phase 03 — Composition

| Lesson / concept | Demo? | Tech | Status | Notes |
| --- | --- | --- | --- | --- |
| Index | N | — | SEED | |
| Focal point | Y | CSS/SVG drag | SEED | `focal-point.mdx` EN |
| Balance | Y | CSS/SVG | SEED | No fake “science scores” |
| Tension | Y | CSS/SVG | SEED | |
| Center vs off-center | Y | CSS/SVG | SEED | |
| Rule of Thirds / grids | Y | SVG overlay | NOT STARTED | |
| Symmetry | Y | SVG | NOT STARTED | |
| Negative space | Y | SVG | NOT STARTED | |
| Leading lines | Y | SVG | NOT STARTED | |
| Depth / layering | Y | CSS/R3F | NOT STARTED | |
| Hierarchy | Y | CSS | NOT STARTED | |

## Phase 04 — Motion Design

| Lesson / concept | Demo? | Tech | Status | Notes |
| --- | --- | --- | --- | --- |
| Index | N | — | SEED | |
| Timing | Y | GSAP | SHIPPED | DOC + DEMO motion-001 (English, shell, reduced-motion) |
| Easing | Y | GSAP + curve viz | SHIPPED | DOC + DEMO motion-002 (gold vertical slice) |
| Spacing | Y | GSAP | NOT STARTED | |
| Anticipation | Y | GSAP | NOT STARTED | |
| Follow Through / Overshoot | Y | GSAP | NOT STARTED | |
| Stagger | Y | GSAP | NOT STARTED | |
| Parallax | Y | GSAP/scroll | NOT STARTED | |
| Morph | Y | SVG/GSAP | NOT STARTED | |
| Kinetic type | Y | GSAP | NOT STARTED | |
| Scroll timelines | Y | GSAP ST | NOT STARTED | |
| GSAP engineering notes | Partial | — | NOT STARTED | |
| Reduced motion patterns | Y | CSS/GSAP | NOT STARTED | |

## Phase 05 — Visual Storytelling

| Lesson / concept | Demo? | Tech | Status |
| --- | --- | --- | --- |
| Index | N | — | SEED |
| Narrative / motif / metaphor | Optional | — | NOT STARTED |
| Pacing | Y | Timeline | NOT STARTED |
| Mise-en-scène | Y | Composition+light | NOT STARTED |
| Scroll storytelling / reveals | Y | GSAP ST | NOT STARTED |

## Phase 06 — Lighting, Color & Atmosphere

| Lesson / concept | Demo? | Tech | Status |
| --- | --- | --- | --- |
| Index | N | — | SEED |
| Lights & shadows | Y | R3F | NOT STARTED |
| Color / grade | Y | CSS/R3F | NOT STARTED |
| Fog / atmosphere | Y | R3F | NOT STARTED |
| Bloom / tone mapping | Y | R3F | NOT STARTED |

## Phase 07 — Creative Web

| Lesson / concept | Demo? | Tech | Status |
| --- | --- | --- | --- |
| Index | N | — | SEED |
| GSAP systems | Y | GSAP | NOT STARTED |
| WebGL pipeline / R3F | Y | R3F | NOT STARTED |
| Shaders intro | Y | R3F/shader | NOT STARTED |
| Cursor / magnetic / distortion | Y | GSAP/R3F | NOT STARTED |
| Perf + a11y patterns | Partial | — | NOT STARTED |

## Phase 08–09 — Direction & Projects

| Lesson / concept | Demo? | Tech | Status |
| --- | --- | --- | --- |
| Creative direction frameworks | N | — | NOT STARTED |
| Cinematic landing case study | Y | mixed | NOT STARTED |
| 3D product case study | Y | R3F | NOT STARTED |
| Immersive portfolio | Y | mixed | NOT STARTED |
| Digital showroom | Y | R3F | NOT STARTED |

---

## Demo tech summary (shipped)

| Demo | Path | Tech | Shell? |
| --- | --- | --- | --- |
| TimingPlayground | `src/demos/motion/timing-playground.tsx` | GSAP | Custom (pre-shell) |
