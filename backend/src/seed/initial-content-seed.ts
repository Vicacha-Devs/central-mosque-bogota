import type { Core } from '@strapi/strapi';
import { seedAdditionalCmsContent } from './cms-seed-data';

export async function seedInitialContent(strapi: Core.Strapi) {
  try {
    const globalSettingsByLocale: Record<
      string,
      {
        siteName: string;
        lemma: string;
        rightsText: string;
        openingHours: string;
        country: string;
      }
    > = {
      es: {
        siteName: 'Mezquita Central Abu Bakr As-Siddiq',
        lemma:
          'Dedicados a servir a la comunidad musulmana en Bogotá a través de la oración, la educación y la caridad.',
        rightsText:
          '© Mezquita Central Abu Bakr As-Siddiq Bogotá. Todos los derechos reservados.',
        openingHours: 'Abierto todos los días: 4:30 AM – 8:30 PM',
        country: 'Colombia',
      },
      en: {
        siteName: 'Abu Bakr As-Siddiq Central Mosque',
        lemma:
          'Dedicated to serving the Muslim community in Bogotá through prayer, education, and charity.',
        rightsText:
          '© Abu Bakr As-Siddiq Central Mosque Bogotá. All rights reserved.',
        openingHours: 'Open daily: 4:30 AM – 8:30 PM',
        country: 'Colombia',
      },
      ar: {
        siteName: 'مسجد أبو بكر الصديق المركزي',
        lemma:
          'مكرسون لخدمة المجتمع المسلم في بوغوتا من خلال الصلاة والتعليم والعمل الخيري.',
        rightsText:
          '© مسجد أبو بكر الصديق المركزي ببوغوتا. جميع الحقوق محفوظة.',
        openingHours: 'مفتوح يومياً: 4:30 صباحاً – 8:30 مساءً',
        country: 'كولومبيا',
      },
      tr: {
        siteName: 'Ebû Bekir Es-Sıddîk Merkez Camii',
        lemma:
          'Bogota’daki Müslüman topluma namaz, eğitim ve hayır işleri aracılığıyla hizmet etmeye adanmıştır.',
        rightsText:
          '© Ebû Bekir Es-Sıddîk Merkez Camii Bogota. Tüm hakları saklıdır.',
        openingHours: 'Her gün açık: 04:30 – 20:30',
        country: 'Kolombiya',
      },
    };

    for (const [locale, content] of Object.entries(globalSettingsByLocale)) {
      const existing = await strapi
        .documents('api::global-setting.global-setting')
        .findFirst({ locale });

      if (!existing) {
        await strapi.documents('api::global-setting.global-setting').create({
          locale,
          status: 'published',
          data: {
            siteName: content.siteName,
            lemma: content.lemma,
            rightsText: content.rightsText,
            contactInfo: {
              address: 'Calle 80 # 30-15, Barrios Unidos',
              city: 'Bogotá D.C.',
              country: content.country,
              phone: '+57 (601) 250-8000',
              whatsapp: '+57 310 555-0199',
              email: 'info@mezquitabogota.org',
              latitude: 4.6685,
              longitude: -74.0758,
              openingHours: content.openingHours,
            },
          },
        });
      }
    }

    const islamFaithByLocale: Record<
      string,
      {
        heroTitle: string;
        heroSubtitle: string;
        shahadaTransliteration: string;
        shahadaTranslation: string;
      }
    > = {
      es: {
        heroTitle: 'Descubre el Islam y los Pilares de la Fe',
        heroSubtitle:
          'Una introducción clara a las creencias, valores espirituales y prácticas esenciales del Islam.',
        shahadaTransliteration:
          'Ash-hadu an la ilaha illa Allah, wa ash-hadu anna Muhammadan Rasulu Allah',
        shahadaTranslation:
          'Atestiguo que no hay divinidad digna de adoración sino Dios (Allah), y atestiguo que Muhammad es el Mensajero de Dios.',
      },
      en: {
        heroTitle: 'Discover Islam & the Pillars of Faith',
        heroSubtitle:
          'A clear introduction to the core beliefs, spiritual values, and essential practices of Islam.',
        shahadaTransliteration:
          'Ash-hadu an la ilaha illa Allah, wa ash-hadu anna Muhammadan Rasulu Allah',
        shahadaTranslation:
          'I bear witness that there is no deity worthy of worship except God (Allah), and I bear witness that Muhammad is the Messenger of God.',
      },
      ar: {
        heroTitle: 'تعرّف على الإسلام وأركان الإيمان',
        heroSubtitle:
          'مقدمة واضحة للعقيدة الإسلامية والقيم الروحية والعبادات الأساسية في الإسلام.',
        shahadaTransliteration:
          'أشهد أن لا إله إلا الله وأشهد أن محمداً رسول الله',
        shahadaTranslation:
          'أشهد أن لا معبود بحق إلا الله وحده لا شريك له، وأشهد أن محمداً عبده ورسوله.',
      },
      tr: {
        heroTitle: 'İslam’ı ve İmanın Şartlarını Keşfedin',
        heroSubtitle:
          'İslam’ın temel inançları, manevi değerleri ve ibadet esaslarına açık bir giriş.',
        shahadaTransliteration:
          'Eşhedü en lâ ilâhe illallah ve eşhedü enne Muhammeden abduhû ve resûlüh',
        shahadaTranslation:
          'Şahitlik ederim ki Allah’tan başka ilah yoktur ve yine şahitlik ederim ki Muhammed O’nun kulu ve elçisidir.',
      },
    };

    for (const [locale, content] of Object.entries(islamFaithByLocale)) {
      const existing = await strapi
        .documents('api::islam-faith-page.islam-faith-page')
        .findFirst({ locale });

      if (!existing) {
        await strapi
          .documents('api::islam-faith-page.islam-faith-page')
          .create({
            locale,
            status: 'published',
            data: {
              heroTitle: content.heroTitle,
              heroSubtitle: content.heroSubtitle,
              shahadaArabic:
                'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ ٱللَّٰهِ',
              shahadaTransliteration: content.shahadaTransliteration,
              shahadaTranslation: content.shahadaTranslation,
            },
          });
      }
    }

    const leadersByLocale: Record<
      string,
      Array<{
        name: string;
        slug: string;
        honorificTitle: string;
        roleTitle: string;
        memberCategory:
          | 'imam_scholar'
          | 'instructor'
          | 'staff_caretaker'
          | 'board_administration'
          | 'guest_author';
        shortSummary: string;
        bio: string;
        credentials: string;
        officeHours: string;
        languagesSpoken: string;
        showInStaffDirectory: boolean;
        hasDedicatedPage: boolean;
        isAuthor: boolean;
        isKhateeb: boolean;
        order: number;
      }>
    > = {
      es: [
        {
          name: 'Sheikh Ahmad Al-Mansoor',
          slug: 'sheikh-ahmad-al-mansoor',
          honorificTitle: 'Sheikh / Imam',
          roleTitle: 'Imam Principal y Director Espiritual',
          memberCategory: 'imam_scholar',
          shortSummary:
            'Licenciado en Ciencias Islámicas y Jurisprudencia (Fiqh). Guía espiritual y Khateeb de la Mezquita Central Abu Bakr As-Siddiq desde 2014.',
          bio: 'Licenciado en Ciencias Islámicas y Jurisprudencia (Fiqh). Guía espiritual de la Mezquita Central Abu Bakr As-Siddiq en Bogotá desde 2014, encargado de las Jutbas de los viernes, consejería familiar y clases de Tafsir y Fiqh.',
          credentials:
            'Licenciatura en Sharia y Jurisprudencia Islámica (Fiqh) · Ijazah en Recitación del Sagrado Corán (Hafs an Asim)',
          officeHours: 'Martes a Domingo, 2:00 PM – 5:30 PM (Después de Dhuhr y Asr)',
          languagesSpoken: 'Árabe, Español, Inglés',
          showInStaffDirectory: true,
          hasDedicatedPage: true,
          isAuthor: true,
          isKhateeb: true,
          order: 1,
        },
        {
          name: 'Ustadh Tariq Ramírez',
          slug: 'ustadh-tariq-ramirez',
          honorificTitle: 'Ustadh',
          roleTitle: 'Coordinador de Educación y Nuevos Musulmanes',
          memberCategory: 'instructor',
          shortSummary:
            'Especialista en pedagogía islámica, enseñanza del idioma árabe y acompañamiento integral para nuevos musulmanes en Colombia.',
          bio: 'Especialista en pedagogía islámica, enseñanza del idioma árabe y acompañamiento integral para nuevos musulmanes en Colombia. Dirige los cursos introductorios de fin de semana y las visitas guiadas universitarias.',
          credentials:
            'Especialización en Lengua Árabe y Estudios Islámicos · Coordinador de la Academia Cultural Mezquita Central',
          officeHours: 'Miércoles a Sábado, 10:00 AM – 4:00 PM',
          languagesSpoken: 'Español, Árabe, Inglés',
          showInStaffDirectory: true,
          hasDedicatedPage: true,
          isAuthor: true,
          isKhateeb: true,
          order: 2,
        },
        {
          name: 'Dra. Amina Gómez',
          slug: 'dra-amina-gomez',
          honorificTitle: 'Dra.',
          roleTitle: 'Directora de Acción Social y Programas Familiares',
          memberCategory: 'board_administration',
          shortSummary:
            'Lidera los programas de bienestar comunitario, distribución de Zakat y actividades educativas para mujeres y jóvenes.',
          bio: 'Lidera los programas de bienestar comunitario, distribución de Zakat y actividades educativas para mujeres, niños y jóvenes en la Mezquita Central de Bogotá.',
          credentials:
            'Doctorado en Desarrollo Social y Comunitario · Directora del Comité de Bienestar y Familia',
          officeHours: 'Lunes a Viernes, 9:00 AM – 3:00 PM',
          languagesSpoken: 'Español, Inglés',
          showInStaffDirectory: true,
          hasDedicatedPage: true,
          isAuthor: true,
          isKhateeb: false,
          order: 3,
        },
        {
          name: 'Hajj Ibrahim Al-Khatib',
          slug: 'hajj-ibrahim-al-khatib',
          honorificTitle: 'Hajj',
          roleTitle: 'Encargado de la Mezquita y Muadhin (Qayyim al-Masjid)',
          memberCategory: 'staff_caretaker',
          shortSummary:
            'Responsable del cuidado diario del recinto sagrado, apertura para las cinco oraciones, llamado al Adhan y hospitalidad a los visitantes.',
          bio: 'Custodio y encargado operativo (Qayyim) de la Mezquita Central Abu Bakr As-Siddiq. Supervisa la apertura puntual para las cinco oraciones diarias, el mantenimiento de las salas de oración, el llamado al Adhan y la recepción hospitalaria de la comunidad y visitantes.',
          credentials:
            'Servicio Comunitario y Custodia de Mezquita desde 2012 · Muadhin Residente',
          officeHours: 'Todos los días durante los horarios de las 5 oraciones diarias',
          languagesSpoken: 'Árabe, Español',
          showInStaffDirectory: true,
          hasDedicatedPage: true,
          isAuthor: false,
          isKhateeb: false,
          order: 4,
        },
      ],
      en: [
        {
          name: 'Sheikh Ahmad Al-Mansoor',
          slug: 'sheikh-ahmad-al-mansoor',
          honorificTitle: 'Sheikh / Imam',
          roleTitle: 'Head Imam & Spiritual Director',
          memberCategory: 'imam_scholar',
          shortSummary:
            'Graduate in Islamic Sciences and Jurisprudence (Fiqh). Spiritual leader and Friday Khateeb of the Abu Bakr As-Siddiq Central Mosque since 2014.',
          bio: 'Graduate in Islamic Sciences and Jurisprudence (Fiqh). Spiritual leader of the Abu Bakr As-Siddiq Central Mosque in Bogotá since 2014, leading Friday Khutbahs, family counseling, and weekly Tafsir and Fiqh circles.',
          credentials:
            'B.A. in Sharia & Islamic Jurisprudence (Fiqh) · Ijazah in Quranic Recitation (Hafs an Asim)',
          officeHours: 'Tuesday to Sunday, 2:00 PM – 5:30 PM (After Dhuhr & Asr)',
          languagesSpoken: 'Arabic, Spanish, English',
          showInStaffDirectory: true,
          hasDedicatedPage: true,
          isAuthor: true,
          isKhateeb: true,
          order: 1,
        },
        {
          name: 'Ustadh Tariq Ramírez',
          slug: 'ustadh-tariq-ramirez',
          honorificTitle: 'Ustadh',
          roleTitle: 'Education & New Muslim Coordinator',
          memberCategory: 'instructor',
          shortSummary:
            'Specialist in Islamic pedagogy, Arabic instruction, and comprehensive mentorship for new Muslims in Colombia.',
          bio: 'Specialist in Islamic pedagogy, Arabic instruction, and comprehensive mentorship for new Muslims in Colombia. Coordinates weekend foundations courses and university guided visits.',
          credentials:
            'Diploma in Arabic Language & Islamic Studies · Head of Mosque Cultural Academy',
          officeHours: 'Wednesday to Saturday, 10:00 AM – 4:00 PM',
          languagesSpoken: 'Spanish, Arabic, English',
          showInStaffDirectory: true,
          hasDedicatedPage: true,
          isAuthor: true,
          isKhateeb: true,
          order: 2,
        },
        {
          name: 'Dr. Amina Gómez',
          slug: 'dra-amina-gomez',
          honorificTitle: 'Dr.',
          roleTitle: 'Director of Social Outreach & Family Programs',
          memberCategory: 'board_administration',
          shortSummary:
            'Leads community welfare initiatives, Zakat distribution, and educational programs for women and youth.',
          bio: 'Leads community welfare initiatives, Zakat distribution, and educational programs for women, children, and youth at the Central Mosque of Bogotá.',
          credentials:
            'Ph.D. in Social & Community Development · Director of Family & Welfare Committee',
          officeHours: 'Monday to Friday, 9:00 AM – 3:00 PM',
          languagesSpoken: 'Spanish, English',
          showInStaffDirectory: true,
          hasDedicatedPage: true,
          isAuthor: true,
          isKhateeb: false,
          order: 3,
        },
        {
          name: 'Hajj Ibrahim Al-Khatib',
          slug: 'hajj-ibrahim-al-khatib',
          honorificTitle: 'Hajj',
          roleTitle: 'Mosque Caretaker & Resident Muadhin (Qayyim al-Masjid)',
          memberCategory: 'staff_caretaker',
          shortSummary:
            'Oversees the daily care of the sanctuary, opening for all five daily prayers, calling the Adhan, and welcoming guests.',
          bio: 'Custodian and operations caretaker (Qayyim) of the Abu Bakr As-Siddiq Central Mosque. Oversees daily opening for the five congregational prayers, upkeep of the prayer halls, calling the Adhan, and hospitality for worshippers and visitors.',
          credentials:
            'Mosque Custodianship & Community Service since 2012 · Resident Muadhin',
          officeHours: 'Daily across all 5 congregational prayer times',
          languagesSpoken: 'Arabic, Spanish',
          showInStaffDirectory: true,
          hasDedicatedPage: true,
          isAuthor: false,
          isKhateeb: false,
          order: 4,
        },
      ],
      ar: [
        {
          name: 'الشيخ أحمد المنصور',
          slug: 'sheikh-ahmad-al-mansoor',
          honorificTitle: 'فضيلة الشيخ / الإمام',
          roleTitle: 'الإمام الرئيسي والمدير الروحي',
          memberCategory: 'imam_scholar',
          shortSummary:
            'حاصل على الإجازة في العلوم الإسلامية والفقه. المرشد الروحي وخطيب الجمعة في مسجد أبو بكر الصديق المركزي منذ عام 2014.',
          bio: 'حاصل على الإجازة في العلوم الإسلامية والفقه. المرشد الروحي لمسجد أبو بكر الصديق المركزي في بوغوتا منذ عام 2014، ويشرف على خطب الجمعة والإرشاد الأسري وحلقات التفسير والفقه.',
          credentials: 'بكالوريوس في الشريعة والفقه الإسلامي · إجازة في تلاوة القرآن الكريم برواية حفص عن عاصم',
          officeHours: 'من الثلاثاء إلى الأحد، 2:00 ظهراً – 5:30 مساءً',
          languagesSpoken: 'العربية، الإسبانية، الإنجليزية',
          showInStaffDirectory: true,
          hasDedicatedPage: true,
          isAuthor: true,
          isKhateeb: true,
          order: 1,
        },
        {
          name: 'الأستاذ طارق راميريز',
          slug: 'ustadh-tariq-ramirez',
          honorificTitle: 'الأستاذ',
          roleTitle: 'منسق التعليم والمسلمين الجدد',
          memberCategory: 'instructor',
          shortSummary:
            'متخصص في التربية الإسلامية وتعليم اللغة العربية والإرشاد الشامل للمسلمين الجدد في كولومبيا.',
          bio: 'متخصص في التربية الإسلامية وتعليم اللغة العربية والإرشاد الشامل للمسلمين الجدد في كولومبيا، ويشرف على الدورات الأسبوعية والزيارات الجامعية التعريفية.',
          credentials: 'دبلوم في اللغة العربية والدراسات الإسلامية · منسق الأكاديمية الثقافية بالمسجد',
          officeHours: 'من الأربعاء إلى السبت، 10:00 صباحاً – 4:00 عصراً',
          languagesSpoken: 'الإسبانية، العربية، الإنجليزية',
          showInStaffDirectory: true,
          hasDedicatedPage: true,
          isAuthor: true,
          isKhateeb: true,
          order: 2,
        },
        {
          name: 'د. أمينة غوميز',
          slug: 'dra-amina-gomez',
          honorificTitle: 'الدكتورة',
          roleTitle: 'مديرة العمل الاجتماعي وبرامج الأسرة',
          memberCategory: 'board_administration',
          shortSummary:
            'تشرف على برامج التكافل الاجتماعي وتوزيع الزكاة والأنشطة التعليمية للنساء والشباب.',
          bio: 'تشرف على برامج التكافل الاجتماعي وتوزيع الزكاة والأنشطة التعليمية للنساء والأطفال والشباب في مسجد بوغوتا المركزي.',
          credentials: 'دكتوراه في التنمية الاجتماعية والمجتمعية · مديرة لجنة الأسرة والتكافل',
          officeHours: 'من الإثنين إلى الجمعة، 9:00 صباحاً – 3:00 عصراً',
          languagesSpoken: 'الإسبانية، الإنجليزية',
          showInStaffDirectory: true,
          hasDedicatedPage: true,
          isAuthor: true,
          isKhateeb: false,
          order: 3,
        },
        {
          name: 'الحاج إبراهيم الخطيب',
          slug: 'hajj-ibrahim-al-khatib',
          honorificTitle: 'الحاج',
          roleTitle: 'قيّم المسجد والمؤذن المقيم',
          memberCategory: 'staff_caretaker',
          shortSummary:
            'مسؤول عن رعاية المسجد اليومية وفتحه للصلوات الخمس ورفع الأذان واستقبال المصلين والزوار.',
          bio: 'قيّم مسجد أبو بكر الصديق المركزي والمؤذن المقيم. يشرف على فتح المسجد للصلوات الخمس اليومية، والعناية بمصليات الرجال والنساء، ورفع الأذان، وحسن وفادة المصلين والزوار.',
          credentials: 'خدمة ورعاية بيت الله منذ عام 2012 · المؤذن المقيم',
          officeHours: 'يومياً خلال أوقات الصلوات الخمس',
          languagesSpoken: 'العربية، الإسبانية',
          showInStaffDirectory: true,
          hasDedicatedPage: true,
          isAuthor: false,
          isKhateeb: false,
          order: 4,
        },
      ],
      tr: [
        {
          name: 'Şeyh Ahmed El-Mansur',
          slug: 'sheikh-ahmad-al-mansoor',
          honorificTitle: 'Şeyh / İmam',
          roleTitle: 'Baş İmam ve Manevi Rehber',
          memberCategory: 'imam_scholar',
          shortSummary:
            'İslami İlimler ve Fıkıh mezunu. 2014 yılından bu yana Bogota Ebû Bekir Es-Sıddîk Merkez Camii’nin manevi rehberi ve Cuma hatibi.',
          bio: 'İslami İlimler ve Fıkıh mezunu. 2014 yılından bu yana Bogota Ebû Bekir Es-Sıddîk Merkez Camii’nin manevi rehberi olarak Cuma hutbeleri, aile danışmanlığı ve Tefsir ile Fıkıh derslerini yürütmektedir.',
          credentials: 'İslam Hukuku (Şeriat ve Fıkıh) Lisansı · Kur’ân-ı Kerîm Kıraat İcazeti',
          officeHours: 'Salı – Pazar, 14:00 – 17:30 (Öğle ve İkindi sonrası)',
          languagesSpoken: 'Arapça, İspanyolca, İngilizce',
          showInStaffDirectory: true,
          hasDedicatedPage: true,
          isAuthor: true,
          isKhateeb: true,
          order: 1,
        },
        {
          name: 'Üstad Tarık Ramírez',
          slug: 'ustadh-tariq-ramirez',
          honorificTitle: 'Üstad',
          roleTitle: 'Eğitim ve Yeni Müslümanlar Koordinatörü',
          memberCategory: 'instructor',
          shortSummary:
            'İslami pedagoji, Arapça öğretimi ve Kolombiya’daki yeni Müslümanlar için rehberlik uzmanı.',
          bio: 'İslami pedagoji, Arapça öğretimi ve Kolombiya’daki yeni Müslümanlar için rehberlik uzmanı. Hafta sonu temel İslam derslerini ve üniversite tanıtım ziyaretlerini koordine etmektedir.',
          credentials: 'Arap Dili ve İslami İlimler Uzmanlığı · Cami Kültür Akademisi Koordinatörü',
          officeHours: 'Çarşamba – Cumartesi, 10:00 – 16:00',
          languagesSpoken: 'İspanyolca, Arapça, İngilizce',
          showInStaffDirectory: true,
          hasDedicatedPage: true,
          isAuthor: true,
          isKhateeb: true,
          order: 2,
        },
        {
          name: 'Dr. Amina Gómez',
          slug: 'dra-amina-gomez',
          honorificTitle: 'Dr.',
          roleTitle: 'Sosyal Yardım ve Aile Programları Direktörü',
          memberCategory: 'board_administration',
          shortSummary:
            'Toplumsal dayanışma, Zekât dağıtımı ve kadınlar ile gençlere yönelik eğitim programlarını yönetmektedir.',
          bio: 'Bogota Merkez Camii’nde toplumsal dayanışma, Zekât dağıtımı ve kadınlar, çocuklar ile gençlere yönelik eğitim programlarını yönetmektedir.',
          credentials: 'Sosyal ve Toplumsal Kalkınma Doktorası · Aile ve Yardımlaşma Komitesi Direktörü',
          officeHours: 'Pazartesi – Cuma, 09:00 – 15:00',
          languagesSpoken: 'İspanyolca, İngilizce',
          showInStaffDirectory: true,
          hasDedicatedPage: true,
          isAuthor: true,
          isKhateeb: false,
          order: 3,
        },
        {
          name: 'Hacı İbrahim El-Hatib',
          slug: 'hajj-ibrahim-al-khatib',
          honorificTitle: 'Hacı',
          roleTitle: 'Cami Görevlisi ve Müezzin (Kayyim)',
          memberCategory: 'staff_caretaker',
          shortSummary:
            'Caminin günlük bakımı, beş vakit namaz için açılışı, ezan okunması ve ziyaretçilerin ağırlanmasından sorumludur.',
          bio: 'Ebû Bekir Es-Sıddîk Merkez Camii’nin cami görevlisi (Kayyim) ve mukim müezzini. Beş vakit namaz için caminin açılışını, ibadet alanlarının düzenini, ezanların okunmasını ve misafirperverliği koordine eder.',
          credentials: '2012’den Beri Cami Hizmeti ve Müezzinlik Görevi',
          officeHours: 'Her gün beş vakit namaz saatlerinde',
          languagesSpoken: 'Arapça, İspanyolca',
          showInStaffDirectory: true,
          hasDedicatedPage: true,
          isAuthor: false,
          isKhateeb: false,
          order: 4,
        },
      ],
    };

    for (const [locale, leaders] of Object.entries(leadersByLocale)) {
      const existing = await strapi
        .documents('api::leader.leader')
        .findMany({ locale });

      for (const leader of leaders) {
        const match = existing.find(
          (item: Record<string, unknown>) =>
            item.slug === leader.slug || item.order === leader.order || item.name === leader.name
        );

        if (!match) {
          await strapi.documents('api::leader.leader').create({
            locale,
            status: 'published',
            data: leader,
          });
        } else if (!match.slug || !match.memberCategory || !match.credentials) {
          await strapi.documents('api::leader.leader').update({
            documentId: match.documentId as string,
            locale,
            status: 'published',
            data: leader,
          });
        }
      }
    }

    await seedAdditionalCmsContent(strapi);
  } catch {
    strapi.log.warn('Initial content seed skipped or partially applied');
  }
}
