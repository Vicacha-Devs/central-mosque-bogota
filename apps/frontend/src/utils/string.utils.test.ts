import { describe, expect, it } from "vitest";

import { interpolate, slugifyFilenamePart } from "./string.utils";

describe("string.utils", () => {
  it("interpolates {{ key }} placeholders and returns template when vars omitted", () => {
    expect(interpolate("Hello {{ name }}!", { name: "Bogotá" })).toBe(
      "Hello Bogotá!"
    );
    expect(interpolate("Static text")).toBe("Static text");
  });

  it("slugifies filename parts safely", () => {
    expect(slugifyFilenamePart("  Horario_Oración 2026! ")).toBe(
      "horario-oracin-2026"
    );
    expect(slugifyFilenamePart("---")).toBe("");
  });
});
