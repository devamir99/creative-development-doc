import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
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
        text: "نقشه راه",
        url: "/docs",
        active: "nested-url",
      },
    ],
  };
}
