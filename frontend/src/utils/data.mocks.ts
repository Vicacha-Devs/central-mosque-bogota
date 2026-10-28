import type { TEvent } from "./models/events";
import type { TCommunityService } from "./models/services";

export const lemma
  = "La primera y principal mezquita de Bogotá, brindando servicios espirituales y sociales a la comunidad desde hace más de 30 años.";

export const contactInfo = {
  address: "Calle 80 #30-45, Bogotá D.C., Colombia",
  phone: "+57 (601) 123 4567",
  email: "info@mezquitabogota.org",
};

export const fastLinks = [
  { label: "Horarios de Rezo", href: "/schedules" },
  { label: "Donaciones Online", href: "/donations" },
  { label: "Programas Educativos", href: "/educational-programs" },
  { label: "Zakat al-Fitr", href: "/zakat-al-fitr" },
  { label: "Voluntariado", href: "/volunteer" },
];

export const socialNetworkLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/mezquitabogota",
    icon: "facebook" as const,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/mezquitabogota",
    icon: "instagram" as const,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/mezquitabogota",
    icon: "youtube" as const,
  },
];

export const rightsText = {
  copyRight:
    "© 2024 Mezquita Central de Bogotá. Todos los derechos reservados.",
  privacyPolicy: { label: "Política de Privacidad", href: "/privacy-policy" },
  termsAndConditions: {
    label: "Términos y Condiciones",
    href: "/terms-and-conditions",
  },
};

export const navLinks = [
  { label: "Nosotros", href: "/about-us" },
  { label: "Islam", href: "/islam-and-faith" },
  { label: "Prayer", href: "/prayer-information" },
  { label: "Events", href: "/events-and-programs" },
  { label: "Community", href: "/community-services" },
  { label: "Contact", href: "/contact-and-visit" },
];

export const events: Array<TEvent> = [
  {
    category: "Educación",
    title: "Clase de Árabe Clásico",
    description:
      "Aprende los fundamentos del idioma árabe y la gramática del Corán con instructores certificados.",
    schedule: "18:00 - 20:00",
    location: "Mezquita Central de Bogotá",
    url: "#",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA2BT6Jztlh7ad7MeluINOUNUGLjyMu2cEqolZDsyGhQzx1Y7Qy_DH6J2x7sv0GGqxPYbTrWOFyAov6rSkKrZZKH56b_59Sd9zXRHXyTX-LaaCFZAi3nL2bPb0jDCRp0yAu49PriAhAeafH68l9gwX2RpauMK3gETpCE_DPrVmSxJDWUIe81d1Nlbw82je21kBjFqSP_aPzQwYGVZdvPggzO8vfMdwGADXHfRC98B7VPurzaR1xCwMoGB2e--BHc1BTpVyrU7j932XI",
    date: { month: "Oct", day: 15 },
  },
  {
    category: "Comunidad",
    title: "Cena Comunitaria",
    description:
      "Un espacio para compartir alimentos y fortalecer los lazos entre las familias de la comunidad.",
    schedule: "19:30 - 21:30",
    location: "Mezquita Central de Bogotá",
    url: "#",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDB46G_zagethWTQbcfv_b0nnGkofgD0uv8Vy3RDuzUE7ThDDCN6MnwLwYTRjVhRPVmK682qGREveowLbtN3NiAxYL6Df7YhJLJ8eqcOueLp6Tw6R6_9qVnKyVC220IR8rWPbK2tepMhlChwpowpubNFcbktMTPUZCP3baqXkz46WNYKkySntbhAXsMqPux48R10WbKOwy-ghJppPZGXKBOZW_DjOkEVnq02GshAR20e7TdT_0nqGTAhR5xi3uIMwvX73wsEcx5gFIt",
    date: { month: "Oct", day: 18 },
  },
  {
    category: "Jóvenes",
    title: "Círculo de Jóvenes",
    description:
      "Diálogo abierto sobre desafíos contemporáneos y el papel de la juventud en la fe.",
    schedule: "17:00 - 19:00",
    location: "Mezquita Central de Bogotá",
    url: "#",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDW42btUFIp07IZZb16JXmVfA_4CMxaoGAfolrWyVo8rRsmqRIqM0vtKIdradMVnr3Qr7F4D1Vtwjl3kbxrUjwwnJfuFvNO21F1_S8p9-bcAOonShZsIR9-EYqaW6bnQkkbzij0wgNREbDiN_HNU9oykbaGS8psymOJ_g1ouNcpCw4_oqGQu9heyCo5tfBLlt4tOQOkZJ02GZkT6Yd-f0Foyvf80e9_HLgYO1WwpX_doLKuiaEVnR3qfdVU2KpAPzy5fIhicG8Hwv8R",
    date: { month: "Oct", day: 20 },
  },
];

export const defaultServices: Array<TCommunityService> = [
  {
    icon: "menu_book",
    title: "Escuela Coránica",
    description:
      "Clases de árabe y memorización del Corán para niños y adultos de todos los niveles.",
  },
  {
    icon: "volunteer_activism",
    title: "Apoyo Social",
    description:
      "Programas de distribución de alimentos y asistencia a familias necesitadas de la ciudad.",
  },
  {
    icon: "church",
    title: "Bodas & Nikah",
    description:
      "Oficiamos ceremonias matrimoniales islámicas y asesoramiento para parejas.",
  },
  {
    icon: "groups",
    title: "Juventud",
    description:
      "Espacio dedicado a actividades recreativas y educativas para jóvenes musulmanes.",
  },
];

export const mediaHighlights = [
  {
    title: "La importancia de leer el Sagrado Corán",
    href: "#",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3E7lrQkQB_RaV6iMPDiVK7Ec0b8eW78Mh2I5o4BsWJCrzbT6f6hnB1XnvXU4TVwbUqdt43guoQ-_vgvKiKdn3av2dMJ7Ef3LMWVIBHT4A2QngXs40zKXoHjNgf-4xo8aCk4vZP8P8biIAxgVGOOffolXed8kcxom7JVmDrY0Tj2hJhcwRrXna8-V4MiwE_Xidcu9rVfr6yVGB-BvC-VBETgnnTlcbEYInVl0QnW8u8oCHxPNdIiXBWnx-Epf-T7TqVdRP6HUcutM",
    imageAlt: "Podcast 1",
  },
  {
    title: "El Valor de las 5 Oraciones Diarias",
    href: "#",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAX_pOrlKWaBb21MxbHQoGm8DVBDNLoy0YFSQM6fak9nafsSKqy9AoGdRaiKkvWZ2CWQ9AC9eCFUTTv7BnNuxDRdnszV_KXS1QLDDmEtj62BEAIiJSxxz2svEJyCzDf3Xxn0Vyz_9qWSly4ws4PgmP6P1RSxI89Q2JT99wGy-dniYTJ0nmaIccbIjoseFmHBPs8oUC1mgnBDuDChFsxIv49cBiwt_XDMasu9xx6vWQIlhr9yYtcKm5ghsQ26IongjRMKfVM-jb2y9w",
    imageAlt: "Podcast 2",
  },
  {
    title: "La Virtud de Buscar el Conocimiento",
    href: "#",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA3yTR3f77aCob-ydTr3OKP4s8E0dMaVK3cuIke3la64bFhGAlLd2oe1y7UOtvPDRPE3trAOcnapjXdGggsJN_PWqcMhLg-PMZIZG7nFc_sVDGHhLgYf-F0mj3CuFFasrZGGUQNw-6mQ9p9_nRxrtxAGdg1LLI7fD-aAsmlowlSEac54fgD0GZiCn3p6oxo2ukpFtcFNsTdlLpYZGxDd8DgYgDZqdsmsiP2FpM1NwcUFSPakOA7sXxbx999bOCvSu0bC0k9zQYEJ6Y",
    imageAlt: "Podcast 3",
  },
];

export const academyCourses = [
  {
    badgeLabel: "Fundacional",
    badgeTone: "primary",
    title: "Introducción al Árabe Coránico",
    description:
      "Domina las bases de la lectura y escritura del idioma sagrado del Islam desde cero.",
    href: "/academy/introduccion-arabe-coranico",
    ctaIcon: "menu_book",
    imageAlt: "Arabic Calligraphy",
    imageUrl:
      "https://stamptitude.com/cdn/shop/files/Arabic-Calligraphy-Stamp.jpg?v=1747036327&width=1080",
  },
  {
    badgeLabel: "Histórico",
    badgeTone: "secondary",
    title: "Historia del Islam",
    description:
      "Un viaje fascinante por los siglos que forjaron una de las civilizaciones más influyentes.",
    href: "/academy/historia-del-islam",
    ctaIcon: "history_edu",
    imageAlt: "Islamic History Manuscript",
    imageUrl:
      "https://c7c8edde.delivery.rocketcdn.me/wp-content/uploads/sonni-ali-1.jpg",
  },
  {
    badgeLabel: "Práctico",
    badgeTone: "primary",
    title: "Fiqh y Ética",
    description:
      "Aplicación de la jurisprudencia islámica y los valores morales en la vida cotidiana moderna.",
    href: "/academy/fiqh-y-etica",
    ctaIcon: "gavel",
    imageAlt: "Fiqh and Ethics",
    imageUrl:
      "https://halalfoundation.org/wp-content/uploads/2025/03/islamic-jurisprudence-980x491.jpg",
  },
];

export const featuredDonation = {
  title: "Remodelación Sala de Oración",
  description:
    "Tu generosidad permite que la Mezquita Central siga siendo un faro de luz en Bogotá. Cada aporte contribuye al mantenimiento de nuestras instalaciones y al crecimiento de nuestros programas sociales.",
  goal: "$100.000.000 COP",
  raised: "$75.000.000 COP",
  ctaHref: "/donate",
  imageAlt: "Inside Mosque",
  imageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA_gilkVDNWf49Gpn_AO0T3W4CAyawSEg9Fs8QCDx5-0BfVKSk_MGXuRC1NWB3yZORnmbCwPP5CGtUCCqqQLS_ZgvOHXXoU9ZTAs6vTyV8H7Eyxf9HnZluMLXtGsexIiHaBa5Ieq65Gp_XeDzI_P6AMcJX6vP9EzUjICXxOfddgSBvFuceyWt_SiZ_vTxDrBFv5NEy_--M_pcRIa9zRXK6kVZPguMfmAOhoDUzKqajOpOpHt7eyNqwh7pSewKsn5tuIsTaymxA1Gec",
};

export const aboutPageData = {
  heroTitle: "Nuestra Historia y Misión en Bogotá",
  heroSubtitle:
    "Desde la fundación de nuestra comunidad hasta la construcción de la primera mezquita arquitectónica de la capital colombiana.",
  missionTitle: "Nuestra Misión",
  missionBody:
    "Servir a la comunidad musulmana de Bogotá y Colombia mediante un espacio espiritual acogedor para la oración diaria, la educación islámica auténtica, la asistencia social y el diálogo intercultural constructivo.",
  visionTitle: "Nuestra Visión",
  visionBody:
    "Ser un referente de paz, conocimiento, solidaridad y convivencia armónica en América Latina, preservando la identidad islámica y aportando al bienestar de toda la sociedad colombiana.",
  historyTimeline: [
    {
      year: "1979",
      title: "Primeros Encuentros Comunitarios",
      description:
        "Las primeras familias musulmanas e inmigrantes en Bogotá establecen la Asociación Benéfica Islámica para reunirse en oración y apoyo mutuo.",
    },
    {
      year: "2008",
      title: "Adquisición del Lote en la Calle 80",
      description:
        "Con el esfuerzo conjunto de la comunidad local y donantes internacionales, se adquiere el predio estratégico en Barrios Unidos (Calle 80 con Carrera 30).",
    },
    {
      year: "2011",
      title: "Inauguración de la Mezquita Abu Bakr As-Siddiq",
      description:
        "Se culmina la construcción de la primera mezquita de arquitectura clásica islámica en Bogotá, con su emblemática cúpula y minarete.",
    },
    {
      year: "2024",
      title: "Renovación Digital y Expansión Educativa",
      description:
        "Ampliación de los programas de la Academia Coránica, visitas guiadas universitarias y servicios digitales para toda la comunidad.",
    },
  ],
  architectureHighlights: [
    {
      icon: "mosque",
      title: "Cúpula y Minarete Clásico",
      description:
        "Inspirada en la arquitectura otomana y árabe tradicional, visible como símbolo de paz en el corredor de la Calle 80.",
    },
    {
      icon: "auto_awesome",
      title: "Caligrafía y Mihrab",
      description:
        "Detalles ornamentales orientados con precisión hacia la Qibla en La Meca (276.4° desde el norte).",
    },
    {
      icon: "groups",
      title: "Salas de Oración y Biblioteca",
      description:
        "Espacios amplios y separados para hombres y mujeres, aulas de estudio y salón múltiple comunitario.",
    },
  ],
  leaders: [
    {
      name: "Sheikh Ahmad Al-Mansoor",
      slug: "sheikh-ahmad-al-mansoor",
      honorificTitle: "Sheikh / Imam",
      roleTitle: "Imam Principal y Director Espiritual",
      memberCategory: "imam_scholar",
      shortSummary:
        "Licenciado en Ciencias Islámicas y Jurisprudencia (Fiqh). Guía espiritual y Khateeb de la Mezquita Central Abu Bakr As-Siddiq desde 2014.",
      bio: "Licenciado en Ciencias Islámicas y Jurisprudencia (Fiqh). Guía espiritual de la Mezquita Central Abu Bakr As-Siddiq desde 2014.",
      credentials:
        "Licenciatura en Sharia y Jurisprudencia Islámica (Fiqh) · Ijazah en Recitación del Sagrado Corán (Hafs an Asim)",
      officeHours: "Martes a Domingo, 2:00 PM – 5:30 PM",
      languagesSpoken: "Árabe, Español, Inglés",
      showInStaffDirectory: true,
      hasDedicatedPage: true,
      isAuthor: true,
      isKhateeb: true,
    },
    {
      name: "Ustadh Tariq Ramírez",
      slug: "ustadh-tariq-ramirez",
      honorificTitle: "Ustadh",
      roleTitle: "Coordinador de Educación y Nuevos Musulmanes",
      memberCategory: "instructor",
      shortSummary:
        "Especialista en pedagogía islámica, enseñanza del idioma árabe y acompañamiento integral para nuevos musulmanes.",
      bio: "Especialista en pedagogía islámica, enseñanza del idioma árabe y acompañamiento integral para nuevos musulmanes.",
      credentials:
        "Especialización en Lengua Árabe y Estudios Islámicos · Coordinador de la Academia Cultural Mezquita Central",
      officeHours: "Miércoles a Sábado, 10:00 AM – 4:00 PM",
      languagesSpoken: "Español, Árabe, Inglés",
      showInStaffDirectory: true,
      hasDedicatedPage: true,
      isAuthor: true,
      isKhateeb: true,
    },
    {
      name: "Dra. Amina Gómez",
      slug: "dra-amina-gomez",
      honorificTitle: "Dra.",
      roleTitle: "Directora de Acción Social y Programas Familiares",
      memberCategory: "board_administration",
      shortSummary:
        "Lidera los programas de bienestar comunitario, distribución de Zakat y actividades educativas para mujeres y jóvenes.",
      bio: "Lidera los programas de bienestar comunitario, distribución de Zakat y actividades educativas para mujeres y jóvenes.",
      credentials:
        "Doctorado en Desarrollo Social y Comunitario · Directora del Comité de Bienestar y Familia",
      officeHours: "Lunes a Viernes, 9:00 AM – 3:00 PM",
      languagesSpoken: "Español, Inglés",
      showInStaffDirectory: true,
      hasDedicatedPage: true,
      isAuthor: true,
      isKhateeb: false,
    },
    {
      name: "Hajj Ibrahim Al-Khatib",
      slug: "hajj-ibrahim-al-khatib",
      honorificTitle: "Hajj",
      roleTitle: "Encargado de la Mezquita y Muadhin (Qayyim al-Masjid)",
      memberCategory: "staff_caretaker",
      shortSummary:
        "Responsable del cuidado diario del recinto sagrado, apertura para las cinco oraciones, llamado al Adhan y hospitalidad a los visitantes.",
      bio: "Custodio y encargado operativo (Qayyim) de la Mezquita Central Abu Bakr As-Siddiq. Supervisa la apertura puntual para las cinco oraciones diarias, el llamado al Adhan y la recepción hospitalaria de la comunidad y visitantes.",
      credentials:
        "Servicio Comunitario y Custodia de Mezquita desde 2012 · Muadhin Residente",
      officeHours:
        "Todos los días durante los horarios de las 5 oraciones diarias",
      languagesSpoken: "Árabe, Español",
      showInStaffDirectory: true,
      hasDedicatedPage: true,
      isAuthor: false,
      isKhateeb: false,
    },
  ],
};

export const donationCampaigns = [
  {
    slug: "remodelacion-sala-oracion",
    title: "Remodelación Sala de Oración y Sonido",
    description:
      "Mantenimiento de alfombras, iluminación eficiente y actualización del sistema acústico para el Jumu'ah y Ramadán.",
    goalAmount: 100000000,
    raisedAmount: 75000000,
    currency: "COP",
    percent: 75,
  },
  {
    slug: "fondo-zakat-alimentario",
    title: "Fondo de Zakat y Apoyo Alimentario",
    description:
      "Asistencia directa con mercados y ayudas de emergencia para familias vulnerables verificadas en Bogotá.",
    goalAmount: 60000000,
    raisedAmount: 43200000,
    currency: "COP",
    percent: 72,
  },
  {
    slug: "becas-escuela-coranica",
    title: "Becas Escuela Coránica y Material Educativo",
    description:
      "Impresión de literatura islámica en español, ejemplares del Sagrado Corán y becas para niños y nuevos musulmanes.",
    goalAmount: 35000000,
    raisedAmount: 24500000,
    currency: "COP",
    percent: 70,
  },
];

export const paymentMethods = [
  {
    providerName: "Bancolombia",
    accountType: "Cuenta Corriente",
    accountNumber: "192-000458-91",
    accountHolder: "Asociación Benéfica Islámica de Bogotá",
    nit: "860.099.123-4",
    instructions:
      "Realiza tu transferencia especificando en la referencia si corresponde a Zakat, Sadaqah o Mantenimiento.",
  },
  {
    providerName: "Nequi / Bre-B QR",
    accountType: "Billetera Digital",
    accountNumber: "310 555 0199",
    accountHolder: "Mezquita Central Bogotá",
    nit: "860.099.123-4",
    instructions:
      "Envía tu aporte inmediato desde Nequi o cualquier banco colombiano mediante llave Bre-B / código QR.",
  },
  {
    providerName: "Donación en Persona (Recepción)",
    accountType: "Urna Oficial y Recibo Caja",
    accountNumber: "Calle 80 # 30-15",
    accountHolder: "Oficina Administrativa Mezquita",
    nit: "Horario: 9:00 AM - 6:00 PM",
    instructions:
      "Puedes entregar tu donación directamente en la oficina administrativa y solicitar certificado de donación.",
  },
];

export const islamFaithData = {
  shahadaArabic: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ ٱللَّٰهِ",
  shahadaTransliteration:
    "Ash-hadu an la ilaha illa Allah, wa ash-hadu anna Muhammadan Rasulu Allah",
  shahadaTranslation:
    "Atestiguo que no hay divinidad digna de adoración sino Dios (Allah), y atestiguo que Muhammad es el Mensajero de Dios.",
  fivePillars: [
    {
      number: 1,
      arabicName: "الشَّهَادَة",
      transliteration: "Ash-Shahadah",
      title: "Profesión de Fe",
      description:
        "La declaración sincera del monoteísmo puro en un único Creador y la aceptación de Muhammad ﷺ como Su último profeta.",
      icon: "favorite",
    },
    {
      number: 2,
      arabicName: "الصَّلَاة",
      transliteration: "As-Salah",
      title: "La Oración Diaria",
      description:
        "Cinco oraciones diarias que conectan directamente al creyente con Dios en momentos clave del día y la noche.",
      icon: "schedule",
    },
    {
      number: 3,
      arabicName: "الزَّكَاة",
      transliteration: "Az-Zakah",
      title: "Caridad Purificadora",
      description:
        "Aporte anual obligatorio del 2.5% de los ahorros que superan el Nisab para apoyar a los necesitados y purificar la riqueza.",
      icon: "volunteer_activism",
    },
    {
      number: 4,
      arabicName: "الصَّوْم",
      transliteration: "As-Sawm",
      title: "El Ayuno de Ramadán",
      description:
        "Abstinencia desde el alba hasta el ocaso durante el noveno mes lunar para cultivar la piedad, la gratitud y la autodisciplina.",
      icon: "dark_mode",
    },
    {
      number: 5,
      arabicName: "الحَجّ",
      transliteration: "Al-Hajj",
      title: "Peregrinación a La Meca",
      description:
        "Viaje espiritual a la Casa Sagrada en La Meca al menos una vez en la vida para quien cuente con salud y medios económicos.",
      icon: "public",
    },
  ],
  faqs: [
    {
      category: "visiting",
      question: "¿Pueden personas no musulmanas visitar la Mezquita?",
      answer:
        "¡Por supuesto! La Mezquita Central Abu Bakr As-Siddiq da la bienvenida a visitantes, colegios y universidades. Puedes agendar una visita guiada gratuita en nuestra página de Contacto.",
    },
    {
      category: "visiting",
      question: "¿Qué código de vestimenta se recomienda para la visita?",
      answer:
        "Recomendamos ropa modesta y holgada que cubra hombros y piernas (pantalón largo o falda larga). A las mujeres se les proporciona un velo (pañoleta) en la recepción si no cuentan con uno.",
    },
    {
      category: "islam",
      question:
        "¿Cómo puedo aprender más sobre el Islam o pronunciar la Shahada?",
      answer:
        "Ofrecemos clases introductorias gratuitas todos los fines de semana y atención personalizada con nuestro Imam. También puedes descargar nuestras guías en español.",
    },
    {
      category: "donations",
      question: "¿Cómo se calcula el Zakat en pesos colombianos (COP)?",
      answer:
        "Nuestra calculadora en la página de Donaciones consulta en tiempo real el valor del Nisab (85g de oro o 595g de plata) a través de IslamicAPI y calcula automáticamente el 2.5% sobre tu patrimonio neto ahorrado durante un año lunar.",
    },
  ],
};

export const contactVisitData = {
  visitorEtiquette: [
    {
      icon: "checkroom",
      title: "Vestimenta Modesta",
      description:
        "Usa prendas holgadas que cubran brazos y piernas. Las mujeres cubren su cabello dentro del salón de oración (disponemos de pañoletas en la entrada).",
    },
    {
      icon: "do_not_step",
      title: "Retirar el Calzado",
      description:
        "Antes de ingresar a la zona alfombrada del salón de oración, coloca tus zapatos en los estantes habilitados en la entrada.",
    },
    {
      icon: "volume_off",
      title: "Silencio y Respeto",
      description:
        "Mantén el teléfono celular en silencio y habla en voz baja, especialmente cuando los fieles se encuentren realizando la oración.",
    },
    {
      icon: "photo_camera",
      title: "Fotografía Respetuosa",
      description:
        "Puedes tomar fotografías de la arquitectura del recinto, evitando fotografiar directamente a las personas mientras oran sin su consentimiento.",
    },
  ],
  transitDirections: [
    {
      icon: "directions_bus",
      title: "En TransMilenio (Troncal Calle 80 / NQS)",
      description:
        "Bájate en la estación Escuela Militar o Polo (Troncal Calle 80). La mezquita se encuentra exactamente en la esquina de la Calle 80 con Carrera 30.",
    },
    {
      icon: "directions_car",
      title: "En Vehículo Particular",
      description:
        "Acceso directo por la Avenida Calle 80 sentido oriente-occidente o por la Avenida NQS (Carrera 30). Recomendamos llegar temprano los viernes para el Jumu'ah.",
    },
  ],
};

export {
  getLocalizedMocks,
  getDetailedEvents,
  getDetailedArticles,
  getDetailedMediaHighlights,
} from "./localized-mocks";
