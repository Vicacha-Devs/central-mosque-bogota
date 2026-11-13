import type { APIRoute } from "astro";
import { STRAPI_API_URL } from "astro:env/client";
import { getSecret } from "astro:env/server";

export const prerender = false;

const ALLOWED_LANGS = new Set(["es", "en", "ar", "tr"]);

const BOGOTA_DAILY_PRAYERS: Array<{
  key: string;
  labelByLang: Record<string, string>;
  hour: number;
  minute: number;
}> = [
  {
    key: "FAJR",
    labelByLang: {
      es: "Fajr (Alba) — Mezquita Central Bogotá",
      en: "Fajr (Dawn) — Bogotá Central Mosque",
      ar: "صلاة الفجر — مسجد أبو بكر الصديق بوغوتا",
      tr: "İmsak / Sabah Namazı — Bogotá Merkez Camii",
    },
    hour: 4,
    minute: 42,
  },
  {
    key: "DHUHR",
    labelByLang: {
      es: "Dhuhr (Mediodía) — Mezquita Central Bogotá",
      en: "Dhuhr (Noon) — Bogotá Central Mosque",
      ar: "صلاة الظهر — مسجد أبو بكر الصديق بوغوتا",
      tr: "Öğle Namazı — Bogotá Merkez Camii",
    },
    hour: 11,
    minute: 59,
  },
  {
    key: "ASR",
    labelByLang: {
      es: "Asr (Tarde) — Mezquita Central Bogotá",
      en: "Asr (Afternoon) — Bogotá Central Mosque",
      ar: "صلاة العصر — مسجد أبو بكر الصديق بوغوتا",
      tr: "İkindi Namazı — Bogotá Merkez Camii",
    },
    hour: 15,
    minute: 18,
  },
  {
    key: "MAGHRIB",
    labelByLang: {
      es: "Maghrib (Ocaso) — Mezquita Central Bogotá",
      en: "Maghrib (Sunset) — Bogotá Central Mosque",
      ar: "صلاة المغرب — مسجد أبو بكر الصديق بوغوتا",
      tr: "Akşam Namazı — Bogotá Merkez Camii",
    },
    hour: 18,
    minute: 2,
  },
  {
    key: "ISHA",
    labelByLang: {
      es: "Isha (Noche) — Mezquita Central Bogotá",
      en: "Isha (Night) — Bogotá Central Mosque",
      ar: "صلاة العشاء — مسجد أبو بكر الصديق بوغوتا",
      tr: "Yatsı Namazı — Bogotá Merkez Camii",
    },
    hour: 19,
    minute: 12,
  },
];

function sanitizeIcsText(input: string): string {
  return input.replace(/[\r\n,;\\]+/g, " ").trim();
}

function pad2(num: number): string {
  return String(num).padStart(2, "0");
}

function buildFallbackIcs(yearMonth: string, lang: string): string {
  const [yearStr, monthStr] = yearMonth.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const dtStamp = "20260101T000000Z";

  const lines: Array<string> = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mezquita Central Abu Bakr As-Siddiq Bogota//Prayer Calendar//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Mezquita Central Bogota - Horarios de Oracion",
    "X-WR-TIMEZONE:America/Bogota",
  ];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateCompact = `${String(year)}${pad2(month)}${pad2(day)}`;
    for (const prayer of BOGOTA_DAILY_PRAYERS) {
      const startLocal = `${dateCompact}T${pad2(prayer.hour)}${pad2(prayer.minute)}00`;
      const endMinute = (prayer.minute + 20) % 60;
      const endHour = prayer.hour + Math.floor((prayer.minute + 20) / 60);
      const endLocal = `${dateCompact}T${pad2(endHour)}${pad2(endMinute)}00`;
      const rawLabel = prayer.labelByLang[lang] ?? prayer.labelByLang.es;
      const summary = sanitizeIcsText(rawLabel);

      lines.push(
        "BEGIN:VEVENT",
        `UID:bogota-${dateCompact}-${prayer.key}@mezquitabogota.org`,
        `DTSTAMP:${dtStamp}`,
        `DTSTART;TZID=America/Bogota:${startLocal}`,
        `DTEND;TZID=America/Bogota:${endLocal}`,
        `SUMMARY:${summary}`,
        "LOCATION:Cra. 30 #79-61 Bogota Colombia",
        "END:VEVENT"
      );
    }
  }

  lines.push("END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}

export const GET: APIRoute = async ({ url }) => {
  const rawYm = url.searchParams.get("ym") ?? "";
  const rawLang = (url.searchParams.get("lang") ?? "es").toLowerCase();

  const now = new Date();
  const defaultYm = `${String(now.getUTCFullYear())}-${pad2(now.getUTCMonth() + 1)}`;
  const safeYm = /^\d{4}-\d{2}$/.test(rawYm) ? rawYm : defaultYm;
  const safeLang = ALLOWED_LANGS.has(rawLang) ? rawLang : "es";

  let icsBody: string | null = null;

  try {
    const baseUrl = STRAPI_API_URL || "http://127.0.0.1:1337";
    const token = getSecret("STRAPI_API_TOKEN");
    const targetUrl = new URL("/api/islam/prayer-times/calendar.ics", baseUrl);
    targetUrl.searchParams.set("yearMonth", safeYm);
    targetUrl.searchParams.set("locale", safeLang);

    const headers = new Headers({ Accept: "text/calendar" });
    if (typeof token === "string" && token.trim()) {
      headers.set("Authorization", `Bearer ${token.trim()}`);
    }

    const res = await fetch(targetUrl, {
      headers,
      signal: AbortSignal.timeout(2500),
    });

    if (res.ok) {
      const upstreamText = await res.text();
      if (upstreamText.includes("BEGIN:VCALENDAR")) {
        icsBody = upstreamText;
      }
    }
  } catch {
    // Fall back to deterministic local RFC 5545 generator when Strapi is offline
  }

  const finalIcs = icsBody ?? buildFallbackIcs(safeYm, safeLang);

  return new Response(finalIcs, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="mezquita-central-bogota-${safeYm}.ics"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
