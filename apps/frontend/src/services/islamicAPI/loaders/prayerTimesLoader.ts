import {
  fetchIslamSuiteFromStrapi,
  fetchPrayerSettingsFromStrapi,
} from "@services/strapi";
import { getClientLocation } from "@utils/location.utils";
import type {
  TIslamicApiPrayerTimeMonthResponse,
  TIslamicApiPrayerTimeSingleResponse,
  TIslamicResponse,
} from "@utils/models/islamic";
import type { LiveLoader } from "astro/loaders";

import { buildPrayerData } from "../adaptor/buildPrayerData";
import { fetchIslamicData } from "../api";

const BOGOTA_FALLBACK_TIMES = {
  Fajr: "04:42",
  Sunrise: "05:56",
  Dhuhr: "11:59",
  Asr: "15:18",
  Maghrib: "18:02",
  Isha: "19:12",
};

type FetchPrayerParams = {
  date?: string;
  languageCode?: string;
  isMonthly: boolean;
};

type LoaderResponse = TIslamicResponse & {
  fetchedAt: string;
};
type LoaderExpectedResponse = { id: string; data: LoaderResponse };
type LoaderError = { error: Error };

type LoaderEntryResult = {
  type: "entry";
  result: LoaderExpectedResponse;
};
type LoaderCollectionResult = {
  type: "collection";
  result: Array<LoaderExpectedResponse>;
};

type LoaderSuccessResult = LoaderEntryResult | LoaderCollectionResult;
type LoaderResult = LoaderSuccessResult | LoaderError;

type EntryFilter = {
  date?: string;
  languageCode?: string;
};

type CollectionFilter = {
  languageCode?: string;
  date?: string;
};

type TStrapiIslamDailyTimetable = {
  dateGregorian: string;
  times: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
};

type TStrapiIslamMonthlyTimetable = {
  yearMonth: string;
  days: Array<TStrapiIslamDailyTimetable>;
};

/**
 * Fetches either daily or monthly prayer times from `@vicacha-devs/strapi-plugin-islam`
 * (`/api/islam/prayer-times`), falling back to IslamicAPI and local Bogotá fallback times.
 */
const fetchPrayerTimes = async ({
  date,
  languageCode = "es",
  isMonthly,
}: FetchPrayerParams): Promise<LoaderResult> => {
  const currentDate = date ? new Date(date) : new Date();
  let city = "Bogotá";
  let country = "Colombia";

  try {
    const [clientLoc, strapiPrayerSettings] = await Promise.all([
      getClientLocation(),
      fetchPrayerSettingsFromStrapi(languageCode),
    ]);

    city = clientLoc.city || "Bogotá";
    country = clientLoc.country || "Colombia";
    const lat = clientLoc.lat || String(strapiPrayerSettings.defaultLat);
    const lon = clientLoc.lon || String(strapiPrayerSettings.defaultLon);

    if (isMonthly) {
      const strapiMonthly =
        await fetchIslamSuiteFromStrapi<TStrapiIslamMonthlyTimetable>(
          "prayer-times/monthly",
          {
            yearMonth: date,
            lat,
            lon,
            city,
            country,
            locale: languageCode,
          }
        );

      if (strapiMonthly?.days.length) {
        return {
          type: "collection",
          result: strapiMonthly.days.map((day) => ({
            id: `${currentDate.toISOString()}-${day.dateGregorian}`,
            data: buildPrayerData({
              times: {
                Fajr: day.times.fajr,
                Sunrise: day.times.sunrise,
                Dhuhr: day.times.dhuhr,
                Asr: day.times.asr,
                Maghrib: day.times.maghrib,
                Isha: day.times.isha,
              },
              city,
              country,
              languageCode,
              date: new Date(`${day.dateGregorian}T12:00:00Z`),
            }),
          })),
        };
      }
    } else {
      const strapiDaily =
        await fetchIslamSuiteFromStrapi<TStrapiIslamDailyTimetable>(
          "prayer-times",
          {
            date,
            lat,
            lon,
            city,
            country,
            locale: languageCode,
          }
        );

      if (strapiDaily?.times.fajr) {
        return {
          type: "entry",
          result: {
            id: currentDate.toISOString(),
            data: buildPrayerData({
              times: {
                Fajr: strapiDaily.times.fajr,
                Sunrise: strapiDaily.times.sunrise,
                Dhuhr: strapiDaily.times.dhuhr,
                Asr: strapiDaily.times.asr,
                Maghrib: strapiDaily.times.maghrib,
                Isha: strapiDaily.times.isha,
              },
              city,
              country,
              languageCode,
              date: currentDate,
            }),
          },
        };
      }
    }

    const endpoint = "prayer-time/";
    const params = {
      lat,
      lon,
      method: strapiPrayerSettings.method,
      school: strapiPrayerSettings.school,
      calender: strapiPrayerSettings.calender,
      shifting: strapiPrayerSettings.shifting,
      date,
    };

    if (isMonthly) {
      const { data } =
        await fetchIslamicData<TIslamicApiPrayerTimeMonthResponse>(
          endpoint,
          params
        );

      return {
        type: "collection",
        result: data.map((entry) => ({
          id: `${currentDate.toISOString()}-${entry.date}`,
          data: buildPrayerData({
            times: entry.times,
            city,
            country,
            languageCode,
            date: new Date(entry.date),
          }),
        })),
      };
    } else {
      const { data } =
        await fetchIslamicData<TIslamicApiPrayerTimeSingleResponse>(
          endpoint,
          params
        );

      return {
        type: "entry",
        result: {
          id: currentDate.toISOString(),
          data: buildPrayerData({
            times: data.times,
            city,
            country,
            languageCode,
            date: currentDate,
          }),
        },
      };
    }
  } catch {
    if (isMonthly) {
      const year = currentDate.getUTCFullYear();
      const month = currentDate.getUTCMonth();
      const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
      const entries: Array<LoaderExpectedResponse> = [];

      for (let d = 1; d <= daysInMonth; d++) {
        const dayDate = new Date(Date.UTC(year, month, d));
        const isoDay = dayDate.toISOString().slice(0, 10);
        entries.push({
          id: `${currentDate.toISOString()}-${isoDay}`,
          data: buildPrayerData({
            times: BOGOTA_FALLBACK_TIMES,
            city,
            country,
            languageCode,
            date: dayDate,
          }),
        });
      }

      return {
        type: "collection",
        result: entries,
      };
    }

    return {
      type: "entry",
      result: {
        id: currentDate.toISOString(),
        data: buildPrayerData({
          times: BOGOTA_FALLBACK_TIMES,
          city,
          country,
          languageCode,
          date: currentDate,
        }),
      },
    };
  }
};

/**
 * Astro live loader for the `prayerTimes` collection.
 *
 * - `loadEntry`: fetches a single day (uses `filter.date` when provided)
 * - `loadCollection`: fetches a whole month (requires `config.date` in `YYYY-MM` format)
 */
export function prayerTimesLoader(): LiveLoader<
  LoaderResponse,
  EntryFilter,
  CollectionFilter
> {
  return {
    name: "prayer-times-loader",

    loadCollection: async ({ filter }) => {
      if (!filter)
        return {
          error: new Error("Date and LanguageCode parameters are required"),
        };

      const { date, languageCode } = filter;

      if (!date || !/^\d{4}-\d{2}$/.test(date)) {
        return {
          error: new Error("Date parameter in YYYY-MM format is required"),
        };
      }

      const response = await fetchPrayerTimes({
        date,
        languageCode,
        isMonthly: true,
      });

      if ("error" in response) return response;
      if (response.type !== "collection") {
        return {
          error: new Error("Unexpected response type for collection"),
        };
      }

      return { entries: response.result };
    },

    loadEntry: async ({ filter }) => {
      const { date, languageCode } = filter;

      const response = await fetchPrayerTimes({
        date,
        languageCode,
        isMonthly: false,
      });

      if ("error" in response) return response;
      if (response.type !== "entry") {
        return {
          error: new Error("Unexpected response type for single entry"),
        };
      }

      return response.result;
    },
  };
}
