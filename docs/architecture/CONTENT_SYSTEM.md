# Content System — MDX & Lessons

## Location

- Curriculum: `content/docs/**`
- Navigation: `meta.json` per folder + root `content/docs/meta.json`
- Loader: `src/lib/source.ts` (`defineDocs` + `loader`, `baseUrl: "/docs"`)
- Lesson template: [`LESSON_TEMPLATE.md`](./LESSON_TEMPLATE.md)
- Copy-paste stub: [`docs/templates/lesson.stub.mdx`](../templates/lesson.stub.mdx)

## Language policy

Per **ADR-005**, product UI and lesson prose default to **English**.

| Surface | Language |
| --- | --- |
| Instructional prose | Clear English |
| Technical terms | Keep standard English (Timing, Easing, FOV, …) |
| UI chrome / `meta.json` titles | English |
| Code, paths, CLI, APIs | LTR English |
| Direction | LTR root; playground/code stay `lab-ltr` |

**Migration rule:** Ship one lesson per DOC task; do not mass-rewrite the curriculum in a single run.

## Default lesson skeleton

Full Persian section guide: [`LESSON_TEMPLATE.md`](./LESSON_TEMPLATE.md).

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

## Embedding demos & MDX registration

Pattern in MDX:

```mdx
# Easing

توضیح مفهوم...

<EasingPlayground />
```

**Registration checklist (required):**

1. Create the demo module under `src/demos/<domain>/…` (Client Component only if needed).
2. Export a stable PascalCase component name.
3. Import it in `src/components/mdx.tsx` and add it to the object returned by `getMDXComponents`.
4. Spread `...defaultMdxComponents` first; put lesson demos next; allow `...components` override last.
5. Do **not** rely on implicit global MDX scope or unregistered tags.

Reference implementation: `TimingPlayground` in `src/components/mdx.tsx`.

## Accuracy

Distinguish in prose when useful:

- Established principles  
- Teaching simplifications  
- Subjective judgment  
- Physically accurate vs approximate visualization  

Do not invent library APIs; verify against official docs when unsure.

## Search

Route: `src/app/api/search/route.ts` → `createFromSource(source)` with **default multilingual** tokenization (Unicode segmentation).

**Decision:** ADR-004 — do not force `language: "english"`. Mixed Persian body + English technical terms share one index. Revisit only if quality regresses after large Persian migrations.

## Nav hygiene

- Root separators and folder `meta.json` `title` values use Persian chrome (ENG-002).
- Individual lesson `title` / body language still follows per-lesson DOC tasks.
- Inventory + backlog statuses are authoritative for “shipped” quality — not landing badges.

## Status honesty

Inventory + backlog statuses are authoritative. Landing/`index.mdx` “Done” badges are **not** proof a lesson meets the gold demo bar.
