"use client";

import {
  createContext,
  use,
  useMemo,
  type ReactNode,
} from "react";
import type { Locale } from "@/lib/i18n";

export const common = {
  en: {
    replay: "Replay",
    pause: "Pause",
    resume: "Resume",
    reset: "Reset",
    copy: "Copy",
    copied: "Copied",
    copyFailed: "Copy failed",
    copiedAnnouncement: "Code copied to clipboard",
    playgroundError: "Playground error",
    playgroundErrorBody:
      "This playground hit an error. You can retry after resetting state.",
    retry: "Retry",
    demoStage: "Demo stage",
    loadingWebgl: "Loading WebGL stage…",
    loadingDemo: "Loading demo…",
  },
  fa: {
    replay: "پخش دوباره",
    pause: "توقف",
    resume: "ادامه",
    reset: "بازنشانی",
    copy: "کپی",
    copied: "کپی شد",
    copyFailed: "کپی ناموفق بود",
    copiedAnnouncement: "کد در کلیپ‌بورد کپی شد",
    playgroundError: "خطای دمو",
    playgroundErrorBody:
      "این دمو به خطا خورد. بعد از بازنشانی حالت می‌توانی دوباره تلاش کنی.",
    retry: "تلاش دوباره",
    demoStage: "صحنه دمو",
    loadingWebgl: "در حال بارگذاری صحنه WebGL…",
    loadingDemo: "در حال بارگذاری دمو…",
  },
} as const;

export type CommonStrings = {
  [K in keyof (typeof common)["en"]]: string;
};

type LocaleContextValue = {
  locale: Locale;
  fa: boolean;
  common: CommonStrings;
  pick: (en: string, fa: string) => string;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  fa: false,
  common: common.en,
  pick: (en) => en,
});

export { LocaleContext };

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      fa: locale === "fa",
      common: common[locale],
      pick: (en, fa) => (locale === "fa" ? fa : en),
    }),
    [locale],
  );
  return <LocaleContext value={value}>{children}</LocaleContext>;
}

export function useLocale() {
  return use(LocaleContext);
}
