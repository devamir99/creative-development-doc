import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import type { Locale } from "./i18n";

export function baseOptions(lang: Locale = "en"): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="font-[family-name:var(--font-display)] tracking-tight">
          Creative Lab
        </span>
      ),
    },
    links: [
      {
        text: lang === "fa" ? "نقشه راه" : "Roadmap",
        url: `/${lang}/docs`,
        active: "nested-url",
      },
    ],
  };
}
