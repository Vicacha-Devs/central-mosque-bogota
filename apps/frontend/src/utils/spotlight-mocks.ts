import type { TLang } from "@i18n/ui";

import type { TEventSpotlight } from "./models/events";

const SPOTLIGHT_EVENTS_BY_LANG: Record<TLang, Array<TEventSpotlight>> = {
  es: [
    {
      id: "evt-ytb-2026",
      tabLabel: "Becas YTB",
      category: "Educación • Becas",
      title: "Becas Türkiye Bursları (YTB) — Gobierno de Turquía",
      summary:
        "Convocatoria abierta en febrero para becas completas de pregrado, maestría y doctorado en Turquía (matrícula, alojamiento, estipendio mensual, seguro médico y tiquetes aéreos).",
      schedule: "10 Ene – 20 Feb • Convocatoria Anual",
      location: "Portal Oficial YTB & Orientación en Mezquita Central",
      poster: {
        url: "/images/events/ytb-scholarship-poster.svg",
        alt: "Afiche Oficial Becas Türkiye Bursları (YTB)",
        mime: "image/svg+xml",
        width: 800,
        height: 1120,
      },
      actionLinks: [
        {
          label: "Postular en Türkiye Bursları",
          url: "https://turkiyeburslari.gov.tr",
          variant: "primary",
          external: true,
          icon: "open_in_new",
        },
        {
          label: "Ver Programas y Eventos",
          url: "/es/events-and-programs",
          variant: "outline",
          external: false,
          icon: "event_note",
        },
      ],
      spotlightConfig: {
        enabled: true,
        badgeText: "Inscripciones Febrero",
        priority: 20,
        position: "bottom-end",
        showCountdown: true,
        startAt: "2026-01-10",
        endAt: "2026-02-20",
      },
    },
    {
      id: "evt-diyanet-2026",
      tabLabel: "Becas Diyanet (TDV)",
      category: "Estudios Islámicos • Becas",
      title: "Becas Fundación Diyanet (TDV) — Teología y Estudios Islámicos",
      summary:
        "Inscripciones abiertas todo febrero para becas integrales de bachillerato (Imam Hatip), licenciatura y posgrado en Teología y Ciencias Islámicas en Turquía.",
      schedule: "1 Feb – 28 Feb • Inscripciones Abiertas",
      location: "Portal TDV Diyanet & Aval en Mezquita Central",
      poster: {
        url: "/images/events/diyanet-scholarship-poster.svg",
        alt: "Afiche Oficial Becas Fundación Diyanet (TDV)",
        mime: "image/svg+xml",
        width: 800,
        height: 1120,
      },
      actionLinks: [
        {
          label: "Postular en Diyanet Bursları",
          url: "https://diyanetburslari.tdv.org",
          variant: "primary",
          external: true,
          icon: "open_in_new",
        },
        {
          label: "Solicitar Orientación / Aval",
          url: "/es/contact-and-visit",
          variant: "outline",
          external: false,
          icon: "school",
        },
      ],
      spotlightConfig: {
        enabled: true,
        badgeText: "Convocatoria TDV • Febrero",
        priority: 15,
        position: "bottom-end",
        showCountdown: true,
        startAt: "2026-02-01",
        endAt: "2026-02-28",
      },
    },
  ],
  en: [
    {
      id: "evt-ytb-2026",
      tabLabel: "YTB Scholarships",
      category: "Education • Scholarships",
      title: "Türkiye Bursları (YTB) — Turkish Government Scholarships",
      summary:
        "Applications open in February for full Bachelor’s, Master’s, and PhD scholarships in Türkiye covering tuition, accommodation, monthly stipend, health insurance, and flights.",
      schedule: "Jan 10 – Feb 20 • Annual Call",
      location: "Official YTB Portal & Central Mosque Guidance",
      poster: {
        url: "/images/events/ytb-scholarship-poster.svg",
        alt: "Official Türkiye Bursları (YTB) Scholarship Poster",
        mime: "image/svg+xml",
        width: 800,
        height: 1120,
      },
      actionLinks: [
        {
          label: "Apply on Türkiye Bursları",
          url: "https://turkiyeburslari.gov.tr",
          variant: "primary",
          external: true,
          icon: "open_in_new",
        },
        {
          label: "Explore Events & Programs",
          url: "/en/events-and-programs",
          variant: "outline",
          external: false,
          icon: "event_note",
        },
      ],
      spotlightConfig: {
        enabled: true,
        badgeText: "February Registrations",
        priority: 20,
        position: "bottom-end",
        showCountdown: true,
        startAt: "2026-01-10",
        endAt: "2026-02-20",
      },
    },
    {
      id: "evt-diyanet-2026",
      tabLabel: "Diyanet (TDV)",
      category: "Islamic Studies • Scholarships",
      title: "Diyanet Foundation (TDV) — Theology & Islamic Studies",
      summary:
        "February applications open for full international scholarships in Islamic Studies, Theology, and Imam Hatip programs across Türkiye.",
      schedule: "Feb 1 – Feb 28 • Open Registration",
      location: "TDV Diyanet Portal & Central Mosque Advisement",
      poster: {
        url: "/images/events/diyanet-scholarship-poster.svg",
        alt: "Official Diyanet Foundation (TDV) Scholarship Poster",
        mime: "image/svg+xml",
        width: 800,
        height: 1120,
      },
      actionLinks: [
        {
          label: "Apply on Diyanet Bursları",
          url: "https://diyanetburslari.tdv.org",
          variant: "primary",
          external: true,
          icon: "open_in_new",
        },
        {
          label: "Request Mosque Advisement",
          url: "/en/contact-and-visit",
          variant: "outline",
          external: false,
          icon: "school",
        },
      ],
      spotlightConfig: {
        enabled: true,
        badgeText: "TDV Call • February",
        priority: 15,
        position: "bottom-end",
        showCountdown: true,
        startAt: "2026-02-01",
        endAt: "2026-02-28",
      },
    },
  ],
  ar: [
    {
      id: "evt-ytb-2026",
      tabLabel: "منح تركيا YTB",
      category: "التعليم • منح دراسية",
      title: "منح الحكومة التركية (YTB Türkiye Bursları) — تسجيلات فبراير",
      summary:
        "التسجيل متاح خلال شهر فبراير للمنح الدراسية الكاملة لمرحلتي البكالوريوس والدراسات العليا في تركيا (الرسوم الجامعية، السكن، الراتب الشهري، التأمين الصحي وتذاكر الطيران).",
      schedule: "10 يناير – 20 فبراير • التسجيل السنوي",
      location: "البوابة الرسمية YTB ومكتب الإرشاد بالمسجد المركزي",
      poster: {
        url: "/images/events/ytb-scholarship-poster.svg",
        alt: "ملصق منح الحكومة التركية YTB",
        mime: "image/svg+xml",
        width: 800,
        height: 1120,
      },
      actionLinks: [
        {
          label: "التقديم عبر بوابة YTB",
          url: "https://turkiyeburslari.gov.tr",
          variant: "primary",
          external: true,
          icon: "open_in_new",
        },
        {
          label: "عرض الفعاليات والبرامج",
          url: "/ar/events-and-programs",
          variant: "outline",
          external: false,
          icon: "event_note",
        },
      ],
      spotlightConfig: {
        enabled: true,
        badgeText: "تسجيلات فبراير",
        priority: 20,
        position: "bottom-end",
        showCountdown: true,
        startAt: "2026-01-10",
        endAt: "2026-02-20",
      },
    },
    {
      id: "evt-diyanet-2026",
      tabLabel: "منح الديانة TDV",
      category: "الدراسات الإسلامية • منح",
      title: "منح وقف الديانة التركي (TDV Diyanet) — الإلهيات والعلوم الإسلامية",
      summary:
        "برنامج المنح الدولية الكاملة من وقف الديانة التركي (TDV) لدراسة العلوم الإسلامية والشريعة في الجامعات التركية طوال شهر فبراير.",
      schedule: "1 فبراير – 28 فبراير • التسجيل مفتوح",
      location: "بوابة وقف الديانة TDV والمسجد المركزي ببوغوتا",
      poster: {
        url: "/images/events/diyanet-scholarship-poster.svg",
        alt: "ملصق منح وقف الديانة التركي TDV",
        mime: "image/svg+xml",
        width: 800,
        height: 1120,
      },
      actionLinks: [
        {
          label: "التقديم عبر بوابة الديانة TDV",
          url: "https://diyanetburslari.tdv.org",
          variant: "primary",
          external: true,
          icon: "open_in_new",
        },
        {
          label: "طلب التزكية والإرشاد",
          url: "/ar/contact-and-visit",
          variant: "outline",
          external: false,
          icon: "school",
        },
      ],
      spotlightConfig: {
        enabled: true,
        badgeText: "منح الديانة • فبراير",
        priority: 15,
        position: "bottom-end",
        showCountdown: true,
        startAt: "2026-02-01",
        endAt: "2026-02-28",
      },
    },
  ],
  tr: [
    {
      id: "evt-ytb-2026",
      tabLabel: "YTB Bursları",
      category: "Eğitim • Burslar",
      title: "Türkiye Bursları (YTB) — Şubat Ayı Başvuruları",
      summary:
        "Lisans, yüksek lisans ve doktora düzeyinde tam kapsamlı Türkiye Bursları (YTB) başvuruları Şubat ayı boyunca açıktır (harç, yurt, aylık burs, sağlık sigortası ve uçak bileti).",
      schedule: "10 Ocak – 20 Şubat • Başvuru Dönemi",
      location: "YTB Resmi Portalı & Bogota Merkez Camii Rehberlik",
      poster: {
        url: "/images/events/ytb-scholarship-poster.svg",
        alt: "Türkiye Bursları (YTB) Resmi Afişi",
        mime: "image/svg+xml",
        width: 800,
        height: 1120,
      },
      actionLinks: [
        {
          label: "Türkiye Bursları Başvurusu",
          url: "https://turkiyeburslari.gov.tr",
          variant: "primary",
          external: true,
          icon: "open_in_new",
        },
        {
          label: "Etkinlik ve Programlar",
          url: "/tr/events-and-programs",
          variant: "outline",
          external: false,
          icon: "event_note",
        },
      ],
      spotlightConfig: {
        enabled: true,
        badgeText: "Şubat Başvuruları",
        priority: 20,
        position: "bottom-end",
        showCountdown: true,
        startAt: "2026-01-10",
        endAt: "2026-02-20",
      },
    },
    {
      id: "evt-diyanet-2026",
      tabLabel: "Diyanet (TDV)",
      category: "İslami İlimler • Burs",
      title: "TDV Diyanet Bursları — İlahiyat ve İslami İlimler",
      summary:
        "Türkiye Diyanet Vakfı (TDV) Uluslararası İmam Hatip ve İlahiyat Fakültesi tam burs başvuruları Şubat ayı boyunca devam etmektedir.",
      schedule: "1 Şubat – 28 Şubat • Başvurular Açık",
      location: "TDV Diyanet Portalı & Bogota Merkez Camii",
      poster: {
        url: "/images/events/diyanet-scholarship-poster.svg",
        alt: "TDV Diyanet Bursları Resmi Afişi",
        mime: "image/svg+xml",
        width: 800,
        height: 1120,
      },
      actionLinks: [
        {
          label: "Diyanet Bursları Başvurusu",
          url: "https://diyanetburslari.tdv.org",
          variant: "primary",
          external: true,
          icon: "open_in_new",
        },
        {
          label: "Cami Rehberlik ve Referans",
          url: "/tr/contact-and-visit",
          variant: "outline",
          external: false,
          icon: "school",
        },
      ],
      spotlightConfig: {
        enabled: true,
        badgeText: "TDV Bursları • Şubat",
        priority: 15,
        position: "bottom-end",
        showCountdown: true,
        startAt: "2026-02-01",
        endAt: "2026-02-28",
      },
    },
  ],
};

export function getEventSpotlights(lang: TLang): Array<TEventSpotlight> {
  return [...SPOTLIGHT_EVENTS_BY_LANG[lang]]
    .filter((item) => item.spotlightConfig.enabled)
    .sort((a, b) => {
      const pa = a.spotlightConfig.priority ?? 0;
      const pb = b.spotlightConfig.priority ?? 0;
      return pb - pa;
    });
}
