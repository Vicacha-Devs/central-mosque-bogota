import { describe, expect, it } from "vitest";

import { pad2, sanitizeIcsText } from "./ics.utils";

describe("ics.utils", () => {
  it("should escape RFC 5545 characters when text has specials or newlines", () => {
    expect(sanitizeIcsText("Hello, World; Test\\Path\r\nLine2\nLine3")).toBe(
      "Hello\\, World\\; Test\\\\Path\\nLine2\\nLine3"
    );
  });

  it("should pad to two digits when the number has one digit", () => {
    expect(pad2(0)).toBe("00");
    expect(pad2(7)).toBe("07");
    expect(pad2(12)).toBe("12");
  });
});
