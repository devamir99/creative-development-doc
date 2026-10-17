export type SnippetParamValue = string | number | boolean | null | undefined;

export type SnippetParams = Record<string, SnippetParamValue>;

/**
 * Serialize a value for insertion into a live code snippet.
 * Numbers/booleans/null stay unquoted; strings become JSON-quoted.
 */
export function serializeSnippetValue(value: SnippetParamValue): string {
  if (value === null || value === undefined) return "null";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "null";
    return String(value);
  }
  if (typeof value === "boolean") return value ? "true" : "false";
  return JSON.stringify(value);
}

/**
 * Fill `{{param}}` placeholders in a template so the displayed snippet
 * matches live playground parameters.
 *
 * Unknown placeholders are left unchanged so typos are visible in the panel.
 *
 * @example
 * formatSnippet('duration: {{duration}}', { duration: 0.6 })
 * // → 'duration: 0.6'
 */
export function formatSnippet(
  template: string,
  params: SnippetParams,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    if (!Object.prototype.hasOwnProperty.call(params, key)) return match;
    return serializeSnippetValue(params[key]);
  });
}
