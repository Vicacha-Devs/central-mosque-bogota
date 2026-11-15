import { describe, expect, it } from "vitest";

import { toSafeHref } from "./url.utils";

describe("toSafeHref", () => {
  it("allows relative paths and hash anchors", () => {
    expect(toSafeHref("/es/donate")).toBe("/es/donate");
    expect(toSafeHref("#main-content")).toBe("#main-content");
  });

  it("allows http, https, mailto, and tel URLs", () => {
    expect(toSafeHref("https://mezquitabogota.org/es")).toBe(
      "https://mezquitabogota.org/es"
    );
    expect(toSafeHref("http://127.0.0.1:1337")).toBe(
      "http://127.0.0.1:1337/"
    );
    expect(toSafeHref("mailto:info@mezquitabogota.org")).toBe(
      "mailto:info@mezquitabogota.org"
    );
    expect(toSafeHref("tel:+5712345678")).toBe("tel:+5712345678");
    expect(toSafeHref(new URL("https://mezquitabogota.org/en"))).toBe(
      "https://mezquitabogota.org/en"
    );
  });

  it("rejects javascript:, data:, vbscript:, protocol-relative, and empty URLs", () => {
    expect(toSafeHref("javascript:alert(1)")).toBe("#");
    expect(toSafeHref("JAVASCRIPT:alert(1)")).toBe("#");
    expect(toSafeHref("data:text/html,<script>alert(1)</script>")).toBe("#");
    expect(toSafeHref("vbscript:msgbox(1)")).toBe("#");
    expect(toSafeHref("//evil.example/phish")).toBe("#");
    expect(toSafeHref("/\\evil.example/phish")).toBe("#");
    expect(toSafeHref("/\t/evil.example/phish")).toBe("#");
    expect(toSafeHref("")).toBe("#");
    expect(toSafeHref(null)).toBe("#");
    expect(toSafeHref(undefined, "/fallback")).toBe("/fallback");
  });
});
