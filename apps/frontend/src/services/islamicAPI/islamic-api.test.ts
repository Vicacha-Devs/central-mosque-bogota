import * as strapiService from "@services/strapi";
import * as locationUtils from "@utils/location.utils";
import * as timeUtils from "@utils/time.utils";
import * as astroEnvServer from "astro:env/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { buildPrayerData } from "./adaptor/buildPrayerData";
import { fetchIslamicData } from "./api";
import { prayerTimesLoader } from "./loaders/prayerTimesLoader";
import { zakatNisabLoader } from "./loaders/zakatNisabLoader";

const SAMPLE_TIMES = {
  Fajr: "04:42",
  Sunrise: "05:56",
  Dhuhr: "11:59",
  Asr: "15:18",
  Maghrib: "18:02",
  Isha: "19:12",
};

describe("islamicAPI service, adaptor, and loaders", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("should fetch IslamicAPI data or throw when API key is missing or HTTP fails", async () => {
    const secretSpy = vi
      .spyOn(astroEnvServer, "getSecret")
      .mockReturnValueOnce(undefined)
      .mockReturnValue("valid-key");

    await expect(fetchIslamicData("prayer-time/")).rejects.toThrow(
      "ISLAMIC_API_KEY is not configured"
    );

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ code: 200 }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
      });
    vi.stubGlobal("fetch", fetchMock);

    const controller = new AbortController();
    const okRes = await fetchIslamicData(
      "prayer-time/",
      { lat: "4.7", empty: null, undef: undefined },
      { signal: controller.signal }
    );
    expect(okRes).toEqual({ code: 200 });

    await expect(fetchIslamicData("prayer-time/")).rejects.toThrow(
      "Islamic API request failed (429)"
    );
    expect(secretSpy).toHaveBeenCalled();
  });

  it("should build prayer data for today and non-today dates when called", () => {
    const minSpy = vi.spyOn(timeUtils, "getCurrentMinutes");
    minSpy.mockReturnValueOnce(300);
    const todayActive = buildPrayerData({
      times: SAMPLE_TIMES,
      city: "Bogotá",
      country: "Colombia",
      date: new Date(),
    });
    expect(todayActive.isToday).toBe(true);
    expect(todayActive.activePray).toBe("fajr");

    minSpy.mockReturnValueOnce(360);
    const todayBuffer = buildPrayerData({
      times: SAMPLE_TIMES,
      city: "Bogotá",
      country: "Colombia",
      date: new Date(),
    });
    expect(todayBuffer.activePray).toBeUndefined();

    const pastDate = buildPrayerData({
      times: SAMPLE_TIMES,
      city: "Bogotá",
      country: "Colombia",
      date: new Date("2020-01-01T12:00:00Z"),
      languageCode: "en",
      fetchedAt: "2020-01-01T12:00:00Z",
    });
    expect(pastDate.isToday).toBe(false);
    expect(pastDate.activePray).toBeUndefined();
  });

  it("should load prayerTimes collection and entry when Strapi, IslamicAPI, or fallback is used", async () => {
    const loader = prayerTimesLoader();

    const errNoFilter = await loader.loadCollection({
      collection: "prayerTimes",
      filter: undefined,
    });
    expect("error" in errNoFilter).toBe(true);

    const errBadDate = await loader.loadCollection({
      collection: "prayerTimes",
      filter: { date: "invalid" },
    });
    expect("error" in errBadDate).toBe(true);

    vi.spyOn(locationUtils, "getClientLocation").mockResolvedValue({
      lat: "",
      lon: "",
      city: "",
      country: "",
      timeZone: "America/Bogota",
    });
    vi.spyOn(strapiService, "fetchPrayerSettingsFromStrapi").mockResolvedValue({
      method: "3",
      school: "1",
      calender: "MATHEMATICAL",
      shifting: "0",
      defaultLat: 4.66,
      defaultLon: -74.07,
      jumuahKhutbahTime: "12:15 PM",
      jumuahPrayerTime: "12:45 PM",
    });

    const suiteSpy = vi.spyOn(strapiService, "fetchIslamSuiteFromStrapi");

    suiteSpy.mockResolvedValueOnce({
      yearMonth: "2026-03",
      days: [
        {
          dateGregorian: "2026-03-01",
          times: {
            fajr: "04:40",
            sunrise: "05:55",
            dhuhr: "12:00",
            asr: "15:15",
            maghrib: "18:00",
            isha: "19:10",
          },
        },
      ],
    });
    const strapiMonth = await loader.loadCollection({
      collection: "prayerTimes",
      filter: { date: "2026-03", languageCode: "es" },
    });
    expect("entries" in strapiMonth && strapiMonth.entries.length).toBe(1);

    suiteSpy.mockResolvedValueOnce({
      dateGregorian: "2026-03-01",
      times: {
        fajr: "04:40",
        sunrise: "05:55",
        dhuhr: "12:00",
        asr: "15:15",
        maghrib: "18:00",
        isha: "19:10",
      },
    });
    const strapiDay = await loader.loadEntry({
      collection: "prayerTimes",
      filter: { date: "2026-03-01", languageCode: "es" },
    });
    expect(strapiDay && "data" in strapiDay).toBe(true);

    suiteSpy.mockResolvedValue(null);
    vi.spyOn(astroEnvServer, "getSecret").mockReturnValue("api-key");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [{ date: "2026-03-01", times: SAMPLE_TIMES }],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { times: SAMPLE_TIMES },
          }),
      })
      .mockRejectedValueOnce(new Error("Offline month"))
      .mockRejectedValueOnce(new Error("Offline day"));
    vi.stubGlobal("fetch", fetchMock);

    const apiMonth = await loader.loadCollection({
      collection: "prayerTimes",
      filter: { date: "2026-03" },
    });
    expect("entries" in apiMonth && apiMonth.entries.length).toBe(1);

    const apiDay = await loader.loadEntry({
      collection: "prayerTimes",
      filter: {},
    });
    expect(apiDay && "data" in apiDay).toBe(true);

    const fbMonth = await loader.loadCollection({
      collection: "prayerTimes",
      filter: { date: "2026-02" },
    });
    expect("entries" in fbMonth && fbMonth.entries.length).toBe(28);

    const fbDay = await loader.loadEntry({
      collection: "prayerTimes",
      filter: {},
    });
    expect(fbDay && "data" in fbDay).toBe(true);
  });

  it("should load zakatNisab collection and entry when Strapi, IslamicAPI, or fallback is used", async () => {
    const loader = zakatNisabLoader();
    const suiteSpy = vi.spyOn(strapiService, "fetchIslamSuiteFromStrapi");

    suiteSpy.mockResolvedValue({
      fetchedAt: "2026-03-01T00:00:00Z",
      standard: "common",
      currency: "cop",
      weightUnit: "gram",
      zakatRate: 0.025,
      gold: { weightGrams: 85, unitPrice: 100, nisabAmount: 8500 },
      silver: { weightGrams: 595, unitPrice: 10, nisabAmount: 5950 },
    });

    const strapiColl = await loader.loadCollection({
      collection: "zakatNisab",
      filter: {},
    });
    expect("entries" in strapiColl && strapiColl.entries.length).toBe(2);

    const strapiEntry = await loader.loadEntry({
      collection: "zakatNisab",
      filter: {},
    });
    expect(strapiEntry && "data" in strapiEntry).toBe(true);

    suiteSpy.mockResolvedValue(null);
    vi.spyOn(astroEnvServer, "getSecret").mockReturnValue("api-key");
    const sampleApiBody = {
      updated_at: "",
      calculation_standard: "classical",
      currency: "",
      weight_unit: "",
      data: {
        nisab_thresholds: {
          gold: { weight: 87.48, unit_price: 90, nisab_amount: 7873.2 },
          silver: { weight: 612.36, unit_price: 1, nisab_amount: 612.36 },
        },
      },
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(sampleApiBody),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            ...sampleApiBody,
            updated_at: "2026-03-01",
            currency: "usd",
            weight_unit: "oz",
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(sampleApiBody),
      })
      .mockRejectedValue(new Error("Zakat API offline"));
    vi.stubGlobal("fetch", fetchMock);

    const apiColl = await loader.loadCollection({
      collection: "zakatNisab",
      filter: { standard: "classical", unit: "oz" },
    });
    expect("entries" in apiColl && apiColl.entries.length).toBe(2);

    const apiEntry = await loader.loadEntry({
      collection: "zakatNisab",
      filter: { standard: "classical", currency: "usd", unit: "oz" },
    });
    expect(apiEntry && "data" in apiEntry).toBe(true);

    const fbColl = await loader.loadCollection({
      collection: "zakatNisab",
      filter: { standard: "classical" },
    });
    expect("entries" in fbColl && fbColl.entries.length).toBe(2);

    const fbEntry = await loader.loadEntry({
      collection: "zakatNisab",
      filter: { standard: "common", currency: "cop" },
    });
    expect(fbEntry && "data" in fbEntry).toBe(true);
  });
});
