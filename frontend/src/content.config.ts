import type { TLang } from "@i18n/ui";
import {
  createStrapiCollectionLoader,
  createStrapiSingleTypeLoader,
} from "@services/strapi/loader";
import { getLocalizedMocks } from "@utils/data.mocks";
import {
  getLocalizedAboutPageData,
  getLocalizedIslamFaithData,
  getLocalizedPaymentMethods,
} from "@utils/institutional-mocks";
import {
  getDetailedArticles,
  getDetailedEvents,
  getDetailedMediaHighlights,
  type TDetailedArticle,
  type TDetailedEvent,
  type TDetailedMediaItem,
} from "@utils/localized-mocks";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const langEnum = z.enum(["es", "en", "ar", "tr"]);

const asStr = (...values: Array<unknown>): string => {
  for (const val of values) {
    if (typeof val === "string" || typeof val === "number") {
      return String(val);
    }
  }
  return "";
};

const articlesCollection = defineCollection({
  loader: createStrapiCollectionLoader({
    contentType: "articles",
    idField: "slug",
    fallbackByLocale: (lang: TLang) => {
      return getDetailedArticles(lang).map((item) => ({
        ...item,
        content: item.contentParagraphs.map((p) => `<p>${p}</p>`).join("\n"),
      }));
    },
    mapStrapiEntry: (raw: Record<string, unknown>, lang: TLang) => {
      const defaults = getDetailedArticles(lang)[0];
      const slug = asStr(raw.slug, defaults.slug);
      const rawContent =
        typeof raw.content === "string" && raw.content.trim()
          ? raw.content
          : defaults.contentParagraphs.map((p) => `<p>${p}</p>`).join("\n");

      const item: TDetailedArticle & { content: string } = {
        slug,
        badgeLabel: asStr(raw.tag, raw.category, defaults.badgeLabel),
        badgeTone: defaults.badgeTone,
        title: asStr(raw.title, defaults.title),
        description: asStr(raw.description, defaults.description),
        href: `/${lang}/articles/${slug}`,
        ctaIcon: defaults.ctaIcon,
        imageAlt: asStr(raw.imageAlt, raw.title, defaults.imageAlt),
        imageUrl: asStr(raw.imageUrl, defaults.imageUrl),
        authorName: asStr(raw.author, defaults.authorName),
        readingTimeMinutes:
          Number.parseInt(asStr(raw.readingTime), 10) ||
          defaults.readingTimeMinutes,
        instructorRole: defaults.instructorRole,
        scheduleLabel: defaults.scheduleLabel,
        contentParagraphs: defaults.contentParagraphs,
        learningObjectives: defaults.learningObjectives,
        content: rawContent,
      };
      return item;
    },
  }),
  schema: z.object({
    documentId: z.string(),
    locale: langEnum,
    slug: z.string(),
    badgeLabel: z.string(),
    badgeTone: z.enum(["primary", "secondary"]),
    title: z.string(),
    description: z.string(),
    href: z.string(),
    ctaIcon: z.string(),
    imageAlt: z.string(),
    imageUrl: z.string(),
    authorName: z.string(),
    readingTimeMinutes: z.number(),
    instructorRole: z.string(),
    scheduleLabel: z.string(),
    contentParagraphs: z.array(z.string()),
    learningObjectives: z.array(z.string()),
    content: z.string().optional(),
  }),
});

const eventsCollection = defineCollection({
  loader: createStrapiCollectionLoader({
    contentType: "events",
    idField: "slug",
    fallbackByLocale: (lang: TLang) =>
      getDetailedEvents(lang).map((ev) => ({
        ...ev,
        richDescription: ev.fullDescription
          .map((p) => `<p>${p}</p>`)
          .join("\n"),
      })),
    mapStrapiEntry: (raw: Record<string, unknown>, lang: TLang) => {
      const defaults = getDetailedEvents(lang)[0];
      const slug = asStr(raw.slug, defaults.slug);
      const startDate =
        typeof raw.startDate === "string"
          ? new Date(raw.startDate)
          : new Date();
      const month = startDate.toLocaleString(lang, { month: "short" });
      const day = startDate.getUTCDate();
      const richDescription =
        typeof raw.description === "string" && raw.description.trim()
          ? raw.description
          : defaults.fullDescription.map((p) => `<p>${p}</p>`).join("\n");

      const item: TDetailedEvent & { richDescription: string } = {
        slug,
        category: asStr(raw.category, defaults.category),
        title: asStr(raw.title, defaults.title),
        description: asStr(raw.summary, raw.description, defaults.description),
        schedule: asStr(raw.timeLabel, defaults.schedule),
        location: asStr(raw.location, defaults.location),
        url: `/${lang}/events/${slug}`,
        image: asStr(raw.imageUrl, defaults.image),
        date: { month, day },
        speaker: defaults.speaker,
        fullDescription: defaults.fullDescription,
        audience: defaults.audience,
        richDescription,
      };
      return item;
    },
  }),
  schema: z.object({
    documentId: z.string(),
    locale: langEnum,
    slug: z.string(),
    category: z.string(),
    title: z.string(),
    description: z.string(),
    schedule: z.string(),
    location: z.string(),
    url: z.string(),
    image: z.string(),
    date: z.object({
      month: z.string(),
      day: z.number(),
    }),
    speaker: z.string(),
    fullDescription: z.array(z.string()),
    audience: z.string(),
    richDescription: z.string().optional(),
  }),
});

const faqsCollection = defineCollection({
  loader: createStrapiCollectionLoader({
    contentType: "faqs",
    idField: "question",
    fallbackByLocale: (lang: TLang) => {
      return getLocalizedMocks(lang).islamFaithData.faqs.map((faq, idx) => ({
        id: `faq-${String(idx)}`,
        question: faq.question,
        answer: faq.answer,
      }));
    },
    mapStrapiEntry: (raw: Record<string, unknown>) => ({
      id: asStr(raw.documentId, raw.id, "faq"),
      question: asStr(raw.question),
      answer: asStr(raw.answer),
    }),
  }),
  schema: z.object({
    documentId: z.string(),
    locale: langEnum,
    id: z.string(),
    question: z.string(),
    answer: z.string(),
  }),
});

const communityServicesCollection = defineCollection({
  loader: createStrapiCollectionLoader({
    contentType: "community-services",
    idField: "title",
    fallbackByLocale: (lang: TLang) => {
      return getLocalizedMocks(lang).defaultServices.map((srv) => ({
        icon: srv.icon,
        title: srv.title,
        description: srv.description,
      }));
    },
    mapStrapiEntry: (raw: Record<string, unknown>, lang: TLang) => {
      const defaults = getLocalizedMocks(lang).defaultServices[0];
      return {
        icon: asStr(raw.icon, defaults.icon),
        title: asStr(raw.title, defaults.title),
        description: asStr(raw.description, defaults.description),
        longDescription:
          typeof raw.longDescription === "string" && raw.longDescription.trim()
            ? raw.longDescription
            : undefined,
      };
    },
  }),
  schema: z.object({
    documentId: z.string(),
    locale: langEnum,
    icon: z.string(),
    title: z.string(),
    description: z.string(),
    longDescription: z.string().optional(),
  }),
});

const mediaHighlightsCollection = defineCollection({
  loader: createStrapiCollectionLoader({
    contentType: "media-highlights",
    idField: "slug",
    fallbackByLocale: (lang: TLang) => {
      return getDetailedMediaHighlights(lang).map((item) => ({ ...item }));
    },
    mapStrapiEntry: (raw: Record<string, unknown>, lang: TLang) => {
      const defaults = getDetailedMediaHighlights(lang)[0];
      const rawType = asStr(raw.type, defaults.type);
      const type: TDetailedMediaItem["type"] =
        rawType === "khutbah" || rawType === "podcast" || rawType === "video"
          ? rawType
          : defaults.type;
      const item: TDetailedMediaItem = {
        slug: asStr(raw.slug, defaults.slug),
        type,
        typeLabel: asStr(raw.typeLabel, defaults.typeLabel),
        provider: defaults.provider,
        providerLabel: asStr(raw.providerLabel, defaults.providerLabel),
        externalId:
          typeof raw.externalId === "string"
            ? raw.externalId
            : defaults.externalId,
        embedUrl:
          typeof raw.embedUrl === "string" ? raw.embedUrl : defaults.embedUrl,
        watchUrl: asStr(raw.href, raw.watchUrl, defaults.watchUrl),
        title: asStr(raw.title, defaults.title),
        description: asStr(raw.description, defaults.description),
        speakerName: asStr(raw.speaker, raw.speakerName, defaults.speakerName),
        duration: asStr(raw.duration, defaults.duration),
        publishedDate: asStr(
          raw.publishedAtLabel,
          raw.publishedDate,
          defaults.publishedDate
        ),
        hijriDate:
          typeof raw.hijriDate === "string"
            ? raw.hijriDate
            : defaults.hijriDate,
        spokenLanguages: Array.isArray(raw.spokenLanguages)
          ? raw.spokenLanguages.map((item) => asStr(item))
          : defaults.spokenLanguages,
        languageTracks: defaults.languageTracks,
        href: asStr(raw.href, `/${lang}/media`),
        imageUrl: asStr(raw.imageUrl, defaults.imageUrl),
        imageAlt: asStr(raw.imageAlt, raw.title, defaults.imageAlt),
      };
      return item;
    },
  }),
  schema: z.object({
    documentId: z.string(),
    locale: langEnum,
    slug: z.string(),
    type: z.enum(["khutbah", "podcast", "video"]),
    typeLabel: z.string(),
    provider: z.enum([
      "youtube",
      "spotify",
      "apple_podcasts",
      "vimeo",
      "soundcloud",
      "direct",
      "upload",
    ]),
    providerLabel: z.string(),
    externalId: z.string().optional(),
    embedUrl: z.string().optional(),
    watchUrl: z.string(),
    title: z.string(),
    description: z.string(),
    speakerName: z.string(),
    duration: z.string(),
    publishedDate: z.string(),
    hijriDate: z.string().optional(),
    spokenLanguages: z.array(z.string()),
    languageTracks: z
      .array(
        z.object({
          locale: z.string(),
          label: z.string(),
          audioUrl: z.string().optional(),
          transcriptUrl: z.string().optional(),
        })
      )
      .optional(),
    href: z.string(),
    imageUrl: z.string(),
    imageAlt: z.string(),
  }),
});

const donationCampaignsCollection = defineCollection({
  loader: createStrapiCollectionLoader({
    contentType: "donation-campaigns",
    idField: "slug",
    fallbackByLocale: (lang: TLang) => {
      return getLocalizedMocks(lang).donationCampaigns.map((camp) => ({
        ...camp,
      }));
    },
    mapStrapiEntry: (raw: Record<string, unknown>, lang: TLang) => {
      const defaults = getLocalizedMocks(lang).donationCampaigns[0];
      const goalAmount = Number(raw.goalAmount ?? defaults.goalAmount);
      const raisedAmount = Number(raw.raisedAmount ?? defaults.raisedAmount);
      const percent =
        goalAmount > 0
          ? Math.min(100, Math.round((raisedAmount / goalAmount) * 100))
          : defaults.percent;
      return {
        slug: asStr(raw.slug, defaults.slug),
        title: asStr(raw.title, defaults.title),
        description: asStr(raw.description, defaults.description),
        goalAmount,
        raisedAmount,
        currency: asStr(raw.currency, defaults.currency),
        percent,
      };
    },
  }),
  schema: z.object({
    documentId: z.string(),
    locale: langEnum,
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    goalAmount: z.number(),
    raisedAmount: z.number(),
    currency: z.string(),
    percent: z.number(),
  }),
});

const leadersCollection = defineCollection({
  loader: createStrapiCollectionLoader({
    contentType: "leaders",
    idField: "name",
    fallbackByLocale: (lang: TLang) => {
      return getLocalizedAboutPageData(lang).leaders.map((leader) => ({
        ...leader,
      }));
    },
    mapStrapiEntry: (raw: Record<string, unknown>, lang: TLang) => {
      const defaults = getLocalizedAboutPageData(lang).leaders[0];
      return {
        name: asStr(raw.name, defaults.name),
        roleTitle: asStr(raw.roleTitle, defaults.roleTitle),
        bio: asStr(raw.bio, defaults.bio),
        languagesSpoken: asStr(raw.languagesSpoken, defaults.languagesSpoken),
      };
    },
  }),
  schema: z.object({
    documentId: z.string(),
    locale: langEnum,
    name: z.string(),
    roleTitle: z.string(),
    bio: z.string(),
    languagesSpoken: z.string(),
  }),
});

const aboutPageCollection = defineCollection({
  loader: createStrapiSingleTypeLoader({
    contentType: "about-page",
    fallbackByLocale: (lang: TLang) => ({
      ...getLocalizedAboutPageData(lang),
    }),
    mapStrapiEntry: (raw: Record<string, unknown>, lang: TLang) => {
      const defaults = getLocalizedAboutPageData(lang);
      const defaultHighlights = defaults.architectureHighlights;
      return {
        heroTitle: asStr(raw.heroTitle, defaults.heroTitle),
        heroSubtitle: asStr(raw.heroSubtitle, defaults.heroSubtitle),
        missionTitle: asStr(raw.missionTitle, defaults.missionTitle),
        missionBody: asStr(raw.missionBody, defaults.missionBody),
        visionTitle: asStr(raw.visionTitle, defaults.visionTitle),
        visionBody: asStr(raw.visionBody, defaults.visionBody),
        historyTimeline: Array.isArray(raw.historyTimeline)
          ? (raw.historyTimeline as typeof defaults.historyTimeline)
          : defaults.historyTimeline,
        architectureHighlights: Array.isArray(raw.architectureHighlights)
          ? (raw.architectureHighlights as typeof defaultHighlights)
          : defaultHighlights,
        architectureDescription:
          typeof raw.architectureDescription === "string" &&
          raw.architectureDescription.trim()
            ? raw.architectureDescription
            : undefined,
        leaders: Array.isArray(raw.leaders)
          ? (raw.leaders as typeof defaults.leaders)
          : defaults.leaders,
      };
    },
  }),
  schema: z.object({
    documentId: z.string(),
    locale: langEnum,
    slug: z.string(),
    heroTitle: z.string(),
    heroSubtitle: z.string(),
    missionTitle: z.string(),
    missionBody: z.string(),
    visionTitle: z.string(),
    visionBody: z.string(),
    historyTimeline: z.array(
      z.object({
        year: z.string(),
        title: z.string(),
        description: z.string(),
      })
    ),
    architectureHighlights: z.array(
      z.object({
        icon: z.string(),
        title: z.string(),
        description: z.string(),
      })
    ),
    architectureDescription: z.string().optional(),
    leaders: z.array(
      z.object({
        name: z.string(),
        roleTitle: z.string(),
        bio: z.string(),
        languagesSpoken: z.string(),
      })
    ),
  }),
});

const globalSettingCollection = defineCollection({
  loader: createStrapiSingleTypeLoader({
    contentType: "global-setting",
    fallbackByLocale: (lang: TLang) => {
      const mocks = getLocalizedMocks(lang);
      return {
        lemma: mocks.lemma,
        contactInfo: mocks.contactInfo,
        navLinks: mocks.navLinks,
        fastLinks: mocks.fastLinks,
        rightsText: mocks.rightsText,
        socialNetworkLinks: mocks.socialNetworkLinks,
      };
    },
    mapStrapiEntry: (raw: Record<string, unknown>, lang: TLang) => {
      const defaults = getLocalizedMocks(lang);
      return {
        lemma: asStr(raw.lemma, defaults.lemma),
        contactInfo:
          raw.contactInfo && typeof raw.contactInfo === "object"
            ? (raw.contactInfo as typeof defaults.contactInfo)
            : defaults.contactInfo,
        navLinks: Array.isArray(raw.navLinks)
          ? (raw.navLinks as typeof defaults.navLinks)
          : defaults.navLinks,
        fastLinks: Array.isArray(raw.fastLinks)
          ? (raw.fastLinks as typeof defaults.fastLinks)
          : defaults.fastLinks,
        rightsText: defaults.rightsText,
        socialNetworkLinks: Array.isArray(raw.socialNetworkLinks)
          ? (raw.socialNetworkLinks as typeof defaults.socialNetworkLinks)
          : defaults.socialNetworkLinks,
      };
    },
  }),
  schema: z.object({
    documentId: z.string(),
    locale: langEnum,
    slug: z.string(),
    lemma: z.string(),
    contactInfo: z.object({
      address: z.string(),
      phone: z.string(),
      email: z.string(),
    }),
    navLinks: z.array(
      z.object({
        label: z.string(),
        href: z.string(),
      })
    ),
    fastLinks: z.array(
      z.object({
        label: z.string(),
        href: z.string(),
      })
    ),
    rightsText: z.object({
      copyRight: z.string(),
      privacyPolicy: z.object({
        label: z.string(),
        href: z.string(),
      }),
      termsAndConditions: z.object({
        label: z.string(),
        href: z.string(),
      }),
    }),
    socialNetworkLinks: z.array(
      z.object({
        label: z.string(),
        href: z.string(),
        icon: z.enum(["facebook", "instagram", "youtube"]),
      })
    ),
  }),
});

const islamFaithPageCollection = defineCollection({
  loader: createStrapiSingleTypeLoader({
    contentType: "islam-faith-page",
    fallbackByLocale: (lang: TLang) => {
      const data = getLocalizedIslamFaithData(lang);
      return {
        shahadaArabic: data.shahadaArabic,
        shahadaTransliteration: data.shahadaTransliteration,
        shahadaTranslation: data.shahadaTranslation,
        fivePillars: data.fivePillars,
      };
    },
    mapStrapiEntry: (raw: Record<string, unknown>, lang: TLang) => {
      const defaults = getLocalizedIslamFaithData(lang);
      return {
        shahadaArabic: asStr(raw.shahadaArabic, defaults.shahadaArabic),
        shahadaTransliteration: asStr(
          raw.shahadaTransliteration,
          defaults.shahadaTransliteration
        ),
        shahadaTranslation: asStr(
          raw.shahadaTranslation,
          defaults.shahadaTranslation
        ),
        introText:
          typeof raw.introText === "string" && raw.introText.trim()
            ? raw.introText
            : undefined,
        fivePillars: Array.isArray(raw.fivePillars)
          ? (raw.fivePillars as typeof defaults.fivePillars)
          : defaults.fivePillars,
      };
    },
  }),
  schema: z.object({
    documentId: z.string(),
    locale: langEnum,
    slug: z.string(),
    shahadaArabic: z.string(),
    shahadaTransliteration: z.string(),
    shahadaTranslation: z.string(),
    introText: z.string().optional(),
    fivePillars: z.array(
      z.object({
        number: z.number(),
        arabicName: z.string(),
        transliteration: z.string(),
        title: z.string(),
        description: z.string(),
        icon: z.string(),
      })
    ),
  }),
});

const donationsPageCollection = defineCollection({
  loader: createStrapiSingleTypeLoader({
    contentType: "donations-page",
    fallbackByLocale: (lang: TLang) => ({
      paymentMethods: getLocalizedPaymentMethods(lang),
    }),
    mapStrapiEntry: (raw: Record<string, unknown>, lang: TLang) => {
      const defaults = getLocalizedPaymentMethods(lang);
      return {
        paymentMethods: Array.isArray(raw.paymentMethods)
          ? (raw.paymentMethods as typeof defaults)
          : defaults,
      };
    },
  }),
  schema: z.object({
    documentId: z.string(),
    locale: langEnum,
    slug: z.string(),
    paymentMethods: z.array(
      z.object({
        providerName: z.string(),
        accountType: z.string(),
        accountNumber: z.string(),
        accountHolder: z.string(),
        nit: z.string(),
        instructions: z.string(),
      })
    ),
  }),
});

const contactPageCollection = defineCollection({
  loader: createStrapiSingleTypeLoader({
    contentType: "contact-page",
    fallbackByLocale: (lang: TLang) => {
      const { contactVisitData } = getLocalizedMocks(lang);
      return {
        visitorEtiquette: contactVisitData.visitorEtiquette,
        transitDirections: contactVisitData.transitDirections,
      };
    },
    mapStrapiEntry: (raw: Record<string, unknown>, lang: TLang) => {
      const defaults = getLocalizedMocks(lang).contactVisitData;
      return {
        visitorEtiquette: Array.isArray(raw.visitorEtiquette)
          ? (raw.visitorEtiquette as typeof defaults.visitorEtiquette)
          : defaults.visitorEtiquette,
        transitDirections: Array.isArray(raw.transitDirections)
          ? (raw.transitDirections as typeof defaults.transitDirections)
          : defaults.transitDirections,
      };
    },
  }),
  schema: z.object({
    documentId: z.string(),
    locale: langEnum,
    slug: z.string(),
    visitorEtiquette: z.array(
      z.object({
        icon: z.string(),
        title: z.string(),
        description: z.string(),
      })
    ),
    transitDirections: z.array(
      z.object({
        icon: z.string(),
        title: z.string(),
        description: z.string(),
      })
    ),
  }),
});

export const collections = {
  articles: articlesCollection,
  events: eventsCollection,
  faqs: faqsCollection,
  communityServices: communityServicesCollection,
  mediaHighlights: mediaHighlightsCollection,
  donationCampaigns: donationCampaignsCollection,
  leaders: leadersCollection,
  aboutPage: aboutPageCollection,
  globalSetting: globalSettingCollection,
  islamFaithPage: islamFaithPageCollection,
  donationsPage: donationsPageCollection,
  contactPage: contactPageCollection,
};
