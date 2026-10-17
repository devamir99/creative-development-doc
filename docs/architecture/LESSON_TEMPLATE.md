# Lesson Template — Persian standard

Use this skeleton when writing or migrating a lesson (`DOC-*` tasks).  
Copy-paste stub: [`docs/templates/lesson.stub.mdx`](../templates/lesson.stub.mdx).

**Do not** mass-rewrite English seeds; migrate one lesson per approved task.

---

## Frontmatter

```yaml
---
title: عنوان فارسی کوتاه
description: یک جملهٔ دقیق دربارهٔ مفهوم (فارسی).
---
```

Keep established English terms in the body when they are the industry name (e.g. Timing, Easing, FOV).

---

## Body skeleton

Omit empty sections. Order is preferred, not rigid.

```mdx
# عنوان

## مقدمه
تعریف مفهوم به زبان روشن.

## چرا مهم است
کاربرد در سینما / موشن / وب خلاق / UX — فقط موارد مرتبط.

## توضیح بصری
آنچه خواننده باید «ببیند» قبل از بازی با کنترل‌ها.

## Playground تعاملی
<!-- required when the concept is visual / spatial / temporal -->
<YourPlayground />

## پارامترها
جدول یا فهرست پارامترهای زنده و معنای هرکدام.

## مثال‌های عملی
۲–۴ سناریوی کوتاه واقعی.

## پیاده‌سازی
ساده‌ترین ابزار درست (CSS → GSAP → Canvas → R3F). کد LTR انگلیسی.

## نکات Performance
فقط وقتی relevancy دارد.

## اشتباهات رایج

## چه زمانی استفاده کنیم / نکنیم

## جمع‌بندی

## مفاهیم مرتبط
لینک به درس‌های هم‌خانواده در `/docs/...`
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
