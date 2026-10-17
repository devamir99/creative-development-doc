import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

/**
 * Default multilingual tokenizer (Unicode segmentation).
 * Better for mixed Persian + English technical terms than `language: "english"`.
 * See docs/decisions/ADR-004-search-language.md
 */
export const { GET } = createFromSource(source);
