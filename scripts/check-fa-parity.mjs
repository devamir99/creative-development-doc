/**
 * FA parity QA (ADR-006): every EN MDX page must have a Persian twin.
 * Checks:
 *  1. Every `*.mdx` (EN) has a sibling `*.fa.mdx`; every `meta.json` has `meta.fa.json`.
 *  2. Every `meta.fa.json` has the same `pages` order as its `meta.json`
 *     (separator labels are translated; page order + separator count compared).
 *  3. Playground component tags are preserved between EN and FA twins.
 *  4. FA files have frontmatter title.
 *  5. Every in-content link in every MDX (EN + FA) resolves the way Fumadocs
 *     `resolveHref` does: file-relative with `.mdx` extension, looked up by
 *     logical file path. Absolute `/docs/...` and extensionless links fail.
 * Run: npm run check:fa-parity
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname, relative } from "node:path";
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
const allPages = files.filter((f) => f.endsWith(".mdx"));
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

// --- Link resolution (mirrors fumadocs-core resolveHref) ---
const logicalOf = (abs) =>
  relative(root, abs).split("\\").join("/").replace(/\.fa\.mdx$/, ".mdx");
const logicalSet = new Set(enPages.map(logicalOf));

function posixResolve(dir, rel) {
  const out = [];
  for (const p of (dir ? dir.split("/") : []).concat(rel.split("/"))) {
    if (p === "" || p === ".") continue;
    if (p === "..") out.pop();
    else out.push(p);
  }
  return out.join("/");
}

let linksChecked = 0;
for (const page of allPages) {
  const text = readFileSync(page, "utf8");
  const logical = logicalOf(page);
  const slash = logical.lastIndexOf("/");
  const dir = slash === -1 ? "" : logical.slice(0, slash);
  for (const m of text.matchAll(/\]\(([^)\s]+)\)|href="([^"]+)"/g)) {
    const href = m[1] ?? m[2];
    if (/^(https?:|mailto:|#)/.test(href)) continue;
    linksChecked++;
    if (href.startsWith("/")) {
      errors.push(`absolute link in ${logical}: ${href}`);
      continue;
    }
    if (!href.startsWith("./") && !href.startsWith("../")) {
      errors.push(`non-relative link in ${logical}: ${href}`);
      continue;
    }
    const pathPart = href.split("#", 2)[0];
    const target = posixResolve(dir, pathPart);
    if (!logicalSet.has(target)) {
      errors.push(`unresolved link in ${logical}: ${href} -> ${target}`);
    }
  }
}

console.log(
  `FA parity: EN pages=${enPages.length} FA pages=${faPages.length} metas=${enMetas.length} links=${linksChecked}`,
);
if (errors.length) {
  console.error(`FAILED (${errors.length}):`);
  for (const e of errors) console.error(` - ${e}`);
  process.exit(1);
}
console.log(
  `FA parity: OK — ${enPages.length}/${enPages.length} pages, links resolve, tags preserved.`,
);
