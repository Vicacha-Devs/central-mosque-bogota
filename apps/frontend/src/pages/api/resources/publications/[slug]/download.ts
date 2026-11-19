import type { TLang } from "@i18n/ui";
import {
  getLocalizedPublications,
  type TResourcePublication,
} from "@utils/resources-mocks";
import type { APIRoute } from "astro";
import { STRAPI_API_URL } from "astro:env/client";
import { getSecret } from "astro:env/server";

export const prerender = false;

const ALLOWED_LANGS = new Set<TLang>(["es", "en", "ar", "tr"]);
const SLUG_REGEX = /^[a-z0-9-]{1,120}$/;

/**
 * Escapes characters for safe inclusion in a PDF literal string `(...)` and normalizes
 * non-Latin1 characters so standard Type1 Helvetica renders without corruption.
 */
export function escapePdfText(input: string): string {
  const asciiNormalized = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return asciiNormalized
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

/**
 * Builds a minimal, standards-compliant PDF 1.4 document for offline/fallback publication downloads.
 */
export function buildFallbackPublicationPdf(
  publication: TResourcePublication,
  lang: TLang
): Uint8Array<ArrayBuffer> {
  const title =
    escapePdfText(publication.title) || escapePdfText(publication.slug);
  const author =
    escapePdfText(publication.authorName) || "Central Mosque Bogota";
  const summary =
    escapePdfText(publication.summary) ||
    "Official digital publication from Abu Bakr As-Siddiq Central Mosque Bogota.";
  const metaLine = escapePdfText(
    `${publication.categoryLabel} | ${publication.publishedAtDate} (${publication.secondaryDateFormatted}) | Locale: ${lang.toUpperCase()}`
  );

  const streamContent = [
    "BT",
    "/F1 16 Tf",
    "50 750 Td",
    "(Abu Bakr As-Siddiq Central Mosque - Bogota D.C.) Tj",
    "0 -28 Td",
    "/F1 13 Tf",
    `(${title}) Tj`,
    "0 -22 Td",
    "/F1 10 Tf",
    `(${author}) Tj`,
    "0 -18 Td",
    `(${metaLine}) Tj`,
    "0 -26 Td",
    `(${summary.slice(0, 95)}) Tj`,
    "0 -16 Td",
    `(${summary.slice(95, 190)}) Tj`,
    "ET",
  ].join("\n");

  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n",
    `4 0 obj\n<< /Length ${String(streamContent.length)} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: Array<number> = [];

  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${String(objects.length + 1)}\n`;
  pdf += "0000000000 65535 f \n";
  for (const offset of offsets) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${String(objects.length + 1)} /Root 1 0 R >>\nstartxref\n${String(xrefOffset)}\n%%EOF\n`;

  return new Uint8Array(new TextEncoder().encode(pdf));
}

// TODO(security): Integrate Content Disarm and Reconstruction (CDR) and antivirus scanning on upstream CMS-uploaded PDFs in production.
export const GET: APIRoute = async ({ params, url }) => {
  const rawSlug = (params.slug ?? "").trim().toLowerCase();
  if (!SLUG_REGEX.test(rawSlug)) {
    return new Response(
      JSON.stringify({ ok: false, error: "Invalid publication slug" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
        },
      }
    );
  }

  const rawLocale = (
    url.searchParams.get("locale") ??
    url.searchParams.get("lang") ??
    "es"
  ).toLowerCase() as TLang;
  const safeLang: TLang = ALLOWED_LANGS.has(rawLocale) ? rawLocale : "es";

  try {
    const baseUrl = STRAPI_API_URL || "http://127.0.0.1:1337";
    const token = getSecret("STRAPI_API_TOKEN");
    const targetUrl = new URL(
      `/api/resources/publications/${encodeURIComponent(rawSlug)}/download`,
      baseUrl
    );
    targetUrl.searchParams.set("locale", safeLang);

    const headers = new Headers({
      Accept: "application/pdf, application/json",
    });
    if (typeof token === "string" && token.trim()) {
      headers.set("Authorization", `Bearer ${token.trim()}`);
    }

    const res = await fetch(targetUrl, {
      headers,
      signal: AbortSignal.timeout(2500),
    });

    if (res.ok) {
      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.includes("application/pdf")) {
        const buffer = await res.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        if (
          bytes.length > 4 &&
          bytes[0] === 0x25 &&
          bytes[1] === 0x50 &&
          bytes[2] === 0x44 &&
          bytes[3] === 0x46
        ) {
          return new Response(buffer, {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename="${rawSlug}-${safeLang}.pdf"`,
              "X-Content-Type-Options": "nosniff",
              "X-Frame-Options": "DENY",
              "Cache-Control": "public, max-age=3600",
            },
          });
        }
      }
    }
  } catch {
    // Fall back to deterministic local PDF generator when Strapi is offline
  }

  const localizedPubs = getLocalizedPublications(safeLang);
  const matchedPub = localizedPubs.find((pub) => pub.slug === rawSlug);

  if (!matchedPub) {
    return new Response(
      JSON.stringify({ ok: false, error: "Publication not found" }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
        },
      }
    );
  }

  const fallbackBytes = buildFallbackPublicationPdf(matchedPub, safeLang);

  return new Response(fallbackBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${rawSlug}-${safeLang}.pdf"`,
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
