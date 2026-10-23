export const EVENTS_BY_LOCALE: Record<string, Array<Record<string, unknown>>> =
  {
    es: [
      {
        title: 'Clase de Árabe Clásico',
        slug: 'clase-arabe-clasico',
        summary:
          'Aprende los fundamentos del idioma árabe y la gramática del Corán con instructores certificados.',
        description:
          '<p>Nuestro curso de Árabe Clásico está diseñado tanto para principiantes como para estudiantes intermedios que desean comprender directamente el texto del Sagrado Corán.</p>',
        startDate: '2026-10-15T18:00:00.000Z',
        timeLabel: '18:00 - 20:00',
        location: 'Mezquita Central de Bogotá',
        category: 'education',
        featured: true,
      },
      {
        title: 'Cena Comunitaria',
        slug: 'cena-comunitaria',
        summary:
          'Un espacio para compartir alimentos y fortalecer los lazos entre las familias de la comunidad.',
        description:
          '<p>La Cena Comunitaria mensual reúne a las familias musulmanas de Bogotá y a nuestros visitantes en un ambiente de fraternidad, hospitalidad y diálogo abierto.</p>',
        startDate: '2026-10-18T19:30:00.000Z',
        timeLabel: '19:30 - 21:30',
        location: 'Mezquita Central de Bogotá',
        category: 'community',
        featured: true,
      },
      {
        title: 'Círculo de Jóvenes',
        slug: 'circulo-jovenes',
        summary:
          'Diálogo abierto sobre desafíos contemporáneos y el papel de la juventud en la fe.',
        description:
          '<p>Un espacio seguro y dinámico donde los jóvenes musulmanes de Bogotá conversan sobre identidad, estudios universitarios, ética digital y liderazgo social.</p>',
        startDate: '2026-10-20T17:00:00.000Z',
        timeLabel: '17:00 - 19:00',
        location: 'Mezquita Central de Bogotá',
        category: 'youth',
        featured: true,
      },
      {
        title: 'Becas Türkiye Bursları (YTB) — Inscripciones de Febrero',
        slug: 'becas-turkiye-burslari-ytb-inscripciones-febrero',
        summary:
          'Convocatoria anual de becas completas del Gobierno de Turquía (YTB) para estudios de pregrado, maestría y doctorado. Incluye matrícula, alojamiento, estipendio mensual, seguro médico y tiquetes aéreos.',
        description:
          'Durante todo el mes de febrero están abiertas las inscripciones para el programa oficial Türkiye Bursları (YTB). La Mezquita Central de Bogotá brinda orientación gratuita sobre requisitos, carta de intención y documentación para postulantes colombianos.',
        startDate: '2026-01-10T00:00:00.000Z',
        endDate: '2026-02-20T23:59:59.000Z',
        timeLabel: '10 Ene – 20 Feb • Convocatoria Abierta',
        location: 'Portal Oficial YTB & Orientación en Mezquita Central',
        category: 'education',
        featured: true,
        imageUrl: '/images/events/ytb-scholarship-poster.svg',
        imageAlt: 'Afiche Oficial Becas Türkiye Bursları (YTB)',
        actionLinks: [
          {
            label: 'Postular en Türkiye Bursları (YTB)',
            url: 'https://turkiyeburslari.gov.tr',
            variant: 'primary',
            external: true,
            icon: 'open_in_new',
          },
          {
            label: 'Ver Requisitos y Eventos',
            url: '/es/events-and-programs',
            variant: 'outline',
            external: false,
            icon: 'event_note',
          },
        ],
        spotlightConfig: {
          enabled: true,
          badgeText: 'Inscripciones YTB • Febrero',
          priority: 20,
          position: 'bottom-end',
          showCountdown: true,
          startAt: '2026-01-10',
          endAt: '2026-02-20',
        },
      },
      {
        title: 'Becas de la Fundación Diyanet (TDV) — Teología y Estudios Islámicos',
        slug: 'becas-fundacion-diyanet-tdv-inscripciones-febrero',
        summary:
          'Programa internacional de becas de la Presidencia de Asuntos Religiosos de Turquía (Diyanet / TDV) para bachillerato (Imam Hatip), pregrado y posgrado en Teología y Estudios Islámicos en Turquía.',
        description:
          'Convocatoria abierta en febrero para jóvenes interesados en formarse en ciencias islámicas, lengua árabe y turca en universidades de Turquía con beca integral de la Fundación Turkiye Diyanet Vakfi (TDV).',
        startDate: '2026-02-01T00:00:00.000Z',
        endDate: '2026-02-28T23:59:59.000Z',
        timeLabel: '1 Feb – 28 Feb • Inscripciones Abiertas',
        location: 'Portal TDV Diyanet & Aval Comunitario en Mezquita Central',
        category: 'education',
        featured: true,
        imageUrl: '/images/events/diyanet-scholarship-poster.svg',
        imageAlt: 'Afiche Oficial Becas Fundación Diyanet (TDV)',
        actionLinks: [
          {
            label: 'Postular en Diyanet Bursları (TDV)',
            url: 'https://diyanetburslari.tdv.org',
            variant: 'primary',
            external: true,
            icon: 'open_in_new',
          },
          {
            label: 'Solicitar Aval / Orientación',
            url: '/es/contact-and-visit',
            variant: 'outline',
            external: false,
            icon: 'school',
          },
        ],
        spotlightConfig: {
          enabled: true,
          badgeText: 'Becas Diyanet • Febrero',
          priority: 15,
          position: 'bottom-end',
          showCountdown: true,
          startAt: '2026-02-01',
          endAt: '2026-02-28',
        },
      },
    ],
    en: [
      {
        title: 'Classical Arabic Class',
        slug: 'clase-arabe-clasico',
        summary:
          'Learn the fundamentals of the Arabic script and Quranic grammar with certified instructors.',
        description:
          '<p>Our Classical Arabic course is designed for beginners and intermediate students seeking direct comprehension of the Holy Quran.</p>',
        startDate: '2026-10-15T18:00:00.000Z',
        timeLabel: '18:00 - 20:00',
        location: 'Bogotá Central Mosque',
        category: 'education',
        featured: true,
      },
      {
        title: 'Community Dinner',
        slug: 'cena-comunitaria',
        summary:
          'A welcoming gathering to share a meal and strengthen bonds among community families.',
        description:
          '<p>Our monthly Community Dinner brings together Muslim families in Bogotá and guests in an atmosphere of brotherhood and hospitality.</p>',
        startDate: '2026-10-18T19:30:00.000Z',
        timeLabel: '19:30 - 21:30',
        location: 'Bogotá Central Mosque',
        category: 'community',
        featured: true,
      },
      {
        title: 'Youth Circle',
        slug: 'circulo-jovenes',
        summary:
          'Open dialogue on contemporary challenges and the role of youth in faith and society.',
        description:
          '<p>A supportive and engaging space where young Muslims in Bogotá discuss identity, university life, digital ethics, and leadership.</p>',
        startDate: '2026-10-20T17:00:00.000Z',
        timeLabel: '17:00 - 19:00',
        location: 'Bogotá Central Mosque',
        category: 'youth',
        featured: true,
      },
      {
        title: 'Türkiye Bursları (YTB) Scholarships — February Applications',
        slug: 'turkiye-burslari-ytb-scholarships-february',
        summary:
          'Full Turkish Government scholarships (YTB) for Bachelor’s, Master’s, and PhD programs in Türkiye, covering tuition, accommodation, monthly stipend, health insurance, and round-trip flights.',
        description:
          'Applications for Türkiye Bursları (YTB) run throughout February. The Central Mosque of Bogotá offers guidance sessions on eligibility, letters of intent, and application preparation.',
        startDate: '2026-01-10T00:00:00.000Z',
        endDate: '2026-02-20T23:59:59.000Z',
        timeLabel: 'Jan 10 – Feb 20 • Applications Open',
        location: 'Official YTB Portal & Guidance at Central Mosque',
        category: 'education',
        featured: true,
        imageUrl: '/images/events/ytb-scholarship-poster.svg',
        imageAlt: 'Official Türkiye Bursları (YTB) Scholarship Poster',
        actionLinks: [
          {
            label: 'Apply on Türkiye Bursları (YTB)',
            url: 'https://turkiyeburslari.gov.tr',
            variant: 'primary',
            external: true,
            icon: 'open_in_new',
          },
          {
            label: 'Requirements & Events',
            url: '/en/events-and-programs',
            variant: 'outline',
            external: false,
            icon: 'event_note',
          },
        ],
        spotlightConfig: {
          enabled: true,
          badgeText: 'YTB Scholarships • Feb',
          priority: 20,
          position: 'bottom-end',
          showCountdown: true,
          startAt: '2026-01-10',
          endAt: '2026-02-20',
        },
      },
      {
        title: 'Diyanet Foundation (TDV) Scholarships — Islamic Studies & Theology',
        slug: 'diyanet-foundation-tdv-scholarships-february',
        summary:
          'International scholarship program by the Türkiye Diyanet Foundation (TDV) for high school, undergraduate, and graduate degrees in Islamic Studies and Theology in Türkiye.',
        description:
          'Open throughout February for students seeking full scholarships in Islamic sciences, Arabic, and Turkish language preparation at leading Turkish universities.',
        startDate: '2026-02-01T00:00:00.000Z',
        endDate: '2026-02-28T23:59:59.000Z',
        timeLabel: 'Feb 1 – Feb 28 • Applications Open',
        location: 'TDV Diyanet Portal & Central Mosque Advisement',
        category: 'education',
        featured: true,
        imageUrl: '/images/events/diyanet-scholarship-poster.svg',
        imageAlt: 'Official Diyanet Foundation (TDV) Scholarship Poster',
        actionLinks: [
          {
            label: 'Apply on Diyanet Bursları (TDV)',
            url: 'https://diyanetburslari.tdv.org',
            variant: 'primary',
            external: true,
            icon: 'open_in_new',
          },
          {
            label: 'Request Mosque Guidance',
            url: '/en/contact-and-visit',
            variant: 'outline',
            external: false,
            icon: 'school',
          },
        ],
        spotlightConfig: {
          enabled: true,
          badgeText: 'Diyanet Scholarships • Feb',
          priority: 15,
          position: 'bottom-end',
          showCountdown: true,
          startAt: '2026-02-01',
          endAt: '2026-02-28',
        },
      },
    ],
    ar: [
      {
        title: 'درس اللغة العربية الفصحى',
        slug: 'clase-arabe-clasico',
        summary:
          'تعلّم أساسيات اللغة العربية وقواعد التلاوة القرآنية مع معلمين معتمدين.',
        description:
          '<p>صُممت دورة اللغة العربية الفصحى للمبتدئين وطلاب المستوى المتوسط الراغبين في فهم نصوص القرآن الكريم مباشرة.</p>',
        startDate: '2026-10-15T18:00:00.000Z',
        timeLabel: '18:00 - 20:00',
        location: 'مسجد أبو بكر الصديق المركزي ببوغوتا',
        category: 'education',
        featured: true,
      },
      {
        title: 'العشاء المجتمعي العائلي',
        slug: 'cena-comunitaria',
        summary:
          'لقاء أخوي لتقاسم الطعام وتعزيز الروابط الأسرية والاجتماعية بين أبناء الجالية.',
        description:
          '<p>يجمع العشاء المجتمعي الشهري العائلات المسلمة في بوغوتا والزوار في أجواء من الأخوة والضيافة والحوار البناء.</p>',
        startDate: '2026-10-18T19:30:00.000Z',
        timeLabel: '19:30 - 21:30',
        location: 'مسجد أبو بكر الصديق المركزي ببوغوتا',
        category: 'community',
        featured: true,
      },
      {
        title: 'حلقة الشباب المسلم',
        slug: 'circulo-jovenes',
        summary:
          'حوار مفتوح حول التحديات المعاصرة ودور الشباب في ترسيخ القيم الإسلامية.',
        description:
          '<p>مساحة حوارية هادفة يناقش فيها شباب الجالية المسلمة في بوغوتا قضايا الهوية والدراسة الجامعية والعمل التطوعي.</p>',
        startDate: '2026-10-20T17:00:00.000Z',
        timeLabel: '17:00 - 19:00',
        location: 'مسجد أبو بكر الصديق المركزي ببوغوتا',
        category: 'youth',
        featured: true,
      },
      {
        title: 'منح الحكومة التركية (YTB Türkiye Bursları) — تسجيلات فبراير',
        slug: 'turkiye-burslari-ytb-scholarships-ar',
        summary:
          'برنامج المنح الدراسية الكاملة من الحكومة التركية (YTB) لمرحلتي البكالوريوس والدراسات العليا، يشمل الرسوم الجامعية والسكن والراتب الشهري وتذاكر الطيران.',
        description:
          'تستمر فترة التقديم لمنح الحكومة التركية طوال شهر فبراير، ويقدم مسجد أبو بكر الصديق المركزي في بوغوتا جلسات إرشادية للطلاب الراغبين في التقديم.',
        startDate: '2026-01-10T00:00:00.000Z',
        endDate: '2026-02-20T23:59:59.000Z',
        timeLabel: '10 يناير – 20 فبراير • التسجيل متاح',
        location: 'البوابة الرسمية YTB ومكتب الإرشاد بالمسجد المركزي',
        category: 'education',
        featured: true,
        imageUrl: '/images/events/ytb-scholarship-poster.svg',
        imageAlt: 'إعلان منح الحكومة التركية YTB',
        actionLinks: [
          {
            label: 'التقديم عبر بوابة YTB',
            url: 'https://turkiyeburslari.gov.tr',
            variant: 'primary',
            external: true,
            icon: 'open_in_new',
          },
          {
            label: 'تفاصيل الفعاليات والشروط',
            url: '/ar/events-and-programs',
            variant: 'outline',
            external: false,
            icon: 'event_note',
          },
        ],
        spotlightConfig: {
          enabled: true,
          badgeText: 'منح تركيا YTB • فبراير',
          priority: 20,
          position: 'bottom-end',
          showCountdown: true,
          startAt: '2026-01-10',
          endAt: '2026-02-20',
        },
      },
      {
        title: 'منح وقف الديانة التركي (TDV Diyanet) — الدراسات الإسلامية والإلهيات',
        slug: 'diyanet-tdv-scholarships-ar',
        summary:
          'برنامج المنح الدولية من رئاسة الشؤون الدينية التركية ووقف الديانة (TDV) لدراسة العلوم الإسلامية والشريعة في الجامعات التركية.',
        description:
          'التسجيل مفتوح خلال شهر فبراير للطلاب الراغبين في دراسة الإلهيات والعلوم الإسلامية بمنحة شاملة من وقف الديانة التركي.',
        startDate: '2026-02-01T00:00:00.000Z',
        endDate: '2026-02-28T23:59:59.000Z',
        timeLabel: '1 فبراير – 28 فبراير • التسجيل مفتوح',
        location: 'بوابة وقف الديانة TDV والمسجد المركزي ببوغوتا',
        category: 'education',
        featured: true,
        imageUrl: '/images/events/diyanet-scholarship-poster.svg',
        imageAlt: 'إعلان منح وقف الديانة التركي TDV',
        actionLinks: [
          {
            label: 'التقديم عبر بوابة الديانة (TDV)',
            url: 'https://diyanetburslari.tdv.org',
            variant: 'primary',
            external: true,
            icon: 'open_in_new',
          },
          {
            label: 'طلب التزكية والإرشاد',
            url: '/ar/contact-and-visit',
            variant: 'outline',
            external: false,
            icon: 'school',
          },
        ],
        spotlightConfig: {
          enabled: true,
          badgeText: 'منح الديانة TDV • فبراير',
          priority: 15,
          position: 'bottom-end',
          showCountdown: true,
          startAt: '2026-02-01',
          endAt: '2026-02-28',
        },
      },
    ],
    tr: [
      {
        title: 'Klasik Arapça Dersi',
        slug: 'clase-arabe-clasico',
        summary:
          'Sertifikalı eğitmenler eşliğinde Arapça dilinin temellerini ve Kur’an gramerini öğrenin.',
        description:
          '<p>Klasik Arapça kursumuz, Kur’an-ı Kerim metnini doğrudan anlamak isteyen başlangıç ve orta seviye öğrenciler için tasarlanmıştır.</p>',
        startDate: '2026-10-15T18:00:00.000Z',
        timeLabel: '18:00 - 20:00',
        location: 'Bogotá Merkez Camii',
        category: 'education',
        featured: true,
      },
      {
        title: 'Cemaat Akşam Yemeği',
        slug: 'cena-comunitaria',
        summary:
          'Aileler arasındaki kardeşlik bağlarını güçlendirmek ve aynı sofrayı paylaşmak için aylık buluşma.',
        description:
          '<p>Aylık Cemaat Yemeğimiz, Bogotá’daki Müslüman aileleri ve misafirlerimizi kardeşlik ve misafirperverlik ortamında bir araya getirir.</p>',
        startDate: '2026-10-18T19:30:00.000Z',
        timeLabel: '19:30 - 21:30',
        location: 'Bogotá Merkez Camii',
        category: 'community',
        featured: true,
      },
      {
        title: 'Gençlik Halkası',
        slug: 'circulo-jovenes',
        summary:
          'Güncel meseleler ve gençliğin inanç ile toplumdaki rolü üzerine açık söyleşi.',
        description:
          '<p>Bogotá’daki genç Müslümanların kimlik, üniversite hayatı, dijital ahlak ve sosyal sorumluluk konularını konuştuğu dinamik bir buluşma.</p>',
        startDate: '2026-10-20T17:00:00.000Z',
        timeLabel: '17:00 - 19:00',
        location: 'Bogotá Merkez Camii',
        category: 'youth',
        featured: true,
      },
      {
        title: 'Türkiye Bursları (YTB) — Şubat Ayı Başvuruları',
        slug: 'turkiye-burslari-ytb-subat-basvurulari',
        summary:
          'Yurtdışı Türkler ve Akraba Topluluklar Başkanlığı (YTB) tarafından sunulan tam kapsamlı lisans, yüksek lisans ve doktora burs programı.',
        description:
          'Şubat ayı boyunca devam eden Türkiye Bursları (YTB) başvuruları için Bogota Merkez Camii’nde bilgilendirme ve başvuru rehberliği sunulmaktadır.',
        startDate: '2026-01-10T00:00:00.000Z',
        endDate: '2026-02-20T23:59:59.000Z',
        timeLabel: '10 Ocak – 20 Şubat • Başvurular Açık',
        location: 'YTB Resmi Portalı & Bogota Merkez Camii Danışmanlık',
        category: 'education',
        featured: true,
        imageUrl: '/images/events/ytb-scholarship-poster.svg',
        imageAlt: 'Türkiye Bursları (YTB) Resmi Afişi',
        actionLinks: [
          {
            label: 'Türkiye Bursları (YTB) Başvurusu',
            url: 'https://turkiyeburslari.gov.tr',
            variant: 'primary',
            external: true,
            icon: 'open_in_new',
          },
          {
            label: 'Detaylı Bilgi ve Takvim',
            url: '/tr/events-and-programs',
            variant: 'outline',
            external: false,
            icon: 'event_note',
          },
        ],
        spotlightConfig: {
          enabled: true,
          badgeText: 'YTB Bursları • Şubat',
          priority: 20,
          position: 'bottom-end',
          showCountdown: true,
          startAt: '2026-01-10',
          endAt: '2026-02-20',
        },
      },
      {
        title: 'Türkiye Diyanet Vakfı (TDV) Diyanet Bursları — Şubat Başvuruları',
        slug: 'tdv-diyanet-burslari-subat-basvurulari',
        summary:
          'Türkiye Diyanet Vakfı (TDV) ve Diyanet İşleri Başkanlığı iş birliğiyle Uluslararası İmam Hatip Lisesi ve İlahiyat Fakültesi tam burs programı.',
        description:
          'Türkiye’de İslami ilimler ve İlahiyat eğitimi almak isteyen öğrenciler için TDV Diyanet Bursları başvuruları Şubat ayı boyunca açıktır.',
        startDate: '2026-02-01T00:00:00.000Z',
        endDate: '2026-02-28T23:59:59.000Z',
        timeLabel: '1 Şubat – 28 Şubat • Başvurular Açık',
        location: 'TDV Diyanet Bursları Portalı & Merkez Camii',
        category: 'education',
        featured: true,
        imageUrl: '/images/events/diyanet-scholarship-poster.svg',
        imageAlt: 'TDV Diyanet Bursları Resmi Afişi',
        actionLinks: [
          {
            label: 'TDV Diyanet Bursları Başvurusu',
            url: 'https://diyanetburslari.tdv.org',
            variant: 'primary',
            external: true,
            icon: 'open_in_new',
          },
          {
            label: 'Cami Rehberlik ve Referans',
            url: '/tr/contact-and-visit',
            variant: 'outline',
            external: false,
            icon: 'school',
          },
        ],
        spotlightConfig: {
          enabled: true,
          badgeText: 'Diyanet Bursları • Şubat',
          priority: 15,
          position: 'bottom-end',
          showCountdown: true,
          startAt: '2026-02-01',
          endAt: '2026-02-28',
        },
      },
    ],
  };
