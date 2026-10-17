# Lesson Template — English standard

Use this skeleton when writing or migrating a lesson (`DOC-*` tasks).  
Copy-paste stub: [`docs/templates/lesson.stub.mdx`](../templates/lesson.stub.mdx).

Product language is **English** (ADR-005). Migrate one lesson per approved task.

---

## Frontmatter

```yaml
---
title: Short lesson title
description: One precise sentence about the concept.
---
```

---

## Body skeleton

Omit empty sections. Order is preferred, not rigid.

```mdx
# Title

## Introduction
Clear definition.

## Why it matters
Cinema / motion / creative web / UX — only what applies.

## Visual explanation
What the reader should notice before tweaking controls.

## Interactive playground
<!-- required when the concept is visual / spatial / temporal -->
<YourPlayground />

## Parameters
Table or list of live params and what each does.

## Practical examples
2–4 short real scenarios.

## Implementation
Simplest correct tool (CSS → GSAP → Canvas → R3F).

## Performance notes
Only when relevant.

## Common mistakes

## When to use / avoid

## Key takeaways

## Related concepts
Links to sibling lessons under `/docs/...`
```

---

## Playground registration

1. Implement demo under `src/demos/<domain>/…`
2. Register in `src/components/mdx.tsx` via `getMDXComponents`
3. Embed the PascalCase component tag in MDX

See `CONTENT_SYSTEM.md` → Embedding demos.

---

## Quality bar (reminder)

- Visual concepts need a working demo (see `MASTER_PROMPT` / `PLAYGROUND_SYSTEM.md`)
- Distinguish established principle vs teaching simplification vs subjective judgment
- Code blocks and playground stages stay LTR (`lab-ltr` / `dir="ltr"`)
