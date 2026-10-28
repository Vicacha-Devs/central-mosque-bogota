import { STRAPI_API_URL } from "astro:env/client";
import { getSecret } from "astro:env/server";

export type TStrapiQueryValue = string | number | boolean | null | undefined;
export type TStrapiQueryParams = Record<string, TStrapiQueryValue>;

export type TStrapiPrayerSettings = {
  method: string;
  school: string;
  calender: "MATHEMATICAL" | "UAQ" | "HJCoSA" | "DIYANET";
  shifting: string;
  defaultLat: number;
  defaultLon: number;
  jumuahKhutbahTime: string;
  jumuahPrayerTime: string;
};

const DEFAULT_PRAYER_SETTINGS: TStrapiPrayerSettings = {
  method: "3",
  school: "1",
  calender: "MATHEMATICAL",
  shifting: "0",
  defaultLat: 4.6685,
  defaultLon: -74.0758,
  jumuahKhutbahTime: "12:15 PM",
  jumuahPrayerTime: "12:45 PM",
};

/**
 * Optimizes Cloudinary CDN URLs with `f_auto,q_auto` transformations.
 * Leaves non-Cloudinary URLs untouched.
 */
export function optimizeCloudinaryUrl(
  rawUrl: string | undefined | null,
  width?: number
): string {
  if (!rawUrl) return "";
  if (!rawUrl.includes("res.cloudinary.com") || !rawUrl.includes("/upload/")) {
    return rawUrl;
  }
  const transform = width
    ? `f_auto,q_auto,w_${String(width)}`
    : "f_auto,q_auto";
  if (rawUrl.includes(`/upload/${transform}/`)) {
    return rawUrl;
  }
  return rawUrl.replace("/upload/", `/upload/${transform}/`);
}

let strapiOfflineUntil = 0;

/**
 * Generic HTTP client for Strapi v5 REST endpoints.
 * Automatically injects `populate=deep` (via strapi-v5-plugin-populate-deep) and Bearer token when available.
 */
export const fetchStrapiData = async <
  TResult,
  TParams extends TStrapiQueryParams = TStrapiQueryParams,
>(
  endpoint: string,
  params: TParams = {} as TParams,
  init?: RequestInit
): Promise<TResult> => {
  const isGet = !init?.method || init.method.toUpperCase() === "GET";
  if (isGet && Date.now() < strapiOfflineUntil) {
    throw new Error("Strapi API offline (circuit breaker active)");
  }

  const baseUrl = STRAPI_API_URL || "http://127.0.0.1:1337";
  const token = getSecret("STRAPI_API_TOKEN");

  const normalizedEndpoint = endpoint.replace(/^\/+/, "");
  const url = new URL(`/api/${normalizedEndpoint}`, baseUrl);
  const searchParams = new URLSearchParams(url.search);

  if (!searchParams.has("populate")) {
    searchParams.set("populate", "deep");
  }

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    searchParams.set(key, String(value));
  }

  url.search = searchParams.toString();

  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  if (typeof token === "string" && token.trim()) {
    headers.set("Authorization", `Bearer ${token.trim()}`);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 1500);

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers,
      signal: controller.signal,
    });
  } catch (networkErr) {
    if (isGet) {
      strapiOfflineUntil = Date.now() + 10_000;
    }
    throw networkErr;
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    throw new Error(`Strapi API request failed (${String(res.status)})`);
  }

  return (await res.json()) as TResult;
};

/**
 * Fetches Mosque prayer calculation parameters from `@vicacha-devs/strapi-plugin-islam`
 * (`/api/islam/prayer-times`), with resilient fallback if Strapi is offline.
 */
export async function fetchPrayerSettingsFromStrapi(locale = "es"): Promise<TStrapiPrayerSettings> {
  try {
    const response = await fetchStrapiData<{
      data?: Partial<TStrapiPrayerSettings>;
    }>("islam/prayer-times", { locale });

    if (!response.data) return DEFAULT_PRAYER_SETTINGS;

    return {
      method: response.data.method ?? DEFAULT_PRAYER_SETTINGS.method,
      school: response.data.school ?? DEFAULT_PRAYER_SETTINGS.school,
      calender: response.data.calender ?? DEFAULT_PRAYER_SETTINGS.calender,
      shifting: response.data.shifting ?? DEFAULT_PRAYER_SETTINGS.shifting,
      defaultLat:
        response.data.defaultLat ?? DEFAULT_PRAYER_SETTINGS.defaultLat,
      defaultLon:
        response.data.defaultLon ?? DEFAULT_PRAYER_SETTINGS.defaultLon,
      jumuahKhutbahTime:
        response.data.jumuahKhutbahTime
        ?? DEFAULT_PRAYER_SETTINGS.jumuahKhutbahTime,
      jumuahPrayerTime:
        response.data.jumuahPrayerTime
        ?? DEFAULT_PRAYER_SETTINGS.jumuahPrayerTime,
    };
  } catch {
    return DEFAULT_PRAYER_SETTINGS;
  }
}

/**
 * Queries `@vicacha-devs/strapi-plugin-islam` endpoints (`/api/islam/*`),
 * such as `prayer-times`, `prayer-times/monthly`, `qibla`, `hijri`, `scripture`, and `nisab`.
 */
export async function fetchIslamSuiteFromStrapi<
  TData,
  TParams extends TStrapiQueryParams = TStrapiQueryParams,
>(subpath: string, params: TParams = {} as TParams): Promise<TData | null> {
  try {
    const cleanSubpath = subpath.replace(/^\/+/, "");
    const response = await fetchStrapiData<{ data?: TData }>(
      `islam/${cleanSubpath}`,
      params
    );
    return response.data ?? null;
  } catch {
    return null;
  }
}

/**
 * Queries Quran Foundation Content API v4.0.0 chapter verses via Strapi BFF (`/api/islam/quran/chapters/:chapterNumber`).
 * Enforces Quran Foundation's Translation Integrity Policy (`translate="no"` / `class="notranslate"`).
 */
export async function fetchQuranChapterVersesFromStrapi(
  chapterNumber: number,
  options?: {
    locale?: string;
    page?: number;
    perPage?: number;
    script?: "uthmani" | "uthmani_tajweed" | "imlaei" | "indopak_nastaleeq";
    words?: boolean;
    reciterId?: number;
  }
) {
  const safeChapter = Math.max(
    1,
    Math.min(114, Math.trunc(chapterNumber) || 1)
  );
  return fetchIslamSuiteFromStrapi(`quran/chapters/${String(safeChapter)}`, {
    locale: options?.locale ?? "es",
    page: options?.page ?? 1,
    perPage: options?.perPage ?? 20,
    script: options?.script ?? "uthmani",
    words: options?.words ?? false,
    reciterId: options?.reciterId ?? 7,
  });
}

/**
 * Queries Quran Foundation Content API v4.0.0 Ayah-linked Hadiths & scholarly answers
 * via Strapi BFF (`/api/islam/quran/verses/:verseKey/hadiths`).
 */
export async function fetchQuranAyahHadithsFromStrapi(
  verseKey: string,
  options?: { locale?: string; page?: number; limit?: number }
) {
  const safeKey = /^\d{1,3}:\d{1,3}$/.test(verseKey.trim())
    ? verseKey.trim()
    : "1:1";
  return fetchIslamSuiteFromStrapi(
    `quran/verses/${encodeURIComponent(safeKey)}/hadiths`,
    {
      locale: options?.locale ?? "es",
      page: options?.page ?? 1,
      limit: options?.limit ?? 4,
    }
  );
}
