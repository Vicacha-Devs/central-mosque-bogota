import { getLocalizedPublications } from "@utils/resources-mocks";
import { describe, expect, test, vi } from "vitest";

import {
  GET,
  buildFallbackPublicationPdf,
  escapePdfText,
} from "../../pages/api/resources/publications/[slug]/download";

describe("GET /api/resources/publications/[slug]/download BFF endpoint", () => {
  test("escapePdfText escapes parentheses and backslashes safely", () => {
    expect(escapePdfText("Guide (v1) \\ Español")).toBe(
      "Guide \\(v1\\) \\\\ Espanol"
    );
  });

  test("buildFallbackPublicationPdf produces a valid %PDF-1.4 byte array", () => {
    const [pub] = getLocalizedPublications("es");
    const pdfBytes = buildFallbackPublicationPdf(pub, "es");
    const text = new TextDecoder().decode(pdfBytes);

    expect(text.startsWith("%PDF-1.4\n")).toBe(true);
    expect(text).toContain("Abu Bakr As-Siddiq Central Mosque");
    expect(text.endsWith("%%EOF\n")).toBe(true);
  });

  test("rejects invalid slug parameters with 400 and nosniff header", async () => {
    const response = await GET({
      params: { slug: "../etc/passwd" },
      url: new URL(
        "http://127.0.0.1:4321/api/resources/publications/invalid/download"
      ),
    } as never);

    expect(response.status).toBe(400);
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });

  test("returns 404 when slug is unknown and Strapi is offline", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const response = await GET({
      params: { slug: "unknown-publication-slug" },
      url: new URL(
        "http://127.0.0.1:4321/api/resources/publications/unknown-publication-slug/download?locale=es"
      ),
    } as never);

    expect(response.status).toBe(404);
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });

  test("falls back to valid PDF attachment when Strapi is offline for known publication slug", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const response = await GET({
      params: { slug: "guia-bienvenida-visita-mezquita" },
      url: new URL(
        "http://127.0.0.1:4321/api/resources/publications/guia-bienvenida-visita-mezquita/download?locale=en"
      ),
    } as never);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toContain(
      "attachment; filename=\u0022guia-bienvenida-visita-mezquita-en.pdf\u0022"
    );
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");

    const bodyText = await response.text();
    expect(bodyText.startsWith("%PDF-1.4")).toBe(true);
  });

  test("should stream upstream PDF when Strapi responds with valid %PDF-1.4 bytes and token", async () => {
    const astroEnv = await import("astro:env/server");
    vi.spyOn(astroEnv, "getSecret").mockReturnValue("secret-token");

    const pdfBytes = new TextEncoder().encode("%PDF-1.4 upstream content");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(
        new Response(pdfBytes, {
          status: 200,
          headers: { "Content-Type": "application/pdf" },
        })
      )
    );

    const response = await GET({
      params: { slug: "guia-bienvenida-visita-mezquita" },
      url: new URL(
        "http://127.0.0.1:4321/api/resources/publications/guia-bienvenida-visita-mezquita/download?lang=invalid"
      ),
    } as never);

    expect(response.status).toBe(200);
    expect(await response.text()).toContain("%PDF-1.4 upstream content");

    const emptyPubPdf = buildFallbackPublicationPdf(
      {
        ...getLocalizedPublications("es")[0],
        title: "",
        authorName: "",
        summary: "",
      },
      "es"
    );
    expect(emptyPubPdf.byteLength).toBeGreaterThan(100);
  });
});
