# Git Commit Plan (USER ONLY)

Agents must **never** run `git add` / `git commit` / `git push`.

Historical per-batch commands below are **logical groupings of the final working tree**, not guaranteed intermediate snapshots.

---

## FIX-PAGES-001 — Unlock Actions deploy (2026-10-26)

```powershell
git add package-lock.json .github/workflows/nextjs.yml README.md docs/deploy/GITHUB_PAGES.md docs/README.md docs/progress docs/roadmap/TASK_BACKLOG.md
git commit -m "ci(pages): repair lockfile sync and drop conflicting nextjs workflow"
git push origin main
```

Then: GitHub → Settings → Pages → Source = GitHub Actions. Watch **Actions → Deploy GitHub Pages**. Site: `https://devamir99.github.io/creative-development-doc/`

## FIX-PAGES-002 — Lockfile for npm 10.9.2 on Actions (2026-10-26)

CI pins `npm@10.9.2`; lockfile from npm 11 still omitted `@emnapi/core` / `@emnapi/runtime`. Regenerated so `npm@10.9.2 ci` succeeds. Do **not** click Pages → “Configure” Next.js sample (recreates conflicting workflow).

```powershell
git add package-lock.json .github/workflows/ci.yml .github/workflows/pages.yml docs/progress/GIT_COMMIT_PLAN.md
git commit -m "ci(pages): sync lockfile for npm 10.9.2 used on Actions"
git push origin main
```

## FIX-PAGES-003 — Typecheck + static export (2026-10-26)

Install now passes. Next blockers: `PageProps`/`LayoutProps` need `.next/dev` types (missing on CI), and `robots.txt`/`sitemap` need `dynamic = "force-static"` for `output: "export"`.

```powershell
git add "src/app/[lang]/docs/[[...slug]]/page.tsx" "src/app/[lang]/docs/layout.tsx" src/app/robots.ts src/app/sitemap.ts docs/progress/GIT_COMMIT_PLAN.md
git commit -m "fix(pages): explicit route props and force-static robots/sitemap for export"
git push origin main
```

Validation: `tsc --noEmit` exit 0; local `GITHUB_PAGES=1` build (api excluded) exit 0 and writes `out/`.

---

## FIX-INSTANT-001 — Docs slug Suspense (2026-10-26)

```bash
git add src/app/[lang]/docs/[[...slug]]/page.tsx docs/progress/PROJECT_STATUS.md docs/progress/AGENT_CHECKPOINT.md docs/progress/GIT_COMMIT_PLAN.md docs/roadmap/TASK_BACKLOG.md
git commit -m "fix(docs): stream slug page behind Suspense for Instant Navigations"
```

Validation: reload `/fa/docs/*` and `/en/docs/*` — Blocking Route / `instant-shell-url-data` gone; content still renders; unknown slugs soft-404 with `noindex`.

---

## FA Batch 0 — ADR-006 + glossary + guide (2026-10-21)

```bash
git add docs/decisions/ADR-006-bilingual-en-fa.md docs/architecture/CONTENT_SYSTEM.md docs/architecture/ARCHITECTURE.md docs/i18n docs/progress docs/roadmap/TASK_BACKLOG.md
git commit -m "docs(i18n): ADR-006 bilingual en/fa strategy, glossary, and translation guide"
```

---

## FA Batch 1 — /en + /fa routing, RTL, pilot FA pages (2026-10-21)

```bash
git add src/lib/i18n.ts src/lib/source.ts src/lib/layout.shared.tsx src/proxy.ts src/app src/app/globals.css content/docs/index.fa.mdx content/docs/meta.fa.json content/docs/camera/movement.fa.mdx content/docs/camera/meta.fa.json content/docs/motion/easing.fa.mdx content/docs/motion/meta.fa.json docs/progress docs/roadmap/TASK_BACKLOG.md
git commit -m "feat(i18n): add /en and /fa routes, RTL chrome, and legacy /docs redirects"
```

Validation: `next typegen` + `tsc --noEmit` passed; HTTP smoke — `/`→308 `/en`, `/docs/*`→308 `/en/docs/*`, `/fa/docs/camera/movement` RTL+Persian 200, `/en` pages English 200.

---

## FA Batch 2 — Playground localization (2026-10-21)

```bash
git add src/i18n src/components/playground src/demos docs/progress docs/roadmap/TASK_BACKLOG.md
git commit -m "feat(i18n): localize all playground chrome, labels, and educational code comments"
```

Validation: `tsc --noEmit` passed; ESLint on `src/i18n src/components/playground src/demos src/app src/lib` passed; all 36 playground files consume `useLocale`; FA movement page renders Persian toolbar.

---

## FA Batch 3 — FA root + camera + editing content (2026-10-21)

```bash
git add content/docs/index.fa.mdx content/docs/meta.fa.json content/docs/camera content/docs/editing docs/progress docs/roadmap/TASK_BACKLOG.md
git commit -m "docs(fa): translate handbook root, camera, and editing curriculum"
```

Validation: 0 absolute `/docs/` links in camera+editing `*.fa.mdx`; `/fa/docs/camera`, `/fa/docs/camera/fundamentals`, `/fa/docs/editing`, `/fa/docs/editing/cuts` all 200 with Persian content.

---

## FA Batch 4 — FA composition + motion content (2026-10-21)

```bash
git add content/docs/composition content/docs/motion docs/progress docs/roadmap/TASK_BACKLOG.md
git commit -m "docs(fa): translate composition and motion curriculum"
```

Validation: 0 absolute `/docs/` links in composition+motion `*.fa.mdx`; `/fa/docs/composition/rule-of-thirds`, `/fa/docs/motion`, `/fa/docs/motion/timing` 200.

---

## FA Batch 5 — FA storytelling + lighting + creative-web (2026-10-21)

```bash
git add content/docs/storytelling content/docs/lighting content/docs/creative-web docs/progress docs/roadmap/TASK_BACKLOG.md
git commit -m "docs(fa): translate storytelling, lighting, and creative-web curriculum"
```

Validation: 0 absolute links in new FA files; storytelling/pacing, lighting/three-point, creative-web/scroll-trigger FA routes 200.

---

## FA Batch 6 — FA direction + projects + reference (2026-10-21)

```bash
git add content/docs/direction content/docs/projects content/docs/reference docs/progress docs/roadmap/TASK_BACKLOG.md
git commit -m "docs(fa): translate direction, projects, and reference section"
```

Validation: parity EN 65 / FA 65, meta 11/11, 0 absolute `/docs/` links in all FA MDX; direction/critique, projects/showroom, reference/glossary FA routes 200.

---

## FA Batch 7 — Search locale, SEO/hreflang, parity QA (2026-10-21)

```bash
git add src/app/api/search src/app/sitemap.ts src/app/robots.ts "src/app/[lang]/docs" "src/app/[lang]/layout.tsx" src/lib/site.ts scripts/check-fa-parity.mjs package.json docs/progress docs/roadmap/TASK_BACKLOG.md
git commit -m "feat(i18n): fa search locale filtering, hreflang SEO, and parity QA"
```

Validation: `npm run check:fa-parity` OK; tsc + ESLint passed; search `locale=fa` isolates `/fa`; sitemap+robots 200; canonical + hreflang (`en`/`fa`/`x-default`) present on docs pages.

---

## FarsiUI Batch — FarsiUI adoption for /fa (2026-10-21, ADR-007)

```bash
git add package.json package-lock.json components.json src/lib/utils.ts src/components/farsiui src/app/globals.css "src/app/[lang]/page.tsx" .cursor/skills .cursor/rules/persian-typography.mdc .cursor/rules/agents-md-persian.mdc docs/decisions/ADR-007-farsiui-adoption.md content/docs/index.fa.mdx content/docs/camera/index.fa.mdx content/docs/editing/index.fa.mdx content/docs/composition/index.fa.mdx content/docs/motion/index.fa.mdx content/docs/storytelling/index.fa.mdx content/docs/lighting/index.fa.mdx content/docs/creative-web/index.fa.mdx content/docs/direction/index.fa.mdx content/docs/projects/index.fa.mdx content/docs/reference/index.fa.mdx docs/progress docs/roadmap/TASK_BACKLOG.md
git commit -m "feat(fa): adopt FarsiUI components, Persian typeset, and polished FA entry texts"
```

Validation: tsc + ESLint passed; parity 65/65 OK; `/fa` renders new FarsiUI home (Cards/Badges/Buttons), `/en` untouched; FA/EN docs 200.

---

## GitHub Actions + Pages (2026-10-24)

```bash
git add .github next.config.mjs src/app/page.tsx docs/progress/GIT_COMMIT_PLAN.md
git commit -m "ci: add GitHub Actions CI and static GitHub Pages deploy"
```

After push: Settings → Pages → Source = GitHub Actions. Site:
`https://devamir99.github.io/creative-development-doc/`
Note: Pages build excludes `/api/search` (static host).

---

## Audit-Fix Batch — Claude audit fixes (2026-10-21)

```bash
git add .gitignore content/docs src scripts/check-fa-parity.mjs docs/i18n/TRANSLATION_GUIDE.md docs/progress docs/roadmap/TASK_BACKLOG.md
git commit -m "fix(audit): repair FA links, real 404s, RTL shell chrome, demo bugs, and FA search normalization"
```

Fixes: #1 all 578 in-content links → file-relative `.mdx` (EN+FA) + parity resolves links; #2 production build requires `NEXT_PUBLIC_SITE_URL`; #3/#4 shell chrome follows locale dir, Persian chrome drops mono/tracking; #5 dark theme forced; #6 unknown slugs → real 404; #7–#12 demo bugs (kinetic, J/L marker, scroll marker, translate stacking, orbit commit, camera pause); #13–#15 FarsiUI leaks scoped (radius/tabular/FA headings); #16 stage `role=group`; #17 touch-none drag; #18 FA search normalization (ي/ك/ZWNJ); #19 localized home metadata; #21 `nativeButton={false}`; #22 slider readout rounding; #24 localized transition readout.
Validation: tsc + ESLint passed; parity links=578 OK; HTTP — `/fa/docs/nope` 404, FA index links 200, Arabic/ZWNJ-less search hits, FA home metadata/hreflang present. Production build not run (OOM risk noted in audit; run with `NEXT_PUBLIC_SITE_URL` set).

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
