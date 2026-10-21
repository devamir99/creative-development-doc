import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

/**
 * Persian normalization for search (ADR-006):
 * Arabic ي/ك → Persian ی/ک, and ZWNJ removed, applied to BOTH the indexed
 * text (buildIndex) and the incoming query — so دوربين and زمانبندی
 * (no ZWNJ) match دوربین / زمان‌بندی.
 */
function normalizeFa(value: string): string {
  return value
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/‌/g, "");
}

function normalizeDeep<T>(value: T): T {
  if (typeof value === "string") return normalizeFa(value) as T;
  if (Array.isArray(value)) return value.map(normalizeDeep) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, normalizeDeep(v)]),
    ) as T;
  }
  return value;
}

/**
 * Default multilingual tokenizer (Unicode segmentation).
 * Better for mixed Persian + English technical terms than `language: "english"`.
 * See docs/decisions/ADR-004-search-language.md
 *
 * Locale filtering (ADR-006): the i18n-aware loader tags every index with
 * its locale, and `createFromSource` enables `localeFilter` automatically —
 * `?locale=fa` returns only `/fa/...` pages, `?locale=en` only `/en/...`.
 */
const { GET: searchGET } = createFromSource(source, {
  buildIndex: async (page) => {
    const data = page.data as {
      title?: string;
      description?: string;
      structuredData?:
        | unknown
        | (() => Promise<unknown>);
    };
    const structuredData =
      typeof data.structuredData === "function"
        ? await data.structuredData()
        : data.structuredData;
    if (!structuredData) {
      throw new Error(
        "Cannot find structured data from page, please define the page to index function.",
      );
    }
    return {
      id: page.url,
      url: page.url,
      title: data.title ? normalizeFa(data.title) : page.url,
      description: data.description
        ? normalizeFa(data.description)
        : undefined,
      structuredData: normalizeDeep(structuredData),
    };
  },
});

export function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");
  if (query) {
    url.searchParams.set("query", normalizeFa(query));
    return searchGET(new Request(url, request));
  }
  return searchGET(request);
}
