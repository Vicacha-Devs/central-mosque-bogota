import { describe, expect, it, vi } from "vitest";

import { GET } from "../../pages/api/prayer-calendar.ics";

vi.mock("@services/strapi", () => ({
  resolveApiLang: (url: URL) => {
    const raw = (url.searchParams.get("lang") ?? "es").toLowerCase();
    return ["es", "en", "ar", "tr"].includes(raw) ? raw : "es";
  },
  fetchStrapiRaw: vi.fn().mockRejectedValue(new Error("Strapi offline")),
}));

describe("GET /api/prayer-calendar.ics", () => {
  it("should generate a fallback VCALENDAR when Strapi is unreachable for a month and locale", async () => {
    const res = await GET({
      url: new URL(
        "http://localhost:4321/api/prayer-calendar.ics?ym=2026-03&lang=en"
      ),
    } as never);

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/calendar");
    expect(res.headers.get("content-security-policy")).toBe(
      "default-src 'none'; sandbox"
    );

    const body = await res.text();
    expect(body).toContain("BEGIN:VCALENDAR");
    expect(body).toContain("SUMMARY:Fajr (Dawn)");
    expect(body).toContain("END:VCALENDAR");
  });

  it("should proxy the upstream VCALENDAR when Strapi is online", async () => {
    const { fetchStrapiRaw } = await import("@services/strapi");
    vi.mocked(fetchStrapiRaw).mockResolvedValueOnce(
      new Response("BEGIN:VCALENDAR\r\nVERSION:2.0\r\nEND:VCALENDAR\r\n", {
        status: 200,
        headers: { "Content-Type": "text/calendar; charset=utf-8" },
      })
    );

    const res = await GET({
      url: new URL(
        "http://localhost:4321/api/prayer-calendar.ics?ym=2026-04&lang=es"
      ),
    } as never);

    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain("BEGIN:VCALENDAR");
  });
});
