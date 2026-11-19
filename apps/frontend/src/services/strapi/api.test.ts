import * as astroEnvServer from "astro:env/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  fetchIslamSuiteFromStrapi,
  fetchPrayerSettingsFromStrapi,
  fetchQuranAyahHadithsFromStrapi,
  fetchQuranChapterVersesFromStrapi,
  fetchStrapiData,
  optimizeCloudinaryUrl,
} from "./api";

describe("strapi api service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("should return empty string when URL is nullish", () => {
    expect(optimizeCloudinaryUrl(undefined)).toBe("");
    expect(optimizeCloudinaryUrl(null)).toBe("");
  });

  it("should keep original URL when host is not Cloudinary or already transformed", () => {
    const externalUrl = "https://example.com/mosque.jpg";
    expect(optimizeCloudinaryUrl(externalUrl)).toBe(externalUrl);

    const alreadyOptimized =
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v1/mosque.jpg";
    expect(optimizeCloudinaryUrl(alreadyOptimized)).toBe(alreadyOptimized);
  });

  it("should inject auto params and optional width when URL is Cloudinary", () => {
    const raw =
      "https://res.cloudinary.com/demo/image/upload/v17000000/mosque.jpg";
    expect(optimizeCloudinaryUrl(raw)).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v17000000/mosque.jpg"
    );
    expect(optimizeCloudinaryUrl(raw, 800)).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/v17000000/mosque.jpg"
    );
  });

  it("should fetch Strapi data with auth header and query params when online", async () => {
    vi.spyOn(astroEnvServer, "getSecret").mockReturnValue("secret-token");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: [{ id: 1 }] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await fetchStrapiData("/articles?populate=*", {
      locale: "es",
      emptyNull: null,
      emptyUndef: undefined,
    });
    expect(res).toEqual({ data: [{ id: 1 }] });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("should fetch prayer settings and fall back when fields or API are missing", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              method: "2",
              school: "2",
              calender: "UAQ",
              shifting: "1",
              defaultLat: 5,
              defaultLon: -75,
              jumuahKhutbahTime: "12:00 PM",
              jumuahPrayerTime: "12:30 PM",
            },
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: {} }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
      });
    vi.stubGlobal("fetch", fetchMock);

    const custom = await fetchPrayerSettingsFromStrapi("en");
    expect(custom.method).toBe("2");

    const partial = await fetchPrayerSettingsFromStrapi();
    expect(partial.method).toBe("3");

    const empty = await fetchPrayerSettingsFromStrapi();
    expect(empty.method).toBe("3");

    const errored = await fetchPrayerSettingsFromStrapi();
    expect(errored.method).toBe("3");
  });

  it("should query Islam suite and Quran helpers when online or offline", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { chapter: 1 } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
      });
    vi.stubGlobal("fetch", fetchMock);

    const chapterData = await fetchQuranChapterVersesFromStrapi(0);
    expect(chapterData).toEqual({ chapter: 1 });

    const emptyHadith = await fetchQuranAyahHadithsFromStrapi("2:255", {
      locale: "en",
      page: 2,
      limit: 5,
    });
    expect(emptyHadith).toBeNull();

    const fallbackHadith = await fetchQuranAyahHadithsFromStrapi("invalid");
    expect(fallbackHadith).toBeNull();

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { verses: [] } }),
    });
    const customChapter = await fetchQuranChapterVersesFromStrapi(2, {
      locale: "ar",
      page: 1,
      perPage: 10,
      script: "uthmani_tajweed",
      words: true,
      reciterId: 3,
    });
    expect(customChapter).toEqual({ verses: [] });

    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });
    expect(await fetchIslamSuiteFromStrapi("/qibla")).toBeNull();
  });

  it("should throw on HTTP error, timeout, and trigger circuit breaker when GET fails", async () => {
    vi.useFakeTimers();
    vi.spyOn(astroEnvServer, "getSecret").mockReturnValue(undefined);
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
      })
      .mockImplementationOnce((_url: URL, init?: RequestInit) => {
        return new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(new Error("Aborted"));
          });
        });
      })
      .mockRejectedValueOnce(new Error("ECONNREFUSED"))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ok: true }),
      });
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchStrapiData("articles")).rejects.toThrow(
      "Strapi API request failed (500)"
    );

    const timeoutPromise = fetchStrapiData(
      "slow-endpoint",
      {},
      { method: "POST" }
    );
    await Promise.all([
      expect(timeoutPromise).rejects.toThrow("Aborted"),
      vi.advanceTimersByTimeAsync(2000),
    ]);

    await expect(fetchStrapiData("articles")).rejects.toThrow("ECONNREFUSED");

    await expect(fetchStrapiData("articles")).rejects.toThrow(
      "Strapi API offline (circuit breaker active)"
    );

    const postRes = await fetchStrapiData(
      "submissions",
      {},
      { method: "POST" }
    );
    expect(postRes).toEqual({ ok: true });
  });
});
