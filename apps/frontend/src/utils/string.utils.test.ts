import { describe, expect, it } from "vitest";

import { interpolate, slugifyFilenamePart } from "./string.utils";

describe("string.utils", () => {
  it("should interpolate placeholders when vars are given", () => {
    expect(interpolate("Hello {{ name }}!", { name: "Bogotá" })).toBe(
      "Hello Bogotá!"
    );
    expect(interpolate("Static text")).toBe("Static text");
  });

  it("should slugify filename parts when they contain unsafe characters", () => {
    expect(slugifyFilenamePart("  Horario_Oración 2026! ")).toBe(
      "horario-oracin-2026"
    );
    expect(slugifyFilenamePart("---")).toBe("");
  });
});
