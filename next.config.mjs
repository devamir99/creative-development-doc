import { createMDX } from "fumadocs-mdx/next";

/**
 * GitHub Pages is static-only. Enable export + basePath when GITHUB_PAGES=1
 * (set by .github/workflows/pages.yml). Local/Vercel builds stay full Next.js.
 *
 * Public URL shape:
 *   https://devamir99.github.io/creative-development-doc/
 */
const isGitHubPages = process.env.GITHUB_PAGES === "1";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "creative-development-doc";
const basePath = isGitHubPages ? `/${repoName}` : "";

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  ...(isGitHubPages
    ? {
        output: "export",
        trailingSlash: true,
        images: { unoptimized: true },
        basePath,
        assetPrefix: basePath || undefined,
        // Static export does not support these experimental/server features.
        cacheComponents: false,
        partialPrefetching: false,
      }
    : {
        cacheComponents: true,
        partialPrefetching: true,
      }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withMDX = createMDX();

export default withMDX(config);
