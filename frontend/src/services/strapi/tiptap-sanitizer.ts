import DOMPurify from "isomorphic-dompurify";

import { optimizeCloudinaryUrl } from "./api";

const ALLOWED_TAGS = [
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "strike",
  "del",
  "sub",
  "sup",
  "blockquote",
  "ul",
  "ol",
  "li",
  "code",
  "pre",
  "a",
  "img",
  "br",
  "hr",
  "span",
  "div",
  "figure",
  "figcaption",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
];

const ALLOWED_ATTR = [
  "href",
  "target",
  "rel",
  "src",
  "alt",
  "title",
  "width",
  "height",
  "loading",
  "class",
  "dir",
  "lang",
  "colspan",
  "rowspan",
];

export type TTiptapRichContent =
  | string
  | ReadonlyArray<string>
  | null
  | undefined;

function escapeHtmlText(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\u0022", "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeToHtml(input: TTiptapRichContent): string {
  if (!input) return "";

  if (Array.isArray(input)) {
    return input
      .map((item) => String(item ?? "").trim())
      .filter(Boolean)
      .map((paragraph) =>
        paragraph.startsWith("<")
          ? paragraph
          : `<p>${escapeHtmlText(paragraph)}</p>`
      )
      .join("\n");
  }

  const trimmed = String(input).trim();
  if (!trimmed) return "";

  // If plain text without HTML tags, wrap paragraphs in <p> tags
  if (!/<[a-z][\s\S]*>/i.test(trimmed)) {
    return trimmed
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `<p>${escapeHtmlText(p)}</p>`)
      .join("\n");
  }

  return trimmed;
}

/**
 * Sanitizes HTML output from Strapi's `@notum-cz/strapi-plugin-tiptap-editor`
 * (`"type": "richtext"`) using `isomorphic-dompurify`, enforces `rel="noopener noreferrer"`
 * on links, and optimizes embedded Cloudinary images.
 */
export function sanitizeTiptapHtml(input: TTiptapRichContent): string {
  const rawHtml = normalizeToHtml(input);
  if (!rawHtml) return "";

  const clean = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: [
      "script",
      "style",
      "iframe",
      "object",
      "embed",
      "form",
      "input",
    ],
    FORBID_ATTR: [
      "onerror",
      "onload",
      "onclick",
      "onmouseover",
      "onfocus",
      "style",
    ],
  });

  // Optimize Cloudinary URLs in <img> tags and enforce safe rel on <a target="_blank">
  return clean
    .replace(
      /<img\b([^>]*?)\bsrc=(["'])([^"']+)\2([^>]*?)>/gi,
      (_match, before: string, quote: string, src: string, after: string) => {
        const optimized = optimizeCloudinaryUrl(src, 1200);
        const hasLoading = /\bloading=/i.test(`${before}${after}`);
        const loadingAttr = hasLoading ? "" : " loading=\u0022lazy\u0022";
        return `<img${before}src=${quote}${optimized}${quote}${after}${loadingAttr}>`;
      }
    )
    .replace(/<a\b([^>]*?)>/gi, (fullMatch, attrs: string) => {
      if (/\brel=/i.test(attrs)) {
        return fullMatch;
      }
      return `<a${attrs} rel="noopener noreferrer">`;
    });
}
