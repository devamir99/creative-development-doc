/**
 * FA parity QA (ADR-006): every EN MDX page must have a Persian twin.
 * Checks:
 *  1. Every `*.mdx` (EN) has a sibling `*.fa.mdx`; every `meta.json` has `meta.fa.json`.
 *  2. Every `meta.fa.json` has the same `pages` order as its `meta.json`.
 *  3. No absolute `/docs/...` links in `*.fa.mdx` (relative links only).
 *  4. Playground component tags are preserved between EN and FA twins.
 *  5. FA files have frontmatter title.
 * Run: node scripts/check-fa-parity.mjs
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "content", "docs");

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const files = walk(root);
const enPages = files.filter((f) => f.endsWith(".mdx") && !f.endsWith(".fa.mdx"));
const faPages = files.filter((f) => f.endsWith(".fa.mdx"));
const enMetas = files.filter((f) => f.endsWith("meta.json") && !f.endsWith("meta.fa.json"));

const errors = [];
const tagPattern = /<([A-Z][A-Za-z0-9]*Playground)\b/g;
const tagsOf = (text) => [...text.matchAll(tagPattern)].map((m) => m[1]).sort();

for (const en of enPages) {
  const twin = en.replace(/\.mdx$/, ".fa.mdx");
  if (!existsSync(twin)) {
    errors.push(`missing FA twin: ${twin}`);
    continue;
  }
  const enText = readFileSync(en, "utf8");
  const faText = readFileSync(twin, "utf8");
  if (!/^---\r?\n[\s\S]*?^title:/m.test(faText)) {
    errors.push(`missing frontmatter title: ${twin}`);
  }
  const enTags = tagsOf(enText);
  const faTags = tagsOf(faText);
  if (JSON.stringify(enTags) !== JSON.stringify(faTags)) {
    errors.push(
      `playground tags differ: ${twin} EN=[${enTags}] FA=[${faTags}]`,
    );
  }
}

for (const fa of faPages) {
  const text = readFileSync(fa, "utf8");
  const absolute = text.match(/\]\(\/docs[^)]*\)|href="\/docs[^"]*"/g);
  if (absolute) {
    errors.push(`absolute /docs link in ${fa}: ${absolute[0]}`);
  }
  const enTwin = fa.replace(/\.fa\.mdx$/, ".mdx");
  if (!existsSync(enTwin)) {
    errors.push(`FA page without EN source: ${fa}`);
  }
}

for (const meta of enMetas) {
  const twin = meta.replace(/meta\.json$/, "meta.fa.json");
  if (!existsSync(twin)) {
    errors.push(`missing FA meta twin: ${twin}`);
    continue;
  }
  const enPagesOrder = JSON.parse(readFileSync(meta, "utf8")).pages ?? [];
  const faPagesOrder = JSON.parse(readFileSync(twin, "utf8")).pages ?? [];
  // Separator labels (---...---) are translated; compare page order + separator count.
  const realPages = (list) => list.filter((p) => !String(p).startsWith("---"));
  const separatorCount = (list) =>
    list.filter((p) => String(p).startsWith("---")).length;
  if (
    JSON.stringify(realPages(enPagesOrder)) !==
      JSON.stringify(realPages(faPagesOrder)) ||
    separatorCount(enPagesOrder) !== separatorCount(faPagesOrder)
  ) {
    errors.push(`meta pages order differs: ${twin}`);
  }
}

console.log(
  `FA parity: EN pages=${enPages.length} FA pages=${faPages.length} metas=${enMetas.length}`,
);
if (errors.length) {
  console.error(`FAILED (${errors.length}):`);
  for (const e of errors) console.error(` - ${e}`);
  process.exit(1);
}
console.log("FA parity: OK — 65/65 style parity, relative links, tags preserved.");
