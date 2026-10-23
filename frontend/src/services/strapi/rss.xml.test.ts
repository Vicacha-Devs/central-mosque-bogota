import { describe, expect, test, vi } from "vitest";

import {
  GET,
  buildMediaRssXml,
  escapeXml,
} from "../../pages/api/media-feeds/rss.xml";

describe("rss.xml API route", () => {
  test("escapeXml escapes XML special characters safely", () => {
    expect(escapeXml("<script>&\"test'</script>")).toBe(
      "&lt;script&gt;&amp;&quot;test&apos;&lt;/script&gt;"
    );
  });

  test("buildMediaRssXml generates valid RSS 2.0 XML for locale", () => {
    const xml = buildMediaRssXml("en", "https://mezquitabogota.org");
    expect(xml).toContain(
      "<?xml version=\u00221.0\u0022 encoding=\u0022UTF-8\u0022?>"
    );
    expect(xml).toContain("<language>en</language>");
    expect(xml).toContain("Abu Bakr As-Siddiq Central Mosque Bogotá");
    expect(xml).toContain("<item>");
  });

  test("GET falls back to local RSS 2.0 feed when Strapi is offline and sanitizes invalid locale", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const response = await GET({
      url: new URL(
        "http://localhost:4321/api/media-feeds/rss.xml?locale=invalid"
      ),
    } as never);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain(
      "application/rss+xml"
    );
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    const body = await response.text();
    expect(body).toContain("<language>es</language>");
  });

  test("should return upstream RSS XML when Strapi responds with valid RSS and token", async () => {
    const astroEnv = await import("astro:env/server");
    vi.spyOn(astroEnv, "getSecret").mockReturnValue("rss-token");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(
        new Response("<rss version=\u00222.0\u0022><channel></channel></rss>", {
          status: 200,
        })
      )
    );

    const response = await GET({
      url: new URL("http://localhost:4321/api/media-feeds/rss.xml"),
    } as never);
    expect(await response.text()).toContain("<rss version=\u00222.0\u0022>");
  });
});
