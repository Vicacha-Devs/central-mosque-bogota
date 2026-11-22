import type { TLang } from "@i18n/ui";
import { useTranslations } from "@i18n/utils";
import { fetchStrapiRaw, resolveApiLang } from "@services/strapi";
import { getDetailedMediaHighlights } from "@utils/localized-mocks";
import type { APIRoute } from "astro";

export const prerender = false;

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildMediaRssXml(lang: TLang, siteOrigin: string): string {
  const t = useTranslations(lang);
  const items = getDetailedMediaHighlights(lang);
  const channelLink = `${siteOrigin}/${lang}/media`;

  const itemXml = items
    .map((item) => {
      const pubDate = new Date(`${item.publishedDate}T12:00:00Z`).toUTCString();
      return [
        "    <item>",
        `      <title>${escapeXml(item.title)}</title>`,
        `      <link>${escapeXml(item.watchUrl)}</link>`,
        `      <guid isPermaLink="false">${escapeXml(`${lang}-${item.slug}`)}</guid>`,
        `      <description>${escapeXml(item.description)}</description>`,
        `      <category>${escapeXml(item.typeLabel)}</category>`,
        `      <author>${escapeXml(item.speakerName)}</author>`,
        `      <pubDate>${escapeXml(pubDate)}</pubDate>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  return [
    "<?xml version=\u00221.0\u0022 encoding=\u0022UTF-8\u0022?>",
    "<rss version=\u00222.0\u0022>",
    "  <channel>",
    `    <title>${escapeXml(t("media-page.rss-title"))}</title>`,
    `    <link>${escapeXml(channelLink)}</link>`,
    `    <description>${escapeXml(t("media-page.rss-description"))}</description>`,
    `    <language>${escapeXml(lang)}</language>`,
    itemXml,
    "  </channel>",
    "</rss>",
  ].join("\n");
}

export const GET: APIRoute = async ({ url, site }) => {
  const safeLang = resolveApiLang(url);
  let rssXml: string | null = null;

  try {
    const res = await fetchStrapiRaw(
      "media-feeds/rss.xml",
      { locale: safeLang },
      {
        headers: { Accept: "application/rss+xml, application/xml, text/xml" },
        timeoutMs: 2500,
        skipDefaultPopulate: true,
      }
    );

    const contentType = res.headers.get("content-type") ?? "";
    if (
      contentType.includes("xml") ||
      contentType.includes("rss") ||
      contentType.includes("text/plain")
    ) {
      const upstreamXml = await res.text();
      if (upstreamXml.includes("<rss")) {
        rssXml = upstreamXml;
      }
    }
  } catch {
    // Fall back to deterministic localized RSS 2.0 generator when Strapi is offline
  }

  const safeOrigin = site?.origin ?? "https://mezquitabogota.org";
  const finalXml = rssXml ?? buildMediaRssXml(safeLang, safeOrigin);

  return new Response(finalXml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Content-Security-Policy": "default-src 'none'; sandbox",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
