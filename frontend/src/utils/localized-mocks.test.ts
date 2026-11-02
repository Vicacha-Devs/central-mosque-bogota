import type { TLang } from "@i18n/ui";

import { getDetailedArticles } from "./article-mocks";
import { getDetailedEvents } from "./event-mocks";
import {
  getFallbackObservances,
  getFallbackScriptureBundle,
  getIslamSuiteCopy,
} from "./islam-suite-mocks";
import { getLocalizedMocks } from "./localized-mocks";
import { getDetailedMediaHighlights } from "./media-mocks";
import {
  getLocalizedGalleryAlbums,
  getLocalizedGlossaryTerms,
  getLocalizedPublications,
} from "./resources-mocks";
import { getEventSpotlights } from "./spotlight-mocks";
import { getLocalizedUtilityInvoices } from "./utility-invoice-mocks";

describe("getLocalizedMocks", () => {
  it("should return localized mocks when locale is valid", () => {
    const esMocks = getLocalizedMocks("es");
    const enMocks = getLocalizedMocks("en");
    const arMocks = getLocalizedMocks("ar");
    const trMocks = getLocalizedMocks("tr");

    expect(esMocks.navLinks[0].label).toBe("Nosotros");
    expect(enMocks.navLinks[0].label).toBe("About Us");
    expect(arMocks.navLinks[0].label).toBe("من نحن");
    expect(trMocks.navLinks[0].label).toBe("Hakkımızda");

    expect(enMocks.aboutPageData.missionTitle).toBe("Our Mission");
    expect(arMocks.aboutPageData.missionTitle).toBe("رسالتنا");
    expect(trMocks.aboutPageData.missionTitle).toBe("Misyonumuz");

    expect(enMocks.islamFaithData.fivePillars[0].title).toBe(
      "Declaration of Faith"
    );
    expect(arMocks.islamFaithData.fivePillars[0].title).toBe("الشهادتان");
    expect(trMocks.islamFaithData.fivePillars[0].title).toBe(
      "Kelime-i Şehadet"
    );

    expect(enMocks.donationCampaigns[0].title).toContain("Prayer Hall");
    expect(arMocks.donationCampaigns[0].title).toContain("قاعة الصلاة");
    expect(trMocks.donationCampaigns[0].title).toContain("Namaz Salonu");

    expect(enMocks.paymentMethods[1].accountType).toContain("Digital Wallet");
    expect(arMocks.paymentMethods[1].accountType).toContain("محفظة رقمية");
    expect(trMocks.paymentMethods[1].accountType).toContain("Dijital Cüzdan");

    const locales: Array<TLang> = ["es", "en", "ar", "tr"];
    for (const lang of locales) {
      expect(getDetailedArticles(lang).length).toBeGreaterThan(0);
      expect(getDetailedEvents(lang).length).toBeGreaterThan(0);
      expect(getDetailedMediaHighlights(lang).length).toBeGreaterThan(0);
      expect(getLocalizedPublications(lang).length).toBeGreaterThan(0);
      expect(getLocalizedGalleryAlbums(lang).length).toBeGreaterThan(0);
      expect(getLocalizedGlossaryTerms(lang).length).toBeGreaterThan(0);
      expect(getFallbackObservances(lang).length).toBeGreaterThan(0);
      expect(getIslamSuiteCopy(lang).qiblaTitle.length).toBeGreaterThan(0);
      expect(getFallbackScriptureBundle(lang).ayat.length).toBeGreaterThan(0);
      expect(getEventSpotlights(lang).length).toBeGreaterThan(0);
      expect(getLocalizedUtilityInvoices(lang).length).toBeGreaterThan(0);
    }
  });
});
