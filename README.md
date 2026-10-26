# Creative Lab

Personal handbook and interactive playground for cinematic creative development — camera, composition, motion, and WebGL.

Bilingual **English / Persian** (`/en`, `/fa`). Curriculum and demos live under Fumadocs + Next.js.

## Local development

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port Next prints). Prefer `npm ci` so the lockfile stays the source of truth (same as GitHub Actions).

Useful checks:

```bash
npx tsc --noEmit
npm run lint
npm run check:fa-parity
```

Production build (non-Pages) requires a public site URL:

```bash
# PowerShell
$env:NEXT_PUBLIC_SITE_URL="https://example.com"
npm run build
```

## Deploy (GitHub Pages + Actions)

This repo already ships the deploy workflow. Follow:

**[docs/deploy/GITHUB_PAGES.md](./docs/deploy/GITHUB_PAGES.md)**

Short version:

1. GitHub → **Settings → Pages → Source = GitHub Actions**
2. Push to `main` (or run **Deploy GitHub Pages** manually)
3. Site: [https://devamir99.github.io/creative-development-doc/](https://devamir99.github.io/creative-development-doc/)

Only use `.github/workflows/pages.yml` for Pages — do not add a second sample `nextjs.yml`.

## Project docs

See [docs/README.md](./docs/README.md) for architecture, roadmap, and agent continuity files.
