import { describe, expect, it } from "vitest";

import { pad2, sanitizeIcsText } from "./ics.utils";

describe("ics.utils", () => {
  it("escapes RFC 5545 special characters and newlines", () => {
    expect(sanitizeIcsText("Hello, World; Test\\Path\r\nLine2\nLine3")).toBe(
      "Hello\\, World\\; Test\\\\Path\\nLine2\\nLine3"
    );
  });

  it("pads single-digit numbers to two digits", () => {
    expect(pad2(0)).toBe("00");
    expect(pad2(7)).toBe("07");
    expect(pad2(12)).toBe("12");
  });
});
