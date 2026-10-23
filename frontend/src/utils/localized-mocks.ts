import type { TLang } from "@i18n/ui";
import { useTranslations } from "@i18n/utils";

import { getDetailedArticles, type TDetailedArticle } from "./article-mocks";
import {
  contactInfo,
  contactVisitData,
  defaultServices,
  featuredDonation,
  socialNetworkLinks,
} from "./data.mocks";
import { getDetailedEvents, type TDetailedEvent } from "./event-mocks";
import {
  getLocalizedAboutPageData,
  getLocalizedDonationCampaigns,
  getLocalizedIslamFaithData,
  getLocalizedPaymentMethods,
} from "./institutional-mocks";
import {
  getDetailedMediaHighlights,
  type TDetailedMediaItem,
} from "./media-mocks";
import type { TCommunityService } from "./models/services";
import { getEventSpotlights } from "./spotlight-mocks";

export {
  getDetailedArticles,
  getDetailedEvents,
  getDetailedMediaHighlights,
  type TDetailedArticle,
  type TDetailedEvent,
  type TDetailedMediaItem,
};

type TNonDefaultLang = Exclude<TLang, "es">;

export type TDailyDua = {
  hijriBadge: string;
  title: string;
  subtitle: string;
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
  triggerLabel: string;
  copyLabel: string;
  copiedLabel: string;
};

const DAILY_DUA_BY_LANG: Record<TLang, TDailyDua> = {
  es: {
    hijriBadge: "Súplica Diaria (Dua)",
    title: "Dua del Día",
    subtitle: "Súplica profética por el perdón, la sabiduría y el bienestar",
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    transliteration: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni",
    translation:
      "«Oh Allah, ciertamente Tú eres Perdonador y amas el perdón, así que perdóname.»",
    source: "Sunan At-Tirmidhi 3513 • Enseñado por el Profeta Muhammad ﷺ",
    triggerLabel: "Dua del Día",
    copyLabel: "Copiar Dua",
    copiedLabel: "¡Copiado!",
  },
  en: {
    hijriBadge: "Daily Supplication (Dua)",
    title: "Dua of the Day",
    subtitle: "Prophetic supplication for forgiveness, mercy, and peace",
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    transliteration: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni",
    translation:
      "“O Allah, indeed You are Pardoning and love pardon, so pardon me.”",
    source: "Sunan At-Tirmidhi 3513 • Taught by Prophet Muhammad ﷺ",
    triggerLabel: "Dua of the Day",
    copyLabel: "Copy Dua",
    copiedLabel: "Copied!",
  },
  ar: {
    hijriBadge: "دعاء اليوم المأثور",
    title: "دعاء اليوم",
    subtitle: "من الأدعية النبوية الجامعة للعفو والعافية والرحمة",
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    transliteration: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni",
    translation:
      "«اللهم إنك عفو تحب العفو فاعف عني» — دعاء أوصى به النبي ﷺ لطلب المغفرة والرحمة.",
    source: "سنن الترمذي (3513) • حديث صحيح",
    triggerLabel: "دعاء اليوم",
    copyLabel: "نسخ الدعاء",
    copiedLabel: "تم النسخ!",
  },
  tr: {
    hijriBadge: "Günün Duası",
    title: "Günün Nebevî Duası",
    subtitle:
      "Af, mağfiret ve huzur için Peygamber Efendimizin ﷺ öğrettiği dua",
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    transliteration: "Allahümme inneke afüvvün tuhibbü'l-afve fa'fu annî",
    translation:
      "“Allah’ım! Şüphesiz Sen affedicisin, affetmeyi seversin, beni de affet.”",
    source: "Tirmizî, Daavât 84 (3513)",
    triggerLabel: "Günün Duası",
    copyLabel: "Duayı Kopyala",
    copiedLabel: "Kopyalandı!",
  },
};

const SERVICES_BY_LANG: Record<TNonDefaultLang, Array<TCommunityService>> = {
  en: [
    {
      icon: "menu_book",
      title: "Quranic Academy",
      description:
        "Arabic language, Tajweed, and Quran memorization classes for children and adults of all levels.",
    },
    {
      icon: "volunteer_activism",
      title: "Social Outreach & Zakat",
      description:
        "Food pantry distribution and humanitarian support for vulnerable families across Bogotá.",
    },
    {
      icon: "church",
      title: "Islamic Marriages (Nikah)",
      description:
        "Officiating Islamic marriage ceremonies and providing pre-marital and family counseling.",
    },
    {
      icon: "groups",
      title: "Youth & New Muslim Support",
      description:
        "Dedicated mentorship, educational circles, and recreational activities for youth and new Muslims.",
    },
  ],
  ar: [
    {
      icon: "menu_book",
      title: "المدرسة القرآنية",
      description:
        "حلقات تحفيظ القرآن الكريم وتعليم اللغة العربية للأطفال والكبار بمختلف المستويات.",
    },
    {
      icon: "volunteer_activism",
      title: "التكافل الاجتماعي والزكاة",
      description:
        "برامج توزيع السلال الغذائية ودعم الأسر المتعففة والمحتاجين في مدينة بوغوتا.",
    },
    {
      icon: "church",
      title: "عقود الزواج الشرعي (النكاح)",
      description:
        "توثيق عقود الزواج الإسلامي وتقديم الإرشاد الأسري للمقبلين على الزواج.",
    },
    {
      icon: "groups",
      title: "رعاية الشباب والمسلمين الجدد",
      description:
        "أنشطة تربوية ولقاءات دورية لدعم الشباب ومرافقة المسلمين الجدد علمياً وروحياً.",
    },
  ],
  tr: [
    {
      icon: "menu_book",
      title: "Kur'an Akademisi",
      description:
        "Her seviyeden çocuk ve yetişkinler için Arapça, tecvid ve Kur'an-ı Kerim ezber dersleri.",
    },
    {
      icon: "volunteer_activism",
      title: "Sosyal Yardım ve Zekât",
      description:
        "Bogota'daki ihtiyaç sahibi ailelere gıda kolisi dağıtımı ve insani yardım programları.",
    },
    {
      icon: "church",
      title: "İslami Nikâh Hizmetleri",
      description:
        "Dini nikâh merasimlerinin icrası ve çiftlere yönelik aile danışmanlığı.",
    },
    {
      icon: "groups",
      title: "Gençlik ve Yeni Müslümanlar",
      description:
        "Gençler ve yeni Müslümanlar için rehberlik, eğitim halkaları ve sosyal etkinlikler.",
    },
  ],
};

const FEATURED_DONATION_COPY_BY_LANG: Record<
  TNonDefaultLang,
  Pick<typeof featuredDonation, "title" | "description" | "goal" | "raised">
> = {
  en: {
    title: "Prayer Hall & Audio System Renovation",
    description:
      "Your generosity keeps the Central Mosque shining in Bogotá. Every contribution supports our daily prayers, educational programs, and social outreach.",
    goal: "$100,000,000 COP",
    raised: "$75,000,000 COP",
  },
  ar: {
    title: "تأهيل مصلى المسجد والنظام الصوتي",
    description:
      "مساهمتكم الكريمة تدعم استمرار رسالة المسجد المركزي في بوغوتا، وتعين على صيانة بيت الله واستمرار البرامج التعليمية والاجتماعية.",
    goal: "100,000,000 بيزو كولومبي",
    raised: "75,000,000 بيزو كولومبي",
  },
  tr: {
    title: "Namaz Salonu ve Ses Sistemi Yenilemesi",
    description:
      "Cömertliğiniz Bogota Merkez Camii'nin hizmetlerini sürdürmesini sağlar. Her katkınız cami bakımına ve eğitim programlarımıza destek olur.",
    goal: "$100.000.000 COP",
    raised: "$75.000.000 COP",
  },
};

const CONTACT_VISIT_BY_LANG: Record<TNonDefaultLang, typeof contactVisitData> =
  {
    en: {
      visitorEtiquette: [
        {
          icon: "checkroom",
          title: "Modest Attire",
          description:
            "Wear loose clothing covering arms and legs. Women cover their hair inside the prayer hall (headscarves are available at the entrance).",
        },
        {
          icon: "do_not_step",
          title: "Remove Footwear",
          description:
            "Before stepping onto the carpeted prayer hall, place your shoes on the racks provided at the entrance.",
        },
        {
          icon: "volume_off",
          title: "Quiet & Respect",
          description:
            "Keep mobile phones on silent and speak softly, especially while worshippers are performing prayer.",
        },
        {
          icon: "photo_camera",
          title: "Respectful Photography",
          description:
            "Feel free to photograph the architecture, while avoiding photographing worshippers without their consent.",
        },
      ],
      transitDirections: [
        {
          icon: "directions_bus",
          title: "By TransMilenio (Calle 80 / NQS Line)",
          description:
            "Alight at Escuela Militar or Polo station (Calle 80 line). The mosque stands directly at the corner of Calle 80 and Carrera 30.",
        },
        {
          icon: "directions_car",
          title: "By Private Vehicle",
          description:
            "Direct access via Avenida Calle 80 westbound or Avenida NQS (Carrera 30). We recommend arriving early on Fridays for Jumu'ah.",
        },
      ],
    },
    ar: {
      visitorEtiquette: [
        {
          icon: "checkroom",
          title: "اللباس المحتشم",
          description:
            "يرجى ارتداء ملابس فضفاضة تغطي الذراعين والساقين، وتغطية الرأس للنساء داخل المصلى (تتوفر أغطية رأس عند المدخل).",
        },
        {
          icon: "do_not_step",
          title: "خلع الأحذية",
          description:
            "قبل الدخول إلى قاعة الصلاة المفروشة بالسجاد، يرجى وضع الأحذية في الرفوف المخصصة عند المدخل.",
        },
        {
          icon: "volume_off",
          title: "الهدوء والسكينة",
          description:
            "يرجى وضع الهاتف على الوضع الصامت وخفض الصوت، لا سيما أثناء إقامة الصلوات.",
        },
        {
          icon: "photo_camera",
          title: "التصوير باحترام",
          description:
            "يمكنكم تصوير المعالم المعمارية للمسجد مع تجنب تصوير المصلين بشكل مباشر دون استئذان.",
        },
      ],
      transitDirections: [
        {
          icon: "directions_bus",
          title: "عبر حافلات ترانس ميلينيو (شارع 80 / NQS)",
          description:
            "انزل في محطة Escuela Militar أو Polo على خط شارع 80. يقع المسجد مباشرة عند تقاطع شارع 80 مع طريق 30.",
        },
        {
          icon: "directions_car",
          title: "بالسيارة الخاصة",
          description:
            "وصول مباشر عبر شارع 80 أو طريق NQS (Carrera 30). ننصح بالحضور مبكراً يوم الجمعة لصلاة الجمعة.",
        },
      ],
    },
    tr: {
      visitorEtiquette: [
        {
          icon: "checkroom",
          title: "Mütevazı Kıyafet",
          description:
            "Kolları ve bacakları örten bol kıyafetler tercih edin. Kadın ziyaretçilerimiz namaz salonunda başörtüsü takar (girişte başörtüsü temin edilmektedir).",
        },
        {
          icon: "do_not_step",
          title: "Ayakkabıların Çıkarılması",
          description:
            "Halı kaplı namaz alanına girmeden önce ayakkabılarınızı girişteki raflara yerleştirin.",
        },
        {
          icon: "volume_off",
          title: "Sessizlik ve Saygı",
          description:
            "Özellikle cemaat namaz kılarken cep telefonunuzu sessize alın ve alçak sesle konuşun.",
        },
        {
          icon: "photo_camera",
          title: "Saygılı Fotoğraf Çekimi",
          description:
            "Caminin mimarisini fotoğraflayabilirsiniz; ancak ibadet eden kişileri izinsiz fotoğraflamaktan kaçının.",
        },
      ],
      transitDirections: [
        {
          icon: "directions_bus",
          title: "TransMilenio ile (Calle 80 / NQS Hattı)",
          description:
            "Escuela Militar veya Polo istasyonunda inin. Cami, Calle 80 ile Carrera 30 köşesinde yer almaktadır.",
        },
        {
          icon: "directions_car",
          title: "Özel Araç ile",
          description:
            "Avenida Calle 80 veya Avenida NQS (Carrera 30) üzerinden doğrudan ulaşım. Cuma namazı için erken gelmeniz tavsiye edilir.",
        },
      ],
    },
  };

export function getLocalizedServices(lang: TLang): Array<TCommunityService> {
  if (lang === "es") return defaultServices;
  return SERVICES_BY_LANG[lang];
}

export function getLocalizedMocks(lang: TLang) {
  const t = useTranslations(lang);
  const detailedEvents = getDetailedEvents(lang);
  const detailedArticles = getDetailedArticles(lang);
  const detailedMedia = getDetailedMediaHighlights(lang);
  const services = getLocalizedServices(lang);

  const localizedFeaturedDonation =
    lang === "es"
      ? {
          ...featuredDonation,
          ctaHref: `/${lang}/donate`,
        }
      : {
          ...featuredDonation,
          ...FEATURED_DONATION_COPY_BY_LANG[lang],
          ctaHref: `/${lang}/donate`,
        };

  const localizedContactVisit =
    lang === "es" ? contactVisitData : CONTACT_VISIT_BY_LANG[lang];

  return {
    lang,
    dir: lang === "ar" ? ("rtl" as const) : ("ltr" as const),
    lemma: t("footer.lemma"),
    heroPhrase: t("home.hero-phrase"),
    contactInfo,
    navLinks: [
      { label: t("nav.about-us"), href: "/about-us" },
      { label: t("nav.islam"), href: "/islam-and-faith" },
      { label: t("nav.prayer"), href: "/prayer-information" },
      { label: t("nav.events"), href: "/events-and-programs" },
      { label: t("nav.services"), href: "/community-services" },
      { label: t("nav.media"), href: "/media" },
      { label: t("nav.contact"), href: "/contact-and-visit" },
    ],
    fastLinks: [
      { label: t("footer.fast-link.prayer"), href: "/prayer-information" },
      { label: t("footer.fast-link.donate"), href: "/donate" },
      { label: t("footer.fast-link.academy"), href: "/islam-and-faith" },
      { label: t("footer.fast-link.media"), href: "/media" },
      { label: t("footer.fast-link.search"), href: "/search" },
    ],
    socialNetworkLinks,
    rightsText: {
      copyRight: t("footer.copyright"),
      privacyPolicy: {
        label: t("footer.privacy-policy"),
        href: "/contact-and-visit",
      },
      termsAndConditions: {
        label: t("footer.terms"),
        href: "/contact-and-visit",
      },
    },
    events: detailedEvents,
    defaultServices: services,
    academyCourses: detailedArticles,
    mediaHighlights: detailedMedia,
    featuredDonation: localizedFeaturedDonation,
    donationCampaigns: getLocalizedDonationCampaigns(lang),
    paymentMethods: getLocalizedPaymentMethods(lang),
    aboutPageData: getLocalizedAboutPageData(lang),
    islamFaithData: getLocalizedIslamFaithData(lang),
    contactVisitData: localizedContactVisit,
    dailyDua: DAILY_DUA_BY_LANG[lang],
    eventSpotlights: getEventSpotlights(lang),
  };
}
