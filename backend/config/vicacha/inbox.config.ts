type EnvFn = {
  (key: string, defaultValue?: string): string;
  int(key: string, defaultValue?: number): number;
  bool(key: string, defaultValue?: boolean): boolean;
};

export function buildMosqueInboxPluginConfig(env: EnvFn) {
  return {
    enabled: true,
    config: {
      primaryCalendar: 'gregory',
      secondaryCalendars: ['islamic-umalqura'],
      defaultLocale: 'es',
      supportedLocales: ['es', 'en', 'ar', 'tr'],
      defaultRateLimitPerHour: env.int('INBOX_RATE_LIMIT_PER_HOUR', 15),
      defaultHoneypotField: '_website_url',
      defaultCaptchaProvider: env('INBOX_CAPTCHA_PROVIDER', 'none'),
      turnstileSiteKey: env('TURNSTILE_SITE_KEY', ''),
      turnstileSecretKey: env('TURNSTILE_SECRET_KEY', ''),
      recaptchaSiteKey: env('RECAPTCHA_SITE_KEY', ''),
      recaptchaSecretKey: env('RECAPTCHA_SECRET_KEY', ''),
      enableDoubleOptIn: env.bool('INBOX_DOUBLE_OPT_IN', true),
      availableTopics: [
        'announcements',
        'events',
        'courses',
        'ramadan_eid',
        'newsletter',
      ],
      availableDepartments: [
        'general',
        'imamate',
        'nikah_family',
        'new_muslims',
        'halal_certification',
        'janazah_urgent',
        'social_aid',
        'guided_visits',
      ],
      enableBookingBridge: true,
      enableCertificateBridge: true,
      defaultNotifyEmails: [
        env('MOSQUE_INBOX_EMAIL', 'info@mezquitabogota.org'),
        env('MOSQUE_IMAM_EMAIL', 'imam@mezquitabogota.org'),
      ],
      outboundWebhookUrl: env('INBOX_OUTBOUND_WEBHOOK_URL', ''),
      presetForms: [
        {
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
        },
        {
          slug: 'service-desk-application',
          title: 'Mesa de Servicios Religiosos y Comunitarios (Nikah, Shahada, Halal, Janazah)',
          category: 'service_desk',
          active: true,
          translations: {
            es: {
              title: 'Solicitud Formal de Servicio Religioso o Comunitario',
              description:
                'Radica tu solicitud de Matrimonio Islámico (Nikah), Certificado de Shahada, Certificación Halal o Asistencia Funeraria (Janazah) con lista de verificación documental.',
              submitButtonLabel: 'Radicar Solicitud Oficial',
              successMessage:
                'Tu solicitud ha sido radicada con código de seguimiento. Nuestro equipo revisará los requisitos y agendará tu cita.',
            },
            en: {
              title: 'Formal Religious & Community Service Application',
              description:
                'Submit an application for Islamic Marriage (Nikah), Shahada Certificate, Halal Certification, or Janazah Funeral Coordination with document verification.',
              submitButtonLabel: 'Submit Official Application',
              successMessage:
                'Your application has been registered with a tracking code. Our team will verify your documents and schedule your appointment.',
            },
            ar: {
              title: 'طلب خدمة دينية أو مجتمعية رسمية',
              description:
                'تقديم طلب عقد نكاح، شهادة إشهار إسلام، شهادة حلال، أو تنسيق جنازة مع قائمة التحقق من المستندات.',
              submitButtonLabel: 'تقديم الطلب الرسمي',
              successMessage:
                'تم تسجيل طلبكم برقم مرجعي. سيقوم فريقنا بمراجعة المستندات وتحديد الموعد.',
            },
            tr: {
              title: 'Resmi Dini ve Toplumsal Hizmet Başvurusu',
              description:
                'İslami Nikâh, Şehadet Belgesi, Helal Sertifikası veya Cenaze Hizmetleri için belge kontrol listeli başvuru.',
              submitButtonLabel: 'Resmi Başvuruyu Gönder',
              successMessage:
                'Başvurunuz takip koduyla kaydedildi. Ekibimiz belgelerinizi inceleyip randevunuzu planlayacaktır.',
            },
          },
          fields: [
            {
              id: 'fld_service_type',
              type: 'select',
              name: 'serviceType',
              label: 'Tipo de Trámite',
              required: true,
              width: 'half',
              localizedLabels: {
                es: 'Tipo de Trámite',
                en: 'Service Type',
                ar: 'نوع الخدمة',
                tr: 'Hizmet Türü',
              },
              options: [
                {
                  value: 'nikah',
                  label: 'Matrimonio Islámico (Nikah)',
                  localizedLabels: {
                    es: 'Matrimonio Islámico (Nikah)',
                    en: 'Islamic Marriage (Nikah)',
                    ar: 'عقد الزواج الإسلامي (النكاح)',
                    tr: 'İslami Nikâh (Nikah)',
                  },
                },
                {
                  value: 'shahada',
                  label: 'Declaración y Certificado de Shahada',
                  localizedLabels: {
                    es: 'Declaración y Certificado de Shahada',
                    en: 'Shahada Declaration & Certificate',
                    ar: 'إشهار الإسلام وشهادة الشهادتين',
                    tr: 'Kelime-i Şehadet ve Belgesi',
                  },
                },
                {
                  value: 'consular_hajj',
                  label: 'Certificado Consular para Visado Hajj / Umrah',
                  localizedLabels: {
                    es: 'Certificado Consular para Visado Hajj / Umrah',
                    en: 'Consular Certificate for Hajj / Umrah Visa',
                    ar: 'شهادة قنصلية لتأشيرة الحج والعمرة',
                    tr: 'Hac / Umre Vizesi Konsolosluk Belgesi',
                  },
                },
                {
                  value: 'halal',
                  label: 'Inspección y Certificación Halal',
                  localizedLabels: {
                    es: 'Inspección y Certificación Halal',
                    en: 'Halal Inspection & Certification',
                    ar: 'الفحص وإصدار شهادة الحلال',
                    tr: 'Helal Denetim ve Sertifikasyon',
                  },
                },
                {
                  value: 'janazah',
                  label: 'Asistencia Funeraria Urgente (Janazah)',
                  localizedLabels: {
                    es: 'Asistencia Funeraria Urgente (Janazah)',
                    en: 'Urgent Funeral Coordination (Janazah)',
                    ar: 'تنسيق الجنازة العاجل',
                    tr: 'Acil Cenaze Hizmetleri (Cenaze Namazı)',
                  },
                },
              ],
            },
            {
              id: 'fld_applicant_name',
              type: 'text',
              name: 'applicantName',
              label: 'Nombre Completo del Solicitante',
              required: true,
              width: 'half',
              localizedLabels: {
                es: 'Nombre Completo del Solicitante',
                en: 'Applicant Full Name',
                ar: 'الاسم الكامل لمقدم الطلب',
                tr: 'Başvuru Sahibinin Adı Soyadı',
              },
            },
            {
              id: 'fld_applicant_email',
              type: 'email',
              name: 'applicantEmail',
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
              id: 'fld_applicant_phone',
              type: 'phone',
              name: 'applicantPhone',
              label: 'Teléfono / WhatsApp',
              required: true,
              width: 'half',
              localizedLabels: {
                es: 'Teléfono / WhatsApp',
                en: 'Phone / WhatsApp',
                ar: 'الهاتف / واتساب',
                tr: 'Telefon / WhatsApp',
              },
            },
            {
              id: 'fld_preferred_date',
              type: 'date',
              name: 'preferredDate',
              label: 'Fecha Preferida para Cita',
              required: false,
              width: 'half',
              localizedLabels: {
                es: 'Fecha Preferida para Cita',
                en: 'Preferred Appointment Date',
                ar: 'تاريخ الموعد المفضل',
                tr: 'Tercih Edilen Randevu Tarihi',
              },
            },
            {
              id: 'fld_details',
              type: 'textarea',
              name: 'details',
              label: 'Detalles de la Solicitud y Observaciones',
              required: true,
              width: 'full',
              localizedLabels: {
                es: 'Detalles de la Solicitud y Observaciones',
                en: 'Application Details & Notes',
                ar: 'تفاصيل الطلب والملاحظات',
                tr: 'Başvuru Detayları ve Notlar',
              },
            },
          ],
          checklistTemplate: [
            {
              id: 'chk_national_id',
              label: 'Copia de Cédula de Ciudadanía, Extranjería o Pasaporte vigente',
              required: true,
              verified: false,
              localizedLabels: {
                es: 'Copia de Cédula de Ciudadanía, Extranjería o Pasaporte vigente',
                en: 'Valid National ID or Passport Copy',
                ar: 'نسخة من الهوية الوطنية أو جواز السفر الساري',
                tr: 'Geçerli Kimlik Kartı veya Pasaport Fotokopisi',
              },
            },
            {
              id: 'chk_witnesses_or_wali',
              label: 'Datos de dos testigos musulmanes (y Wali para trámites de Nikah)',
              required: true,
              verified: false,
              localizedLabels: {
                es: 'Datos de dos testigos musulmanes (y Wali para trámites de Nikah)',
                en: 'Details of two Muslim witnesses (and Wali for Nikah applications)',
                ar: 'بيانات شاهدين مسلمين (وولي الأمر لطلبات النكاح)',
                tr: 'İki Müslüman şahit bilgisi (ve Nikâh için Veli onayı)',
              },
            },
          ],
          settings: {
            honeypotField: '_website_url',
            rateLimitPerHour: 10,
            enableBookingBridge: true,
            defaultBookingServiceSlug: 'nikah-shahada-appointment',
            enableCertificateBridge: true,
            defaultCertificateTemplateId: 'shahada-certificate',
            defaultPriority: 'high',
            department: 'imamate',
          },
        },
      ],
    },
  };
}
