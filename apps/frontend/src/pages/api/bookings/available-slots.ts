import { fetchStrapiData } from "@services/strapi";
import type { APIRoute } from "astro";

export const prerender = false;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ALLOWED_LOCALES = new Set(["es", "en", "ar", "tr"]);

type RawSlot = {
  startTime?: unknown;
  endTime?: unknown;
  slotKey?: unknown;
  label?: unknown;
};

function jsonRes(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function toSlotOption(slot: RawSlot): { value: string; label: string } | null {
  const start = typeof slot.startTime === "string" ? slot.startTime.trim() : "";
  const end = typeof slot.endTime === "string" ? slot.endTime.trim() : "";
  const rawKey = typeof slot.slotKey === "string" ? slot.slotKey.trim() : "";

  if (!start && !rawKey) return null;

  const hour = start ? Number.parseInt(start.slice(0, 2), 10) : NaN;
  const value =
    rawKey ||
    (Number.isFinite(hour) ? (hour < 12 ? "morning" : "afternoon") : start);
  const label =
    typeof slot.label === "string" && slot.label.trim().length > 0
      ? slot.label.trim()
      : start && end
        ? `${start} - ${end}`
        : start || value;

  return { value, label };
}

/**
 * BFF Route for querying available Guided Visit slots from Strapi
 * `@vicacha-devs/strapi-plugin-bookings` (`GET /api/bookings/available-slots`).
 * Returns `{ ok: true, slots: null }` when Strapi is offline so the UI falls back
 * to its default localized morning/afternoon options.
 */
export const GET: APIRoute = async ({ url }) => {
  const date = url.searchParams.get("date")?.trim() ?? "";
  if (!DATE_RE.test(date)) {
    return jsonRes({ ok: false, error: "Invalid date parameter" }, 400);
  }

  const rawParty = Number(url.searchParams.get("partySize") ?? 1);
  const partySize =
    Number.isFinite(rawParty) && rawParty >= 1 ? Math.round(rawParty) : 1;

  const rawLocale = url.searchParams.get("locale")?.trim() ?? "es";
  const locale = ALLOWED_LOCALES.has(rawLocale) ? rawLocale : "es";

  try {
    const res = await fetchStrapiData<{ data?: Array<RawSlot> }>(
      "bookings/available-slots",
      {
        resourceSlug: "visit-bookings",
        from: date,
        to: date,
        partySize,
        preferredLanguage: locale,
      }
    );
    const rawSlots = Array.isArray(res.data) ? res.data : [];
    const seen = new Set<string>();
    const slots = rawSlots
      .map(toSlotOption)
      .filter((s): s is { value: string; label: string } => {
        if (!s || seen.has(s.value)) return false;
        seen.add(s.value);
        return true;
      });

    return jsonRes({ ok: true, slots: slots.length > 0 ? slots : null });
  } catch {
    return jsonRes({ ok: true, slots: null });
  }
};
