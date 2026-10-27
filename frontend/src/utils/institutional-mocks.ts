import type { TLang } from "@i18n/ui";

import {
  aboutPageData,
  donationCampaigns,
  islamFaithData,
  paymentMethods,
} from "./data.mocks";

type TAboutPageSource = typeof aboutPageData;

type TAboutLeader = TAboutPageSource["leaders"][number];
type TAboutLeaderRequired = "name" | "roleTitle" | "bio" | "languagesSpoken";

// CMS-sourced leaders only guarantee the core fields; the rest are optional
export type TAboutPageData = Omit<TAboutPageSource, "leaders"> & {
  leaders: Array<
    Pick<TAboutLeader, TAboutLeaderRequired>
    & Partial<Omit<TAboutLeader, TAboutLeaderRequired>>
  >;
};
export type TIslamFaithData = typeof islamFaithData;
export type TDonationCampaign = (typeof donationCampaigns)[number];
export type TPaymentMethod = (typeof paymentMethods)[number];

type TNonDefaultLang = Exclude<TLang, "es">;

const SHAHADA_ARABIC = "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ ٱللَّٰهِ";
const SHAHADA_TRANSLITERATION
  = "Ash-hadu an la ilaha illa Allah, wa ash-hadu anna Muhammadan Rasulu Allah";

const ABOUT_PAGE_BY_LANG: Record<TNonDefaultLang, TAboutPageData> = {
  en: {
    heroTitle: "Our History and Mission in Bogotá",
    heroSubtitle:
      "From the founding of our community to the construction of the first purpose-built mosque in the Colombian capital.",
    missionTitle: "Our Mission",
    missionBody:
      "To serve the Muslim community of Bogotá and Colombia by providing a welcoming spiritual sanctuary for daily prayer, authentic Islamic education, social welfare, and constructive intercultural dialogue.",
    visionTitle: "Our Vision",
    visionBody:
      "To be a beacon of peace, knowledge, solidarity, and harmonious coexistence in Latin America, preserving Islamic identity while contributing to the well-being of Colombian society.",
    historyTimeline: [
      {
        year: "1979",
        title: "First Community Gatherings",
        description:
          "The first Muslim families and immigrants in Bogotá establish the Islamic Benevolent Association to gather for congregational prayer and mutual support.",
      },
      {
        year: "2008",
        title: "Land Acquisition on Calle 80",
        description:
          "Through the united effort of the local community and international donors, the strategic plot in Barrios Unidos (Calle 80 & Carrera 30) is acquired.",
      },
      {
        year: "2011",
        title: "Inauguration of Abu Bakr As-Siddiq Mosque",
        description:
          "Construction of Bogotá's first classical Islamic mosque is completed, featuring its iconic dome and minaret.",
      },
      {
        year: "2024",
        title: "Digital Renewal & Educational Expansion",
        description:
          "Expansion of Quranic Academy programs, university guided tours, and digital community services.",
      },
    ],
    architectureHighlights: [
      {
        icon: "mosque",
        title: "Classical Dome & Minaret",
        description:
          "Inspired by traditional Ottoman and Arab architecture, standing as a visible symbol of peace along the Calle 80 corridor.",
      },
      {
        icon: "auto_awesome",
        title: "Calligraphy & Mihrab",
        description:
          "Ornamental details precisely oriented toward the Qibla in Makkah (64.93° NE from Bogotá).",
      },
      {
        icon: "groups",
        title: "Prayer Halls & Library",
        description:
          "Spacious dedicated prayer areas for men and women, study classrooms, and a multipurpose community hall.",
      },
    ],
    leaders: [
      {
        name: "Sheikh Ahmad Al-Mansoor",
        slug: "sheikh-ahmad-al-mansoor",
        honorificTitle: "Sheikh / Imam",
        roleTitle: "Resident Imam & Spiritual Director",
        memberCategory: "imam_scholar",
        shortSummary:
          "B.A. in Islamic Sciences and Jurisprudence (Fiqh). Spiritual leader and Friday Khateeb of the Abu Bakr As-Siddiq Central Mosque since 2014.",
        bio: "B.A. in Islamic Sciences and Jurisprudence (Fiqh). Spiritual leader of the Abu Bakr As-Siddiq Central Mosque since 2014.",
        credentials:
          "B.A. in Sharia & Islamic Jurisprudence (Fiqh) · Ijazah in Quranic Recitation (Hafs an Asim)",
        officeHours: "Tuesday to Sunday, 2:00 PM – 5:30 PM",
        languagesSpoken: "Arabic, Spanish, English",
        showInStaffDirectory: true,
        hasDedicatedPage: true,
        isAuthor: true,
        isKhateeb: true,
      },
      {
        name: "Ustadh Tariq Ramírez",
        slug: "ustadh-tariq-ramirez",
        honorificTitle: "Ustadh",
        roleTitle: "Director of Education & New Muslim Support",
        memberCategory: "instructor",
        shortSummary:
          "Specialist in Islamic pedagogy, Arabic language instruction, and comprehensive mentorship for new Muslims.",
        bio: "Specialist in Islamic pedagogy, Arabic language instruction, and comprehensive mentorship for new Muslims.",
        credentials:
          "Diploma in Arabic Language & Islamic Studies · Head of Mosque Cultural Academy",
        officeHours: "Wednesday to Saturday, 10:00 AM – 4:00 PM",
        languagesSpoken: "Spanish, Arabic, English",
        showInStaffDirectory: true,
        hasDedicatedPage: true,
        isAuthor: true,
        isKhateeb: true,
      },
      {
        name: "Dr. Amina Gómez",
        slug: "dra-amina-gomez",
        honorificTitle: "Dr.",
        roleTitle: "Director of Social Outreach & Family Programs",
        memberCategory: "board_administration",
        shortSummary:
          "Leads community welfare initiatives, Zakat distribution, and educational programs for women and youth.",
        bio: "Leads community welfare initiatives, Zakat distribution, and educational programs for women and youth.",
        credentials:
          "Ph.D. in Social & Community Development · Director of Family & Welfare Committee",
        officeHours: "Monday to Friday, 9:00 AM – 3:00 PM",
        languagesSpoken: "Spanish, English",
        showInStaffDirectory: true,
        hasDedicatedPage: true,
        isAuthor: true,
        isKhateeb: false,
      },
      {
        name: "Hajj Ibrahim Al-Khatib",
        slug: "hajj-ibrahim-al-khatib",
        honorificTitle: "Hajj",
        roleTitle: "Mosque Caretaker & Resident Muadhin (Qayyim al-Masjid)",
        memberCategory: "staff_caretaker",
        shortSummary:
          "Oversees the daily care of the sanctuary, opening for all five daily prayers, calling the Adhan, and welcoming guests.",
        bio: "Custodian and operations caretaker (Qayyim) of the Abu Bakr As-Siddiq Central Mosque. Oversees daily opening for the five congregational prayers, calling the Adhan, and hospitality for worshippers and visitors.",
        credentials:
          "Mosque Custodianship & Community Service since 2012 · Resident Muadhin",
        officeHours: "Daily across all 5 congregational prayer times",
        languagesSpoken: "Arabic, Spanish",
        showInStaffDirectory: true,
        hasDedicatedPage: true,
        isAuthor: false,
        isKhateeb: false,
      },
    ],
  },
  ar: {
    heroTitle: "تاريخنا ورسالتنا في بوغوتا",
    heroSubtitle:
      "منذ تأسيس جاليتنا وحتى تشييد أول مسجد ذي طراز معماري إسلامي في العاصمة الكولومبية.",
    missionTitle: "رسالتنا",
    missionBody:
      "خدمة المجتمع المسلم في بوغوتا وكولومبيا من خلال توفير رحاب إيمانية جامعة للصلوات اليومية، والتعليم الإسلامي الأصيل، والتكافل الاجتماعي، والحوار الحضاري البنّاء.",
    visionTitle: "رؤيتنا",
    visionBody:
      "أن نكون منارةً للسلام والعلم والتضامن والتعايش المشترك في أمريكا اللاتينية، مع الحفاظ على الهوية الإسلامية والإسهام الإيجابي في المجتمع الكولومبي.",
    historyTimeline: [
      {
        year: "1979",
        title: "اللقاءات الأولى للجالية",
        description:
          "تأسيس الجمعية الخيرية الإسلامية في بوغوتا من قِبل العائلات المسلمة الأولى لإقامة صلاة الجماعة والتكافل.",
      },
      {
        year: "2008",
        title: "شراء الأرض في شارع 80",
        description:
          "بفضل تضافر جهود أبناء الجالية والمحسنين، تم شراء الموقع الاستراتيجي في حي باريوس أونيدوس (شارع 80 مع كاريرا 30).",
      },
      {
        year: "2011",
        title: "افتتاح مسجد أبو بكر الصديق",
        description:
          "إتمام بناء أول مسجد بطراز معماري إسلامي كلاسيكي في بوغوتا بقبته ومئذنته البارزة.",
      },
      {
        year: "2024",
        title: "التجديد الرقمي والتوسع التعليمي",
        description:
          "توسيع برامج المدرسة القرآنية، والزيارات الجامعية التعريفية، والخدمات الرقمية للجالية.",
      },
    ],
    architectureHighlights: [
      {
        icon: "mosque",
        title: "القبة والمئذنة الكلاسيكية",
        description:
          "تصميم مستوحى من العمارة الإسلامية التقليدية يقف رمزاً للسلام والتآخي على محور شارع 80.",
      },
      {
        icon: "auto_awesome",
        title: "الخط العربي والمحراب",
        description:
          "زخارف إسلامية ومحراب موجّه بدقة نحو القبلة المشرفة في مكة المكرمة (64.93° شمال شرق).",
      },
      {
        icon: "groups",
        title: "قاعات الصلاة والمكتبة",
        description:
          "مصليات واسعة للرجال والنساء، وفصول دراسية، وقاعة متعددة الأغراض للأنشطة المجتمعية.",
      },
    ],
    leaders: [
      {
        name: "الشيخ أحمد المنصور",
        slug: "sheikh-ahmad-al-mansoor",
        honorificTitle: "فضيلة الشيخ / الإمام",
        roleTitle: "إمام المسجد والمدير الشرعي",
        memberCategory: "imam_scholar",
        shortSummary:
          "إجازة في العلوم الإسلامية والفقه، وإمام وخطيب مسجد أبو بكر الصديق المركزي منذ عام 2014.",
        bio: "إجازة في العلوم الإسلامية والفقه، وإمام وخطيب مسجد أبو بكر الصديق المركزي منذ عام 2014.",
        credentials:
          "بكالوريوس في الشريعة والفقه الإسلامي · إجازة في تلاوة القرآن الكريم برواية حفص عن عاصم",
        officeHours: "من الثلاثاء إلى الأحد، 2:00 ظهراً – 5:30 مساءً",
        languagesSpoken: "العربية، الإسبانية، الإنجليزية",
        showInStaffDirectory: true,
        hasDedicatedPage: true,
        isAuthor: true,
        isKhateeb: true,
      },
      {
        name: "الأستاذ طارق راميريز",
        slug: "ustadh-tariq-ramirez",
        honorificTitle: "الأستاذ",
        roleTitle: "منسق التعليم ورعاية المسلمين الجدد",
        memberCategory: "instructor",
        shortSummary:
          "متخصص في التربية الإسلامية وتعليم اللغة العربية ومرافقة المهتدين الجدد.",
        bio: "متخصص في التربية الإسلامية وتعليم اللغة العربية ومرافقة المهتدين الجدد.",
        credentials:
          "دبلوم في اللغة العربية والدراسات الإسلامية · منسق الأكاديمية الثقافية بالمسجد",
        officeHours: "من الأربعاء إلى السبت، 10:00 صباحاً – 4:00 عصراً",
        languagesSpoken: "الإسبانية، العربية، الإنجليزية",
        showInStaffDirectory: true,
        hasDedicatedPage: true,
        isAuthor: true,
        isKhateeb: true,
      },
      {
        name: "د. أمينة غوميز",
        slug: "dra-amina-gomez",
        honorificTitle: "الدكتورة",
        roleTitle: "مديرة العمل الاجتماعي وبرامج الأسرة",
        memberCategory: "board_administration",
        shortSummary:
          "تشرف على مبادرات التكافل الاجتماعي وتوزيع الزكاة والبرامج التعليمية للنساء والشباب.",
        bio: "تشرف على مبادرات التكافل الاجتماعي وتوزيع الزكاة والبرامج التعليمية للنساء والشباب.",
        credentials:
          "دكتوراه في التنمية الاجتماعية والمجتمعية · مديرة لجنة الأسرة والتكافل",
        officeHours: "من الإثنين إلى الجمعة، 9:00 صباحاً – 3:00 عصراً",
        languagesSpoken: "الإسبانية، الإنجليزية",
        showInStaffDirectory: true,
        hasDedicatedPage: true,
        isAuthor: true,
        isKhateeb: false,
      },
      {
        name: "الحاج إبراهيم الخطيب",
        slug: "hajj-ibrahim-al-khatib",
        honorificTitle: "الحاج",
        roleTitle: "قيّم المسجد والمؤذن المقيم",
        memberCategory: "staff_caretaker",
        shortSummary:
          "مسؤول عن رعاية المسجد اليومية وفتحه للصلوات الخمس ورفع الأذان واستقبال المصلين والزوار.",
        bio: "قيّم مسجد أبو بكر الصديق المركزي والمؤذن المقيم. يشرف على فتح المسجد للصلوات الخمس اليومية، والعناية بمصليات الرجال والنساء، ورفع الأذان، وحسن وفادة المصلين والزوار.",
        credentials: "خدمة ورعاية بيت الله منذ عام 2012 · المؤذن المقيم",
        officeHours: "يومياً خلال أوقات الصلوات الخمس",
        languagesSpoken: "العربية، الإسبانية",
        showInStaffDirectory: true,
        hasDedicatedPage: true,
        isAuthor: false,
        isKhateeb: false,
      },
    ],
  },
  tr: {
    heroTitle: "Bogota'daki Tarihimiz ve Misyonumuz",
    heroSubtitle:
      "Cemaatimizin kuruluşundan Kolombiya başkentindeki ilk müstakil caminin inşasına uzanan yolculuğumuz.",
    missionTitle: "Misyonumuz",
    missionBody:
      "Bogota ve Kolombiya'daki Müslüman toplumuna günlük ibadet, sahih İslami eğitim, sosyal yardımlaşma ve kültürlerarası diyalog için huzurlu bir manevi merkez sunmak.",
    visionTitle: "Vizyonumuz",
    visionBody:
      "İslami kimliği koruyarak Kolombiya toplumunun refahına katkıda bulunan, Latin Amerika'da barış, ilim, dayanışma ve birlikte yaşama kültürünün öncüsü olmak.",
    historyTimeline: [
      {
        year: "1979",
        title: "İlk Cemaat Buluşmaları",
        description:
          "Bogota'daki ilk Müslüman aileler cemaatle namaz ve dayanışma amacıyla İslam Hayır Cemiyeti'ni kurdu.",
      },
      {
        year: "2008",
        title: "Calle 80'deki Arsanın Satın Alınması",
        description:
          "Yerel cemaat ve uluslararası hayırseverlerin ortak gayretiyle Barrios Unidos'taki (Calle 80 & Carrera 30) stratejik arsa satın alındı.",
      },
      {
        year: "2011",
        title: "Ebû Bekir Es-Sıddîk Camii'nin Açılışı",
        description:
          "Bogota'nın kubbe ve minareye sahip ilk klasik İslam mimarisiyle inşa edilen camisi ibadete açıldı.",
      },
      {
        year: "2024",
        title: "Dijital Yenilenme ve Eğitim Hamlesi",
        description:
          "Kur'an Akademisi kurslarının, üniversite rehberli ziyaretlerinin ve dijital cemaat hizmetlerinin genişletilmesi.",
      },
    ],
    architectureHighlights: [
      {
        icon: "mosque",
        title: "Klasik Kubbe ve Minare",
        description:
          "Geleneksel Osmanlı ve Arap mimarisinden ilham alan, Calle 80 bulvarında barışın sembolü olarak yükselen mimari.",
      },
      {
        icon: "auto_awesome",
        title: "Hüsn-i Hat ve Mihrap",
        description:
          "Mekke-i Mükerreme'deki Kâbe-i Muazzama yönüne (64.93° KD) hassas şekilde hizalanmış mihrap ve hat işlemeleri.",
      },
      {
        icon: "groups",
        title: "Namaz Salonları ve Kütüphane",
        description:
          "Erkekler ve kadınlar için geniş ve ayrı ibadet alanları, derslikler ve çok amaçlı toplantı salonu.",
      },
    ],
    leaders: [
      {
        name: "Şeyh Ahmad Al-Mansoor",
        slug: "sheikh-ahmad-al-mansoor",
        honorificTitle: "Şeyh / İmam",
        roleTitle: "Baş İmam ve Manevi Rehber",
        memberCategory: "imam_scholar",
        shortSummary:
          "İslami İlimler ve Fıkıh mezunu. 2014'ten bu yana Ebû Bekir Es-Sıddîk Merkez Camii'nin baş imamı ve Cuma hatibi.",
        bio: "İslami İlimler ve Fıkıh mezunu. 2014'ten bu yana Ebû Bekir Es-Sıddîk Merkez Camii'nin baş imamı.",
        credentials:
          "İslam Hukuku (Şeriat ve Fıkıh) Lisansı · Kur'ân-ı Kerîm Kıraat İcazeti",
        officeHours: "Salı – Pazar, 14:00 – 17:30",
        languagesSpoken: "Arapça, İspanyolca, İngilizce",
        showInStaffDirectory: true,
        hasDedicatedPage: true,
        isAuthor: true,
        isKhateeb: true,
      },
      {
        name: "Üstad Tariq Ramírez",
        slug: "ustadh-tariq-ramirez",
        honorificTitle: "Üstad",
        roleTitle: "Eğitim ve Yeni Müslümanlar Koordinatörü",
        memberCategory: "instructor",
        shortSummary:
          "İslami pedagoji, Arapça öğretimi ve yeni Müslümanlara rehberlik alanında uzman.",
        bio: "İslami pedagoji, Arapça öğretimi ve yeni Müslümanlara rehberlik alanında uzman.",
        credentials:
          "Arap Dili ve İslami İlimler Uzmanlığı · Cami Kültür Akademisi Koordinatörü",
        officeHours: "Çarşamba – Cumartesi, 10:00 – 16:00",
        languagesSpoken: "İspanyolca, Arapça, İngilizce",
        showInStaffDirectory: true,
        hasDedicatedPage: true,
        isAuthor: true,
        isKhateeb: true,
      },
      {
        name: "Dr. Amina Gómez",
        slug: "dra-amina-gomez",
        honorificTitle: "Dr.",
        roleTitle: "Sosyal Hizmetler ve Aile Programları Direktörü",
        memberCategory: "board_administration",
        shortSummary:
          "Sosyal yardımlaşma, zekât dağıtımı ile kadın ve gençlik eğitim programlarını yönetmektedir.",
        bio: "Sosyal yardımlaşma, zekât dağıtımı ile kadın ve gençlik eğitim programlarını yönetmektedir.",
        credentials:
          "Sosyal ve Toplumsal Kalkınma Doktorası · Aile ve Yardımlaşma Komitesi Direktörü",
        officeHours: "Pazartesi – Cuma, 09:00 – 15:00",
        languagesSpoken: "İspanyolca, İngilizce",
        showInStaffDirectory: true,
        hasDedicatedPage: true,
        isAuthor: true,
        isKhateeb: false,
      },
      {
        name: "Hacı İbrahim El-Hatib",
        slug: "hajj-ibrahim-al-khatib",
        honorificTitle: "Hacı",
        roleTitle: "Cami Görevlisi ve Müezzin (Kayyim)",
        memberCategory: "staff_caretaker",
        shortSummary:
          "Caminin günlük bakımı, beş vakit namaz için açılışı, ezan okunması ve ziyaretçilerin ağırlanmasından sorumludur.",
        bio: "Ebû Bekir Es-Sıddîk Merkez Camii'nin cami görevlisi (Kayyim) ve mukim müezzini. Beş vakit namaz için caminin açılışını, ezanların okunmasını ve misafirperverliği koordine eder.",
        credentials: "2012'den Beri Cami Hizmeti ve Müezzinlik Görevi",
        officeHours: "Her gün beş vakit namaz saatlerinde",
        languagesSpoken: "Arapça, İspanyolca",
        showInStaffDirectory: true,
        hasDedicatedPage: true,
        isAuthor: false,
        isKhateeb: false,
      },
    ],
  },
};

const ISLAM_FAITH_BY_LANG: Record<TNonDefaultLang, TIslamFaithData> = {
  en: {
    shahadaArabic: SHAHADA_ARABIC,
    shahadaTransliteration: SHAHADA_TRANSLITERATION,
    shahadaTranslation:
      "I bear witness that there is no deity worthy of worship except God (Allah), and I bear witness that Muhammad is the Messenger of God.",
    fivePillars: [
      {
        number: 1,
        arabicName: "الشَّهَادَة",
        transliteration: "Ash-Shahadah",
        title: "Declaration of Faith",
        description:
          "The sincere testimony of pure monotheism in One Creator and acceptance of Muhammad ﷺ as His final messenger.",
        icon: "favorite",
      },
      {
        number: 2,
        arabicName: "الصَّلَاة",
        transliteration: "As-Salah",
        title: "Daily Prayer",
        description:
          "Five daily prayers that directly connect the believer with God at key intervals throughout the day and night.",
        icon: "schedule",
      },
      {
        number: 3,
        arabicName: "الزَّكَاة",
        transliteration: "Az-Zakah",
        title: "Purifying Almsgiving",
        description:
          "An obligatory annual contribution of 2.5% of net savings above the Nisab threshold to support those in need.",
        icon: "volunteer_activism",
      },
      {
        number: 4,
        arabicName: "الصَّوْم",
        transliteration: "As-Sawm",
        title: "Fasting in Ramadan",
        description:
          "Abstaining from dawn to sunset during the ninth lunar month to cultivate piety, gratitude, and self-discipline.",
        icon: "dark_mode",
      },
      {
        number: 5,
        arabicName: "الحَجّ",
        transliteration: "Al-Hajj",
        title: "Pilgrimage to Makkah",
        description:
          "A spiritual journey to the Sacred House in Makkah at least once in a lifetime for those who are physically and financially able.",
        icon: "public",
      },
    ],
    faqs: [
      {
        category: "visiting",
        question: "Can non-Muslims visit the Central Mosque?",
        answer:
          "Absolutely! The Abu Bakr As-Siddiq Central Mosque welcomes visitors, schools, and universities. You can book a free guided visit on our Contact page.",
      },
      {
        category: "visiting",
        question: "What dress code is recommended when visiting?",
        answer:
          "We recommend modest, loose-fitting clothing that covers shoulders and legs (long trousers or a long skirt). Headscarves are provided for women at reception if needed.",
      },
      {
        category: "islam",
        question: "How can I learn more about Islam or take my Shahada?",
        answer:
          "We offer free introductory classes every weekend as well as one-on-one sessions with our Imam. You can also download our introductory guides.",
      },
      {
        category: "donations",
        question: "How is Zakat calculated in Colombian Pesos (COP)?",
        answer:
          "Our calculator on the Donate page fetches live Nisab thresholds (85g of gold or 595g of silver) and automatically computes 2.5% on net zakatable wealth held for one lunar year.",
      },
    ],
  },
  ar: {
    shahadaArabic: SHAHADA_ARABIC,
    shahadaTransliteration: SHAHADA_TRANSLITERATION,
    shahadaTranslation:
      "أشهد أن لا إله إلا الله وحده لا شريك له، وأشهد أن محمداً عبده ورسوله.",
    fivePillars: [
      {
        number: 1,
        arabicName: "الشَّهَادَة",
        transliteration: "Ash-Shahadah",
        title: "الشهادتان",
        description:
          "الإقرار الخالص بتوحيد الله عز وجل والإيمان برسالة النبي محمد ﷺ خاتم الأنبياء والمرسلين.",
        icon: "favorite",
      },
      {
        number: 2,
        arabicName: "الصَّلَاة",
        transliteration: "As-Salah",
        title: "إقام الصلاة",
        description:
          "الصلوات الخمس المفروضة في اليوم والليلة صلةً مباشرة بين العبد وربه وطمأنينة للقلب.",
        icon: "schedule",
      },
      {
        number: 3,
        arabicName: "الزَّكَاة",
        transliteration: "Az-Zakah",
        title: "إيتاء الزكاة",
        description:
          "إخراج 2.5% سنوياً من الأموال المدخرة التي بلغت النصاب وحال عليها الحول تطهيراً للمال ودعماً للمستحقين.",
        icon: "volunteer_activism",
      },
      {
        number: 4,
        arabicName: "الصَّوْم",
        transliteration: "As-Sawm",
        title: "صوم رمضان",
        description:
          "الإمساك عن المفطرات من طلوع الفجر إلى غروب الشمس في شهر رمضان المبارك تحقيقاً للتقوى.",
        icon: "dark_mode",
      },
      {
        number: 5,
        arabicName: "الحَجّ",
        transliteration: "Al-Hajj",
        title: "حج البيت",
        description:
          "قصد بيت الله الحرام في مكة المكرمة لأداء مناسك الحج مرةً في العمر لمن استطاع إليه سبيلاً.",
        icon: "public",
      },
    ],
    faqs: [
      {
        category: "visiting",
        question: "هل يمكن لغير المسلمين زيارة المسجد المركزي؟",
        answer:
          "بكل ترحيب! يفتح مسجد أبو بكر الصديق أبوابه للزوار والمدارس والجامعات. يمكنكم حجز جولة تعريفية مجانية عبر صفحة التواصل.",
      },
      {
        category: "visiting",
        question: "ما هي ضوابط اللباس الموصى بها عند الزيارة؟",
        answer:
          "نوصي بارتداء ملابس محتشمة وفضفاضة تغطي الكتفين والساقين، وتتوفر أغطية رأس للزائرات عند مكتب الاستقبال.",
      },
      {
        category: "islam",
        question: "كيف يمكنني التعرف أكثر على الإسلام أو نطق الشهادتين؟",
        answer:
          "نقدم دروساً تعريفية أسبوعية مجانية وجلسات فردية مع إمام المسجد، كما يمكنك تحميل الكتب والأدلة التعريفية من المكتبة الرقمية.",
      },
      {
        category: "donations",
        question: "كيف تُحسب زكاة المال بالبيزو الكولومبي (COP)؟",
        answer:
          "تعتمد حاسبة الزكاة في صفحة التبرعات على قيمة نصاب الذهب (85 غراماً) أو الفضة (595 غراماً) وتحسب 2.5% من صافي المدخرات التي حال عليها الحول.",
      },
    ],
  },
  tr: {
    shahadaArabic: SHAHADA_ARABIC,
    shahadaTransliteration: SHAHADA_TRANSLITERATION,
    shahadaTranslation:
      "Şehadet ederim ki Allah'tan başka ilah yoktur ve yine şehadet ederim ki Muhammed O'nun kulu ve elçisidir.",
    fivePillars: [
      {
        number: 1,
        arabicName: "الشَّهَادَة",
        transliteration: "Ash-Shahadah",
        title: "Kelime-i Şehadet",
        description:
          "Tek Yaratıcı olan Allah'ın birliğine ve Hz. Muhammed'in ﷺ O'nun son elçisi olduğuna gönülden şahitlik etmek.",
        icon: "favorite",
      },
      {
        number: 2,
        arabicName: "الصَّلَاة",
        transliteration: "As-Salah",
        title: "Namaz Kılmak",
        description:
          "Kulun günün belirli vakitlerinde doğrudan Rabbiyle buluştuğu günde beş vakit farz ibadet.",
        icon: "schedule",
      },
      {
        number: 3,
        arabicName: "الزَّكَاة",
        transliteration: "Az-Zakah",
        title: "Zekât Vermek",
        description:
          "Nisap miktarını aşan bir yıllık birikimin %2,5'ini ihtiyaç sahipleriyle paylaşarak malı arındırmak.",
        icon: "volunteer_activism",
      },
      {
        number: 4,
        arabicName: "الصَّوْم",
        transliteration: "As-Sawm",
        title: "Ramazan Orucu",
        description:
          "Takva, şükür ve irade eğitimi için Ramazan ayı boyunca imsak vaktinden akşam ezanına kadar oruç tutmak.",
        icon: "dark_mode",
      },
      {
        number: 5,
        arabicName: "الحَجّ",
        transliteration: "Al-Hajj",
        title: "Hacca Gitmek",
        description:
          "Sağlığı ve mali durumu elveren her Müslümanın ömründe bir kez Mekke'deki Kâbe-i Muazzama'yı ziyaret etmesi.",
        icon: "public",
      },
    ],
    faqs: [
      {
        category: "visiting",
        question: "Müslüman olmayanlar Merkez Camii'ni ziyaret edebilir mi?",
        answer:
          "Elbette! Ebû Bekir Es-Sıddîk Merkez Camii tüm ziyaretçilere, okullara ve üniversitelere açıktır. İletişim sayfamızdan ücretsiz rehberli tur randevusu alabilirsiniz.",
      },
      {
        category: "visiting",
        question: "Ziyaret sırasında nasıl bir kıyafet tercih edilmelidir?",
        answer:
          "Omuzları ve bacakları örten sade ve bol kıyafetler tavsiye edilir. Kadın ziyaretçilerimiz için girişte başörtüsü temin edilmektedir.",
      },
      {
        category: "islam",
        question:
          "İslam hakkında nasıl bilgi alabilir veya Kelime-i Şehadet getirebilirim?",
        answer:
          "Hafta sonları ücretsiz tanıtım derslerimiz ve İmamımızla birebir görüşme imkânımız mevcuttur. Ayrıca dijital kütüphanemizden rehberlerimizi indirebilirsiniz.",
      },
      {
        category: "donations",
        question: "Kolombiya Pezosu (COP) cinsinden Zekât nasıl hesaplanır?",
        answer:
          "Bağış sayfasındaki hesaplayıcımız güncel altın (85g) ve gümüş (595g) nisap değerlerini baz alarak net varlığınızın %2,5'ini otomatik olarak hesaplar.",
      },
    ],
  },
};

const DONATION_CAMPAIGNS_BY_LANG: Record<
  TNonDefaultLang,
  Array<TDonationCampaign>
> = {
  en: [
    {
      slug: "remodelacion-sala-oracion",
      title: "Prayer Hall & Acoustic System Upgrade",
      description:
        "Carpet maintenance, energy-efficient lighting, and audio system upgrade for Friday Jumu'ah and Ramadan.",
      goalAmount: 100000000,
      raisedAmount: 75000000,
      currency: "COP",
      percent: 75,
    },
    {
      slug: "fondo-zakat-alimentario",
      title: "Zakat & Food Security Fund",
      description:
        "Direct grocery packages and emergency relief for verified vulnerable families in Bogotá.",
      goalAmount: 60000000,
      raisedAmount: 43200000,
      currency: "COP",
      percent: 72,
    },
    {
      slug: "becas-escuela-coranica",
      title: "Quranic Academy Scholarships & Books",
      description:
        "Printing Spanish Islamic literature, copies of the Holy Quran, and scholarships for children and new Muslims.",
      goalAmount: 35000000,
      raisedAmount: 24500000,
      currency: "COP",
      percent: 70,
    },
  ],
  ar: [
    {
      slug: "remodelacion-sala-oracion",
      title: "تأهيل قاعة الصلاة والنظام الصوتي",
      description:
        "صيانة السجاد وتحديث الإضاءة والنظام الصوتي لصلاة الجمعة وشهر رمضان المبارك.",
      goalAmount: 100000000,
      raisedAmount: 75000000,
      currency: "COP",
      percent: 75,
    },
    {
      slug: "fondo-zakat-alimentario",
      title: "صندوق الزكاة والدعم الغذائي",
      description:
        "توزيع السلال الغذائية والمساعدات الطارئة للأسر المتعففة المسجلة في بوغوتا.",
      goalAmount: 60000000,
      raisedAmount: 43200000,
      currency: "COP",
      percent: 72,
    },
    {
      slug: "becas-escuela-coranica",
      title: "منح المدرسة القرآنية والمصاحف والكتب",
      description:
        "طباعة الكتب الإسلامية باللغة الإسبانية وتوفير المصاحف المترجمة وكفالة طلاب العلم والمسلمين الجدد.",
      goalAmount: 35000000,
      raisedAmount: 24500000,
      currency: "COP",
      percent: 70,
    },
  ],
  tr: [
    {
      slug: "remodelacion-sala-oracion",
      title: "Namaz Salonu ve Ses Sistemi Yenilemesi",
      description:
        "Cuma ve Ramazan ibadetleri için halı bakımı, enerji tasarruflu aydınlatma ve ses sistemi güncellemesi.",
      goalAmount: 100000000,
      raisedAmount: 75000000,
      currency: "COP",
      percent: 75,
    },
    {
      slug: "fondo-zakat-alimentario",
      title: "Zekât ve Gıda Yardım Fonu",
      description:
        "Bogota'daki ihtiyaç sahibi ailelere doğrudan gıda kolisi ve acil nakdi destek.",
      goalAmount: 60000000,
      raisedAmount: 43200000,
      currency: "COP",
      percent: 72,
    },
    {
      slug: "becas-escuela-coranica",
      title: "Kur'an Akademisi Bursları ve Eğitim Materyali",
      description:
        "İspanyolca İslami eserlerin basımı, Kur'an-ı Kerim mealleri ve öğrenciler için eğitim bursları.",
      goalAmount: 35000000,
      raisedAmount: 24500000,
      currency: "COP",
      percent: 70,
    },
  ],
};

const PAYMENT_METHODS_BY_LANG: Record<
  TNonDefaultLang,
  Array<TPaymentMethod>
> = {
  en: [
    {
      providerName: "Bancolombia",
      accountType: "Checking Account (Cuenta Corriente)",
      accountNumber: "192-000458-91",
      accountHolder: "Asociación Benéfica Islámica de Bogotá",
      nit: "860.099.123-4",
      instructions:
        "Specify in the transfer reference whether your contribution is for Zakat, Sadaqah, Waqf, or Utility Bills.",
    },
    {
      providerName: "Nequi / Bre-B QR",
      accountType: "Instant Digital Wallet",
      accountNumber: "310 555 0199",
      accountHolder: "Mezquita Central Bogotá",
      nit: "860.099.123-4",
      instructions:
        "Send your instant transfer from Nequi or any Colombian bank via Bre-B key / QR code.",
    },
    {
      providerName: "In-Person Donation (Reception)",
      accountType: "Official Donation Box & Receipt",
      accountNumber: "Calle 80 # 30-15",
      accountHolder: "Mosque Administrative Office",
      nit: "Hours: 9:00 AM - 6:00 PM",
      instructions:
        "You may deliver your contribution in person at the administrative office and request an official tax receipt.",
    },
  ],
  ar: [
    {
      providerName: "Bancolombia",
      accountType: "حساب جارٍ (Cuenta Corriente)",
      accountNumber: "192-000458-91",
      accountHolder: "Asociación Benéfica Islámica de Bogotá",
      nit: "860.099.123-4",
      instructions:
        "يرجى تحديد نوع التبرع في مرجع التحويل (زكاة، صدقة، وقف، أو سداد فواتير المسجد).",
    },
    {
      providerName: "Nequi / Bre-B QR",
      accountType: "محفظة رقمية فورية",
      accountNumber: "310 555 0199",
      accountHolder: "Mezquita Central Bogotá",
      nit: "860.099.123-4",
      instructions:
        "أرسل مساهمتك الفورية عبر تطبيق Nequi أو أي بنك كولومبي باستخدام مفتاح Bre-B أو رمز QR.",
    },
    {
      providerName: "التبرع المباشر في مكتب المسجد",
      accountType: "صندوق التبرعات الرسمي وإيصال الاستلام",
      accountNumber: "Calle 80 # 30-15",
      accountHolder: "المكتب الإداري للمسجد",
      nit: "أوقات العمل: 9:00 صباحاً - 6:00 مساءً",
      instructions:
        "يمكنكم تسليم تبرعاتكم مباشرة في المكتب الإداري للمسجد وطلب شهادة التبرع الرسمية.",
    },
  ],
  tr: [
    {
      providerName: "Bancolombia",
      accountType: "Cari Hesap (Cuenta Corriente)",
      accountNumber: "192-000458-91",
      accountHolder: "Asociación Benéfica Islámica de Bogotá",
      nit: "860.099.123-4",
      instructions:
        "Havale açıklamasında bağışınızın Zekât, Sadaka, Vakıf veya Cami Faturası için olduğunu belirtiniz.",
    },
    {
      providerName: "Nequi / Bre-B QR",
      accountType: "Dijital Cüzdan",
      accountNumber: "310 555 0199",
      accountHolder: "Mezquita Central Bogotá",
      nit: "860.099.123-4",
      instructions:
        "Nequi veya herhangi bir Kolombiya bankasından Bre-B anahtarı / QR kodu ile anında katkıda bulunun.",
    },
    {
      providerName: "Elden Bağış (Cami İdaresi)",
      accountType: "Resmi Bağış Makbuzu",
      accountNumber: "Calle 80 # 30-15",
      accountHolder: "Cami İdari Ofisi",
      nit: "Saatler: 09:00 - 18:00",
      instructions:
        "Bağışınızı doğrudan idari ofisimize teslim edebilir ve resmi bağış makbuzu talep edebilirsiniz.",
    },
  ],
};

export function getLocalizedAboutPageData(lang: TLang): TAboutPageData {
  if (lang === "es") return aboutPageData;
  return ABOUT_PAGE_BY_LANG[lang];
}

export function getLocalizedIslamFaithData(lang: TLang): TIslamFaithData {
  if (lang === "es") return islamFaithData;
  return ISLAM_FAITH_BY_LANG[lang];
}

type TCampaignList = Array<TDonationCampaign>;

export function getLocalizedDonationCampaigns(lang: TLang): TCampaignList {
  if (lang === "es") return donationCampaigns;
  return DONATION_CAMPAIGNS_BY_LANG[lang];
}

export function getLocalizedPaymentMethods(lang: TLang): Array<TPaymentMethod> {
  if (lang === "es") return paymentMethods;
  return PAYMENT_METHODS_BY_LANG[lang];
}
