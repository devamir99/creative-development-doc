# Content System — MDX & Lessons

## Location

- Curriculum: `content/docs/**`
- Navigation: `meta.json` per folder + root `content/docs/meta.json`
- Loader: `src/lib/source.ts` (`defineDocs` + `loader`, `baseUrl: "/docs"`)

## Language policy

| Surface | Language |
| --- | --- |
| Instructional prose | Fluent Persian |
| Established technical terms | English retained (Timing, Easing, FOV, …) |
| UI chrome in docs (when customized) | Persian labels where user-facing |
| Code, paths, CLI, APIs | LTR English |
| Direction | RTL for Persian lesson bodies; code blocks stay LTR |

**Migration rule:** Convert English seed pages to the Persian standard **when that lesson’s DOC task runs** — no mass rewrite.

## Default lesson skeleton

Adapt; omit empty sections:

1. Introduction — definition  
2. Why it matters  
3. Visual explanation  
4. Interactive playground (required if visual/spatial/temporal)  
5. Parameters  
6. Practical examples  
7. Implementation (simplest correct tool)  
8. Performance notes (when relevant)  
9. Common mistakes  
10. When to use / avoid  
11. Key takeaways  
12. Related concepts  

Frontmatter: `title`, `description` (Persian preferred after migration).

## Embedding demos

```mdx
# Easing

توضیح مفهوم...

<EasingPlayground />
```

Register in `src/components/mdx.tsx` via `getMDXComponents` — do not rely on implicit global MDX scope.

## Accuracy

Distinguish in prose when useful:

- Established principles  
- Teaching simplifications  
- Subjective judgment  
- Physically accurate vs approximate visualization  

Do not invent library APIs; verify against official docs when unsure.

## Search

Current: `src/app/api/search/route.ts` uses `createFromSource` with `language: "english"`.

**Plan (ENG-002):** Decide Persian indexing strategy (Fumadocs language support / dual corpus / accept English-token search for code-heavy terms). Record decision as ADR when implemented.

## Status honesty

Inventory + backlog statuses are authoritative. Landing/`index.mdx` “Done” badges are **not** proof a lesson meets the gold demo bar.
