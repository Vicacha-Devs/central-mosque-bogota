import { describe, expect, it } from "vitest";

import { CONFIG, calculateActivePrayer } from "./islamic.utils";
import { interpolate, slugifyFilenamePart } from "./string.utils";

const SAMPLE_TIMES = {
  fajr: 280,
  dhuhr: 720,
  asr: 920,
  maghrib: 1080,
  isha: 1150,
};

describe("islamic.utils and string.utils", () => {
  it("should return null when current time is inside sunrise, zawal, or sunset buffers", () => {
    expect(calculateActivePrayer(355, SAMPLE_TIMES, 350)).toBeNull();
    expect(
      calculateActivePrayer(
        SAMPLE_TIMES.dhuhr - CONFIG.zawalMinutes + 1,
        SAMPLE_TIMES,
        350
      )
    ).toBeNull();
    expect(
      calculateActivePrayer(
        SAMPLE_TIMES.maghrib - CONFIG.sunsetBufferMinutes + 1,
        SAMPLE_TIMES,
        350
      )
    ).toBeNull();
  });

  it("should return active prayer name when current time falls in each prayer window", () => {
    expect(calculateActivePrayer(300, SAMPLE_TIMES, 350)).toBe("fajr");
    expect(calculateActivePrayer(750, SAMPLE_TIMES, null)).toBe("dhuhr");
    expect(calculateActivePrayer(950, SAMPLE_TIMES, null)).toBe("asr");
    expect(calculateActivePrayer(1100, SAMPLE_TIMES, null)).toBe("maghrib");
    expect(calculateActivePrayer(1200, SAMPLE_TIMES, null)).toBe("isha");
    expect(calculateActivePrayer(100, SAMPLE_TIMES, null)).toBe("isha");
  });

  it("should return null when prayer times are missing", () => {
    expect(
      calculateActivePrayer(
        500,
        {
          fajr: null,
          dhuhr: null,
          asr: null,
          maghrib: null,
          isha: null,
        },
        null
      )
    ).toBeNull();
  });

  it("should interpolate templates and slugify filename parts when given strings", () => {
    expect(interpolate("Hello {{ name }}")).toBe("Hello {{ name }}");
    expect(interpolate("Hello {{ name }}", { name: "Bogotá" })).toBe(
      "Hello Bogotá"
    );
    expect(slugifyFilenamePart("  Calendario_de Oración 2026!  ")).toBe(
      "calendario-de-oracin-2026"
    );
  });
});
