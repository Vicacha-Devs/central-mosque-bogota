import type { TLang } from "@i18n/ui";
import { useTranslations } from "@i18n/utils";
import { getDetailedMediaHighlights } from "@utils/localized-mocks";
import type { APIRoute } from "astro";
import { STRAPI_API_URL } from "astro:env/client";
import { getSecret } from "astro:env/server";

export const prerender = false;

const ALLOWED_LANGS = new Set<TLang>(["es", "en", "ar", "tr"]);

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

export const GET: APIRoute = async ({ url }) => {
  const rawLocale = (
    url.searchParams.get("locale") ??
    url.searchParams.get("lang") ??
    "es"
  ).toLowerCase() as TLang;
  const safeLang: TLang = ALLOWED_LANGS.has(rawLocale) ? rawLocale : "es";

  let rssXml: string | null = null;

  try {
    const baseUrl = STRAPI_API_URL || "http://127.0.0.1:1337";
    const token = getSecret("STRAPI_API_TOKEN");
    const targetUrl = new URL("/api/media-feeds/rss.xml", baseUrl);
    targetUrl.searchParams.set("locale", safeLang);

    const headers = new Headers({ Accept: "application/rss+xml" });
    if (typeof token === "string" && token.trim()) {
      headers.set("Authorization", `Bearer ${token.trim()}`);
    }

    const res = await fetch(targetUrl, {
      headers,
      signal: AbortSignal.timeout(2500),
    });

    if (res.ok) {
      const upstreamXml = await res.text();
      if (upstreamXml.includes("<rss")) {
        rssXml = upstreamXml;
      }
    }
  } catch {
    // Fall back to deterministic localized RSS 2.0 generator when Strapi is offline
  }

  const finalXml = rssXml ?? buildMediaRssXml(safeLang, url.origin);

  return new Response(finalXml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
