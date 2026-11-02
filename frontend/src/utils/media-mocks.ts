import type { TLang } from "@i18n/ui";

import { mediaHighlights } from "./data.mocks";
import type { TDetailedMediaItem } from "./models/media";

export type { TDetailedMediaItem };

type TMediaList = Array<TDetailedMediaItem>;

export function getDetailedMediaHighlights(lang: TLang): TMediaList {
  const images = [
    mediaHighlights[0].imageUrl,
    mediaHighlights[1].imageUrl,
    mediaHighlights[2].imageUrl,
  ];

  const byLang: Record<
    TLang,
    Array<Omit<TDetailedMediaItem, "href" | "imageUrl">>
  > = {
    es: [
      {
        slug: "importancia-leer-sagrado-coran",
        type: "khutbah",
        typeLabel: "Khutbah del Viernes",
        provider: "youtube",
        providerLabel: "YouTube",
        externalId: "M7lc1UVf-VE",
        embedUrl: "https://www.youtube-nocookie.com/embed/M7lc1UVf-VE",
        watchUrl: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
        title: "La importancia de reflexionar en el Sagrado Corán",
        description:
          "Khutbah de Jumu'ah sobre cómo la lectura diaria y la reflexión (Tadabbur) del Corán transforman el corazón y el hogar.",
        speakerName: "Sheikh Ahmad Al-Mansoor",
        duration: "32 min",
        publishedDate: "2026-10-10",
        hijriDate: "25 Sha’ban 1447 AH",
        spokenLanguages: ["ar", "es", "en", "tr"],
        languageTracks: [
          {
            locale: "es",
            label: "Español",
            transcriptUrl: "/media/transcripts/khutbah-es.pdf",
          },
          {
            locale: "en",
            label: "English",
            transcriptUrl: "/media/transcripts/khutbah-en.pdf",
          },
          {
            locale: "ar",
            label: "العربية",
            transcriptUrl: "/media/transcripts/khutbah-ar.pdf",
          },
          {
            locale: "tr",
            label: "Türkçe",
            transcriptUrl: "/media/transcripts/khutbah-tr.pdf",
          },
        ],
        imageAlt: "Khutbah sobre el Sagrado Corán",
      },
      {
        slug: "valor-cinco-oraciones-diarias",
        type: "podcast",
        typeLabel: "Podcast Espiritual",
        provider: "spotify",
        providerLabel: "Spotify / RSS",
        externalId: "4rOoJ6Egrf8K2IrywzwOMk",
        embedUrl:
          "https://open.spotify.com/embed/episode/4rOoJ6Egrf8K2IrywzwOMk",
        watchUrl: "https://open.spotify.com/episode/4rOoJ6Egrf8K2IrywzwOMk",
        title: "El Valor de las 5 Oraciones Diarias en la Vida Moderna",
        description:
          "Consejos prácticos para preservar la concentración (Khushu) y organizar la jornada laboral en torno al Salah.",
        speakerName: "Ustadh Tariq Ramírez",
        duration: "24 min",
        publishedDate: "2026-10-03",
        hijriDate: "18 Sha’ban 1447 AH",
        spokenLanguages: ["es", "en", "ar", "tr"],
        imageAlt: "Podcast sobre la Oración",
      },
      {
        slug: "virtud-buscar-conocimiento",
        type: "video",
        typeLabel: "Conferencia en Video",
        provider: "youtube",
        providerLabel: "YouTube",
        externalId: "aqz-KE-bpKQ",
        embedUrl: "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ",
        watchUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
        title: "La Virtud de Buscar el Conocimiento y Servir a la Comunidad",
        description:
          "Conferencia especial sobre la ética del estudiante en el Islam y la solidaridad social en Bogotá.",
        speakerName: "Dra. Amina Gómez",
        duration: "41 min",
        publishedDate: "2026-09-26",
        hijriDate: "11 Sha’ban 1447 AH",
        spokenLanguages: ["es", "en", "ar", "tr"],
        imageAlt: "Conferencia sobre el Conocimiento",
      },
    ],
    en: [
      {
        slug: "importancia-leer-sagrado-coran",
        type: "khutbah",
        typeLabel: "Friday Khutbah",
        provider: "youtube",
        providerLabel: "YouTube",
        externalId: "M7lc1UVf-VE",
        embedUrl: "https://www.youtube-nocookie.com/embed/M7lc1UVf-VE",
        watchUrl: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
        title: "The Importance of Reflecting on the Holy Quran",
        description:
          "Jumu'ah sermon on how daily recitation and contemplation (Tadabbur) of the Quran bring peace to the heart and family.",
        speakerName: "Sheikh Ahmad Al-Mansoor",
        duration: "32 min",
        publishedDate: "2026-10-10",
        hijriDate: "25 Sha’ban 1447 AH",
        spokenLanguages: ["ar", "es", "en", "tr"],
        imageAlt: "Khutbah on the Holy Quran",
      },
      {
        slug: "valor-cinco-oraciones-diarias",
        type: "podcast",
        typeLabel: "Spiritual Podcast",
        provider: "spotify",
        providerLabel: "Spotify / RSS",
        externalId: "4rOoJ6Egrf8K2IrywzwOMk",
        embedUrl:
          "https://open.spotify.com/embed/episode/4rOoJ6Egrf8K2IrywzwOMk",
        watchUrl: "https://open.spotify.com/episode/4rOoJ6Egrf8K2IrywzwOMk",
        title: "The Value of the 5 Daily Prayers in Modern Life",
        description:
          "Practical reflections on cultivating mindfulness (Khushu) and structuring your workday around Salah.",
        speakerName: "Ustadh Tariq Ramírez",
        duration: "24 min",
        publishedDate: "2026-10-03",
        hijriDate: "18 Sha’ban 1447 AH",
        spokenLanguages: ["es", "en", "ar", "tr"],
        imageAlt: "Podcast on Daily Prayer",
      },
      {
        slug: "virtud-buscar-conocimiento",
        type: "video",
        typeLabel: "Video Lecture",
        provider: "youtube",
        providerLabel: "YouTube",
        externalId: "aqz-KE-bpKQ",
        embedUrl: "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ",
        watchUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
        title: "The Virtue of Seeking Knowledge & Serving Humanity",
        description:
          "Special lecture on the ethics of seeking sacred and beneficial knowledge and supporting community welfare.",
        speakerName: "Dr. Amina Gómez",
        duration: "41 min",
        publishedDate: "2026-09-26",
        hijriDate: "11 Sha’ban 1447 AH",
        spokenLanguages: ["es", "en", "ar", "tr"],
        imageAlt: "Video Lecture on Knowledge",
      },
    ],
    ar: [
      {
        slug: "importancia-leer-sagrado-coran",
        type: "khutbah",
        typeLabel: "خطبة الجمعة",
        provider: "youtube",
        providerLabel: "YouTube",
        externalId: "M7lc1UVf-VE",
        embedUrl: "https://www.youtube-nocookie.com/embed/M7lc1UVf-VE",
        watchUrl: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
        title: "أهمية تلاوة القرآن الكريم وتدبر آياته",
        description:
          "خطبة جمعة حول أثر الورد اليومي من القرآن الكريم والتدبر في صلاح القلوب والبيوت.",
        speakerName: "الشيخ أحمد المنصور",
        duration: "32 دقيقة",
        publishedDate: "2026-10-10",
        hijriDate: "25 شعبان 1447 هـ",
        spokenLanguages: ["ar", "es", "en", "tr"],
        imageAlt: "خطبة عن القرآن الكريم",
      },
      {
        slug: "valor-cinco-oraciones-diarias",
        type: "podcast",
        typeLabel: "بودكاست إيماني",
        provider: "spotify",
        providerLabel: "Spotify / RSS",
        externalId: "4rOoJ6Egrf8K2IrywzwOMk",
        embedUrl:
          "https://open.spotify.com/embed/episode/4rOoJ6Egrf8K2IrywzwOMk",
        watchUrl: "https://open.spotify.com/episode/4rOoJ6Egrf8K2IrywzwOMk",
        title: "مكانة الصلوات الخمس وأثرها في السكينة اليومية",
        description:
          "توجيهات عملية لتحقيق الخشوع في الصلاة والمحافظة على أوقاتها في ظل انشغالات الحياة المعاصرة.",
        speakerName: "الأستاذ طارق راميريز",
        duration: "24 دقيقة",
        publishedDate: "2026-10-03",
        hijriDate: "18 شعبان 1447 هـ",
        spokenLanguages: ["es", "en", "ar", "tr"],
        imageAlt: "بودكاست عن الصلاة",
      },
      {
        slug: "virtud-buscar-conocimiento",
        type: "video",
        typeLabel: "محاضرة مرئية",
        provider: "youtube",
        providerLabel: "YouTube",
        externalId: "aqz-KE-bpKQ",
        embedUrl: "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ",
        watchUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
        title: "فضل طلب العلم النافع وخدمة المجتمع",
        description:
          "محاضرة خاصة حول آداب طالب العلم في الإسلام وأهمية العمل التطوعي والتكافل الاجتماعي.",
        speakerName: "د. أمينة غوميز",
        duration: "41 دقيقة",
        publishedDate: "2026-09-26",
        hijriDate: "11 شعبان 1447 هـ",
        spokenLanguages: ["es", "en", "ar", "tr"],
        imageAlt: "محاضرة عن طلب العلم",
      },
    ],
    tr: [
      {
        slug: "importancia-leer-sagrado-coran",
        type: "khutbah",
        typeLabel: "Cuma Hutbesi",
        provider: "youtube",
        providerLabel: "YouTube",
        externalId: "M7lc1UVf-VE",
        embedUrl: "https://www.youtube-nocookie.com/embed/M7lc1UVf-VE",
        watchUrl: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
        title: "Kur'an-ı Kerim'i Okumanın ve Tefekkür Etmenin Önemi",
        description:
          "Kur'an-ı Kerim ile günlük bağ kurmanın kalplere ve aile hayatına kazandırdığı huzur üzerine Cuma hutbesi.",
        speakerName: "Şeyh Ahmed El-Mansur",
        duration: "32 dk",
        publishedDate: "2026-10-10",
        hijriDate: "25 Şaban 1447 H.",
        spokenLanguages: ["ar", "es", "en", "tr"],
        imageAlt: "Kur'an-ı Kerim Hutbesi",
      },
      {
        slug: "valor-cinco-oraciones-diarias",
        type: "podcast",
        typeLabel: "Manevi Podcast",
        provider: "spotify",
        providerLabel: "Spotify / RSS",
        externalId: "4rOoJ6Egrf8K2IrywzwOMk",
        embedUrl:
          "https://open.spotify.com/embed/episode/4rOoJ6Egrf8K2IrywzwOMk",
        watchUrl: "https://open.spotify.com/episode/4rOoJ6Egrf8K2IrywzwOMk",
        title: "Modern Hayatta 5 Vakit Namazın Değeri ve Huşu",
        description:
          "Günlük iş temposu içinde namaz vakitlerini korumak ve huşuyu yakalamak için pratik tavsiyeler.",
        speakerName: "Üstad Tarık Ramírez",
        duration: "24 dk",
        publishedDate: "2026-10-03",
        hijriDate: "18 Şaban 1447 H.",
        spokenLanguages: ["es", "en", "ar", "tr"],
        imageAlt: "Namaz Podcasti",
      },
      {
        slug: "virtud-buscar-conocimiento",
        type: "video",
        typeLabel: "Video Konferans",
        provider: "youtube",
        providerLabel: "YouTube",
        externalId: "aqz-KE-bpKQ",
        embedUrl: "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ",
        watchUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
        title: "İlim Öğrenmenin Fazileti ve Topluma Hizmet",
        description:
          "İslam'da faydalı ilim talebi ve Bogota'daki sosyal yardımlaşma çalışmaları üzerine özel konferans.",
        speakerName: "Dr. Amina Gómez",
        duration: "41 dk",
        publishedDate: "2026-09-26",
        hijriDate: "11 Şaban 1447 H.",
        spokenLanguages: ["es", "en", "ar", "tr"],
        imageAlt: "İlim Konferansı",
      },
    ],
  };

  return byLang[lang].map((item, idx) => ({
    ...item,
    imageUrl: images[idx] ?? images[0],
    href: `/${lang}/media#${item.slug}`,
  }));
}
