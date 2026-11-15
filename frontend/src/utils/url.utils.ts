const SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS_REGEX = /[\u0000-\u001F\u007F]/g;

/**
 * Validates a URL string for safe use in `<a href>` / `<img src>` attributes.
 * Permits relative paths (`/` or `#`) and `http:`, `https:`, `mailto:`, `tel:` URLs.
 * Rejects `javascript:`, `data:`, `vbscript:`, protocol-relative `//`, backslash `/\`,
 * and malformed URLs.
 */
export function toSafeHref(
  rawUrl: string | URL | undefined | null,
  fallback = "#"
): string {
  if (rawUrl instanceof URL) {
    return SAFE_PROTOCOLS.has(rawUrl.protocol) ? rawUrl.href : fallback;
  }
  if (typeof rawUrl !== "string") return fallback;
  const trimmed = rawUrl.replace(CONTROL_CHARS_REGEX, "").trim();
  if (!trimmed) return fallback;

  if (trimmed.startsWith("#")) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    if (trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
      return fallback;
    }
    try {
      const resolved = new URL(trimmed, "https://example.invalid");
      if (resolved.origin !== "https://example.invalid") {
        return fallback;
      }
      return `${resolved.pathname}${resolved.search}${resolved.hash}`;
    } catch {
      return fallback;
    }
  }

  try {
    const parsed = new URL(trimmed);
    if (SAFE_PROTOCOLS.has(parsed.protocol)) {
      return parsed.href;
    }
  } catch {
    // Fall through to fallback
  }

  return fallback;
}
