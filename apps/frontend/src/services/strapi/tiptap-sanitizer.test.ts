import { describe, expect, it } from "vitest";

import { sanitizeTiptapHtml } from "./tiptap-sanitizer";

describe("sanitizeTiptapHtml", () => {
  it("should return empty string when input is empty", () => {
    expect(sanitizeTiptapHtml(null)).toBe("");
    expect(sanitizeTiptapHtml(undefined)).toBe("");
    expect(sanitizeTiptapHtml("")).toBe("");
    expect(sanitizeTiptapHtml([])).toBe("");
  });

  it("should preserve semantic tags when HTML is valid", () => {
    const html =
      "<h2>Pillars of Islam</h2><p>Welcome to <strong>Mezquita Central</strong>.</p><ul><li>Shahada</li><li>Salah</li></ul><blockquote dir=\u0022rtl\u0022>السلام عليكم</blockquote>";
    const result = sanitizeTiptapHtml(html);

    expect(result).toContain("<h2>Pillars of Islam</h2>");
    expect(result).toContain("<strong>Mezquita Central</strong>");
    expect(result).toContain("<ul><li>Shahada</li><li>Salah</li></ul>");
    expect(result).toContain(
      "<blockquote dir=\u0022rtl\u0022>السلام عليكم</blockquote>"
    );
  });

  it("should strip unsafe attributes when XSS is present", () => {
    const malicious =
      "<p onclick=\u0022alert(1)\u0022>Hello</p><script>window.evil()</script><img src=\u0022x\u0022 onerror=\u0022alert(2)\u0022><a href=\u0022javascript:alert(3)\u0022>Click</a><iframe src=\u0022https://evil.example\u0022></iframe>";
    const result = sanitizeTiptapHtml(malicious);

    expect(result).toContain("<p>Hello</p>");
    expect(result).not.toContain("<script");
    expect(result).not.toContain("onclick");
    expect(result).not.toContain("onerror");
    expect(result).not.toContain("javascript:");
    expect(result).not.toContain("<iframe");
  });

  it("should add rel attributes when links are rendered", () => {
    const html =
      "<p><a href=\u0022https://mezquitabogota.org\u0022 target=\u0022_blank\u0022>Mosque</a></p><img src=\u0022https://res.cloudinary.com/demo/image/upload/v1/mosque.jpg\u0022 alt=\u0022Mosque\u0022>";
    const result = sanitizeTiptapHtml(html);

    expect(result).toContain("rel=\u0022noopener noreferrer\u0022");
    expect(result).toContain(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_1200/v1/mosque.jpg"
    );
    expect(result).toContain("loading=\u0022lazy\u0022");
  });

  it("should wrap plain text paragraphs when array or multiline string is given", () => {
    const paragraphs = [
      "First paragraph <script>bad()</script>",
      "<p>Already HTML</p>",
      null as unknown as string,
      "Second paragraph",
    ];
    const result = sanitizeTiptapHtml(paragraphs);

    expect(result).toContain(
      "<p>First paragraph &lt;script&gt;bad()&lt;/script&gt;</p>"
    );
    expect(result).toContain("<p>Already HTML</p>");
    expect(result).toContain("<p>Second paragraph</p>");

    const plainString = "Line one\n\nLine two";
    const plainResult = sanitizeTiptapHtml(plainString);
    expect(plainResult).toContain("<p>Line one</p>");
    expect(plainResult).toContain("<p>Line two</p>");

    expect(sanitizeTiptapHtml("   ")).toBe("");
  });

  it("should preserve existing rel and loading attributes when already set", () => {
    const html =
      "<a href=\u0022https://example.com\u0022 rel=\u0022nofollow\u0022>Link</a><img src=\u0022https://example.com/a.jpg\u0022 loading=\u0022eager\u0022>";
    const result = sanitizeTiptapHtml(html);

    expect(result).toContain("rel=\u0022nofollow\u0022");
    expect(result).toContain("loading=\u0022eager\u0022");
  });
});
