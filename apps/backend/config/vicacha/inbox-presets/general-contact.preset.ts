export const GENERAL_CONTACT_PRESET_FORM = {
  slug: 'general-contact',
  title: 'Contacto General y Orientación',
  category: 'contact',
  active: true,
  translations: {
    es: {
      title: 'Contacto General y Orientación',
      description:
        'Consultas generales, orientación espiritual con el Imam, certificados o información sobre la Mezquita Central Abu Bakr As-Siddiq.',
      submitButtonLabel: 'Enviar Mensaje',
      successMessage:
        '¡JazakAllahu Khayran! Hemos recibido tu mensaje y nuestro equipo te responderá pronto.',
    },
    en: {
      title: 'General Contact & Spiritual Guidance',
      description:
        'General inquiries, spiritual counseling with the Imam, official certificates, or visitor information.',
      submitButtonLabel: 'Send Message',
      successMessage:
        'JazakAllahu Khayran! We have received your message and will respond shortly.',
    },
    ar: {
      title: 'الاتصال العام والتوجيه الشرعي',
      description:
        'الاستفسارات العامة، التوجيه الروحي مع الإمام، الشهادات الرسمية أو معلومات الزيارة.',
      submitButtonLabel: 'إرسال الرسالة',
      successMessage:
        'جزاكم الله خيراً! تم استلام رسالتكم وسنتواصل معكم قريباً.',
    },
    tr: {
      title: 'Genel İletişim ve Manevi Rehberlik',
      description:
        'Genel sorular, İmam ile manevi danışmanlık, resmi sertifikalar veya ziyaret bilgileri.',
      submitButtonLabel: 'Mesaj Gönder',
      successMessage:
        'Cezakallahu Hayran! Mesajınız alındı, en kısa sürede dönüş yapacağız.',
    },
  },
  fields: [
    {
      id: 'fld_full_name',
      type: 'text',
      name: 'fullName',
      label: 'Nombre Completo',
      required: true,
      width: 'half',
      localizedLabels: {
        es: 'Nombre Completo',
        en: 'Full Name',
        ar: 'الاسم الكامل',
        tr: 'Ad Soyad',
      },
      validation: [{ type: 'minLength', value: 2 }],
    },
    {
      id: 'fld_email',
      type: 'email',
      name: 'email',
      label: 'Correo Electrónico',
      required: true,
      width: 'half',
      localizedLabels: {
        es: 'Correo Electrónico',
        en: 'Email Address',
        ar: 'البريد الإلكتروني',
        tr: 'E-posta Adresi',
      },
    },
    {
      id: 'fld_phone',
      type: 'phone',
      name: 'phone',
      label: 'Teléfono / WhatsApp',
      required: false,
      width: 'half',
      localizedLabels: {
        es: 'Teléfono / WhatsApp',
        en: 'Phone / WhatsApp',
        ar: 'الهاتف / واتساب',
        tr: 'Telefon / WhatsApp',
      },
    },
    {
      id: 'fld_subject',
      type: 'select',
      name: 'subject',
      label: 'Motivo de Consulta',
      required: true,
      width: 'half',
      localizedLabels: {
        es: 'Motivo de Consulta',
        en: 'Inquiry Subject',
        ar: 'موضوع الاستفسار',
        tr: 'Danışma Konusu',
      },
      options: [
        {
          value: 'general',
          label: 'Consulta General',
          localizedLabels: {
            es: 'Consulta General',
            en: 'General Inquiry',
            ar: 'استفسار عام',
            tr: 'Genel Soru',
          },
        },
        {
          value: 'shahada',
          label: 'Shahada y Nuevos Musulmanes',
          localizedLabels: {
            es: 'Shahada y Nuevos Musulmanes',
            en: 'Shahada & New Muslims',
            ar: 'إشهار الإسلام والمسلمون الجدد',
            tr: 'Kelime-i Şehadet ve Yeni Müslümanlar',
          },
        },
        {
          value: 'nikah',
          label: 'Matrimonio Islámico (Nikah)',
          localizedLabels: {
            es: 'Matrimonio Islámico (Nikah)',
            en: 'Islamic Marriage (Nikah)',
            ar: 'عقد الزواج الإسلامي (النكاح)',
            tr: 'İslami Nikâh Merasimi',
          },
        },
        {
          value: 'certificates',
          label: 'Certificados Oficiales / Hajj / Halal',
          localizedLabels: {
            es: 'Certificados Oficiales / Hajj / Halal',
            en: 'Official Certificates / Hajj / Halal',
            ar: 'الشهادات الرسمية / الحج / الحلال',
            tr: 'Resmi Sertifikalar / Hac / Helal',
          },
        },
        {
          value: 'social_aid',
          label: 'Solicitud de Apoyo Social / Zakat',
          localizedLabels: {
            es: 'Solicitud de Apoyo Social / Zakat',
            en: 'Social Aid / Zakat Assistance',
            ar: 'طلب مساعدة اجتماعية / زكاة',
            tr: 'Sosyal Yardım / Zekât Başvurusu',
          },
        },
      ],
    },
    {
      id: 'fld_message',
      type: 'textarea',
      name: 'message',
      label: 'Mensaje',
      required: true,
      width: 'full',
      localizedLabels: {
        es: 'Mensaje',
        en: 'Message',
        ar: 'الرسالة',
        tr: 'Mesajınız',
      },
      validation: [
        { type: 'minLength', value: 10 },
        { type: 'maxLength', value: 2500 },
      ],
    },
  ],
  settings: {
    honeypotField: '_website_url',
    rateLimitPerHour: 15,
    defaultPriority: 'normal',
    department: 'general',
  },
};
