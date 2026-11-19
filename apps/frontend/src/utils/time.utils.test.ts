import {
  buildMonthHref,
  buildMonthLabel,
  formatHijriDate,
  formatLongDate,
  formatTime,
  formatYm,
  formatYmd,
  getCurrentMinutes,
  getMonthAnchorDate,
  isTimeInRange,
  isToday,
  parseTimeToMinutes,
} from "@utils/time.utils";

describe("time.utils", () => {
  describe("parseTimeToMinutes", () => {
    it("should return null when the value is not a string", () => {
      expect(parseTimeToMinutes(null)).toBeNull();
      expect(parseTimeToMinutes(undefined)).toBeNull();
    });

    it("should parse time when the value is a valid HH:MM string", () => {
      expect(parseTimeToMinutes("00:00")).toBe(0);
      expect(parseTimeToMinutes("23:59")).toBe(23 * 60 + 59);
    });

    it("should parse time when the hour has one digit", () => {
      expect(parseTimeToMinutes("7:05")).toBe(7 * 60 + 5);
    });

    it("should trim whitespace when parsing a valid time string", () => {
      expect(parseTimeToMinutes(" 08:30 ")).toBe(8 * 60 + 30);
    });

    it("should return null when the value does not match the HH:MM pattern", () => {
      expect(parseTimeToMinutes("8:5")).toBeNull();
      expect(parseTimeToMinutes("hello")).toBeNull();
      expect(parseTimeToMinutes("")).toBeNull();
    });

    it("should return null when the time is outside the valid range", () => {
      expect(parseTimeToMinutes("24:00")).toBeNull();
      expect(parseTimeToMinutes("12:60")).toBeNull();
      expect(parseTimeToMinutes("-1:00")).toBeNull();
    });
  });

  describe("isTimeInRange", () => {
    it("should include start and exclude end when the range does not wrap midnight", () => {
      expect(isTimeInRange(10, 10, 20)).toBe(true);
      expect(isTimeInRange(19, 10, 20)).toBe(true);
      expect(isTimeInRange(20, 10, 20)).toBe(false);
      expect(isTimeInRange(9, 10, 20)).toBe(false);
    });

    it("should handle ranges that wrap midnight when start is greater than end", () => {
      const start = 22 * 60;
      const end = 2 * 60;

      expect(isTimeInRange(23 * 60, start, end)).toBe(true);
      expect(isTimeInRange(1 * 60, start, end)).toBe(true);
      expect(isTimeInRange(5 * 60, start, end)).toBe(false);
      expect(isTimeInRange(start, start, end)).toBe(true);
      expect(isTimeInRange(end, start, end)).toBe(false);
    });
  });

  describe("formatTime", () => {
    it("should return an em dash when the value is not a string", () => {
      expect(formatTime(null)).toBe("—");
      expect(formatTime(123)).toBe("—");
      expect(formatTime({})).toBe("—");
    });

    it("should return an em dash when the string is empty after trimming", () => {
      expect(formatTime("")).toBe("—");
      expect(formatTime("   ")).toBe("—");
    });

    it("should trim and return the string when it has content", () => {
      expect(formatTime(" 10:00 ")).toBe("10:00");
    });
  });

  describe("getCurrentMinutes", () => {
    it("should return minutes when Intl.DateTimeFormat provides valid time parts", () => {
      const dateTimeFormatSpy = vi
        .spyOn(Intl, "DateTimeFormat")
        .mockImplementation(function (
          locale?: Intl.LocalesArgument,
          options?: Intl.DateTimeFormatOptions
        ) {
          expect(locale).toBe("en-US");
          expect(options?.timeZone).toBe("Africa/Bogota");

          return {
            formatToParts() {
              return [
                { type: "hour", value: "05" },
                { type: "literal", value: ":" },
                { type: "minute", value: "07" },
              ] as Array<Intl.DateTimeFormatPart>;
            },
          } as unknown as Intl.DateTimeFormat;
        });

      expect(getCurrentMinutes("Africa/Bogota")).toBe(5 * 60 + 7);

      dateTimeFormatSpy.mockRestore();
    });

    it("should fall back to local time when Intl.DateTimeFormat fails or returns NaN parts", () => {
      const dateTimeFormatSpy = vi
        .spyOn(Intl, "DateTimeFormat")
        .mockImplementationOnce(function () {
          return {
            formatToParts() {
              return [] as Array<Intl.DateTimeFormatPart>;
            },
          } as unknown as Intl.DateTimeFormat;
        })
        .mockImplementationOnce(function () {
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw "Non-Error failure";
        });
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {
        return;
      });
      const getHoursSpy = vi
        .spyOn(Date.prototype, "getHours")
        .mockReturnValue(11);
      const getMinutesSpy = vi
        .spyOn(Date.prototype, "getMinutes")
        .mockReturnValue(22);

      expect(getCurrentMinutes("Invalid/Zone")).toBe(11 * 60 + 22);
      expect(getCurrentMinutes("Invalid/Zone")).toBe(11 * 60 + 22);
      expect(warnSpy).toHaveBeenCalledTimes(2);

      getMinutesSpy.mockRestore();
      getHoursSpy.mockRestore();
      warnSpy.mockRestore();
      dateTimeFormatSpy.mockRestore();
    });
  });

  describe("date and month helpers", () => {
    it("should format dates, Hijri dates, and month helpers when given valid inputs", () => {
      const sample = new Date("2026-03-15T12:00:00Z");
      expect(formatYmd(sample, "UTC")).toContain("2026");
      expect(isToday(new Date(), "UTC")).toBe(true);
      expect(formatYm(sample, "UTC")).toBe("2026-03");
      expect(formatLongDate(sample, "UTC", "es")).toContain("2026");
      expect(formatHijriDate(sample, "UTC", "en")).not.toMatch(/A\.?H\.?$/i);

      const anchor = getMonthAnchorDate("2026-03", 1);
      expect(anchor.getUTCMonth()).toBe(3);

      const fallbackAnchor = getMonthAnchorDate(null, 0);
      expect(fallbackAnchor).toBeInstanceOf(Date);

      expect(buildMonthLabel(sample, "es", "UTC").length).toBeGreaterThan(0);
      expect(
        buildMonthHref("2026-04", new URL("https://mezquitabogota.org/es/pray"))
      ).toBe("/es/pray?date=2026-04");
    });

    it("should handle empty month label and missing formatYm parts when Intl returns empty", () => {
      const dtfSpy = vi
        .spyOn(Intl, "DateTimeFormat")
        .mockImplementation(function () {
          return {
            format: () => "",
            formatToParts: () => [],
          } as unknown as Intl.DateTimeFormat;
        });

      expect(buildMonthLabel(new Date(), "es", "UTC")).toBe("");
      expect(() => formatYm(new Date(), "UTC")).toThrow(
        "Could not format current month"
      );

      dtfSpy.mockRestore();
    });
  });
});
