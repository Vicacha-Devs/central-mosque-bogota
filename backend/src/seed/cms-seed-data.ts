import type { Core } from '@strapi/strapi';
import { DONATION_CAMPAIGNS_BY_LOCALE } from './cms-seed-donations';
import { EVENTS_BY_LOCALE } from './cms-seed-events';
import { MEDIA_HIGHLIGHTS_BY_LOCALE } from './cms-seed-media';
import {
  ABOUT_PAGE_BY_LOCALE,
  CONTACT_PAGE_BY_LOCALE,
  DONATIONS_PAGE_BY_LOCALE,
} from './cms-seed-pages';

export {
  ABOUT_PAGE_BY_LOCALE,
  CONTACT_PAGE_BY_LOCALE,
  DONATION_CAMPAIGNS_BY_LOCALE,
  DONATIONS_PAGE_BY_LOCALE,
  EVENTS_BY_LOCALE,
  MEDIA_HIGHLIGHTS_BY_LOCALE,
};

export const COMMUNITY_SERVICES_BY_LOCALE: Record<
  string,
  Array<Record<string, unknown>>
> = {
  es: [
    {
      title: 'Acompañamiento a Nuevos Musulmanes y Shahada',
      slug: 'acompanamiento-nuevos-musulmanes-shahada',
      description:
        'Orientación personalizada, entrega de literatura islámica en español y clases de fundamentos para quienes pronuncian la Shahada.',
      longDescription:
        'Ofrecemos un programa cálido y estructurado para quienes desean abrazar el Islam o aprender a realizar la oración diaria.',
      icon: 'mosque',
      href: '/es/islam-and-faith',
      featured: true,
      order: 1,
    },
    {
      title: 'Matrimonio Islámico (Nikah) y Consejería Familiar',
      slug: 'matrimonio-islamico-nikah-consejeria-familiar',
      description:
        'Celebración de contratos matrimoniales islámicos (Nikah), charlas prematrimoniales y mediación familiar confidencial.',
      longDescription:
        'El Imam de la mezquita guía a las parejas en los requisitos éticos y espirituales del Nikah y expide la certificación oficial de la comunidad.',
      icon: 'favorite',
      href: '/es/contact-and-visit',
      featured: true,
      order: 2,
    },
    {
      title: 'Visitas Guiadas para Colegios y Universidades',
      slug: 'visitas-guiadas-colegios-universidades',
      description:
        'Recorridos pedagógicos e interreligiosos por la arquitectura, historia y prácticas de la Mezquita Central de Bogotá.',
      longDescription:
        'Recibimos grupos académicos y culturales con reserva previa en español, inglés, árabe o turco.',
      icon: 'school',
      href: '/es/contact-and-visit',
      featured: true,
      order: 3,
    },
  ],
  en: [
    {
      title: 'New Muslim Mentorship & Shahada Declarations',
      slug: 'new-muslim-mentorship-shahada',
      description:
        'One-on-one guidance, Spanish/English Islamic literature, and foundational classes for those embracing Islam.',
      longDescription:
        'We provide a welcoming mentorship program for anyone wishing to declare the Shahada or learn the daily prayers.',
      icon: 'mosque',
      href: '/en/islam-and-faith',
      featured: true,
      order: 1,
    },
    {
      title: 'Islamic Marriage (Nikah) & Family Counseling',
      slug: 'islamic-marriage-nikah-family-counseling',
      description:
        'Officiating Islamic marriage contracts (Nikah), premarital counseling, and confidential family guidance.',
      longDescription:
        'Our Imam guides couples through the spiritual foundations of marriage and issues official mosque Nikah certificates.',
      icon: 'favorite',
      href: '/en/contact-and-visit',
      featured: true,
      order: 2,
    },
    {
      title: 'Guided Tours for Schools & Universities',
      slug: 'guided-tours-schools-universities',
      description:
        'Educational tours exploring the architecture, history, and spiritual life of the Central Mosque of Bogotá.',
      longDescription:
        'Academic and cultural groups are welcome by appointment with guides available in Spanish, English, Arabic, and Turkish.',
      icon: 'school',
      href: '/en/contact-and-visit',
      featured: true,
      order: 3,
    },
  ],
  ar: [
    {
      title: 'رعاية المسلمين الجدد وإشهار الإسلام (الشهادة)',
      slug: 'new-muslim-mentorship-shahada-ar',
      description:
        'إرشاد شخصي ومطبوعات تعريفية بالإسلام باللغتين الإسبانية والعربية ودروس تأسيسية للمسلمين الجدد.',
      icon: 'mosque',
      href: '/ar/islam-and-faith',
      featured: true,
      order: 1,
    },
    {
      title: 'عقود الزواج الإسلامي (النكاح) والإرشاد الأسري',
      slug: 'islamic-marriage-nikah-ar',
      description:
        'إبرام عقود الزواج الشرعي وتقديم الاستشارات الأسرية والتوجيه للمقبلين على الزواج.',
      icon: 'favorite',
      href: '/ar/contact-and-visit',
      featured: true,
      order: 2,
    },
  ],
  tr: [
    {
      title: 'Yeni Müslümanlar İçin Rehberlik ve Kelime-i Şehadet',
      slug: 'yeni-muslumanlar-rehberlik-sehadet',
      description:
        'İslam’ı seçenler için birebir rehberlik, İspanyolca/Türkçe kaynaklar ve temel ibadet dersleri.',
      icon: 'mosque',
      href: '/tr/islam-and-faith',
      featured: true,
      order: 1,
    },
    {
      title: 'İslami Nikâh Merasimi ve Aile Danışmanlığı',
      slug: 'islami-nikah-aile-danismanligi',
      description:
        'İslami nikâh akdi, evlilik öncesi rehberlik ve aile danışmanlığı hizmetleri.',
      icon: 'favorite',
      href: '/tr/contact-and-visit',
      featured: true,
      order: 2,
    },
  ],
};

export const ARTICLES_BY_LOCALE: Record<
  string,
  Array<Record<string, unknown>>
> = {
  es: [
    {
      title: 'Introducción al Árabe Coránico',
      slug: 'introduccion-arabe-coranico',
      description:
        'Domina las bases de la lectura y escritura del idioma sagrado del Islam desde cero.',
      content:
        '<p>El idioma árabe es la llave para comprender directamente el mensaje del Sagrado Corán y conectar con la tradición espiritual del Islam.</p>',
      tag: 'Fundacional',
      category: 'quran',
      author: 'Ustadh Tariq Ramírez',
      readingTime: '8 min',
      featured: true,
    },
    {
      title: 'Historia del Islam',
      slug: 'historia-del-islam',
      description:
        'Un viaje fascinante por los siglos que forjaron una de las civilizaciones más influyentes.',
      content:
        '<p>Desde la revelación en La Meca y la constitución de Medina hasta los grandes centros del saber en Bagdad, Córdoba, El Cairo y Estambul.</p>',
      tag: 'Histórico',
      category: 'history',
      author: 'Sheikh Ahmad Al-Mansoor',
      readingTime: '10 min',
      featured: true,
    },
    {
      title: 'Fiqh y Ética',
      slug: 'fiqh-y-etica',
      description:
        'Aplicación de la jurisprudencia islámica y los valores morales en la vida cotidiana moderna.',
      content:
        '<p>El Fiqh (comprensión profunda de la norma islámica) y el Adab (ética y carácter) caminan siempre juntos en la vida del creyente.</p>',
      tag: 'Práctico',
      category: 'fiqh',
      author: 'Dra. Amina Gómez',
      readingTime: '7 min',
      featured: true,
    },
  ],
  en: [
    {
      title: 'Introduction to Quranic Arabic',
      slug: 'introduccion-arabe-coranico',
      description:
        'Master the foundations of reading and writing the sacred language of Islam from scratch.',
      content:
        '<p>The Arabic language is the key to directly understanding the message of the Holy Quran and connecting with the spiritual heritage of Islam.</p>',
      tag: 'Foundational',
      category: 'quran',
      author: 'Ustadh Tariq Ramírez',
      readingTime: '8 min',
      featured: true,
    },
    {
      title: 'History of Islam',
      slug: 'historia-del-islam',
      description:
        'A fascinating journey through the centuries that shaped one of the world’s most influential civilizations.',
      content:
        '<p>From the revelation in Makkah and the Charter of Madinah to the great centers of scholarship in Baghdad, Cordoba, Cairo, and Istanbul.</p>',
      tag: 'Historical',
      category: 'history',
      author: 'Sheikh Ahmad Al-Mansoor',
      readingTime: '10 min',
      featured: true,
    },
    {
      title: 'Fiqh & Islamic Ethics',
      slug: 'fiqh-y-etica',
      description:
        'Applying Islamic jurisprudence and moral character in modern daily life.',
      content:
        '<p>Fiqh (deep understanding of sacred law) and Adab (ethical refinement) always walk hand in hand in the life of a believer.</p>',
      tag: 'Practical',
      category: 'fiqh',
      author: 'Dr. Amina Gómez',
      readingTime: '7 min',
      featured: true,
    },
  ],
  ar: [
    {
      title: 'مدخل إلى اللغة العربية القرآنية',
      slug: 'introduccion-arabe-coranico',
      description:
        'أتقن أساسيات القراءة والكتابة والتجويد للغة القرآن الكريم من الصفر.',
      content:
        '<p>اللغة العربية هي المفتاح لفهم رسالة القرآن الكريم مباشرة والارتباط بالتراث الروحي والعلمي للإسلام.</p>',
      tag: 'تأسيسي',
      category: 'quran',
      author: 'الأستاذ طارق راميريز',
      readingTime: '8 دقائق',
      featured: true,
    },
    {
      title: 'تاريخ الحضارة الإسلامية',
      slug: 'historia-del-islam',
      description:
        'رحلة معرفية عبر القرون التي صاغت واحدة من أعظم الحضارات الإنسانية.',
      content:
        '<p>منذ فجر الوحي في مكة المكرمة ووثيقة المدينة المنورة إلى حواضر العلم في بغداد وقرطبة والقاهرة وإسطنبول.</p>',
      tag: 'تاريخي',
      category: 'history',
      author: 'الشيخ أحمد المنصور',
      readingTime: '10 دقائق',
      featured: true,
    },
    {
      title: 'الفقه والأخلاق الإسلامية',
      slug: 'fiqh-y-etica',
      description:
        'تطبيق الفقه الإسلامي والقيم الأخلاقية في الحياة اليومية المعاصرة.',
      content:
        '<p>يقترن الفقه في الدين دائماً بحسن الخلق والأدب الإسلامي الرفيع في العبادة والمعاملات.</p>',
      tag: 'عملي',
      category: 'fiqh',
      author: 'د. أمينة غوميز',
      readingTime: '7 دقائق',
      featured: true,
    },
  ],
  tr: [
    {
      title: 'Kur’an Arapçasına Giriş',
      slug: 'introduccion-arabe-coranico',
      description:
        'İslam’ın kutsal dilini okuma, yazma ve tecvid temellerini sıfırdan öğrenin.',
      content:
        '<p>Arapça, Kur’an-ı Kerim’in mesajını doğrudan anlamanın ve İslam geleneğiyle bağ kurmanın anahtarıdır.</p>',
      tag: 'Temel',
      category: 'quran',
      author: 'Üstad Tarık Ramírez',
      readingTime: '8 dk',
      featured: true,
    },
    {
      title: 'İslam Tarihi ve Medeniyeti',
      slug: 'historia-del-islam',
      description:
        'İnsanlık tarihinin en etkili medeniyetlerinden birini şekillendiren yüzyıllara yolculuk.',
      content:
        '<p>Mekke’deki ilk vahiyden ve Medine Vesikası’ndan Bağdat, Kurtuba, Kahire ve İstanbul’daki ilim merkezlerine uzanan miras.</p>',
      tag: 'Tarihî',
      category: 'history',
      author: 'Şeyh Ahmed El-Mansur',
      readingTime: '10 dk',
      featured: true,
    },
    {
      title: 'Fıkıh ve İslam Ahlakı',
      slug: 'fiqh-y-etica',
      description:
        'İslam fıkhının ve ahlaki değerlerin modern günlük hayatta uygulanması.',
      content:
        '<p>Fıkıh (derin kavrayış) ve Edep (güzel ahlak), müminin hayatında her zaman birlikte yürür.</p>',
      tag: 'Uygulamalı',
      category: 'fiqh',
      author: 'Dr. Amina Gómez',
      readingTime: '7 dk',
      featured: true,
    },
  ],
};

export const FAQS_BY_LOCALE: Record<string, Array<Record<string, unknown>>> = {
  es: [
    {
      question: '¿Pueden personas no musulmanas visitar la Mezquita Central?',
      answer:
        '¡Por supuesto! La Mezquita Abu Bakr As-Siddiq da la bienvenida a todos los visitantes curiosos, estudiantes y vecinos. Puedes agendar una visita guiada gratuita desde nuestra página de Contacto.',
      category: 'visiting',
      order: 1,
    },
    {
      question: '¿A qué hora se realiza la oración del viernes (Jumu’ah)?',
      answer:
        'El sermón (Khutbah) en árabe y español comienza a las 12:15 PM y la oración congregacional se realiza a las 12:45 PM todos los viernes.',
      category: 'general',
      order: 2,
    },
  ],
  en: [
    {
      question: 'Can non-Muslims visit the Central Mosque of Bogotá?',
      answer:
        'Absolutely! The Abu Bakr As-Siddiq Central Mosque welcomes visitors of all backgrounds, students, and neighbors. You can request a free guided visit on our Contact page.',
      category: 'visiting',
      order: 1,
    },
    {
      question: 'What time is Friday congregational prayer (Jumu’ah)?',
      answer:
        'The bilingual Khutbah (Arabic and Spanish) starts at 12:15 PM and congregational prayer begins at 12:45 PM every Friday.',
      category: 'general',
      order: 2,
    },
  ],
  ar: [
    {
      question: 'هل يمكن لغير المسلمين زيارة مسجد أبو بكر الصديق المركزي؟',
      answer:
        'بكل ترحيب! يفتح المسجد أبوابه للزوار والباحثين والطلاب للتعرف على الإسلام وحضارته من خلال جولات تعريفية مجانية.',
      category: 'visiting',
      order: 1,
    },
    {
      question: 'متى تقام خطبة وصلاة الجمعة؟',
      answer:
        'تبدأ خطبة الجمعة (بالعربية والإسبانية) الساعة 12:15 ظهراً وتقام الصلاة الساعة 12:45 ظهراً.',
      category: 'general',
      order: 2,
    },
  ],
  tr: [
    {
      question: 'Müslüman olmayan ziyaretçiler Merkez Camii’ni ziyaret edebilir mi?',
      answer:
        'Elbette! Ebû Bekir Es-Sıddîk Merkez Camii tüm ziyaretçilere, öğrencilere ve komşularımıza açıktır. İletişim sayfasından ücretsiz rehberli ziyaret randevusu alabilirsiniz.',
      category: 'visiting',
      order: 1,
    },
    {
      question: 'Cuma namazı ve hutbe saat kaçta başlıyor?',
      answer:
        'Cuma hutbesi (Arapça ve İspanyolca) saat 12:15’te başlamakta, Cuma namazı ise 12:45’te kılınmaktadır.',
      category: 'general',
      order: 2,
    },
  ],
};

export async function seedAdditionalCmsContent(
  strapi: Core.Strapi
): Promise<void> {
  // Single Types
  const singleTypeSeeds: Array<{
    uid:
      | 'api::about-page.about-page'
      | 'api::donations-page.donations-page'
      | 'api::contact-page.contact-page';
    byLocale: Record<string, Record<string, unknown>>;
  }> = [
    { uid: 'api::about-page.about-page', byLocale: ABOUT_PAGE_BY_LOCALE },
    {
      uid: 'api::donations-page.donations-page',
      byLocale: DONATIONS_PAGE_BY_LOCALE,
    },
    { uid: 'api::contact-page.contact-page', byLocale: CONTACT_PAGE_BY_LOCALE },
  ];

  for (const { uid, byLocale } of singleTypeSeeds) {
    for (const [locale, data] of Object.entries(byLocale)) {
      const existing = await strapi.documents(uid).findFirst({ locale });
      if (!existing) {
        await strapi.documents(uid).create({
          locale,
          status: 'published',
          data: data as any,
        });
      }
    }
  }

  // Collection Types
  const collectionTypeSeeds: Array<{
    uid:
      | 'api::event.event'
      | 'api::community-service.community-service'
      | 'api::article.article'
      | 'api::donation-campaign.donation-campaign'
      | 'api::media-highlight.media-highlight'
      | 'api::faq.faq';
    byLocale: Record<string, Array<Record<string, unknown>>>;
  }> = [
    { uid: 'api::event.event', byLocale: EVENTS_BY_LOCALE },
    {
      uid: 'api::community-service.community-service',
      byLocale: COMMUNITY_SERVICES_BY_LOCALE,
    },
    { uid: 'api::article.article', byLocale: ARTICLES_BY_LOCALE },
    {
      uid: 'api::donation-campaign.donation-campaign',
      byLocale: DONATION_CAMPAIGNS_BY_LOCALE,
    },
    {
      uid: 'api::media-highlight.media-highlight',
      byLocale: MEDIA_HIGHLIGHTS_BY_LOCALE,
    },
    { uid: 'api::faq.faq', byLocale: FAQS_BY_LOCALE },
  ];

  for (const { uid, byLocale } of collectionTypeSeeds) {
    for (const [locale, items] of Object.entries(byLocale)) {
      const existing = await strapi.documents(uid).findMany({ locale });
      if (existing.length === 0) {
        for (const item of items) {
          await strapi.documents(uid).create({
            locale,
            status: 'published',
            data: item as any,
          });
        }
      }
    }
  }
}
