import { afterEach, describe, expect, it, vi } from "vitest";

import { GET } from "../../pages/api/events/feed.ics";

describe("GET /api/events/feed.ics BFF endpoint", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should proxy ICS feed when Strapi is available", async () => {
    const upstreamIcs = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "SUMMARY:Jumu'ah Khutbah",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(upstreamIcs, {
        status: 200,
        headers: { "Content-Type": "text/calendar; charset=utf-8" },
      })
    );

    const res = await GET({
      url: new URL("http://localhost:4321/api/events/feed.ics?locale=es"),
    } as never);

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/calendar");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    const text = await res.text();
    expect(text).toContain("SUMMARY:Jumu'ah Khutbah");
  });

  it("should generate ICS fallback when Strapi is offline", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new Error("ECONNREFUSED 127.0.0.1:1337")
    );

    const res = await GET({
      url: new URL("http://localhost:4321/api/events/feed.ics?locale=en"),
    } as never);

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/calendar");
    expect(res.headers.get("Content-Disposition")).toContain(
      "filename=\u0022mezquita-central-bogota-eventos-en.ics\u0022"
    );
    const text = await res.text();
    expect(text).toContain("BEGIN:VCALENDAR");
    expect(text).toContain(
      "UID:bogota-event-clase-arabe-clasico@mezquitabogota.org"
    );
    const astroEnv = await import("astro:env/server");
    vi.spyOn(astroEnv, "getSecret").mockReturnValue("ics-token");
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response("not-an-ics-body", { status: 200 })
    );
    const fallbackRes = await GET({
      url: new URL("http://localhost:4321/api/events/feed.ics?lang=invalid"),
    } as never);
    expect(fallbackRes.status).toBe(200);
  });
});
