import type { TLang } from "@i18n/ui";
import { useTranslations } from "@i18n/utils";

export type TAlertBannerItem = {
  code: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "urgent" | "celebration";
  ctaLabel?: string;
  ctaUrl?: string;
  dismissible: boolean;
  secondaryDateLabel?: string;
};

export type TPublicChannelItem = {
  id: string;
  channel: "telegram" | "whatsapp" | "email";
  label: string;
  handle: string;
  inviteUrl: string;
  localizedLabels?: Record<string, string>;
  localizedDescriptions?: Record<string, string>;
};

export type TArchiveBroadcastItem = {
  slug: string;
  title: string;
  topic: string;
  subject: string;
  bodyText: string;
  ctaLabel?: string;
  ctaUrl?: string;
  secondaryDateLabel?: string;
  translations?: Record<
    string,
    {
      subject?: string;
      bodyText?: string;
      ctaLabel?: string;
      ctaUrl?: string;
    }
  >;
};

export type TBroadcastChannelsCopy = {
  badge: string;
  title: string;
  subtitle: string;
  channelsHeading: string;
  joinBtn: string;
  archiveHeading: string;
  subscribeHeading: string;
  subscribeDesc: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  submitBtn: string;
  successMsg: string;
  topics: Record<string, string>;
};

export type TServiceDeskCopy = {
  badge: string;
  title: string;
  subtitle: string;
  serviceTypeLabel: string;
  services: Array<{ value: string; label: string }>;
  checklistTitle: string;
  checklists: Record<string, Array<string>>;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  dateLabel: string;
  detailsLabel: string;
  submitLabel: string;
  sendingText: string;
  successPrefix: string;
  errorText: string;
};

export function getUrgentAlertFallback(lang: TLang): TAlertBannerItem {
  const byLocale: Record<TLang, TAlertBannerItem> = {
    es: {
      code: "jumuah-khutbah-notice",
      title: "Oración del Viernes (Jumu'ah) y Servicios Comunitarios",
      message:
        "Khutbah bilingüe (Árabe / Español) todos los viernes a las 12:15 PM • Oración 12:45 PM.",
      severity: "celebration",
      ctaLabel: "Agendar Servicio o Visita",
      ctaUrl: `/${lang}/community-services`,
      dismissible: true,
      secondaryDateLabel: "Calendario Hijri Umm al-Qura",
    },
    en: {
      code: "jumuah-khutbah-notice",
      title: "Friday Jumu'ah Prayer & Community Services",
      message:
        "Bilingual Khutbah (Arabic / Spanish) every Friday at 12:15 PM • Congregational Prayer at 12:45 PM.",
      severity: "celebration",
      ctaLabel: "Request a Service",
      ctaUrl: `/${lang}/community-services`,
      dismissible: true,
      secondaryDateLabel: "Hijri Umm al-Qura Calendar",
    },
    ar: {
      code: "jumuah-khutbah-notice",
      title: "خطبة وصلاة الجمعة والخدمات المجتمعية",
      message:
        "تبدأ خطبة الجمعة (بالعربية والإسبانية) الساعة 12:15 ظهراً وتقام الصلاة الساعة 12:45 ظهراً.",
      severity: "celebration",
      ctaLabel: "طلب خدمة رسمية",
      ctaUrl: `/${lang}/community-services`,
      dismissible: true,
      secondaryDateLabel: "تقويم أم القرى الهجري",
    },
    tr: {
      code: "jumuah-khutbah-notice",
      title: "Cuma Hutbesi, Namazı ve Toplumsal Hizmetler",
      message:
        "Cuma hutbesi (Arapça / İspanyolca) her Cuma 12:15'te, Cuma namazı 12:45'te kılınmaktadır.",
      severity: "celebration",
      ctaLabel: "Hizmet Başvurusu",
      ctaUrl: `/${lang}/community-services`,
      dismissible: true,
      secondaryDateLabel: "Hicri Ümmü'l-Kura Takvimi",
    },
  };

  return byLocale[lang];
}

export function getBroadcastChannelsCopy(lang: TLang): TBroadcastChannelsCopy {
  const t = useTranslations(lang);
  return {
    badge: t("broadcast-channels.badge"),
    title: t("broadcast-channels.title"),
    subtitle: t("broadcast-channels.subtitle"),
    channelsHeading: t("broadcast-channels.channelsHeading"),
    joinBtn: t("broadcast-channels.joinBtn"),
    archiveHeading: t("broadcast-channels.archiveHeading"),
    subscribeHeading: t("broadcast-channels.subscribeHeading"),
    subscribeDesc: t("broadcast-channels.subscribeDesc"),
    emailPlaceholder: t("broadcast-channels.emailPlaceholder"),
    phonePlaceholder: t("broadcast-channels.phonePlaceholder"),
    submitBtn: t("broadcast-channels.submitBtn"),
    successMsg: t("broadcast-channels.successMsg"),
    topics: {
      announcements: t("broadcast-channels.topic.announcements"),
      ramadan_eid: t("broadcast-channels.topic.ramadan_eid"),
      urgent_janazah: t("broadcast-channels.topic.urgent_janazah"),
      events: t("broadcast-channels.topic.events"),
      courses: t("broadcast-channels.topic.courses"),
    },
  };
}

export const FALLBACK_BROADCAST_CHANNELS: Array<TPublicChannelItem> = [
  {
    id: "telegram-main",
    channel: "telegram",
    label: "Canal Oficial de Telegram",
    handle: "@MezquitaCentralBogota",
    inviteUrl: "https://t.me/MezquitaCentralBogota",
    localizedLabels: {
      es: "Canal Oficial de Telegram",
      en: "Official Telegram Channel",
      ar: "القناة الرسمية على تيليجرام",
      tr: "Resmi Telegram Kanalı",
    },
    localizedDescriptions: {
      es: "Horarios de Jumu'ah, avistamiento lunar de Ramadán y Eid, cursos y avisos urgentes.",
      en: "Jumu'ah schedules, Ramadan & Eid moon sighting, courses, and urgent community notices.",
      ar: "مواعيد صلاة الجمعة، تحري هلال رمضان والعيد، الدورات والإعلانات العاجلة.",
      tr: "Cuma vakitleri, Ramazan ve Bayram hilal gözlemi, kurslar ve acil duyurular.",
    },
  },
  {
    id: "whatsapp-community",
    channel: "whatsapp",
    label: "Comunidad Oficial de WhatsApp",
    handle: "+57 310 555-0199",
    inviteUrl: "https://whatsapp.com/channel/0029VaMezquitaBogota",
    localizedLabels: {
      es: "Comunidad Oficial de WhatsApp",
      en: "Official WhatsApp Community",
      ar: "مجتمع واتساب الرسمي",
      tr: "Resmi WhatsApp Topluluğu",
    },
    localizedDescriptions: {
      es: "Alertas directas de oración funeraria (Janazah), eventos comunitarios y boletín semanal.",
      en: "Direct Janazah funeral prayer alerts, community events, and weekly newsletter.",
      ar: "تنبيهات صلاة الجنازة العاجلة، الفعاليات المجتمعية والنشرة الأسبوعية.",
      tr: "Acil cenaze namazı duyuruları, topluluk etkinlikleri ve haftalık bülten.",
    },
  },
];

export const FALLBACK_BROADCAST_ARCHIVE: Array<TArchiveBroadcastItem> = [
  {
    slug: "jumuah-weekly-reminder",
    title: "Jumu'ah Weekly Reminder",
    topic: "announcements",
    subject: "🕌 Jumu'ah — Mezquita Central Abu Bakr As-Siddiq",
    bodyText:
      "Khutbah bilingüe (12:15 PM) y oración congregacional de Jumu'ah (12:45 PM).",
    secondaryDateLabel: "Umm al-Qura 1447 AH",
    translations: {
      es: {
        subject: "🕌 Jumu'ah en Mezquita Central Abu Bakr As-Siddiq",
        bodyText:
          "Te esperamos este viernes para la Khutbah (12:15 PM) y oración congregacional de Jumu'ah (12:45 PM).",
      },
      en: {
        subject: "🕌 Friday Jumu'ah Reminder — Abu Bakr As-Siddiq Mosque",
        bodyText:
          "Join us this Friday for the Jumu'ah Khutbah (12:15 PM) and congregational prayer (12:45 PM).",
      },
      ar: {
        subject: "🕌 تذكير صلاة وخطبة الجمعة — مسجد أبو بكر الصديق",
        bodyText:
          "ندعوكم لحضور خطبة الجمعة (12:15 ظهراً) وصلاة الجمعة (12:45 ظهراً).",
      },
      tr: {
        subject: "🕌 Cuma Hutbesi ve Namazı — Ebû Bekir Es-Sıddîk Camii",
        bodyText:
          "Bu Cuma hutbe (12:15) ve Cuma namazı (12:45) için camiimize davetlisiniz.",
      },
    },
  },
  {
    slug: "ramadan-eid-moon-sighting",
    title: "Ramadan & Eid Moon-Sighting Statement",
    topic: "ramadan_eid",
    subject: "🌙 Comunicado Oficial de Avistamiento Lunar",
    bodyText:
      "Programación oficial de Iftar comunitario, Tarawih y Salat al-Eid.",
    secondaryDateLabel: "Ramadán 1447 AH",
    translations: {
      es: {
        subject: "🌙 Comunicado Oficial de Avistamiento Lunar y Programación",
        bodyText:
          "La Junta Directiva e Imamate anuncian la programación especial de Iftar comunitario, Tarawih y Salat al-Eid.",
      },
      en: {
        subject: "🌙 Official Moon-Sighting & Ramadan Schedule Statement",
        bodyText:
          "The Board and Imamate announce the official community Iftar, Tarawih, and Salat al-Eid schedule.",
      },
      ar: {
        subject: "🌙 بيان رسمي بشأن تحري الهلال وجدول رمضان والعيد",
        bodyText:
          "يعلن مجلس الإدارة والإمامة عن جدول الإفطار الجماعي وصلاة التراويح وصلاة العيد.",
      },
      tr: {
        subject: "🌙 Resmi Hilal Gözlemi ve Ramazan/Bayram Programı",
        bodyText:
          "Yönetim Kurulu ve İmamlık toplu iftar, teravih ve bayram namazı programını duyurur.",
      },
    },
  },
];

export function getServiceDeskCopy(lang: TLang): TServiceDeskCopy {
  const t = useTranslations(lang);
  return {
    badge: t("service-desk.badge"),
    title: t("service-desk.title"),
    subtitle: t("service-desk.subtitle"),
    serviceTypeLabel: t("service-desk.serviceTypeLabel"),
    services: [
      { value: "nikah", label: t("service-desk.service.nikah") },
      { value: "shahada", label: t("service-desk.service.shahada") },
      {
        value: "consular_hajj",
        label: t("service-desk.service.consular_hajj"),
      },
      { value: "halal", label: t("service-desk.service.halal") },
      { value: "janazah", label: t("service-desk.service.janazah") },
    ],
    checklistTitle: t("service-desk.checklistTitle"),
    checklists: {
      nikah: [
        t("service-desk.checklist.nikah.1"),
        t("service-desk.checklist.nikah.2"),
        t("service-desk.checklist.nikah.3"),
      ],
      shahada: [
        t("service-desk.checklist.shahada.1"),
        t("service-desk.checklist.shahada.2"),
      ],
      consular_hajj: [
        t("service-desk.checklist.consular_hajj.1"),
        t("service-desk.checklist.consular_hajj.2"),
      ],
      halal: [
        t("service-desk.checklist.halal.1"),
        t("service-desk.checklist.halal.2"),
      ],
      janazah: [
        t("service-desk.checklist.janazah.1"),
        t("service-desk.checklist.janazah.2"),
      ],
    },
    nameLabel: t("service-desk.nameLabel"),
    emailLabel: t("service-desk.emailLabel"),
    phoneLabel: t("service-desk.phoneLabel"),
    dateLabel: t("service-desk.dateLabel"),
    detailsLabel: t("service-desk.detailsLabel"),
    submitLabel: t("service-desk.submitLabel"),
    sendingText: t("service-desk.sendingText"),
    successPrefix: t("service-desk.successPrefix"),
    errorText: t("service-desk.errorText"),
  };
}
