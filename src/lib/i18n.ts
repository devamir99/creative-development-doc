import { defineI18n, type I18nConfig } from "fumadocs-core/i18n";
import { defineI18nUI } from "fumadocs-ui/i18n";

export const locales = ["en", "fa"] as const;
export type Locale = (typeof locales)[number];

export const i18nConfig: I18nConfig<Locale> = {
  languages: [...locales],
  defaultLanguage: "en",
  hideLocale: "never",
  parser: "dot",
  fallbackLanguage: "en",
};

export const i18n = defineI18n(i18nConfig);

export const i18nUI = defineI18nUI(i18nConfig, {
  en: { displayName: "English" },
  fa: {
    displayName: "فارسی",
    "On this page(table of contents)": "در این صفحه",
    "No Headings(table of contents)": "عنوانی نیست",
    "Search(search trigger)": "جست‌وجو",
    "Open Search(search trigger)(aria-label)": "باز کردن جست‌وجو",
    "Close Search(search dialog)(aria-label)": "بستن جست‌وجو",
    "No results found(search dialog)": "نتیجه‌ای پیدا نشد",
    "Search(search dialog)": "جست‌وجو",
    "Choose a language(language switcher)": "انتخاب زبان",
    "Choose a language(language switcher)(aria-label)": "انتخاب زبان",
    "Next Page(pagination)": "صفحه بعدی",
    "Previous Page(pagination)": "صفحه قبلی",
    "Last updated on(page footer)": "آخرین به‌روزرسانی",
    "Table of Contents(inline table of contents)": "فهرست مطالب",
    "Toggle Theme(theme switcher)(aria-label)": "تغییر تم",
    "Dark(theme switcher)(aria-label)": "تیره",
    "Light(theme switcher)(aria-label)": "روشن",
    "System(theme switcher)(aria-label)": "سیستم",
    "Open Sidebar(sidebar)(aria-label)": "باز کردن سایدبار",
    "Close Sidebar(sidebar)(aria-label)": "بستن سایدبار",
    "Collapse Sidebar(sidebar)(aria-label)": "جمع کردن سایدبار",
    "Copy Text(code block)(aria-label)": "کپی متن",
    "Copied Text(code block)(aria-label)": "کپی شد",
  },
});

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dirFor(locale: Locale): "rtl" | "ltr" {
  return locale === "fa" ? "rtl" : "ltr";
}
