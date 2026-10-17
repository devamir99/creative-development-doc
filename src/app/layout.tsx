import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import { IBM_Plex_Mono, Syne, Vazirmatn } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

// Single subset + variable axis — avoids Turbopack
// "next/font/google queries have exactly one entry" with multi-subset arrays.
// Latin glyphs fall through to Syne via the --font-sans stack in globals.css.
const body = Vazirmatn({
  variable: "--font-body",
  subsets: ["arabic"],
  weight: "variable",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Creative Lab",
    template: "%s · Creative Lab",
  },
  description:
    "دفترچه و آزمایشگاه تعاملی توسعه خلاقانه سینمایی — دوربین، ترکیب‌بندی، موشن و WebGL.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${display.variable} ${body.variable} ${mono.variable} dark h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans antialiased">
        <RootProvider
          theme={{
            enabled: true,
            defaultTheme: "dark",
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
