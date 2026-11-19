import type { TLang } from "@i18n/ui";

import { events } from "./data.mocks";
import type { TEvent } from "./models/events";

export type TDetailedEvent = {
  slug: string;
  speaker: string;
  fullDescription: Array<string>;
  audience: string;
  richDescription?: string;
} & TEvent;

export function getDetailedEvents(lang: TLang): Array<TDetailedEvent> {
  const images = [events[0].image, events[1].image, events[2].image];

  const byLang: Record<TLang, Array<Omit<TDetailedEvent, "url" | "image">>> = {
    es: [
      {
        slug: "clase-arabe-clasico",
        category: "Educación",
        title: "Clase de Árabe Clásico y Tajweed",
        description:
          "Aprende los fundamentos del idioma árabe y la recitación correcta del Sagrado Corán con instructores certificados.",
        schedule: "Sábados · 10:00 - 12:00",
        location: "Aulas Educativas — Mezquita Central de Bogotá",
        date: { month: "Oct", day: 15 },
        speaker: "Ustadh Tariq Ramírez",
        audience: "Jóvenes y adultos (niveles inicial e intermedio)",
        fullDescription: [
          "Nuestro curso presencial de Árabe Clásico y Tajweed está diseñado para acompañar paso a paso tanto a principiantes que desean aprender el alfabeto árabe como a estudiantes intermedios que buscan perfeccionar su lectura del Sagrado Corán.",
          "Cada sesión combina práctica fonética (Makharij al-Huruf), vocabulario esencial del Corán y reglas de entonación bajo la guía directa de nuestros docentes.",
        ],
      },
      {
        slug: "cena-comunitaria",
        category: "Comunidad",
        title: "Cena Comunitaria y Fraternidad",
        description:
          "Un espacio mensual para compartir alimentos halal y fortalecer los lazos entre las familias de la comunidad en Bogotá.",
        schedule: "Viernes · 19:30 - 21:30",
        location: "Salón Múltiple — Mezquita Central de Bogotá",
        date: { month: "Oct", day: 18 },
        speaker: "Sheikh Ahmad Al-Mansoor & Junta Directiva",
        audience: "Abierto a todas las familias y visitantes",
        fullDescription: [
          "Después de la oración de Isha, abrimos las puertas de nuestro salón comunitario para dar la bienvenida a familias locales, estudiantes universitarios, diplomáticos y nuevos musulmanes.",
          "La velada incluye una breve reflexión espiritual sobre la hermandad en el Islam seguida de una cena tradicional compartida.",
        ],
      },
      {
        slug: "circulo-jovenes",
        category: "Jóvenes",
        title: "Círculo de Jóvenes y Liderazgo",
        description:
          "Diálogo abierto sobre desafíos contemporáneos, ética profesional y el papel de la juventud musulmana en Colombia.",
        schedule: "Domingos · 17:00 - 19:00",
        location: "Biblioteca — Mezquita Central de Bogotá",
        date: { month: "Oct", day: 20 },
        speaker: "Dra. Amina Gómez & Ustadh Tariq Ramírez",
        audience: "Jóvenes de 15 a 30 años",
        fullDescription: [
          "El Círculo de Jóvenes ofrece un espacio seguro y dinámico donde estudiantes de colegio y universidad conversan sobre identidad, estudios, propósito de vida y servicio social.",
          "Realizamos talleres participativos, mentoría académica y organización de jornadas de voluntariado en Bogotá.",
        ],
      },
    ],
    en: [
      {
        slug: "clase-arabe-clasico",
        category: "Education",
        title: "Classical Arabic & Tajweed Class",
        description:
          "Learn the foundations of the Arabic script and proper Quranic recitation with certified instructors.",
        schedule: "Saturdays · 10:00 - 12:00",
        location: "Education Classrooms — Central Mosque of Bogotá",
        date: { month: "Oct", day: 15 },
        speaker: "Ustadh Tariq Ramírez",
        audience: "Youth & adults (beginner and intermediate levels)",
        fullDescription: [
          "Our in-person Classical Arabic and Tajweed course guides students step by step from the Arabic alphabet to fluent recitation of the Holy Quran.",
          "Sessions combine phonetic articulation (Makharij al-Huruf), essential Quranic vocabulary, and Tajweed rules with personalized instructor feedback.",
        ],
      },
      {
        slug: "cena-comunitaria",
        category: "Community",
        title: "Community Dinner & Fellowship",
        description:
          "A welcoming gathering to share halal food and strengthen bonds among families and visitors in Bogotá.",
        schedule: "Fridays · 19:30 - 21:30",
        location: "Community Hall — Central Mosque of Bogotá",
        date: { month: "Oct", day: 18 },
        speaker: "Sheikh Ahmad Al-Mansoor & Mosque Board",
        audience: "Open to all families, students, and guests",
        fullDescription: [
          "Following the Isha prayer, we gather in the main community hall to welcome local families, international travelers, university students, and new Muslims.",
          "The evening features a short spiritual reminder on brotherhood and hospitality followed by a shared halal dinner.",
        ],
      },
      {
        slug: "circulo-jovenes",
        category: "Youth",
        title: "Youth Halaqa & Leadership Circle",
        description:
          "Open dialogue on contemporary challenges, ethics, and the role of Muslim youth in modern society.",
        schedule: "Sundays · 17:00 - 19:00",
        location: "Mosque Library — Central Mosque of Bogotá",
        date: { month: "Oct", day: 20 },
        speaker: "Dr. Amina Gómez & Ustadh Tariq Ramírez",
        audience: "Youth aged 15–30",
        fullDescription: [
          "The Youth Halaqa provides an engaging, supportive space where high school and university students discuss faith, identity, career ethics, and community leadership.",
          "Includes interactive workshops, mentorship, and planning for Bogotá social outreach initiatives.",
        ],
      },
    ],
    ar: [
      {
        slug: "clase-arabe-clasico",
        category: "التعليم",
        title: "دورة اللغة العربية الفصحى والتجويد",
        description:
          "تعلم أساسيات اللغة العربية وأحكام تلاوة القرآن الكريم مع معلمين معتمدين في المسجد المركزي.",
        schedule: "كل سبت · 10:00 - 12:00",
        location: "القاعات التعليمية — مسجد أبو بكر الصديق المركزي",
        date: { month: "أكتوبر", day: 15 },
        speaker: "الأستاذ طارق راميريز",
        audience: "الشباب والكبار (المستوى المبتدئ والمتوسط)",
        fullDescription: [
          "تهدف دورة اللغة العربية والتجويد إلى تمكين الطلاب من قراءة القرآن الكريم قراءة صحيحة متقنة وفهم المفردات القرآنية الأساسية.",
          "تشمل الدروس التدريب العملي على مخارج الحروف وأحكام التلاوة في بيئة تعليمية محفزة.",
        ],
      },
      {
        slug: "cena-comunitaria",
        category: "المجتمع",
        title: "العشاء الجماعي واللقاء الأخوي",
        description:
          "لقاء دوري لتعزيز أواصر الأخوة والتكافل بين العائلات وأبناء الجالية المسلمة في بوغوتا.",
        schedule: "كل جمعة · 19:30 - 21:30",
        location: "القاعة الكبرى — مسجد أبو بكر الصديق المركزي",
        date: { month: "أكتوبر", day: 18 },
        speaker: "الشيخ أحمد المنصور وإدارة المسجد",
        audience: "مفتوح لجميع العائلات والزوار",
        fullDescription: [
          "يجتمع أبناء الجالية والضيوف عقب صلاة العشاء في القاعة متعددة الأغراض لتبادل الأحاديث الودية وتناول طعام العشاء الحلال.",
          "يتخلل اللقاء كلمة توجيهية قصيرة حول القيم الإسلامية والترابط الأسري.",
        ],
      },
      {
        slug: "circulo-jovenes",
        category: "الشباب",
        title: "حلقة الشباب والريادة المجتمعية",
        description:
          "حوار مفتوح حول التحديات المعاصرة وبناء الهوية الإسلامية الإيجابية لدى الشباب.",
        schedule: "كل أحد · 17:00 - 19:00",
        location: "مكتبة المسجد — بوغوتا",
        date: { month: "أكتوبر", day: 20 },
        speaker: "د. أمينة غوميز والأستاذ طارق راميريز",
        audience: "الشباب والفتيات (15 إلى 30 عاماً)",
        fullDescription: [
          "تجمع حلقة الشباب طلاب الجامعات والمدارس لمناقشة القضايا الفكرية والأخلاقية وتطوير مهارات القيادة والعمل التطوعي في كولومبيا.",
        ],
      },
    ],
    tr: [
      {
        slug: "clase-arabe-clasico",
        category: "Eğitim",
        title: "Klasik Arapça ve Tecvid Dersleri",
        description:
          "Sertifikalı eğitmenler eşliğinde Kur'an-ı Kerim الفبasını, Arapça dilbilgisini ve tecvid kurallarını öğrenin.",
        schedule: "Cumartesi · 10:00 - 12:00",
        location: "Eğitim Sınıfları — Bogota Merkez Camii",
        date: { month: "Eki", day: 15 },
        speaker: "Üstad Tarık Ramírez",
        audience: "Gençler ve yetişkinler (başlangıç ve orta seviye)",
        fullDescription: [
          "Yüz yüze gerçekleştirilen Klasik Arapça ve Tecvid derslerimiz, Kur'an-ı Kerim'i usulüne uygun okumak ve temel Kur'an kelimelerini anlamak isteyen öğrenciler için hazırlanmıştır.",
          "Her ders mahreç uygulamaları, tecvid kaideleri ve birebir okuma pratiği içermektedir.",
        ],
      },
      {
        slug: "cena-comunitaria",
        category: "Toplum",
        title: "Cemaat Akşam Yemeği ve Kardeşlik Buluşması",
        description:
          "Bogota'daki Müslüman aileler ve misafirler arasındaki kardeşlik bağlarını güçlendiren aylık buluşma.",
        schedule: "Cuma · 19:30 - 21:30",
        location: "Çok Amaçlı Salon — Bogota Merkez Camii",
        date: { month: "Eki", day: 18 },
        speaker: "Şeyh Ahmed El-Mansur ve Cami Yönetimi",
        audience: "Tüm ailelere ve misafirlere açıktır",
        fullDescription: [
          "Yatsı namazının ardından camimizin çok amaçlı salonunda aileler, üniversite öğrencileri ve yeni Müslümanlarla bir araya geliyoruz.",
          "Program kısa bir manevi sohbet ve helal akşam yemeği ikramı ile devam etmektedir.",
        ],
      },
      {
        slug: "circulo-jovenes",
        category: "Gençlik",
        title: "Gençlik Halkası ve Liderlik Sohbetleri",
        description:
          "Güncel meseleler, İslami kimlik ve gençlerin toplumdaki yapıcı rolü üzerine açık diyalog.",
        schedule: "Pazar · 17:00 - 19:00",
        location: "Cami Kütüphanesi — Bogota Merkez Camii",
        date: { month: "Eki", day: 20 },
        speaker: "Dr. Amina Gómez ve Üstad Tarık Ramírez",
        audience: "15–30 yaş arası gençler",
        fullDescription: [
          "Gençlik Halkası, lise ve üniversite öğrencilerinin inanç, ahlak, akademik gelişim ve sosyal sorumluluk projelerini konuştuğu samimi bir ortamdır.",
        ],
      },
    ],
  };

  return byLang[lang].map((ev, idx) => ({
    ...ev,
    image: images[idx] ?? images[0],
    url: `/${lang}/events/${ev.slug}`,
  }));
}
