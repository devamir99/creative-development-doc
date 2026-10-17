# Code snippet sync + copy

**Status:** Shipped in `ENG-005`  
**Modules:** `src/lib/playground/`

## Goal

Keep the playground **code panel** aligned with live parameters, and make **Copy** reliable.

## API

```ts
import { formatSnippet, copyText, serializeSnippetValue } from "@/lib/playground";
```

### `formatSnippet(template, params)`

Replaces `{{key}}` placeholders with serialized param values.

| Value type | Inserted as |
| --- | --- |
| `number` / `boolean` | bare literal (`0.6`, `true`) |
| `string` | JSON-quoted (`"power2.out"`) |
| `null` / `undefined` | `null` |
| missing key | placeholder left as `{{key}}` |

```ts
const TIMING_SNIPPET = `gsap.to(el, {
  x: 240,
  duration: {{duration}},
  ease: "none",
});`;

const value = formatSnippet(TIMING_SNIPPET, { duration });
// → passes to <PlaygroundShell code={{ language: "js", value }} />
```

### `copyText(value)`

Async clipboard helper used by `PlaygroundCodePanel`. Returns `boolean` success. Falls back to `document.execCommand("copy")` when the Clipboard API is unavailable.

## Demo contract

1. Own a **template string** with `{{params}}` next to the demo.
2. Call `formatSnippet` whenever params change (render-time is fine).
3. Pass the result to `PlaygroundShell` / `PlaygroundCodePanel` as `code.value`.
4. Do not hand-concatenate snippets in multiple places.

## Smoke reference

`TimingPlayground` uses `formatSnippet` so changing duration updates stage, readout, and code together.
