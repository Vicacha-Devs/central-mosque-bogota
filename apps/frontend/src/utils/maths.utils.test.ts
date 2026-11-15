import { describe, expect, it } from "vitest";

import { calculateProgress, parseAmount } from "./maths.utils";

describe("maths.utils", () => {
  it("parses formatted currency strings and returns NaN when no digits exist", () => {
    expect(parseAmount("$1,250,000 COP")).toBe(1250000);
    expect(parseAmount("N/A")).toBeNaN();
  });

  it("calculates clamped percentage progress", () => {
    expect(calculateProgress("$1,000", "$250")).toBe(25);
    expect(calculateProgress("$1,000", "$1,500")).toBe(100);
    expect(calculateProgress("$0", "$500")).toBe(0);
    expect(calculateProgress("invalid", "$500")).toBe(0);
  });
});
