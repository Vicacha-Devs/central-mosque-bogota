import type { TLang } from "@i18n/ui";

import { academyCourses } from "./data.mocks";

export type TDetailedArticle = {
  slug: string;
  badgeLabel: string;
  badgeTone: "primary" | "secondary";
  title: string;
  description: string;
  href: string;
  ctaIcon: string;
  imageAlt: string;
  imageUrl: string;
  authorName: string;
  readingTimeMinutes: number;
  instructorRole: string;
  scheduleLabel: string;
  contentParagraphs: Array<string>;
  learningObjectives: Array<string>;
  content?: string;
};

export function getDetailedArticles(lang: TLang): Array<TDetailedArticle> {
  const images = [
    academyCourses[0].imageUrl,
    academyCourses[1].imageUrl,
    academyCourses[2].imageUrl,
  ];

  const byLang: Record<
    TLang,
    Array<Omit<TDetailedArticle, "href" | "imageUrl">>
  > = {
    es: [
      {
        slug: "introduccion-arabe-coranico",
        badgeLabel: "Fundacional",
        badgeTone: "primary",
        title: "Introducción al Árabe Coránico",
        description:
          "Domina las bases de la lectura, escritura y comprensión del idioma sagrado del Islam desde cero.",
        ctaIcon: "menu_book",
        imageAlt: "Caligrafía Árabe",
        authorName: "Ustadh Tariq Ramírez",
        readingTimeMinutes: 8,
        instructorRole: "Coordinador de Educación y Lengua Árabe",
        scheduleLabel: "Sábados 10:00 AM – 12:00 PM • Presencial y Online",
        contentParagraphs: [
          "El idioma árabe es la llave para conectar directamente con las palabras reveladas en el Sagrado Corán y comprender la profundidad espiritual de las oraciones diarias (Salah).",
          "En este programa fundacional de la Mezquita Central Abu Bakr As-Siddiq, los estudiantes comienzan reconociendo las 28 letras del alfabeto árabe en sus distintas posiciones, las vocales cortas y largas, y los principios fonéticos del Tajweed.",
          "Además de la lectura fluida, exploramos las raíces trilíteras más frecuentes del Corán para que puedas comprender el significado directo de las suras cortas recitadas en la oración.",
        ],
        learningObjectives: [
          "Reconocimiento y trazado de las 28 letras del alfabeto árabe",
          "Articulación fonética correcta (Makharij al-Huruf)",
          "Lectura fluida de Juz Amma con reglas esenciales de Tajweed",
          "Vocabulario coránico fundamental (las 200 palabras más frecuentes)",
        ],
      },
      {
        slug: "historia-del-islam",
        badgeLabel: "Histórico",
        badgeTone: "secondary",
        title: "Historia y Civilización del Islam",
        description:
          "Un viaje fascinante por la vida del Profeta Muhammad ﷺ, el legado espiritual y los aportes científicos de la civilización islámica.",
        ctaIcon: "history_edu",
        imageAlt: "Manuscrito Histórico Islámico",
        authorName: "Sheikh Ahmad Al-Mansoor",
        readingTimeMinutes: 10,
        instructorRole: "Imam Principal y Director Espiritual",
        scheduleLabel:
          "Domingos 11:00 AM – 12:30 PM • Biblioteca de la Mezquita",
        contentParagraphs: [
          "Comprender la historia del Islam comienza con la Sirah (biografía) del Profeta Muhammad ﷺ en La Meca y Medina: un ejemplo vivo de paciencia, justicia social, misericordia y construcción comunitaria.",
          "A lo largo de los siglos, la civilización islámica impulsó centros de saber desde Bagdad y El Cairo hasta Córdoba en Al-Ándalus, preservando y expandiendo la medicina, el álgebra, la astronomía y la filosofía ética.",
          "También estudiamos la historia de la presencia musulmana en América Latina y Colombia, desde las primeras migraciones hasta la consolidación de la Mezquita Central de Bogotá.",
        ],
        learningObjectives: [
          "La vida del Profeta Muhammad ﷺ (Sirah Nabawiyyah) y sus enseñanzas",
          "Ética y gobernanza durante los Califas Bien Guiados (Al-Khulafa Ar-Rashidun)",
          "El legado científico y cultural de Al-Ándalus y el mundo islámico",
          "Raíces e historia de la comunidad musulmana en Colombia",
        ],
      },
      {
        slug: "fiqh-y-etica",
        badgeLabel: "Práctico",
        badgeTone: "primary",
        title: "Fiqh de la Adoración y Ética Cotidiana",
        description:
          "Aplicación práctica de la jurisprudencia islámica (purificación, oración, ayuno, Zakat) y los valores morales (Akhlaq) en la vida moderna.",
        ctaIcon: "gavel",
        imageAlt: "Jurisprudencia Islámica y Ética",
        authorName: "Sheikh Ahmad Al-Mansoor & Dra. Amina Gómez",
        readingTimeMinutes: 9,
        instructorRole: "Departamento de Ciencias Islámicas",
        scheduleLabel: "Miércoles 6:30 PM – 8:00 PM • Salón de Conferencias",
        contentParagraphs: [
          "El Fiqh (comprensión profunda de las normas prácticas del Islam) brinda claridad sobre cómo adorar a Dios con certeza y cómo conducir nuestros asuntos familiares, financieros y sociales con rectitud.",
          "Este módulo abarca paso a paso la purificación (Taharah y Wudu), las condiciones y pilares de las cinco oraciones diarias, el cálculo del Zakat en el contexto colombiano y las normas del ayuno de Ramadán.",
          "Junto con las normas prácticas, profundizamos en el Akhlaq (carácter moral): la honestidad en el comercio, el trato bondadoso a los padres y vecinos, y la responsabilidad ambiental.",
        ],
        learningObjectives: [
          "Guía práctica completa de Taharah (Wudu) y Salah (Oración)",
          "Cálculo de Zakat, Sadaqah y ética financiera libre de usura (Riba)",
          "Normas del ayuno de Ramadán y la peregrinación (Hajj)",
          "Ética familiar, convivencia ciudadana y excelencia moral (Ihsan)",
        ],
      },
    ],
    en: [
      {
        slug: "introduccion-arabe-coranico",
        badgeLabel: "Foundational",
        badgeTone: "primary",
        title: "Introduction to Quranic Arabic",
        description:
          "Master the foundations of reading, writing, and understanding the sacred language of the Quran from scratch.",
        ctaIcon: "menu_book",
        imageAlt: "Arabic Calligraphy",
        authorName: "Ustadh Tariq Ramírez",
        readingTimeMinutes: 8,
        instructorRole: "Education & Arabic Language Coordinator",
        scheduleLabel: "Saturdays 10:00 AM – 12:00 PM • In-Person & Online",
        contentParagraphs: [
          "The Arabic language is the direct key to connecting with the revealed words of the Holy Quran and experiencing deeper mindfulness in daily prayers (Salah).",
          "In this foundational course at the Abu Bakr As-Siddiq Central Mosque, students learn the 28 Arabic letters in all forms, vowel markings, and core phonetic principles of Tajweed.",
          "Beyond fluent script reading, we explore high-frequency triliteral Quranic roots so you can understand the meaning of the short Surahs recited daily.",
        ],
        learningObjectives: [
          "Recognition and writing of all 28 Arabic alphabet letters",
          "Proper phonetic articulation (Makharij al-Huruf)",
          "Fluent recitation of Juz Amma with essential Tajweed rules",
          "Top 200 most frequent Quranic vocabulary words",
        ],
      },
      {
        slug: "historia-del-islam",
        badgeLabel: "History",
        badgeTone: "secondary",
        title: "Islamic History & Civilization",
        description:
          "A comprehensive journey through the life of Prophet Muhammad ﷺ and the spiritual and scientific legacy of Islamic civilization.",
        ctaIcon: "history_edu",
        imageAlt: "Islamic History Manuscript",
        authorName: "Sheikh Ahmad Al-Mansoor",
        readingTimeMinutes: 10,
        instructorRole: "Head Imam & Spiritual Director",
        scheduleLabel: "Sundays 11:00 AM – 12:30 PM • Mosque Library",
        contentParagraphs: [
          "Understanding Islamic history begins with the Seerah (biography) of Prophet Muhammad ﷺ in Makkah and Madinah—a timeless model of mercy, justice, perseverance, and community building.",
          "Across centuries, Islamic civilization fostered centers of scholarship from Baghdad and Cairo to Córdoba in Al-Andalus, advancing medicine, mathematics, astronomy, and ethics.",
          "We also explore the history of Muslims in Latin America and Colombia, culminating in the establishment of Bogotá's Central Mosque.",
        ],
        learningObjectives: [
          "The biography of Prophet Muhammad ﷺ (Seerah Nabawiyyah)",
          "Leadership and justice during the Rightly Guided Caliphs",
          "Scientific and cultural contributions of Al-Andalus and the Muslim world",
          "History of the Muslim community in Bogotá and Colombia",
        ],
      },
      {
        slug: "fiqh-y-etica",
        badgeLabel: "Practical",
        badgeTone: "primary",
        title: "Fiqh of Worship & Everyday Ethics",
        description:
          "Practical application of Islamic jurisprudence (purification, prayer, fasting, Zakat) and moral character (Akhlaq) in modern life.",
        ctaIcon: "gavel",
        imageAlt: "Fiqh and Ethics",
        authorName: "Sheikh Ahmad Al-Mansoor & Dr. Amina Gómez",
        readingTimeMinutes: 9,
        instructorRole: "Department of Islamic Sciences",
        scheduleLabel: "Wednesdays 6:30 PM – 8:00 PM • Lecture Hall",
        contentParagraphs: [
          "Fiqh provides practical clarity on how to worship God with confidence and conduct our family, professional, and social affairs with integrity.",
          "This course covers step-by-step purification (Taharah and Wudu), the pillars of the five daily prayers, Zakat calculation in Colombia, and the rulings of Ramadan fasting.",
          "Alongside jurisprudence, we study Akhlaq (prophetic character): truthfulness in trade, kindness to parents and neighbors, and civic responsibility.",
        ],
        learningObjectives: [
          "Step-by-step guide to Taharah (Wudu) and Salah (Prayer)",
          "Zakat calculation, Sadaqah, and ethical Islamic finance",
          "Rulings of Ramadan fasting and Hajj pilgrimage",
          "Family ethics, neighborly coexistence, and spiritual excellence (Ihsan)",
        ],
      },
    ],
    ar: [
      {
        slug: "introduccion-arabe-coranico",
        badgeLabel: "تأسيسي",
        badgeTone: "primary",
        title: "مدخل إلى اللغة العربية القرآنية",
        description:
          "أتقن أساسيات القراءة والكتابة وفهم لغة القرآن الكريم خطوة بخطوة من البداية.",
        ctaIcon: "menu_book",
        imageAlt: "الخط العربي",
        authorName: "الأستاذ طارق راميريز",
        readingTimeMinutes: 8,
        instructorRole: "منسق التعليم واللغة العربية",
        scheduleLabel: "السبت 10:00 صباحاً – 12:30 ظهراً • حضوري وعبر الإنترنت",
        contentParagraphs: [
          "اللغة العربية هي المفتاح المباشر لتدبر آيات القرآن الكريم واستشعار الخشوع في الصلوات اليومية.",
          "في هذا البرنامج التأسيسي بمسجد أبو بكر الصديق المركزي في بوغوتا، يتعلم المشاركون الحروف العربية ومخارجها الصحيحة والحركات وقواعد التجويد الأساسية.",
        ],
        learningObjectives: [
          "إتقان قراءة وكتابة الحروف العربية بأشكالها المختلفة",
          "تصحيح مخارج الحروف وأحكام التجويد الأساسية",
          "قراءة جزء عمّ قراءة متقنة",
          "التعرف على أهم 200 مفردة قرآنية شائعة",
        ],
      },
      {
        slug: "historia-del-islam",
        badgeLabel: "تاريخي",
        badgeTone: "secondary",
        title: "السيرة النبوية وتاريخ الحضارة الإسلامية",
        description:
          "رحلة معرفية في سيرة النبي محمد ﷺ والإرث العلمي والأخلاقي للحضارة الإسلامية عبر العصور.",
        ctaIcon: "history_edu",
        imageAlt: "مخطوطة تاريخية إسلامية",
        authorName: "الشيخ أحمد المنصور",
        readingTimeMinutes: 10,
        instructorRole: "الإمام الرئيسي والمدير الروحي",
        scheduleLabel: "الأحد 11:00 صباحاً – 12:30 ظهراً • مكتبة المسجد",
        contentParagraphs: [
          "تبدأ دراسة التاريخ الإسلامي من السيرة النبوية العطرة في مكة المكرمة والمدينة المنورة، وما فيها من دروس الرحمة والعدل وبناء المجتمع المتراحم.",
        ],
        learningObjectives: [
          "دراسة السيرة النبوية الشريفة ودروسها التربوية",
          "منهج الخلفاء الراشدين في العدل والشورى",
          "الإسهامات العلمية والثقافية للحضارة الإسلامية",
          "تاريخ الجالية المسلمة في بوغوتا وأمريكا اللاتينية",
        ],
      },
      {
        slug: "fiqh-y-etica",
        badgeLabel: "تطبيقي",
        badgeTone: "primary",
        title: "فقه العبادات والأخلاق الإسلامية",
        description:
          "دراسة عملية لأحكام الطهارة والصلاة والزكاة والصيام وتطبيق الأخلاق الإسلامية في الحياة اليومية.",
        ctaIcon: "gavel",
        imageAlt: "الفقه والأخلاق",
        authorName: "الشيخ أحمد المنصور ود. أمينة غوميز",
        readingTimeMinutes: 9,
        instructorRole: "قسم العلوم الإسلامية",
        scheduleLabel: "الأربعاء 6:30 مساءً – 8:00 مساءً • قاعة المحاضرات",
        contentParagraphs: [
          "يعين الفقه الإسلامي المسلم على عبادة الله على بصيرة، وتنظيم شؤونه الأسرية والمالية والاجتماعية وفق القيم الإسلامية السمحة.",
        ],
        learningObjectives: [
          "أحكام الطهارة والوضوء والصلاة بالتفصيل العملي",
          "حساب الزكاة وأخلاقيات المعاملات المالية",
          "أحكام صيام رمضان والحج",
          "الأخلاق الأسرية وحسن الجوار والإحسان",
        ],
      },
    ],
    tr: [
      {
        slug: "introduccion-arabe-coranico",
        badgeLabel: "Temel",
        badgeTone: "primary",
        title: "Kur'an Arapçasına Giriş",
        description:
          "Kur'an-ı Kerim'in kutsal dilini sıfırdan okumayı, yazmayı ve temel kavramlarını anlamayı öğrenin.",
        ctaIcon: "menu_book",
        imageAlt: "Arap Hat Sanatı",
        authorName: "Üstad Tarık Ramírez",
        readingTimeMinutes: 8,
        instructorRole: "Eğitim ve Arap Dili Koordinatörü",
        scheduleLabel: "Cumartesi 10:00 – 12:00 • Yüz Yüze ve Çevrimiçi",
        contentParagraphs: [
          "Arapça, Kur'an-ı Kerim'in ilahi mesajıyla doğrudan bağ kurmanın ve günlük namazlarımızı (Salah) huşu içinde eda etmenin anahtarıdır.",
        ],
        learningObjectives: [
          "28 Arap harfinin okunuşu ve yazılışı",
          "Doğru mahreç ve temel tecvid uygulamaları",
          "Amme Cüzü'nün akıcı ve kurallı okunması",
          "Kur'an-ı Kerim'de en sık geçen 200 temel kelime",
        ],
      },
      {
        slug: "historia-del-islam",
        badgeLabel: "Tarih",
        badgeTone: "secondary",
        title: "İslam Tarihi ve Medeniyeti",
        description:
          "Hz. Muhammed'in ﷺ hayatı (Siyer-i Nebi) ve İslam medeniyetinin yüzyıllar boyunca bilime ve insanlığa katkıları.",
        ctaIcon: "history_edu",
        imageAlt: "İslam Tarihi El Yazması",
        authorName: "Şeyh Ahmed El-Mansur",
        readingTimeMinutes: 10,
        instructorRole: "Baş İmam ve Manevi Rehber",
        scheduleLabel: "Pazar 11:00 – 12:30 • Cami Kütüphanesi",
        contentParagraphs: [
          "İslam tarihini anlamak, Peygamber Efendimiz Hz. Muhammed'in ﷺ Mekke ve Medine'deki örnek hayatı (Siyer-i Nebi), merhameti ve adalet anlayışıyla başlar.",
        ],
        learningObjectives: [
          "Hz. Muhammed'in ﷺ hayatı (Siyer-i Nebi) ve sünneti",
          "Hulefâ-yi Râşidîn dönemi adalet ve yönetim ilkeleri",
          "Endülüs ve İslam dünyasının bilimsel mirası",
          "Kolombiya ve Bogota'daki Müslüman toplumun tarihçesi",
        ],
      },
      {
        slug: "fiqh-y-etica",
        badgeLabel: "Uygulamalı",
        badgeTone: "primary",
        title: "İbadet Fıkhı ve İslam Ahlakı",
        description:
          "İslam fıkhının (taharet, namaz, oruç, zekât) ve güzel ahlak ilkelerinin (Ahlak) günlük hayatta uygulanması.",
        ctaIcon: "gavel",
        imageAlt: "Fıkıh ve Ahlak",
        authorName: "Şeyh Ahmed El-Mansur ve Dr. Amina Gómez",
        readingTimeMinutes: 9,
        instructorRole: "İslami İlimler Bölümü",
        scheduleLabel: "Çarşamba 18:30 – 20:00 • Konferans Salonu",
        contentParagraphs: [
          "Fıkıh ilmi, ibadetlerimizi sahih bilgilere dayanarak yerine getirmemize ve aile, ticaret ve toplum hayatımızı dürüstlükle sürdürmemize rehberlik eder.",
        ],
        learningObjectives: [
          "Adım adım Taharet (Abdest) ve Namaz (Salah) rehberi",
          "Zekât hesaplaması, sadaka ve helal ticaret ilkeleri",
          "Ramazan orucu ve Hac ibadeti hükümleri",
          "Aile ahlakı, komşuluk hukuku ve ihsan bilinci",
        ],
      },
    ],
  };

  return byLang[lang].map((article, idx) => ({
    ...article,
    imageUrl: images[idx] ?? images[0],
    href: `/${lang}/articles/${article.slug}`,
  }));
}
