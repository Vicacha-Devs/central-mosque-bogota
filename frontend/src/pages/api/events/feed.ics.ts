import type { TLang } from "@i18n/ui";
import { getDetailedEvents } from "@utils/localized-mocks";
import type { APIRoute } from "astro";
import { STRAPI_API_URL } from "astro:env/client";
import { getSecret } from "astro:env/server";

export const prerender = false;

const ALLOWED_LANGS = new Set<TLang>(["es", "en", "ar", "tr"]);

function sanitizeIcsText(input: string): string {
  return input.replace(/[\r\n,;\\]+/g, " ").trim();
}

function pad2(num: number): string {
  return String(num).padStart(2, "0");
}

function buildFallbackEventsIcs(lang: TLang): string {
  const events = getDetailedEvents(lang);
  const dtStamp = "20260101T000000Z";

  const lines: Array<string> = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mezquita Central Abu Bakr As-Siddiq Bogota//Events Calendar//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Mezquita Central Bogota - Eventos y Programas",
    "X-WR-TIMEZONE:America/Bogota",
  ];

  events.forEach((ev, idx) => {
    const day = pad2(ev.date.day || 15 + idx * 2);
    const dateCompact = `202610${day}`;
    const startHour = 18 - idx;
    const endHour = startHour + 2;
    const summary = sanitizeIcsText(ev.title);
    const description = sanitizeIcsText(ev.description);
    const location = sanitizeIcsText(ev.location);

    lines.push(
      "BEGIN:VEVENT",
      `UID:bogota-event-${ev.slug}@mezquitabogota.org`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART;TZID=America/Bogota:${dateCompact}T${pad2(startHour)}0000`,
      `DTEND;TZID=America/Bogota:${dateCompact}T${pad2(endHour)}0000`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      "END:VEVENT"
    );
  });

  lines.push("END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}

/**
 * BFF Route for downloading or subscribing to the Mosque Events & Programs iCal feed (`/api/events/feed.ics`).
 * Proxies `@vicacha-devs/strapi-plugin-events` (`/api/events/feed.ics`) and `@vicacha-devs/strapi-plugin-calendar` (`/api/calendar/feed.ics`)
 * when Strapi v5 is online, with a deterministic RFC 5545 `VCALENDAR` fallback when offline.
 */
export const GET: APIRoute = async ({ url }) => {
  const rawLang = (
    url.searchParams.get("locale") ??
    url.searchParams.get("lang") ??
    "es"
  ).toLowerCase();
  const safeLang: TLang = ALLOWED_LANGS.has(rawLang as TLang)
    ? (rawLang as TLang)
    : "es";

  let icsBody: string | null = null;

  const upstreamPaths = ["/api/events/feed.ics", "/api/calendar/feed.ics"];
  for (const upstreamPath of upstreamPaths) {
    try {
      const baseUrl = STRAPI_API_URL || "http://127.0.0.1:1337";
      const token = getSecret("STRAPI_API_TOKEN");
      const targetUrl = new URL(upstreamPath, baseUrl);
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
          break;
        }
      }
    } catch {
      // Try next upstream path or fall back to deterministic local RFC 5545 generator
    }
  }

  const finalIcs = icsBody ?? buildFallbackEventsIcs(safeLang);

  return new Response(finalIcs, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="mezquita-central-bogota-eventos-${safeLang}.ics"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
