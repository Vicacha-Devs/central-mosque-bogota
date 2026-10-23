import { describe, expect, it } from "vitest";

import {
  buildAlternateLangHref,
  getLangFromUrl,
  getRouteFromUrl,
  isSupportedLang,
  useTranslatedPath,
  useTranslations,
} from "./utils";

describe("i18n utils", () => {
  it("should translate route when locale is provided", () => {
    const url = new URL("https://mezquitabogota.org/es/about-us");
    expect(buildAlternateLangHref(url, "en", "es")).toBe("/en/about-us");
    expect(buildAlternateLangHref(url, "ar", "es")).toBe("/ar/about-us");
    expect(buildAlternateLangHref(url, "tr", "es")).toBe("/tr/about-us");
    expect(buildAlternateLangHref(url, "en")).toBe("/en/about-us");
  });

  it("should translate prayer slug when locale changes", () => {
    const esUrl = new URL(
      "https://mezquitabogota.org/es/informacion-oraciones"
    );
    expect(buildAlternateLangHref(esUrl, "en", "es")).toBe(
      "/en/prayer-information"
    );
    expect(buildAlternateLangHref(esUrl, "tr", "es")).toBe("/tr/namaz-belgesi");
  });

  it("should preserve nested slug, root path, and unknown slug when building alternate href", () => {
    const nested = new URL(
      "https://mezquitabogota.org/en/articles/introduction-to-islam"
    );
    expect(buildAlternateLangHref(nested, "es", "en")).toBe(
      "/es/articles/introduction-to-islam"
    );

    const root = new URL("https://mezquitabogota.org/es/");
    expect(buildAlternateLangHref(root, "en")).toBe("/en/");

    const nonLocalized = new URL("https://mezquitabogota.org/custom-slug");
    expect(buildAlternateLangHref(nonLocalized, "en")).toBe("/en/custom-slug");
  });

  it("should resolve language, translations, routes, and translated paths when called", () => {
    expect(getLangFromUrl(new URL("https://mezquitabogota.org/en/home"))).toBe(
      "en"
    );
    expect(getLangFromUrl(new URL("https://mezquitabogota.org/fr/home"))).toBe(
      "es"
    );

    const t = useTranslations("es");
    expect(t("header.donate-now").length).toBeGreaterThan(0);
    expect(t("pray-calendar.description", "Bogotá")).toContain("Bogotá");
    expect(t("pray-calendar.description", 123)).toContain("123");
    expect(t("pray-calendar.description", { location: "Medellín" })).toContain(
      "Medellín"
    );

    expect(
      getRouteFromUrl(
        new URL("https://mezquitabogota.org/es/prayer-information")
      )
    ).toBe("informacion-oraciones");
    expect(
      getRouteFromUrl(
        new URL("https://mezquitabogota.org/en/prayer-information")
      )
    ).toBe("prayer-information");
    expect(
      getRouteFromUrl(new URL("https://mezquitabogota.org/en/unknown-route"))
    ).toBeUndefined();
    expect(
      getRouteFromUrl(new URL("https://mezquitabogota.org/"))
    ).toBeUndefined();

    const translatePath = useTranslatedPath("es");
    expect(translatePath("prayer-information")).toBe(
      "/es/informacion-oraciones"
    );
    expect(translatePath("/custom-page", "en")).toBe("/en/custom-page");

    expect(isSupportedLang(undefined)).toBe(false);
    expect(isSupportedLang("")).toBe(false);
    expect(isSupportedLang("fr")).toBe(false);
    expect(isSupportedLang("ar")).toBe(true);
  });
});
