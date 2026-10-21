import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

/**
 * Default multilingual tokenizer (Unicode segmentation).
 * Better for mixed Persian + English technical terms than `language: "english"`.
 * See docs/decisions/ADR-004-search-language.md
 *
 * Locale filtering (ADR-006): the i18n-aware loader tags every index with
 * its locale, and `createFromSource` enables `localeFilter` automatically —
 * `?locale=fa` returns only `/fa/...` pages, `?locale=en` only `/en/...`.
 * Verified in FA Batch 7 QA.
 */
export const { GET } = createFromSource(source);
