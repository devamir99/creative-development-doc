# Deploy to GitHub Pages (Actions)

Static site via `.github/workflows/pages.yml`. Local / Vercel builds stay full Next.js (`cacheComponents` on). Pages builds set `GITHUB_PAGES=1` → `output: "export"` + repo `basePath`.

## One-time GitHub settings

1. Repo → **Settings → Pages**
2. **Build and deployment → Source** = **GitHub Actions** (not “Deploy from a branch”)
3. Ensure Actions are allowed: **Settings → Actions → General → Allow all actions**

## Deploy

Push to `main`, or open **Actions → Deploy GitHub Pages → Run workflow**.

Public URL:

`https://devamir99.github.io/creative-development-doc/`

(Redirects `/` → `/en/` in the workflow; docs live under `/en/docs/…` and `/fa/docs/…`.)

## What the workflow does

1. `npm ci` (public `registry.npmjs.org`)
2. `npx fumadocs-mdx`
3. Removes `src/app/api` (static host cannot ship Route Handlers — **search API is off on Pages**)
4. `npm run build` with `GITHUB_PAGES=1` and `NEXT_PUBLIC_SITE_URL=https://devamir99.github.io/creative-development-doc`
5. Writes `out/.nojekyll` + root `index.html` redirect
6. Uploads `out/` and deploys with `actions/deploy-pages`

## Do not use

Do **not** add GitHub’s sample `nextjs.yml` next to `pages.yml`. Both target the same Pages environment and cancel/race each other. This repo’s custom `pages.yml` is the only deploy workflow.

## Local static smoke (optional)

```bash
# PowerShell
$env:GITHUB_PAGES="1"
$env:NEXT_PUBLIC_SITE_URL="https://devamir99.github.io/creative-development-doc"
# Remove API routes only for this smoke, or use a throwaway worktree
npm run build
```

Serve `out/` with any static server if you want to click through.

## CI

`.github/workflows/ci.yml` runs typecheck, lint, FA parity, and a **non-static** production build (needs `NEXT_PUBLIC_SITE_URL`). It does not deploy.
