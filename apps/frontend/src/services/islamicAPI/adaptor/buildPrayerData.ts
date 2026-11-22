import { calculateActivePrayer } from "@utils/islamic.utils";
import type { TIslamicApiPrayerTimes } from "@utils/models/islamic";
import type { TDailyPrayerSchedule } from "@utils/models/types";
import {
  formatHijriDate,
  formatLongDate,
  getCurrentMinutes,
  isToday,
  parseTimeToMinutes,
} from "@utils/time.utils";

type TRawTimes = TIslamicApiPrayerTimes;

const parsePrayerTimes = (times: TRawTimes): TDailyPrayerSchedule => ({
  fajr: times.Fajr,
  sunrise: times.Sunrise,
  dhuhr: times.Dhuhr,
  asr: times.Asr,
  maghrib: times.Maghrib,
  isha: times.Isha,
});

const parsePrayerTimesToNumber = (times: TDailyPrayerSchedule) => ({
  fajr: parseTimeToMinutes(times.fajr),
  sunrise: parseTimeToMinutes(times.sunrise),
  dhuhr: parseTimeToMinutes(times.dhuhr),
  asr: parseTimeToMinutes(times.asr),
  maghrib: parseTimeToMinutes(times.maghrib),
  isha: parseTimeToMinutes(times.isha),
});

export type BuildPrayerDataParams = {
  times: TIslamicApiPrayerTimes;
  city: string;
  country: string;
  date: Date;
  languageCode?: string;
  timeZone?: string;
  fetchedAt?: string;
};

export const buildPrayerData = ({
  times,
  city,
  country,
  date,
  languageCode = "es",
  timeZone = "America/Bogota",
  fetchedAt = new Date().toISOString(),
}: BuildPrayerDataParams) => {
  const today = isToday(date, timeZone);
  const parsedTimes = parsePrayerTimes(times);
  const activePray = today
    ? (calculateActivePrayer(
        getCurrentMinutes(timeZone),
        parsePrayerTimesToNumber(parsedTimes),
        parseTimeToMinutes(parsedTimes.sunrise)
      ) ?? undefined)
    : undefined;

  return {
    fetchedAt,
    location: `${city}, ${country}`,
    currentDate: formatLongDate(date, timeZone, languageCode),
    hijriDate: formatHijriDate(date, timeZone, languageCode),
    isToday: today,
    activePray,
    times: parsedTimes,
  };
};
