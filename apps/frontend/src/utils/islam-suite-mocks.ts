import type { TLang } from "@i18n/ui";
import { useTranslations } from "@i18n/utils";

export type TQiblaSummary = {
  degrees: number;
  cardinal: string;
  kilometers: number;
  miles: number;
  originCity: string;
  originCountry: string;
  originLat: number;
  originLon: number;
  jumuahPrimaryKhutbah: string;
  jumuahPrimaryPrayer: string;
  prohibitedWindows: {
    sunrise: string;
    zawal: string;
    sunset: string;
  };
};

export type THijriObservanceCard = {
  id: string;
  hijriFormatted: string;
  estimatedGregorianDate: string;
  daysUntil: number;
  category:
    | "eid"
    | "ramadan"
    | "fasting"
    | "sacred_night"
    | "hajj"
    | "commemoration";
  fastingStatus: "obligatory" | "sunnah" | "forbidden" | "none";
  title: string;
  description: string;
};

export type TScriptureAyahCard = {
  id: string;
  referenceKey: string;
  surahNameAr: string;
  surahNameTranslit: string;
  arabicUthmani: string;
  transliteration: string;
  translation: string;
  reflection: string;
  audioUrl: string;
};

export type TScriptureHadithCard = {
  id: string;
  collectionName: string;
  hadithNumber: string;
  grading: "Sahih" | "Hasan";
  narrator: string;
  arabicText: string;
  translation: string;
  keyTakeaway: string;
};

export type TAsmaUlHusnaCard = {
  number: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  reflection: string;
  quranReference: string;
};

export type TTasbihPresetCard = {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  targetCount: number;
  virtue: string;
};

export type TIslamSuiteCopy = {
  qiblaBadge: string;
  qiblaTitle: string;
  qiblaSubtitle: string;
  bearingLabel: string;
  distanceLabel: string;
  coordinatesLabel: string;
  jumuahTitle: string;
  khutbahLabel: string;
  salahLabel: string;
  prohibitedTitle: string;
  prohibitedDesc: string;
  sunriseWindowLabel: string;
  zawalWindowLabel: string;
  sunsetWindowLabel: string;
  observancesBadge: string;
  observancesTitle: string;
  observancesSubtitle: string;
  daysRemainingLabel: string;
  fastingObligatoryLabel: string;
  fastingSunnahLabel: string;
  fastingForbiddenLabel: string;
  downloadIcsLabel: string;
  scriptureBadge: string;
  scriptureTitle: string;
  scriptureSubtitle: string;
  tabDailyInspiration: string;
  tabQuranAyat: string;
  tabHadith: string;
  tabTasbih: string;
  ayahOfDayLabel: string;
  hadithOfDayLabel: string;
  asmaOfDayLabel: string;
  reflectionLabel: string;
  takeawayLabel: string;
  listenRecitationLabel: string;
  tasbihResetLabel: string;
  tasbihIncrementLabel: string;
  tasbihCompletedLabel: string;
  fitranaTabLabel: string;
  zakatMalTabLabel: string;
  fitranaMembersLabel: string;
  fidyahDaysLabel: string;
  kaffarahFastLabel: string;
  fitranaPerPersonNote: string;
  fidyahPerDayNote: string;
  totalFitranaFidyahDueLabel: string;
  useFitranaInFormBtn: string;
};

export const DEFAULT_BOGOTA_QIBLA: TQiblaSummary = {
  degrees: 64.67,
  cardinal: "ENE",
  kilometers: 12286,
  miles: 7634,
  originCity: "Bogotá",
  originCountry: "Colombia",
  originLat: 4.6685,
  originLon: -74.0758,
  jumuahPrimaryKhutbah: "12:15 PM",
  jumuahPrimaryPrayer: "12:45 PM",
  prohibitedWindows: {
    sunrise: "05:56 – 06:11",
    zawal: "11:49 – 11:59",
    sunset: "17:57 – 18:02",
  },
};

export function getIslamSuiteCopy(lang: TLang): TIslamSuiteCopy {
  const t = useTranslations(lang);
  return {
    qiblaBadge: t("islam-suite.qiblaBadge"),
    qiblaTitle: t("islam-suite.qiblaTitle"),
    qiblaSubtitle: t("islam-suite.qiblaSubtitle"),
    bearingLabel: t("islam-suite.bearingLabel"),
    distanceLabel: t("islam-suite.distanceLabel"),
    coordinatesLabel: t("islam-suite.coordinatesLabel"),
    jumuahTitle: t("islam-suite.jumuahTitle"),
    khutbahLabel: t("islam-suite.khutbahLabel"),
    salahLabel: t("islam-suite.salahLabel"),
    prohibitedTitle: t("islam-suite.prohibitedTitle"),
    prohibitedDesc: t("islam-suite.prohibitedDesc"),
    sunriseWindowLabel: t("islam-suite.sunriseWindowLabel"),
    zawalWindowLabel: t("islam-suite.zawalWindowLabel"),
    sunsetWindowLabel: t("islam-suite.sunsetWindowLabel"),
    observancesBadge: t("islam-suite.observancesBadge"),
    observancesTitle: t("islam-suite.observancesTitle"),
    observancesSubtitle: t("islam-suite.observancesSubtitle"),
    daysRemainingLabel: t("islam-suite.daysRemainingLabel"),
    fastingObligatoryLabel: t("islam-suite.fastingObligatoryLabel"),
    fastingSunnahLabel: t("islam-suite.fastingSunnahLabel"),
    fastingForbiddenLabel: t("islam-suite.fastingForbiddenLabel"),
    downloadIcsLabel: t("islam-suite.downloadIcsLabel"),
    scriptureBadge: t("islam-suite.scriptureBadge"),
    scriptureTitle: t("islam-suite.scriptureTitle"),
    scriptureSubtitle: t("islam-suite.scriptureSubtitle"),
    tabDailyInspiration: t("islam-suite.tabDailyInspiration"),
    tabQuranAyat: t("islam-suite.tabQuranAyat"),
    tabHadith: t("islam-suite.tabHadith"),
    tabTasbih: t("islam-suite.tabTasbih"),
    ayahOfDayLabel: t("islam-suite.ayahOfDayLabel"),
    hadithOfDayLabel: t("islam-suite.hadithOfDayLabel"),
    asmaOfDayLabel: t("islam-suite.asmaOfDayLabel"),
    reflectionLabel: t("islam-suite.reflectionLabel"),
    takeawayLabel: t("islam-suite.takeawayLabel"),
    listenRecitationLabel: t("islam-suite.listenRecitationLabel"),
    tasbihResetLabel: t("islam-suite.tasbihResetLabel"),
    tasbihIncrementLabel: t("islam-suite.tasbihIncrementLabel"),
    tasbihCompletedLabel: t("islam-suite.tasbihCompletedLabel"),
    zakatMalTabLabel: t("islam-suite.zakatMalTabLabel"),
    fitranaTabLabel: t("islam-suite.fitranaTabLabel"),
    fitranaMembersLabel: t("islam-suite.fitranaMembersLabel"),
    fidyahDaysLabel: t("islam-suite.fidyahDaysLabel"),
    kaffarahFastLabel: t("islam-suite.kaffarahFastLabel"),
    fitranaPerPersonNote: t("islam-suite.fitranaPerPersonNote"),
    fidyahPerDayNote: t("islam-suite.fidyahPerDayNote"),
    totalFitranaFidyahDueLabel: t("islam-suite.totalFitranaFidyahDueLabel"),
    useFitranaInFormBtn: t("islam-suite.useFitranaInFormBtn"),
  };
}

type TObservanceList = Array<THijriObservanceCard>;

export function getFallbackObservances(lang: TLang): TObservanceList {
  const titles: Record<
    string,
    {
      hijriFormatted: string;
      estimatedGregorianDate: string;
      daysUntil: number;
      category: THijriObservanceCard["category"];
      fastingStatus: THijriObservanceCard["fastingStatus"];
      title: Record<TLang, string>;
      description: Record<TLang, string>;
    }
  > = {
    arafah: {
      hijriFormatted: "9 Dhu al-Hijjah 1447",
      estimatedGregorianDate: "2026-05-26",
      daysUntil: 35,
      category: "hajj",
      fastingStatus: "sunnah",
      title: {
        es: "Día de Arafah",
        en: "Day of Arafah",
        ar: "يوم عرفة",
        tr: "Arefe Günü",
      },
      description: {
        es: "El día más excelso del año; su ayuno expía las faltas menores del año anterior y del siguiente.",
        en: "The noblest day of the year; fasting on this day expiates minor sins of the previous and coming year.",
        ar: "خير يوم طلعت عليه الشمس، صيامه يكفر السنة الماضية والباقية.",
        tr: "Yılın en faziletli günü; tutulan oruç geçmiş ve gelecek bir yıllık küçük günahlara kefarettir.",
      },
    },
    eid_adha: {
      hijriFormatted: "10 Dhu al-Hijjah 1447",
      estimatedGregorianDate: "2026-05-27",
      daysUntil: 36,
      category: "eid",
      fastingStatus: "forbidden",
      title: {
        es: "Eid al-Adha (Fiesta del Sacrificio)",
        en: "Eid al-Adha (Festival of Sacrifice)",
        ar: "عيد الأضحى المبارك",
        tr: "Kurban Bayramı (Eid al-Adha)",
      },
      description: {
        es: "Oración especial de Eid en dos turnos (07:30 AM y 09:00 AM) y distribución solidaria de Qurbani.",
        en: "Special Eid congregation in two shifts (07:30 AM & 09:00 AM) and community Qurbani distribution.",
        ar: "صلاة العيد على فترتين وتوزيع الأضاحي على الأسر المتعففة.",
        tr: "İki vardiya halinde Bayram namazı (07:30 ve 09:00) ve ihtiyaç sahiplerine kurban eti dağıtımı.",
      },
    },
    muharram: {
      hijriFormatted: "1 Muharram 1448",
      estimatedGregorianDate: "2026-06-16",
      daysUntil: 56,
      category: "commemoration",
      fastingStatus: "sunnah",
      title: {
        es: "Año Nuevo Islámico 1448 H",
        en: "Islamic New Year 1448 AH",
        ar: "رأس السنة الهجرية ١٤٤٨ هـ",
        tr: "Hicri Yılbaşı 1448",
      },
      description: {
        es: "Inicio del nuevo año lunar con reflexión sobre la Hégira del Profeta Muhammad ﷺ.",
        en: "Beginning of the new Hijri lunar year reflecting upon the migration (Hijrah) of Prophet Muhammad ﷺ.",
        ar: "بداية العام الهجري الجديد والتذكير بدروس الهجرة النبوية الشريفة.",
        tr: "Hz. Muhammed'in ﷺ Hicret'ini tefekkür ederek yeni Hicri yılın karşılanması.",
      },
    },
    ashura: {
      hijriFormatted: "10 Muharram 1448",
      estimatedGregorianDate: "2026-06-25",
      daysUntil: 65,
      category: "fasting",
      fastingStatus: "sunnah",
      title: {
        es: "Día de Ashura (9 y 10 de Muharram)",
        en: "Day of Ashura (9th & 10th Muharram)",
        ar: "يوم عاشوراء (تاسوعاء وعاشوراء)",
        tr: "Aşure Günü (9 ve 10 Muharrem)",
      },
      description: {
        es: "Jornada de ayuno voluntario en gratitud a Allah por la liberación del Profeta Musa (Moisés).",
        en: "Recommended Sunnah fast in gratitude to Allah for delivering Prophet Musa (Moses).",
        ar: "صيام سنة مؤكدة شكراً لله على نجاة نبي الله موسى عليه السلام.",
        tr: "Hz. Musa'nın kurtuluşuna şükür olarak tutulan müstehap Aşure orucu.",
      },
    },
  };

  return Object.entries(titles).map(([id, item]) => ({
    id,
    hijriFormatted: item.hijriFormatted,
    estimatedGregorianDate: item.estimatedGregorianDate,
    daysUntil: item.daysUntil,
    category: item.category,
    fastingStatus: item.fastingStatus,
    title: item.title[lang],
    description: item.description[lang],
  }));
}

export function getFallbackScriptureBundle(lang: TLang): {
  ayat: Array<TScriptureAyahCard>;
  hadiths: Array<TScriptureHadithCard>;
  asmaOfTheDay: TAsmaUlHusnaCard;
  tasbihPresets: Array<TTasbihPresetCard>;
} {
  const ayat: Array<TScriptureAyahCard> = [
    {
      id: "ayah-kursi",
      referenceKey: "2:255",
      surahNameAr: "سورة البقرة",
      surahNameTranslit: "Al-Baqarah (Ayat al-Kursi)",
      arabicUthmani:
        "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ",
      transliteration:
        "Allahu la ilaha illa Huwal-Hayyul-Qayyum, la ta'khudhuhu sinatun wa la nawm...",
      translation:
        lang === "en"
          ? "Allah—there is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep."
          : lang === "ar"
            ? "آية الكرسي أعظم آية في كتاب الله، تشتمل على توحيد الله وعظمته وقيوميته الواسعة."
            : lang === "tr"
              ? "Allah, O'ndan başka ilah yoktur; O, Hayy ve Kayyum'dur. O'nuج ne bir uyuklama tutabilir ne de bir uyku."
              : "Allah: no hay divinidad salvo Él, el Viviente, el Sustentador Perpetuo. No Le toman somnolencia ni sueño.",
      reflection:
        lang === "en"
          ? "Reciting Ayat al-Kursi after every obligatory prayer and before sleeping brings divine protection and serenity."
          : lang === "ar"
            ? "من قرأ آية الكرسي دبر كل صلاة مكتوبة لم يمنعه من دخول الجنة إلا أن يموت."
            : lang === "tr"
              ? "Her farz namazın ardından Ayetel Kürsi okumak ilahi koruma ve kalp huzuru vesilesidir."
              : "Recitar Ayat al-Kursi tras cada oración obligatoria brinda protección divina y serenidad espiritual.",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/002255.mp3",
    },
    {
      id: "ayah-ash-sharh",
      referenceKey: "94:5-6",
      surahNameAr: "سورة الشرح",
      surahNameTranslit: "Ash-Sharh",
      arabicUthmani: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      transliteration: "Fa-inna ma'al-'usri yusra. Inna ma'al-'usri yusra.",
      translation:
        lang === "en"
          ? "For indeed, with hardship comes ease. Indeed, with hardship comes ease."
          : lang === "ar"
            ? "وعد إلهي صادق بأن مع كل ضيق مخرجاً ومع كل شدة فرجاً قريباً."
            : lang === "tr"
              ? "Şüphesiz her zorlukla beraber bir kolaylık vardır. Gerçekten her zorlukla beraber bir kolaylık vardır."
              : "Ciertamente, junto a la dificultad hay facilidad. En verdad, junto a la dificultad hay facilidad.",
      reflection:
        lang === "en"
          ? "A timeless reminder of hope and resilience (Sabr & Tawakkul) during moments of personal or family trial."
          : lang === "ar"
            ? "لن يغلب عسر يسرين؛ تذكير بالصبر وحسن الظن بالله تعالى في الشدائد."
            : lang === "tr"
              ? "Zorluk anlarında sabır ve tevekkül ile ümidi diri tutan ilahi müjde."
              : "Un recordatorio eterno de esperanza y paciencia (Sabr) ante cualquier prueba personal o familiar.",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/094005.mp3",
    },
    {
      id: "ayah-hujurat-13",
      referenceKey: "49:13",
      surahNameAr: "سورة الحجرات",
      surahNameTranslit: "Al-Hujurat",
      arabicUthmani:
        "يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُمْ مِنْ ذَكَرٍ وَأُنْثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا ۚ إِنَّ أَكْرَمَكُمْ عِنْدَ اللَّهِ أَتْقَاكُمْ",
      transliteration:
        "Ya ayyuhan-nasu inna khalaqnakum min dhakarin wa untha wa ja'alnakum shu'uban wa qaba'ila li-ta'arafu...",
      translation:
        lang === "en"
          ? "O humanity, indeed We have created you from male and female and made you peoples and tribes that you may know one another. Indeed, the most noble of you in the sight of Allah is the most righteous of you."
          : lang === "ar"
            ? "أساس التعارف الإنساني والمساواة في الإسلام، حيث التفاضل بالتقوى والعمل الصالح."
            : lang === "tr"
              ? "Ey insanlar! Şüphesiz sizi bir erkek ile bir dişiden yarattık, tanışasınız diye sizi kavim ve kabilelere ayırdık. Allah katında en değerli olanınız, O'na karşı en çok takva sahibi olanınızdır."
              : "¡Oh, humanidad! Os hemos creado de un varón y una hembra y os hemos constituido en pueblos y tribus para que os conozcáis mutuamente. El más noble ante Allah es el más piadoso.",
      reflection:
        lang === "en"
          ? "Foundation of intercultural coexistence and fraternity practiced daily at Bogotá's Central Mosque."
          : lang === "ar"
            ? "ركيزة التآخي والتعايش التي يجمع عليها مسجد أبو بكر الصديق في بوغوتا."
            : lang === "tr"
              ? "Bogotá Merkez Camii'nde her gün yaşanan kardeşlik ve birlikte yaşam ilkesinin temeli."
              : "Pilar de la convivencia intercultural y fraternidad que vivimos a diario en la Mezquita Central de Bogotá.",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/049013.mp3",
    },
  ];

  const hadiths: Array<TScriptureHadithCard> = [
    {
      id: "hadith-intentions",
      collectionName:
        lang === "ar"
          ? "صحيح البخاري ومسلم (الأربعون النووية)"
          : "Sahih al-Bukhari & Muslim (An-Nawawi #1)",
      hadithNumber: "1",
      grading: "Sahih",
      narrator:
        lang === "ar"
          ? "عمر بن الخطاب رضي الله عنه"
          : "Umar ibn al-Khattab (RA)",
      arabicText: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
      translation:
        lang === "en"
          ? "Actions are judged only by intentions, and every person shall have only what they intended."
          : lang === "ar"
            ? "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى."
            : lang === "tr"
              ? "Ameller niyetlere göredir ve herkese ancak niyet ettiği şey vardır."
              : "Ciertamente las obras se juzgan según las intenciones, y cada persona obtendrá según lo que haya tenido por intención.",
      keyTakeaway:
        lang === "en"
          ? "Purify your intention (Ikhlas) before every act of worship, charity, study, or daily work."
          : lang === "ar"
            ? "إخلاص النية لله تعالى يحول العادات اليومية والأعمال الخيرية إلى عبادات عظيمة الأجر."
            : lang === "tr"
              ? "Her ibadet, hayır ve günlük işe başlarken niyeti Allah rızası için halis kılmak esastır."
              : "Renueva la sinceridad de tu intención (Ijlas) antes de cada oración, caridad, estudio o labor cotidiana.",
    },
    {
      id: "hadith-beneficial-people",
      collectionName:
        lang === "ar"
          ? "المعجم الأوسط (رياض الصالحين)"
          : "Al-Mu'jam al-Awsat / Riyad as-Salihin",
      hadithNumber: "364",
      grading: "Hasan",
      narrator:
        lang === "ar"
          ? "جابر بن عبد الله رضي الله عنهما"
          : "Jabir ibn Abdullah (RA)",
      arabicText: "خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ",
      translation:
        lang === "en"
          ? "The best of people are those who are most beneficial to people."
          : lang === "ar"
            ? "خير الناس أنفعهم للناس."
            : lang === "tr"
              ? "İnsanların en hayırlısı, insanlara en faydalı olandır."
              : "El mejor de los seres humanos es aquel que resulta más beneficioso para los demás.",
      keyTakeaway:
        lang === "en"
          ? "Serving neighbours, supporting social welfare, and sharing knowledge are core expressions of faith."
          : lang === "ar"
            ? "خدمة المجتمع وإعانة المحتاجين ونشر العلم النافع من أسمى شعب الإيمان."
            : lang === "tr"
              ? "Topluma hizmet etmek ve ihtiyaç sahiplerine el uzatmak imanın en güzel tezahürüdür."
              : "El servicio social, la solidaridad vecinal y la enseñanza son expresiones esenciales de la fe islámica.",
    },
  ];

  const asmaOfTheDay: TAsmaUlHusnaCard = {
    number: 1,
    arabic: "الرَّحْمَٰنُ",
    transliteration: "Ar-Rahman",
    meaning:
      lang === "en"
        ? "The Entirely Merciful"
        : lang === "ar"
          ? "ذو الرحمة الواسعة التي وسعت كل شيء"
          : lang === "tr"
            ? "Sonsuz Merhamet Sahibi (Rahmân)"
            : "El Clemente, el Todo Misericordioso",
    reflection:
      lang === "en"
        ? "His mercy encompasses all creation without exception; embody mercy in your speech and dealings."
        : lang === "ar"
          ? "رحمته سبحانه وسعت الخلائق جميعاً، والراحمون يرحمهم الرحمن."
          : lang === "tr"
            ? "Rahmeti bütün varlıkları kuşatan Allah'ın ahlakıyla merhametli olmak."
            : "Su misericordia abarca toda la creación; refleja compasión y bondad en tu trato con cada criatura.",
    quranReference: "1:1 / 55:1",
  };

  const tasbihPresets: Array<TTasbihPresetCard> = [
    {
      id: "subhanallah",
      arabic: "سُبْحَانَ اللَّهِ",
      transliteration: "SubhanAllah",
      translation:
        lang === "en"
          ? "Glory be to Allah (free from all imperfection)"
          : lang === "ar"
            ? "تنزيه الله تعالى عن كل نقص"
            : lang === "tr"
              ? "Allah her türlü eksiklikten münezzehtir"
              : "Glorificado sea Allah (libre de toda imperfección)",
      targetCount: 33,
      virtue: "Sunnah Post-Salah (33x)",
    },
    {
      id: "alhamdulillah",
      arabic: "الْحَمْدُ لِلَّهِ",
      transliteration: "Alhamdulillah",
      translation:
        lang === "en"
          ? "All praise and gratitude belong to Allah"
          : lang === "ar"
            ? "الثناء الكامل والشكر لله وحده"
            : lang === "tr"
              ? "Hamd ve şükür yalnızca Allah'a mahsustur"
              : "Toda alabanza y gratitud pertenecen a Allah",
      targetCount: 33,
      virtue: "Sunnah Post-Salah (33x)",
    },
    {
      id: "allahuakbar",
      arabic: "اللَّهُ أَكْبَرُ",
      transliteration: "Allahu Akbar",
      translation:
        lang === "en"
          ? "Allah is the Greatest"
          : lang === "ar"
            ? "الله أكبر من كل شيء"
            : lang === "tr"
              ? "Allah en büyüktür"
              : "Allah es el Más Grande",
      targetCount: 34,
      virtue: "Sunnah Post-Salah (34x)",
    },
    {
      id: "istighfar",
      arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
      transliteration: "Astaghfirullaha wa atubu ilayh",
      translation:
        lang === "en"
          ? "I seek forgiveness from Allah and turn to Him in repentance"
          : lang === "ar"
            ? "طلب المغفرة والتوبة إلى الله"
            : lang === "tr"
              ? "Allah'tan bağışlanma diler ve O'na tövbe ederim"
              : "Pido perdón a Allah y me vuelvo a Él en arrepentimiento",
      targetCount: 100,
      virtue: "Sunnah Matutina (100x)",
    },
  ];

  return {
    ayat,
    hadiths,
    asmaOfTheDay,
    tasbihPresets,
  };
}

export type TIslamSuiteLocalizedCopy = ReturnType<typeof getIslamSuiteCopy>;
