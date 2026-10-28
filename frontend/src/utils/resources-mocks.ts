import type { TLang } from "@i18n/ui";
import { useTranslations } from "@i18n/utils";

export type TResourcePublication = {
  slug: string;
  title: string;
  summary: string;
  category:
    | "guide"
    | "book"
    | "pamphlet"
    | "press_kit"
    | "academic"
    | "general";
  categoryLabel: string;
  authorName: string;
  pageCount: number;
  fileSizeLabel: string;
  publishedAtDate: string;
  secondaryDateFormatted: string;
  mediaFolderPath: string;
  downloadEndpoint: string;
  externalDownloadUrl: string;
  downloadCount: number;
};

export type TResourceGalleryAlbum = {
  slug: string;
  title: string;
  description: string;
  category: "architecture" | "ramadan_eid" | "community" | "events";
  categoryLabel: string;
  eventDate: string;
  secondaryDateFormatted: string;
  mediaFolderPath: string;
  photographerCredit: string;
  photoCount: number;
  coverUrl: string;
  coverAlt: string;
};

export type TResourceGlossaryTerm = {
  slug: string;
  term: string;
  nativeScript: string;
  transliteration: string;
  definition: string;
  categoryLabel: string;
  letterGroup: string;
  relatedTerms: Array<string>;
};

export type TResourcesHubCopy = {
  publicationsBadge: string;
  publicationsTitle: string;
  publicationsSubtitle: string;
  downloadLabel: string;
  pagesLabel: string;
  glossaryBadge: string;
  glossaryTitle: string;
  glossarySubtitle: string;
  allLettersLabel: string;
  galleriesBadge: string;
  galleriesTitle: string;
  galleriesSubtitle: string;
  photosCountLabel: string;
  mediaFolderLabel: string;
};

export function getResourcesHubCopy(lang: TLang): TResourcesHubCopy {
  const t = useTranslations(lang);
  return {
    publicationsBadge: t("resources-hub.publicationsBadge"),
    publicationsTitle: t("resources-hub.publicationsTitle"),
    publicationsSubtitle: t("resources-hub.publicationsSubtitle"),
    downloadLabel: t("resources-hub.downloadLabel"),
    pagesLabel: t("resources-hub.pagesLabel"),
    glossaryBadge: t("resources-hub.glossaryBadge"),
    glossaryTitle: t("resources-hub.glossaryTitle"),
    glossarySubtitle: t("resources-hub.glossarySubtitle"),
    allLettersLabel: t("resources-hub.allLettersLabel"),
    galleriesBadge: t("resources-hub.galleriesBadge"),
    galleriesTitle: t("resources-hub.galleriesTitle"),
    galleriesSubtitle: t("resources-hub.galleriesSubtitle"),
    photosCountLabel: t("resources-hub.photosCountLabel"),
    mediaFolderLabel: t("resources-hub.mediaFolderLabel"),
  };
}

type TPubList = Array<TResourcePublication>;

export function getLocalizedPublications(lang: TLang): TPubList {
  const isEn = lang === "en";
  const isAr = lang === "ar";
  const isTr = lang === "tr";

  return [
    {
      slug: "guia-bienvenida-visita-mezquita",
      title: isEn
        ? "Mosque Visitor Etiquette & Welcome Guide"
        : isAr
          ? "دليل الزوار وآداب زيارة المسجد"
          : isTr
            ? "Cami Ziyaretçi Rehberi ve Görgü Kuralları"
            : "Guía de Bienvenida y Etiqueta de Visita a la Mezquita",
      summary: isEn
        ? "Illustrated handbook covering dress code guidelines, guided tour schedules, prayer hall etiquette, and FAQs for guests and schools."
        : isAr
          ? "دليل مصور يتضمن إرشادات اللباس، ومواعيد الجولات التعريفية، وآداب قاعة الصلاة، والأسئلة الشائعة."
          : isTr
            ? "Ziyaretçiler ve okullar için kıyafet kuralları, rehberli tur saatleri ve ibadet alanı adabını içeren resimli el kitabı."
            : "Manual ilustrado con recomendaciones de vestimenta, horarios de visita guiada, normas de respeto en la sala de oración y preguntas frecuentes.",
      category: "guide",
      categoryLabel: isEn
        ? "Visitor Guide"
        : isAr
          ? "دليل الزوار"
          : isTr
            ? "Rehber"
            : "Guía Oficial",
      authorName: isEn
        ? "Educational & Cultural Committee"
        : isAr
          ? "اللجنة التعليمية والثقافية"
          : "Comité Educativo y Cultural",
      pageCount: 16,
      fileSizeLabel: "2.4 MB",
      publishedAtDate: "2026-01-15",
      secondaryDateFormatted: "15 Rajab 1447 AH",
      mediaFolderPath: "/resources/publications",
      downloadEndpoint: `/api/resources/publications/guia-bienvenida-visita-mezquita/download?locale=${lang}`,
      externalDownloadUrl: `/api/resources/publications/guia-bienvenida-visita-mezquita/download?locale=${lang}`,
      downloadCount: 342,
    },
    {
      slug: "introduccion-cinco-pilares-islam",
      title: isEn
        ? "Understanding the Five Pillars of Islam"
        : isAr
          ? "مدخل إلى أركان الإسلام الخمسة"
          : isTr
            ? "İslam'ın Beş Şartına Giriş"
            : "Introducción a los Cinco Pilares del Islam",
      summary: isEn
        ? "Foundational reader explaining the Declaration of Faith (Shahada), Daily Prayer (Salah), Almsgiving (Zakat), Fasting in Ramadan (Sawm), and Pilgrimage (Hajj)."
        : isAr
          ? "شرح مبسط لأركان الإسلام الخمسة: الشهادتان، وإقام الصلاة، وإيتاء الزكاة، وصوم رمضان، وحج البيت."
          : isTr
            ? "Kelime-i Şehadet, Namaz, Zekât, Ramazan Orucu ve Hac ibadetlerini açıklayan temel eser."
            : "Compendio introductorio sobre el testimonio de fe (Shahada), la oración (Salah), la caridad purificadora (Zakat), el ayuno de Ramadán (Sawm) y el Hajj.",
      category: "book",
      categoryLabel: isEn
        ? "Booklet"
        : isAr
          ? "كتاب تمهيدي"
          : isTr
            ? "Kitapçık"
            : "Libro Introductorio",
      authorName: isEn
        ? "Department of Outreach & Publications"
        : isAr
          ? "قسم الدعوة والإصدارات"
          : "Departamento de Dawah y Publicaciones",
      pageCount: 48,
      fileSizeLabel: "4.8 MB",
      publishedAtDate: "2026-02-01",
      secondaryDateFormatted: "13 Sha’ban 1447 AH",
      mediaFolderPath: "/resources/publications",
      downloadEndpoint: `/api/resources/publications/introduccion-cinco-pilares-islam/download?locale=${lang}`,
      externalDownloadUrl: `/api/resources/publications/introduccion-cinco-pilares-islam/download?locale=${lang}`,
      downloadCount: 518,
    },
    {
      slug: "dossier-prensa-identidad-arquitectonica",
      title: isEn
        ? "Architectural Heritage & Institutional Press Kit"
        : isAr
          ? "الملف الإعلامي والهوية المعمارية للمسجد"
          : isTr
            ? "Mimari Miras ve Kurumsal Basın Dosyası"
            : "Dossier de Prensa e Identidad Arquitectónica",
      summary: isEn
        ? "Technical fact sheet, historical overview, and editorial guidelines for journalists, researchers, and academic partners."
        : isAr
          ? "بطاقة تقنية ونبذة تاريخية وإرشادات تحريرية للصحفيين والباحثين والمؤسسات الأكاديمية."
          : isTr
            ? "Gazeteciler, araştırmacılar ve akademik kurumlar için teknik bilgi formu ve tarihçe."
            : "Ficha técnica, reseña histórica y lineamientos editoriales para medios de comunicación, investigadores y aliados institucionales.",
      category: "press_kit",
      categoryLabel: isEn
        ? "Press Kit"
        : isAr
          ? "ملف إعلامي"
          : isTr
            ? "Basın Kiti"
            : "Dossier de Prensa",
      authorName: isEn
        ? "Communications Office"
        : isAr
          ? "مكتب الإعلام"
          : "Oficina de Comunicaciones",
      pageCount: 24,
      fileSizeLabel: "6.1 MB",
      publishedAtDate: "2026-02-18",
      secondaryDateFormatted: "1 Ramadan 1447 AH",
      mediaFolderPath: "/resources/publications",
      downloadEndpoint: `/api/resources/publications/dossier-prensa-identidad-arquitectonica/download?locale=${lang}`,
      externalDownloadUrl: `/api/resources/publications/dossier-prensa-identidad-arquitectonica/download?locale=${lang}`,
      downloadCount: 129,
    },
  ];
}

type TAlbumList = Array<TResourceGalleryAlbum>;

export function getLocalizedGalleryAlbums(lang: TLang): TAlbumList {
  const isEn = lang === "en";
  const isAr = lang === "ar";
  const isTr = lang === "tr";

  return [
    {
      slug: "arquitectura-cupula-caligrafica-mihrab",
      title: isEn
        ? "Sacred Geometry, Calligraphic Dome & Mihrab"
        : isAr
          ? "العمارة الإسلامية والقبة الخطية والمحراب"
          : isTr
            ? "İslami Mimari, Hat Kubbesi ve Mihrap"
            : "Arquitectura, Cúpula Caligráfica y Mihrab",
      description: isEn
        ? "High-resolution visual tour across the minaret, central dome calligraphy, and hand-carved woodwork of the main prayer hall."
        : isAr
          ? "جولة بصرية عالية الدقة تستعرض المئذنة، وزخارف القبة المركزية، والمحراب الخشبي المنحوت."
          : isTr
            ? "Minare, merkez kubbe hat sanatı ve ana ibadet salonunun ahşap işçiliğine yüksek çözünürlüklü bakış."
            : "Recorrido visual en alta resolución por el minarete, la cúpula central caligráfica y los detalles en madera tallada del Mihrab.",
      category: "architecture",
      categoryLabel: isEn
        ? "Architecture"
        : isAr
          ? "العمارة"
          : isTr
            ? "Mimari"
            : "Arquitectura",
      eventDate: "2026-01-20",
      secondaryDateFormatted: "1 Sha’ban 1447 AH",
      mediaFolderPath: "/resources/galleries/architecture",
      photographerCredit: "Archivo Fotográfico Institucional",
      photoCount: 18,
      coverUrl:
        "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1000&q=80",
      coverAlt: "Cúpula y arquitectura de la Mezquita Central de Bogotá",
    },
    {
      slug: "iftar-comunitario-noches-ramadan",
      title: isEn
        ? "Community Iftar & Ramadan Nights"
        : isAr
          ? "الإفطار الجماعي وليالي شهر رمضان"
          : isTr
            ? "Topluluk İftarı ve Ramazan Geceleri"
            : "Iftar Comunitario y Noches de Ramadán",
      description: isEn
        ? "Moments of hospitality, breaking the fast together, and interfaith fellowship during the blessed month of Ramadan."
        : isAr
          ? "لقطات من موائد الإفطار الجماعي والضيافة والتآخي خلال شهر رمضان المبارك."
          : isTr
            ? "Mübarek Ramazan ayında birlikte oruç açma, misafirperverlik ve kardeşlik kareleri."
            : "Jornadas de ruptura del ayuno, hospitalidad interreligiosa y encuentro comunitario durante el mes sagrado de Ramadán.",
      category: "ramadan_eid",
      categoryLabel: isEn
        ? "Ramadan & Eid"
        : isAr
          ? "رمضان والعيد"
          : isTr
            ? "Ramazan ve Bayram"
            : "Ramadán y Eid",
      eventDate: "2026-03-10",
      secondaryDateFormatted: "21 Ramadan 1447 AH",
      mediaFolderPath: "/resources/galleries/ramadan",
      photographerCredit: "Comité de Medios",
      photoCount: 24,
      coverUrl:
        "https://images.unsplash.com/photo-1564121211835-e88c852648ab?auto=format&fit=crop&w=1000&q=80",
      coverAlt: "Encuentro comunitario en la mezquita",
    },
    {
      slug: "visitas-culturales-universidades",
      title: isEn
        ? "University Delegations & Cultural Visits"
        : isAr
          ? "الوفود الجامعية والزيارات الثقافية"
          : isTr
            ? "Üniversite Heyetleri ve Kültürel Ziyaretler"
            : "Visitas Guiadas de Colegios y Universidades",
      description: isEn
        ? "Educational dialogues, guided architectural walks, and Q&A sessions with students and faculty across Bogotá."
        : isAr
          ? "لقاءات حوارية وجولات تعليمية لطلاب الجامعات والمدارس في بوغوتا."
          : isTr
            ? "Bogotá'daki üniversite ve okul öğrencileriyle gerçekleştirilen rehberli turlar ve söyleşiler."
            : "Diálogos educativos, recorridos guiados y sesiones de preguntas y respuestas con estudiantes y docentes de Bogotá.",
      category: "community",
      categoryLabel: isEn
        ? "Community"
        : isAr
          ? "المجتمع"
          : isTr
            ? "Topluluk"
            : "Comunidad",
      eventDate: "2026-02-12",
      secondaryDateFormatted: "24 Sha’ban 1447 AH",
      mediaFolderPath: "/resources/galleries/community",
      photographerCredit: "Comité Educativo",
      photoCount: 15,
      coverUrl:
        "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80",
      coverAlt: "Visitas culturales y educativas",
    },
  ];
}

type TTermList = Array<TResourceGlossaryTerm>;

export function getLocalizedGlossaryTerms(lang: TLang): TTermList {
  const isEn = lang === "en";
  const isAr = lang === "ar";
  const isTr = lang === "tr";

  return [
    {
      slug: "adhan",
      term: "Adhan",
      nativeScript: "أَذَان",
      transliteration: "Adhān",
      definition: isEn
        ? "The Islamic public call to prayer recited five times a day from the mosque to announce obligatory congregational prayer (Salah)."
        : isAr
          ? "النداء الشرعي للإعلام بدخول وقت الصلاة المفروضة خمس مرات في اليوم والليلة."
          : isTr
            ? "Günde beş vakit farz namazların vaktini duyurmak için okunan ezan."
            : "El llamado público a la oración islámica proclamado cinco veces al día desde la mezquita para convocar a los creyentes al Salah.",
      categoryLabel: isEn
        ? "Worship"
        : isAr
          ? "العبادات"
          : isTr
            ? "İbadet"
            : "Adoración",
      letterGroup: "A",
      relatedTerms: ["Salah", "Iqamah", "Minarete"],
    },
    {
      slug: "jumuah",
      term: "Jumu'ah",
      nativeScript: "جُمُعَة",
      transliteration: "Salāt al-Jumu'ah",
      definition: isEn
        ? "The Friday congregational midday prayer preceded by the weekly sermon (Khutbah) delivered from the Minbar."
        : isAr
          ? "صلاة الجماعة يوم الجمعة ظهراً وتسبقها خطبتا الجمعة من على المنبر."
          : isTr
            ? "Cuma günü öğle vaktinde hutbe ile birlikte cemaatle kılınan haftalık farz namaz."
            : "La oración congregacional del viernes al mediodía, precedida por el sermón semanal (Jutba) pronunciado desde el Minbar.",
      categoryLabel: isEn
        ? "Worship"
        : isAr
          ? "العبادات"
          : isTr
            ? "İbadet"
            : "Adoración",
      letterGroup: "J",
      relatedTerms: ["Khutbah", "Minbar", "Salah"],
    },
    {
      slug: "mihrab",
      term: "Mihrab",
      nativeScript: "مِحْرَاب",
      transliteration: "Miḥrāb",
      definition: isEn
        ? "Semicircular architectural niche in the prayer hall wall indicating the Qibla direction toward the Kaaba in Mecca."
        : isAr
          ? "الحنية المعمارية في صدر قاعة الصلاة التي تحدد اتجاه القبلة نحو الكعبة المشرفة."
          : isTr
            ? "Cami ibadet salonunda Kıble yönünü (Kâbe) gösteren mimari niş."
            : "Nicho arquitectónico en el muro principal de la sala de oración que señala la Qibla (la dirección hacia la Kaaba en La Meca).",
      categoryLabel: isEn
        ? "Architecture"
        : isAr
          ? "العمارة"
          : isTr
            ? "Mimari"
            : "Arquitectura",
      letterGroup: "M",
      relatedTerms: ["Qibla", "Minbar"],
    },
    {
      slug: "zakat",
      term: "Zakat",
      nativeScript: "زَكَاة",
      transliteration: "Zakāh",
      definition: isEn
        ? "Third Pillar of Islam: obligatory annual almsgiving (2.5% of accumulated wealth above the Nisab threshold) dedicated to social welfare."
        : isAr
          ? "الركن الثالث من أركان الإسلام: نصيب مالي سنوي مقداره 2.5% من المال المدخر الذي بلغ النصاب."
          : isTr
            ? "İslam'ın üçüncü şartı: Nisap miktarını aşan birikim üzerinden yılda %2,5 oranında verilen farz zekât."
            : "Tercer pilar del Islam: contribución anual obligatoria del 2.5% sobre el patrimonio ahorrado que supera el umbral mínimo (Nisab).",
      categoryLabel: isEn
        ? "Ethics & Charity"
        : isAr
          ? "الأخلاق والزكاة"
          : isTr
            ? "Zekât ve Ahlak"
            : "Ética y Solidaridad",
      letterGroup: "Z",
      relatedTerms: ["Sadaqah", "Nisab"],
    },
  ];
}
