import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import { IBM_Plex_Mono, Syne, Vazirmatn } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { LocaleProvider } from "@/i18n/locale";
import { dirFor, i18nUI, isLocale, locales } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";
import "../globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Single arabic subset + variable weight (ADR-003/006 Turbopack note).
const vazir = Vazirmatn({
  variable: "--font-vazir",
  subsets: ["arabic"],
  weight: "variable",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Creative Lab",
    template: "%s · Creative Lab",
  },
  description:
    "Personal handbook and interactive playground for cinematic creative development — camera, composition, motion, and WebGL.",
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      dir={dirFor(lang)}
      className={`${display.variable} ${mono.variable} ${vazir.variable} dark h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans antialiased">
        <RootProvider
          dir={dirFor(lang)}
          i18n={i18nUI.provider(lang)}
          theme={{
            enabled: true,
            defaultTheme: "dark",
          }}
        >
          <LocaleProvider locale={lang}>{children}</LocaleProvider>
        </RootProvider>
      </body>
    </html>
  );
}
