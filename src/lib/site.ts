/**
 * Canonical site origin for sitemap/robots/hreflang (ADR-006).
 *
 * `NEXT_PUBLIC_*` values are inlined at BUILD time, so this must be set
 * when building for production — a localhost fallback would otherwise be
 * baked into canonical, hreflang, sitemap and robots URLs.
 */
const isProd = process.env.NODE_ENV === "production";
const configured = process.env.NEXT_PUBLIC_SITE_URL;

if (isProd && !configured) {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL is required for production builds (canonical/hreflang/sitemap URLs). " +
      "Example: NEXT_PUBLIC_SITE_URL=https://your-domain.example npm run build",
  );
}

export const siteUrl = configured ?? "http://localhost:3000";

export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
