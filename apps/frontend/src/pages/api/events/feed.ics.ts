import type { TLang } from "@i18n/ui";
import { fetchStrapiRaw, resolveApiLang } from "@services/strapi";
import { pad2, sanitizeIcsText } from "@utils/ics.utils";
import { getDetailedEvents } from "@utils/localized-mocks";
import type { APIRoute } from "astro";

export const prerender = false;

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
    const rawDay = ev.date.day || 15 + (idx % 8) * 2;
    const day = pad2(Math.min(31, Math.max(1, rawDay)));
    const dateCompact = `202610${day}`;
    const startHour = Math.max(8, 18 - (idx % 10));
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
  const safeLang = resolveApiLang(url);
  let icsBody: string | null = null;

  const upstreamEndpoints = ["events/feed.ics", "calendar/feed.ics"];
  for (const endpoint of upstreamEndpoints) {
    try {
      const res = await fetchStrapiRaw(
        endpoint,
        { locale: safeLang },
        {
          headers: { Accept: "text/calendar" },
          timeoutMs: 2500,
          skipDefaultPopulate: true,
        }
      );

      const contentType = res.headers.get("content-type") ?? "";
      if (
        contentType.includes("text/calendar")
        || contentType.includes("text/plain")
      ) {
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
      "Content-Security-Policy": "default-src 'none'; sandbox",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
