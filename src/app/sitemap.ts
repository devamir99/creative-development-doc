import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/site";
import { source } from "@/lib/source";

// Required for `output: "export"` (GitHub Pages).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of locales) {
    entries.push({
      url: absoluteUrl(`/${lang}`),
      alternates: {
        languages: {
          en: absoluteUrl("/en"),
          fa: absoluteUrl("/fa"),
          "x-default": absoluteUrl("/en"),
        },
      },
    });

    for (const page of source.getPages(lang)) {
      const slugPath = page.slugs.length ? `/${page.slugs.join("/")}` : "";
      const pathFor = (locale: string) => `/${locale}/docs${slugPath}`;
      entries.push({
        url: absoluteUrl(pathFor(lang)),
        alternates: {
          languages: {
            en: absoluteUrl(pathFor("en")),
            fa: absoluteUrl(pathFor("fa")),
            "x-default": absoluteUrl(pathFor("en")),
          },
        },
      });
    }
  }

  return entries;
}
