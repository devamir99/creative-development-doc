# Git Commit Plan (USER ONLY)

Agents must **never** run `git add` / `git commit` / `git push`.

Historical per-batch commands below are **logical groupings of the final working tree**, not guaranteed intermediate snapshots.

---

## Batch G — Cinematic interactive demos (2026-10-20)

```bash
git add src/demos/camera src/demos/motion/easing-playground.tsx src/demos/motion/easing-scene.tsx content/docs/camera/movement.mdx content/docs/camera/shot-types.mdx content/docs/motion/easing.mdx docs/progress docs/roadmap/TASK_BACKLOG.md
git commit -m "feat(demos): cinematic WebGL stages for camera moves, shots, and easing"
```

---

## Batch F — YouTube video references (2026-10-20)

```bash
git add content/docs/camera content/docs/editing content/docs/composition content/docs/motion content/docs/lighting content/docs/storytelling content/docs/creative-web docs/progress/AGENT_CHECKPOINT.md docs/progress/PROJECT_STATUS.md docs/progress/GIT_COMMIT_PLAN.md docs/roadmap/TASK_BACKLOG.md
git commit -m "docs(curriculum): add curated YouTube references to visual lessons"
```

---

## Batch E — Sidebar section folders (2026-10-20)

```bash
git add src/app/docs/layout.tsx src/app/docs/[[...slug]]/page.tsx docs/progress/AGENT_CHECKPOINT.md docs/progress/PROJECT_STATUS.md docs/progress/GIT_COMMIT_PLAN.md docs/roadmap/TASK_BACKLOG.md
git commit -m "fix(docs): open sidebar sections by default so lesson links SSR"
```

---

## Batch D — Complete handbook reference (2026-10-20)

```bash
git add content/docs src/components/mdx.tsx src/demos/camera/shot-types-playground.tsx src/demos/camera/camera-movement-playground.tsx src/demos/camera/projection-playground.tsx src/demos/composition/space-lines-playground.tsx src/demos/motion/motion-principles-playground.tsx src/demos/storytelling/story-visual-playground.tsx src/demos/lighting/light-atmosphere-playground.tsx src/demos/creative-web/web-craft-playground.tsx docs/progress docs/roadmap/TASK_BACKLOG.md
git commit -m "docs(handbook): complete full creative development reference with new lessons and demos"
```

---

## Batch C — Demo-first gap fill (fundamentals, motif, direction, projects)

```bash
git add src/demos/camera/fundamentals-playground.tsx src/demos/camera/fundamentals-scene.tsx src/demos/storytelling/motif-playground.tsx src/demos/direction src/demos/projects content/docs/camera/fundamentals.mdx content/docs/storytelling/motif.mdx content/docs/direction content/docs/projects content/docs/motion/easing.mdx src/components/mdx.tsx
git commit -m "feat(demos): add demo-first playgrounds for remaining lessons"
```

---

## Final recommended commits (regrouped)

Run from repo root. Inspect with `git status` first.

### 1 — Agent workflow + progress

```bash
git add .cursor/rules/creative-lab-continuity.mdc docs/progress/AGENT_CHECKPOINT.md docs/progress/GIT_COMMIT_PLAN.md docs/progress/PROJECT_STATUS.md docs/roadmap/TASK_BACKLOG.md docs/roadmap/MASTER_ROADMAP.md
git commit -m "docs(agent): enable autonomous mode and update progress tracking"
```

### 2 — Dependencies (DOF postprocessing)

```bash
git add package.json package-lock.json
git commit -m "chore(deps): add react-three postprocessing for DOF demos"
```

### 3 — Camera DOF

```bash
git add src/demos/camera/dof-math.ts src/demos/camera/dof-scene.tsx src/demos/camera/dof-playground.tsx content/docs/camera/dof.mdx content/docs/camera/meta.json content/docs/camera/index.mdx content/docs/camera/orbit.mdx
git commit -m "feat(camera): add depth-of-field and rack-focus playground"
```

### 4 — Editing

```bash
git add src/demos/editing content/docs/editing
git commit -m "feat(editing): add cuts, J/L-cut, and transition playgrounds"
```

### 5 — Composition

```bash
git add src/demos/composition content/docs/composition
git commit -m "feat(composition): polish lessons and interactive composition labs"
```

### 6 — Motion expansions

```bash
git add src/demos/motion/stagger-playground.tsx src/demos/motion/anticipation-playground.tsx src/demos/motion/parallax-playground.tsx content/docs/motion
git commit -m "feat(motion): add stagger, anticipation, and parallax playgrounds"
```

### 7 — Storytelling, lighting, creative web

```bash
git add src/demos/storytelling src/demos/lighting src/demos/creative-web content/docs/storytelling content/docs/lighting content/docs/creative-web
git commit -m "feat(curriculum): add storytelling, lighting, and creative-web labs"
```

### 8 — Direction + projects + nav/MDX registry

```bash
git add content/docs/direction content/docs/projects content/docs/meta.json content/docs/index.mdx src/components/mdx.tsx
git commit -m "feat(docs): add direction, project briefs, and register all playgrounds"
```

### 9 — Config leftovers (only if intentional)

```bash
git add next.config.mjs
git add -u next.config.ts
git commit -m "chore(next): migrate config to next.config.mjs"
```

Include `src/app/docs/` / `src/lib/source.ts` only if they are required untracked app wiring:

```bash
git add src/app/docs src/lib/source.ts
git commit -m "fix(docs): ensure docs app routes and source wiring"
```

---

## Batch log (earlier notes)

### Batch A — Autonomous mode docs

See commit 1.

### Batch B — DEMO-CAM-DOF

See commit 3 (+ deps in commit 2).
