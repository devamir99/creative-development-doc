# Translation Guide — English to Persian

## Rules

1. Translate for clarity, not word-by-word. Keep the lesson skeleton, playground tags, tables, and video references.
2. Frontmatter: translate `title` and `description`; keep them one sentence.
3. First mention: Persian term + English in parentheses; then follow `docs/i18n/GLOSSARY.md`.
4. Links: In ALL MDX (EN + FA), use **file-relative links with extension** (`./timing.mdx`, `../camera/fov.mdx`, `./camera/index.mdx` for sections). Fumadocs `resolveHref` looks pages up by file path — extensionless `./timing` never matches and the browser mis-resolves it. Do not use `/docs/...` absolute links.
5. Playground tags unchanged (`<EasingPlayground />`), and no props.
6. Direct address headings: `See it first` -> `اول ببین`; `Exercise` -> `تمرین`; `Key takeaways` -> `نکات کلیدی`; `Related lessons` -> `درس‌های مرتبط`; `Related concepts` -> `مفاهیم مرتبط`; `Video reference` -> `مرجع ویدیویی`.
7. Numbers in prose may use Latin digits for technical values (`0.8s`, `40°`). Code snippets: Latin digits only.
8. Code snippet comments: translate the teaching comments to Persian; executable identifiers/API/ease strings remain English.
9. Persian prose uses ZWNJ correctly (می‌شود، نمی‌شود) and avoids Arabic ي/ك; use ی/ک.
10. `Watch:` labels in video reference blocks become `تماشا:`; video titles/channels stay in English.

## Quality gate per file

- Frontmatter translated
- No absolute `/docs/` links
- Playground tag preserved
- Video reference and exercise retained
- Glossary terms locked
