import type { Core } from '@strapi/strapi';

export const EMAIL_DESIGNER_TEMPLATE_UID =
  'plugin::email-designer-5.email-designer-template';

export const EMAIL_TEMPLATE_IDS = {
  contactConfirmation: {
    es: 101,
    en: 102,
    ar: 103,
    tr: 104,
  },
  visitConfirmation: {
    es: 201,
    en: 202,
    ar: 203,
    tr: 204,
  },
  donationConfirmation: {
    es: 301,
    en: 302,
    ar: 303,
    tr: 304,
  },
  adminAlerts: {
    contact: 901,
    visit: 902,
    donation: 903,
  },
} as const;

export type SupportedEmailLocale = 'es' | 'en' | 'ar' | 'tr';

export function resolveTemplateLocale(locale: unknown): SupportedEmailLocale {
  if (
    typeof locale === 'string' &&
    (locale === 'es' || locale === 'en' || locale === 'ar' || locale === 'tr')
  ) {
    return locale;
  }
  return 'es';
}

interface SeedEmailTemplateRecord {
  templateReferenceId: number;
  name: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  tags: string[];
  design: Record<string, unknown>;
}

/**
 * Generates a valid Unlayer schemaVersion 6 design JSON object so editors can
 * immediately open and customize any pre-seeded template in the Strapi v5 Admin panel.
 */
function buildUnlayerDesign(innerHtml: string, dir: 'ltr' | 'rtl' = 'ltr'): Record<string, unknown> {
  const textAlign = dir === 'rtl' ? 'right' : 'left';
  return {
    counters: { u_row: 2, u_content_text: 2, u_column: 2 },
    body: {
      values: {
        backgroundColor: '#f6f8f7',
        linkStyle: {
          body: true,
          linkHoverColor: '#1b4332',
          linkHoverUnderline: true,
          linkColor: '#2d6a4f',
          linkUnderline: true,
        },
        contentWidth: '600px',
        backgroundImage: {
          repeat: false,
          center: true,
          fullWidth: true,
          url: '',
          cover: false,
        },
        contentAlign: 'center',
        textColor: '#14281d',
        _meta: { htmlID: 'u_body', htmlClassNames: 'u_body' },
        fontFamily: { label: 'Arial', value: 'arial,helvetica,sans-serif' },
        preheaderText: '',
      },
      rows: [
        {
          cells: [1],
          values: {
            backgroundImage: {
              cover: false,
              url: '',
              repeat: false,
              fullWidth: true,
              center: true,
            },
            hideDesktop: false,
            selectable: true,
            columnsBackgroundColor: '#ffffff',
            hideable: true,
            backgroundColor: '',
            padding: '24px',
            columns: false,
            _meta: { htmlID: 'u_row_1', htmlClassNames: 'u_row' },
            deletable: true,
            displayCondition: null,
            duplicatable: true,
            draggable: true,
          },
          columns: [
            {
              contents: [
                {
                  values: {
                    hideDesktop: false,
                    duplicatable: true,
                    deletable: true,
                    linkStyle: {
                      linkHoverUnderline: true,
                      linkColor: '#2d6a4f',
                      inherit: true,
                      linkUnderline: true,
                      linkHoverColor: '#1b4332',
                    },
                    hideable: true,
                    lineHeight: '160%',
                    draggable: true,
                    containerPadding: '20px',
                    text: `<div dir="${dir}" style="text-align: ${textAlign};">${innerHtml}</div>`,
                    _meta: {
                      htmlID: 'u_content_text_1',
                      htmlClassNames: 'u_content_text',
                    },
                    textAlign,
                    selectable: true,
                  },
                  type: 'text',
                },
              ],
              values: {
                border: {},
                _meta: { htmlClassNames: 'u_column', htmlID: 'u_column_1' },
                backgroundColor: '#ffffff',
                padding: '0px',
              },
            },
          ],
        },
      ],
    },
    schemaVersion: 6,
  };
}

function wrapHtmlCard(innerHtml: string, dir: 'ltr' | 'rtl' = 'ltr'): string {
  const textAlign = dir === 'rtl' ? 'right' : 'left';
  return `<div dir="${dir}" style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;padding:24px;background-color:#ffffff;border:1px solid #d8e2dc;border-radius:8px;line-height:1.6;color:#14281d;text-align:${textAlign}">${innerHtml}</div>`;
}

const INITIAL_EMAIL_TEMPLATES: SeedEmailTemplateRecord[] = [
  // ============================================================================
  // 101–104: Contact Inquiry Confirmations (es, en, ar, tr)
  // ============================================================================
  {
    templateReferenceId: EMAIL_TEMPLATE_IDS.contactConfirmation.es,
    name: '[ES] Confirmación de Contacto — Mezquita Central',
    subject: 'Hemos recibido tu mensaje — {{mosque.name}}',
    tags: ['contact', 'es', 'visitor'],
    bodyText:
      'As-salamu alaykum {{visitor.fullName}},\n\nGracias por comunicarte con la Mezquita Central Abu Bakr As-Siddiq de Bogotá. Nuestro equipo ha recibido tu consulta ({{visitor.subject}}) y te responderá a la brevedad.\n\n{{mosque.name}} • {{mosque.address}}',
    bodyHtml: wrapHtmlCard(
      `<h2 style="color:#1b4332;margin-top:0">As-salamu alaykum, {{visitor.fullName}}</h2>
      <p>Gracias por comunicarte con la <strong>{{mosque.name}}</strong>. Nuestro equipo ha recibido tu consulta y te responderá a la brevedad.</p>
      <p><strong>Categoría:</strong> {{visitor.subject}}</p>
      <hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" />
      <p style="font-size:12px;color:#52796f">{{mosque.name}} • {{mosque.address}} • {{mosque.phone}}</p>`,
      'ltr'
    ),
    design: buildUnlayerDesign(
      `<h2 style="color:#1b4332;margin-top:0">As-salamu alaykum, {{visitor.fullName}}</h2><p>Gracias por comunicarte con la <strong>{{mosque.name}}</strong>. Nuestro equipo ha recibido tu consulta y te responderá a la brevedad.</p><p><strong>Categoría:</strong> {{visitor.subject}}</p><hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" /><p style="font-size:12px;color:#52796f">{{mosque.name}} • {{mosque.address}} • {{mosque.phone}}</p>`,
      'ltr'
    ),
  },
  {
    templateReferenceId: EMAIL_TEMPLATE_IDS.contactConfirmation.en,
    name: '[EN] Contact Inquiry Confirmation — Central Mosque',
    subject: 'We received your message — {{mosque.name}}',
    tags: ['contact', 'en', 'visitor'],
    bodyText:
      'As-salamu alaykum {{visitor.fullName}},\n\nThank you for reaching out to the Abu Bakr As-Siddiq Central Mosque of Bogotá. Our team has received your inquiry ({{visitor.subject}}) and will reply shortly.\n\n{{mosque.name}} • {{mosque.address}}',
    bodyHtml: wrapHtmlCard(
      `<h2 style="color:#1b4332;margin-top:0">As-salamu alaykum, {{visitor.fullName}}</h2>
      <p>Thank you for reaching out to the <strong>{{mosque.name}}</strong>. Our team has received your inquiry and will reply shortly.</p>
      <p><strong>Category:</strong> {{visitor.subject}}</p>
      <hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" />
      <p style="font-size:12px;color:#52796f">{{mosque.name}} • {{mosque.address}} • {{mosque.phone}}</p>`,
      'ltr'
    ),
    design: buildUnlayerDesign(
      `<h2 style="color:#1b4332;margin-top:0">As-salamu alaykum, {{visitor.fullName}}</h2><p>Thank you for reaching out to the <strong>{{mosque.name}}</strong>. Our team has received your inquiry and will reply shortly.</p><p><strong>Category:</strong> {{visitor.subject}}</p><hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" /><p style="font-size:12px;color:#52796f">{{mosque.name}} • {{mosque.address}} • {{mosque.phone}}</p>`,
      'ltr'
    ),
  },
  {
    templateReferenceId: EMAIL_TEMPLATE_IDS.contactConfirmation.ar,
    name: '[AR] تأكيد استلام الرسالة — مسجد أبو بكر الصديق المركزي',
    subject: 'تم استلام رسالتكم — {{mosque.name}}',
    tags: ['contact', 'ar', 'visitor'],
    bodyText:
      'السلام عليكم ورحمة الله وبركاته {{visitor.fullName}}،\n\nشكراً لتواصلكم مع مسجد أبو بكر الصديق المركزي في بوغوتا. لقد استلم فريقنا استفساركم ({{visitor.subject}}) وسنقوم بالرد عليكم في أقرب وقت ممكن.\n\n{{mosque.name}} • {{mosque.address}}',
    bodyHtml: wrapHtmlCard(
      `<h2 style="color:#1b4332;margin-top:0">السلام عليكم ورحمة الله وبركاته، {{visitor.fullName}}</h2>
      <p>شكراً لتواصلكم مع <strong>{{mosque.name}}</strong>. لقد استلم فريقنا استفساركم وسنقوم بالرد عليكم في أقرب وقت ممكن.</p>
      <p><strong>الموضوع:</strong> {{visitor.subject}}</p>
      <hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" />
      <p style="font-size:12px;color:#52796f">{{mosque.name}} • {{mosque.address}} • {{mosque.phone}}</p>`,
      'rtl'
    ),
    design: buildUnlayerDesign(
      `<h2 style="color:#1b4332;margin-top:0">السلام عليكم ورحمة الله وبركاته، {{visitor.fullName}}</h2><p>شكراً لتواصلكم مع <strong>{{mosque.name}}</strong>. لقد استلم فريقنا استفساركم وسنقوم بالرد عليكم في أقرب وقت ممكن.</p><p><strong>الموضوع:</strong> {{visitor.subject}}</p><hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" /><p style="font-size:12px;color:#52796f">{{mosque.name}} • {{mosque.address}} • {{mosque.phone}}</p>`,
      'rtl'
    ),
  },
  {
    templateReferenceId: EMAIL_TEMPLATE_IDS.contactConfirmation.tr,
    name: '[TR] İletişim Mesajı Onayı — Merkez Camii',
    subject: 'Mesajınız alındı — {{mosque.name}}',
    tags: ['contact', 'tr', 'visitor'],
    bodyText:
      'Es-selâmü aleyküm {{visitor.fullName}},\n\nBogota Ebû Bekir Es-Sıddîk Merkez Camii ile iletişime geçtiğiniz için teşekkür ederiz. Ekibimiz mesajınızı ({{visitor.subject}}) almıştır ve en kısa sürede dönüş yapacaktır.\n\n{{mosque.name}} • {{mosque.address}}',
    bodyHtml: wrapHtmlCard(
      `<h2 style="color:#1b4332;margin-top:0">Es-selâmü aleyküm, {{visitor.fullName}}</h2>
      <p><strong>{{mosque.name}}</strong> ile iletişime geçtiğiniz için teşekkür ederiz. Ekibimiz mesajınızı almıştır ve en kısa sürede dönüş yapacaktır.</p>
      <p><strong>Konu:</strong> {{visitor.subject}}</p>
      <hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" />
      <p style="font-size:12px;color:#52796f">{{mosque.name}} • {{mosque.address}} • {{mosque.phone}}</p>`,
      'ltr'
    ),
    design: buildUnlayerDesign(
      `<h2 style="color:#1b4332;margin-top:0">Es-selâmü aleyküm, {{visitor.fullName}}</h2><p><strong>{{mosque.name}}</strong> ile iletişime geçtiğiniz için teşekkür ederiz. Ekibimiz mesajınızı almıştır ve en kısa sürede dönüş yapacaktır.</p><p><strong>Konu:</strong> {{visitor.subject}}</p><hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" /><p style="font-size:12px;color:#52796f">{{mosque.name}} • {{mosque.address}} • {{mosque.phone}}</p>`,
      'ltr'
    ),
  },

  // ============================================================================
  // 201–204: Guided Visit Booking Confirmations (es, en, ar, tr)
  // ============================================================================
  {
    templateReferenceId: EMAIL_TEMPLATE_IDS.visitConfirmation.es,
    name: '[ES] Confirmación de Visita Guiada — Mezquita Central',
    subject: 'Solicitud de visita guiada recibida — {{mosque.name}}',
    tags: ['visit-booking', 'es', 'visitor'],
    bodyText:
      'As-salamu alaykum {{booking.visitorName}},\n\nHemos registrado tu solicitud de visita guiada para el {{booking.preferredDate}} ({{booking.preferredTimeSlot}}, {{booking.groupSize}} personas). Nuestro coordinador educativo confirmará tu reserva por correo o teléfono.\n\n{{mosque.name}} • {{mosque.address}}',
    bodyHtml: wrapHtmlCard(
      `<h2 style="color:#1b4332;margin-top:0">As-salamu alaykum, {{booking.visitorName}}</h2>
      <p>Hemos registrado tu solicitud de visita guiada en la <strong>{{mosque.name}}</strong>. Nuestro coordinador educativo revisará la disponibilidad en la fecha solicitada y confirmará tu reserva.</p>
      <p><strong>Fecha y horario:</strong> {{booking.preferredDate}} ({{booking.preferredTimeSlot}})<br />
      <strong>Tamaño del grupo:</strong> {{booking.groupSize}} personas<br />
      <strong>Idioma del guía:</strong> {{booking.preferredGuideLanguage}}</p>
      <hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" />
      <p style="font-size:12px;color:#52796f">{{mosque.name}} • {{mosque.address}} • {{mosque.phone}}</p>`,
      'ltr'
    ),
    design: buildUnlayerDesign(
      `<h2 style="color:#1b4332;margin-top:0">As-salamu alaykum, {{booking.visitorName}}</h2><p>Hemos registrado tu solicitud de visita guiada en la <strong>{{mosque.name}}</strong>. Nuestro coordinador educativo revisará la disponibilidad en la fecha solicitada y confirmará tu reserva.</p><p><strong>Fecha y horario:</strong> {{booking.preferredDate}} ({{booking.preferredTimeSlot}})<br /><strong>Tamaño del grupo:</strong> {{booking.groupSize}} personas<br /><strong>Idioma del guía:</strong> {{booking.preferredGuideLanguage}}</p><hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" /><p style="font-size:12px;color:#52796f">{{mosque.name}} • {{mosque.address}} • {{mosque.phone}}</p>`,
      'ltr'
    ),
  },
  {
    templateReferenceId: EMAIL_TEMPLATE_IDS.visitConfirmation.en,
    name: '[EN] Guided Visit Booking Confirmation — Central Mosque',
    subject: 'Guided tour booking request received — {{mosque.name}}',
    tags: ['visit-booking', 'en', 'visitor'],
    bodyText:
      'As-salamu alaykum {{booking.visitorName}},\n\nWe have received your guided visit request for {{booking.preferredDate}} ({{booking.preferredTimeSlot}}, {{booking.groupSize}} guests). Our educational coordinator will verify availability and confirm your booking.\n\n{{mosque.name}} • {{mosque.address}}',
    bodyHtml: wrapHtmlCard(
      `<h2 style="color:#1b4332;margin-top:0">As-salamu alaykum, {{booking.visitorName}}</h2>
      <p>We have received your guided visit request at the <strong>{{mosque.name}}</strong>. Our educational coordinator will verify availability for your preferred date and confirm your booking.</p>
      <p><strong>Date & Slot:</strong> {{booking.preferredDate}} ({{booking.preferredTimeSlot}})<br />
      <strong>Group Size:</strong> {{booking.groupSize}}<br />
      <strong>Guide Language:</strong> {{booking.preferredGuideLanguage}}</p>
      <hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" />
      <p style="font-size:12px;color:#52796f">{{mosque.name}} • {{mosque.address}} • {{mosque.phone}}</p>`,
      'ltr'
    ),
    design: buildUnlayerDesign(
      `<h2 style="color:#1b4332;margin-top:0">As-salamu alaykum, {{booking.visitorName}}</h2><p>We have received your guided visit request at the <strong>{{mosque.name}}</strong>. Our educational coordinator will verify availability for your preferred date and confirm your booking.</p><p><strong>Date & Slot:</strong> {{booking.preferredDate}} ({{booking.preferredTimeSlot}})<br /><strong>Group Size:</strong> {{booking.groupSize}}<br /><strong>Guide Language:</strong> {{booking.preferredGuideLanguage}}</p><hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" /><p style="font-size:12px;color:#52796f">{{mosque.name}} • {{mosque.address}} • {{mosque.phone}}</p>`,
      'ltr'
    ),
  },
  {
    templateReferenceId: EMAIL_TEMPLATE_IDS.visitConfirmation.ar,
    name: '[AR] تأكيد طلب الزيارة التعريفية — مسجد أبو بكر الصديق المركزي',
    subject: 'تم استلام طلب الزيارة التعريفية — {{mosque.name}}',
    tags: ['visit-booking', 'ar', 'visitor'],
    bodyText:
      'السلام عليكم ورحمة الله وبركاته {{booking.visitorName}}،\n\nلقد تم تسجيل طلبكم للزيارة التعريفية بتاريخ {{booking.preferredDate}} ({{booking.preferredTimeSlot}}، عدد الزوار: {{booking.groupSize}}). سيقوم منسق البرامج التعليمية بمراجعة الموعد وتأكيد الحجز.\n\n{{mosque.name}} • {{mosque.address}}',
    bodyHtml: wrapHtmlCard(
      `<h2 style="color:#1b4332;margin-top:0">السلام عليكم ورحمة الله وبركاته، {{booking.visitorName}}</h2>
      <p>لقد تم تسجيل طلبكم للزيارة التعريفية في <strong>{{mosque.name}}</strong>. سيقوم منسق البرامج التعليمية بمراجعة الموعد المطلوب وتأكيد الحجز عبر البريد الإلكتروني أو الهاتف.</p>
      <p><strong>التاريخ والموعد:</strong> {{booking.preferredDate}} ({{booking.preferredTimeSlot}})<br />
      <strong>عدد الزوار:</strong> {{booking.groupSize}}<br />
      <strong>لغة الإرشاد:</strong> {{booking.preferredGuideLanguage}}</p>
      <hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" />
      <p style="font-size:12px;color:#52796f">{{mosque.name}} • {{mosque.address}} • {{mosque.phone}}</p>`,
      'rtl'
    ),
    design: buildUnlayerDesign(
      `<h2 style="color:#1b4332;margin-top:0">السلام عليكم ورحمة الله وبركاته، {{booking.visitorName}}</h2><p>لقد تم تسجيل طلبكم للزيارة التعريفية في <strong>{{mosque.name}}</strong>. سيقوم منسق البرامج التعليمية بمراجعة الموعد المطلوب وتأكيد الحجز عبر البريد الإلكتروني أو الهاتف.</p><p><strong>التاريخ والموعد:</strong> {{booking.preferredDate}} ({{booking.preferredTimeSlot}})<br /><strong>عدد الزوار:</strong> {{booking.groupSize}}<br /><strong>لغة الإرشاد:</strong> {{booking.preferredGuideLanguage}}</p><hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" /><p style="font-size:12px;color:#52796f">{{mosque.name}} • {{mosque.address}} • {{mosque.phone}}</p>`,
      'rtl'
    ),
  },
  {
    templateReferenceId: EMAIL_TEMPLATE_IDS.visitConfirmation.tr,
    name: '[TR] Rehberli Cami Ziyareti Onayı — Merkez Camii',
    subject: 'Rehberli ziyaret talebiniz alındı — {{mosque.name}}',
    tags: ['visit-booking', 'tr', 'visitor'],
    bodyText:
      'Es-selâmü aleyküm {{booking.visitorName}},\n\n{{booking.preferredDate}} ({{booking.preferredTimeSlot}}, {{booking.groupSize}} kişi) tarihli rehberli cami ziyareti talebiniz kaydedilmiştir. Eğitim koordinatörümüz uygunluğu kontrol ederek rezervasyonunuzu onaylayacaktır.\n\n{{mosque.name}} • {{mosque.address}}',
    bodyHtml: wrapHtmlCard(
      `<h2 style="color:#1b4332;margin-top:0">Es-selâmü aleyküm, {{booking.visitorName}}</h2>
      <p><strong>{{mosque.name}}</strong> rehberli ziyaret talebiniz kaydedilmiştir. Eğitim koordinatörümüz talep ettiğiniz tarihteki uygunluğu kontrol ederek rezervasyonunuzu onaylayacaktır.</p>
      <p><strong>Tarih ve Saat:</strong> {{booking.preferredDate}} ({{booking.preferredTimeSlot}})<br />
      <strong>Grup Sayısı:</strong> {{booking.groupSize}}<br />
      <strong>Rehber Dili:</strong> {{booking.preferredGuideLanguage}}</p>
      <hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" />
      <p style="font-size:12px;color:#52796f">{{mosque.name}} • {{mosque.address}} • {{mosque.phone}}</p>`,
      'ltr'
    ),
    design: buildUnlayerDesign(
      `<h2 style="color:#1b4332;margin-top:0">Es-selâmü aleyküm, {{booking.visitorName}}</h2><p><strong>{{mosque.name}}</strong> rehberli ziyaret talebiniz kaydedilmiştir. Eğitim koordinatörümüz talep ettiğiniz tarihteki uygunluğu kontrol ederek rezervasyonunuzu onaylayacaktır.</p><p><strong>Tarih ve Saat:</strong> {{booking.preferredDate}} ({{booking.preferredTimeSlot}})<br /><strong>Grup Sayısı:</strong> {{booking.groupSize}}<br /><strong>Rehber Dili:</strong> {{booking.preferredGuideLanguage}}</p><hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" /><p style="font-size:12px;color:#52796f">{{mosque.name}} • {{mosque.address}} • {{mosque.phone}}</p>`,
      'ltr'
    ),
  },

  // ============================================================================
  // 301–304: Donation Notification & DIAN Tax Certificate Confirmations
  // ============================================================================
  {
    templateReferenceId: EMAIL_TEMPLATE_IDS.donationConfirmation.es,
    name: '[ES] Recibo de Aporte / Certificado DIAN — Mezquita Central',
    subject: 'Registro de aporte recibido — {{mosque.name}}',
    tags: ['donation', 'es', 'donor'],
    bodyText:
      'As-salamu alaykum {{donation.donorName}},\n\nQue Allah acepte tu generosidad (JazakAllahu Khayran). Hemos recibido el registro de tu aporte por {{donation.amount}} {{donation.currency}} ({{donation.donationType}}). Si solicitaste certificado tributario de donación (DIAN), nuestro equipo contable lo enviará una vez verificada la transferencia.\n\n{{mosque.name}} • {{mosque.address}}',
    bodyHtml: wrapHtmlCard(
      `<h2 style="color:#1b4332;margin-top:0">As-salamu alaykum, {{donation.donorName}}</h2>
      <p>Que Allah acepte tu generosidad (<em>JazakAllahu Khayran</em>). Hemos recibido el registro de tu aporte. Si solicitaste certificado tributario de donación (DIAN), nuestro equipo contable lo enviará una vez verificada la transferencia.</p>
      <p><strong>Monto reportado:</strong> {{donation.amount}} {{donation.currency}}<br />
      <strong>Categoría:</strong> {{donation.donationType}}<br />
      <strong>Referencia:</strong> {{donation.transactionReference}}</p>
      <hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" />
      <p style="font-size:12px;color:#52796f">{{mosque.name}} • {{mosque.address}} • {{mosque.phone}}</p>`,
      'ltr'
    ),
    design: buildUnlayerDesign(
      `<h2 style="color:#1b4332;margin-top:0">As-salamu alaykum, {{donation.donorName}}</h2><p>Que Allah acepte tu generosidad (<em>JazakAllahu Khayran</em>). Hemos recibido el registro de tu aporte. Si solicitaste certificado tributario de donación (DIAN), nuestro equipo contable lo enviará una vez verificada la transferencia.</p><p><strong>Monto reportado:</strong> {{donation.amount}} {{donation.currency}}<br /><strong>Categoría:</strong> {{donation.donationType}}<br /><strong>Referencia:</strong> {{donation.transactionReference}}</p><hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" /><p style="font-size:12px;color:#52796f">{{mosque.name}} • {{mosque.address}} • {{mosque.phone}}</p>`,
      'ltr'
    ),
  },
  {
    templateReferenceId: EMAIL_TEMPLATE_IDS.donationConfirmation.en,
    name: '[EN] Donation Notification / DIAN Tax Certificate — Central Mosque',
    subject: 'Donation notification received — {{mosque.name}}',
    tags: ['donation', 'en', 'donor'],
    bodyText:
      'As-salamu alaykum {{donation.donorName}},\n\nMay Allah accept your generosity (JazakAllahu Khayran). We have received your donation report of {{donation.amount}} {{donation.currency}} ({{donation.donationType}}). If you requested a Colombian tax certificate (DIAN), our accounting team will issue it once the transfer is verified.\n\n{{mosque.name}} • {{mosque.address}}',
    bodyHtml: wrapHtmlCard(
      `<h2 style="color:#1b4332;margin-top:0">As-salamu alaykum, {{donation.donorName}}</h2>
      <p>May Allah accept your generosity (<em>JazakAllahu Khayran</em>). We have received your donation report. If you requested a Colombian tax certificate (DIAN), our accounting team will issue it once the transfer is verified.</p>
      <p><strong>Reported Amount:</strong> {{donation.amount}} {{donation.currency}}<br />
      <strong>Category:</strong> {{donation.donationType}}<br />
      <strong>Reference:</strong> {{donation.transactionReference}}</p>
      <hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" />
      <p style="font-size:12px;color:#52796f">{{mosque.name}} • {{mosque.address}} • {{mosque.phone}}</p>`,
      'ltr'
    ),
    design: buildUnlayerDesign(
      `<h2 style="color:#1b4332;margin-top:0">As-salamu alaykum, {{donation.donorName}}</h2><p>May Allah accept your generosity (<em>JazakAllahu Khayran</em>). We have received your donation report. If you requested a Colombian tax certificate (DIAN), our accounting team will issue it once the transfer is verified.</p><p><strong>Reported Amount:</strong> {{donation.amount}} {{donation.currency}}<br /><strong>Category:</strong> {{donation.donationType}}<br /><strong>Reference:</strong> {{donation.transactionReference}}</p><hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" /><p style="font-size:12px;color:#52796f">{{mosque.name}} • {{mosque.address}} • {{mosque.phone}}</p>`,
      'ltr'
    ),
  },
  {
    templateReferenceId: EMAIL_TEMPLATE_IDS.donationConfirmation.ar,
    name: '[AR] إشعار استلام التبرع — مسجد أبو بكر الصديق المركزي',
    subject: 'تأكيد استلام إشعار التبرع — {{mosque.name}}',
    tags: ['donation', 'ar', 'donor'],
    bodyText:
      'السلام عليكم ورحمة الله وبركاته {{donation.donorName}}،\n\nجزاكم الله خيراً وتقبل الله منكم صالح الأعمال. لقد استلمنا إشعار مساهمتكم بقيمة {{donation.amount}} {{donation.currency}} ({{donation.donationType}}). في حال طلبكم شهادة التبرع الضريبية، سيقوم القسم المالي بإصدارها فور التحقق من التحويل.\n\n{{mosque.name}} • {{mosque.address}}',
    bodyHtml: wrapHtmlCard(
      `<h2 style="color:#1b4332;margin-top:0">السلام عليكم ورحمة الله وبركاته، {{donation.donorName}}</h2>
      <p>جزاكم الله خيراً وتقبل الله منكم صالح الأعمال. لقد استلمنا إشعار مساهمتكم، وفي حال طلبكم شهادة التبرع الضريبية، سيقوم القسم المالي بإصدارها فور التحقق من التحويل.</p>
      <p><strong>المبلغ:</strong> {{donation.amount}} {{donation.currency}}<br />
      <strong>الفئة:</strong> {{donation.donationType}}<br />
      <strong>رقم المرجع:</strong> {{donation.transactionReference}}</p>
      <hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" />
      <p style="font-size:12px;color:#52796f">{{mosque.name}} • {{mosque.address}} • {{mosque.phone}}</p>`,
      'rtl'
    ),
    design: buildUnlayerDesign(
      `<h2 style="color:#1b4332;margin-top:0">السلام عليكم ورحمة الله وبركاته، {{donation.donorName}}</h2><p>جزاكم الله خيراً وتقبل الله منكم صالح الأعمال. لقد استلمنا إشعار مساهمتكم، وفي حال طلبكم شهادة التبرع الضريبية، سيقوم القسم المالي بإصدارها فور التحقق من التحويل.</p><p><strong>المبلغ:</strong> {{donation.amount}} {{donation.currency}}<br /><strong>الفئة:</strong> {{donation.donationType}}<br /><strong>رقم المرجع:</strong> {{donation.transactionReference}}</p><hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" /><p style="font-size:12px;color:#52796f">{{mosque.name}} • {{mosque.address}} • {{mosque.phone}}</p>`,
      'rtl'
    ),
  },
  {
    templateReferenceId: EMAIL_TEMPLATE_IDS.donationConfirmation.tr,
    name: '[TR] Bağış Bildirimi / Vergi Sertifikası — Merkez Camii',
    subject: 'Bağış bildiriminiz alındı — {{mosque.name}}',
    tags: ['donation', 'tr', 'donor'],
    bodyText:
      'Es-selâmü aleyküm {{donation.donorName}},\n\nAllah hayrınızı kabul etsin (Cezâkümullâhu hayran). {{donation.amount}} {{donation.currency}} ({{donation.donationType}}) tutarındaki bağış bildiriminiz tarafımıza ulaşmıştır. Vergi muafiyet sertifikası (DIAN) talep ettiyseniz, transfer onaylandıktan sonra muhasebe ekibimiz tarafından iletilecektir.\n\n{{mosque.name}} • {{mosque.address}}',
    bodyHtml: wrapHtmlCard(
      `<h2 style="color:#1b4332;margin-top:0">Es-selâmü aleyküm, {{donation.donorName}}</h2>
      <p>Allah hayrınızı kabul etsin (<em>Cezâkümullâhu hayran</em>). Bağış bildiriminiz tarafımıza ulaşmıştır. Vergi muafiyet sertifikası (DIAN) talep ettiyseniz, transfer onaylandıktan sonra muhasebe ekibimiz tarafından iletilecektir.</p>
      <p><strong>Bildirilen Tutar:</strong> {{donation.amount}} {{donation.currency}}<br />
      <strong>Kategori:</strong> {{donation.donationType}}<br />
      <strong>Referans No:</strong> {{donation.transactionReference}}</p>
      <hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" />
      <p style="font-size:12px;color:#52796f">{{mosque.name}} • {{mosque.address}} • {{mosque.phone}}</p>`,
      'ltr'
    ),
    design: buildUnlayerDesign(
      `<h2 style="color:#1b4332;margin-top:0">Es-selâmü aleyküm, {{donation.donorName}}</h2><p>Allah hayrınızı kabul etsin (<em>Cezâkümullâhu hayran</em>). Bağış bildiriminiz tarafımıza ulaşmıştır. Vergi muafiyet sertifikası (DIAN) talep ettiyseniz, transfer onaylandıktan sonra muhasebe ekibimiz tarafından iletilecektir.</p><p><strong>Bildirilen Tutar:</strong> {{donation.amount}} {{donation.currency}}<br /><strong>Kategori:</strong> {{donation.donationType}}<br /><strong>Referans No:</strong> {{donation.transactionReference}}</p><hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" /><p style="font-size:12px;color:#52796f">{{mosque.name}} • {{mosque.address}} • {{mosque.phone}}</p>`,
      'ltr'
    ),
  },

  // ============================================================================
  // 901–903: Internal Mosque Admin Staff Alerts
  // ============================================================================
  {
    templateReferenceId: EMAIL_TEMPLATE_IDS.adminAlerts.contact,
    name: '[ADMIN] New Contact Inquiry Notification',
    subject: '[Mosque Contact] {{visitor.subject}} — {{visitor.fullName}}',
    tags: ['admin', 'contact'],
    bodyText:
      'New Contact Inquiry\nName: {{visitor.fullName}}\nEmail: {{visitor.email}}\nPhone: {{visitor.phone}}\nCategory: {{visitor.subject}}\n\nMessage:\n{{visitor.message}}',
    bodyHtml: wrapHtmlCard(
      `<h2 style="color:#1b4332;margin-top:0">New Contact Inquiry</h2>
      <p><strong>Name:</strong> {{visitor.fullName}}<br />
      <strong>Email:</strong> {{visitor.email}}<br />
      <strong>Phone:</strong> {{visitor.phone}}<br />
      <strong>Category:</strong> {{visitor.subject}}</p>
      <hr style="border:none;border-top:1px solid #d8e2dc;margin:16px 0" />
      <p style="white-space:pre-wrap">{{visitor.message}}</p>`,
      'ltr'
    ),
    design: buildUnlayerDesign(
      `<h2 style="color:#1b4332;margin-top:0">New Contact Inquiry</h2><p><strong>Name:</strong> {{visitor.fullName}}<br /><strong>Email:</strong> {{visitor.email}}<br /><strong>Phone:</strong> {{visitor.phone}}<br /><strong>Category:</strong> {{visitor.subject}}</p><hr style="border:none;border-top:1px solid #d8e2dc;margin:16px 0" /><p style="white-space:pre-wrap">{{visitor.message}}</p>`,
      'ltr'
    ),
  },
  {
    templateReferenceId: EMAIL_TEMPLATE_IDS.adminAlerts.visit,
    name: '[ADMIN] New Guided Visit Reservation Alert',
    subject:
      '[Guided Visit] {{booking.preferredDate}} ({{booking.groupSize}} guests) — {{booking.visitorName}}',
    tags: ['admin', 'visit-booking'],
    bodyText:
      'New Guided Visit Booking\nVisitor: {{booking.visitorName}}\nOrganization: {{booking.organizationOrSchool}}\nDate: {{booking.preferredDate}} ({{booking.preferredTimeSlot}})\nGroup Size: {{booking.groupSize}}\nGuide Language: {{booking.preferredGuideLanguage}}\nEmail: {{visitor.email}}\nPhone: {{visitor.phone}}\nNotes: {{booking.notes}}',
    bodyHtml: wrapHtmlCard(
      `<h2 style="color:#1b4332;margin-top:0">New Guided Visit Reservation</h2>
      <p><strong>Visitor:</strong> {{booking.visitorName}}<br />
      <strong>Organization / School:</strong> {{booking.organizationOrSchool}}<br />
      <strong>Preferred Date & Slot:</strong> {{booking.preferredDate}} ({{booking.preferredTimeSlot}})<br />
      <strong>Group Size:</strong> {{booking.groupSize}}<br />
      <strong>Guide Language:</strong> {{booking.preferredGuideLanguage}}<br />
      <strong>Email:</strong> {{visitor.email}}<br />
      <strong>Phone:</strong> {{visitor.phone}}<br />
      <strong>Notes:</strong> {{booking.notes}}</p>`,
      'ltr'
    ),
    design: buildUnlayerDesign(
      `<h2 style="color:#1b4332;margin-top:0">New Guided Visit Reservation</h2><p><strong>Visitor:</strong> {{booking.visitorName}}<br /><strong>Organization / School:</strong> {{booking.organizationOrSchool}}<br /><strong>Preferred Date & Slot:</strong> {{booking.preferredDate}} ({{booking.preferredTimeSlot}})<br /><strong>Group Size:</strong> {{booking.groupSize}}<br /><strong>Guide Language:</strong> {{booking.preferredGuideLanguage}}<br /><strong>Email:</strong> {{visitor.email}}<br /><strong>Phone:</strong> {{visitor.phone}}<br /><strong>Notes:</strong> {{booking.notes}}</p>`,
      'ltr'
    ),
  },
  {
    templateReferenceId: EMAIL_TEMPLATE_IDS.adminAlerts.donation,
    name: '[ADMIN] New Donation & DIAN Tax Certificate Alert',
    subject:
      '[Donation Report] {{donation.amount}} {{donation.currency}} ({{donation.donationType}}) — {{donation.donorName}}',
    tags: ['admin', 'donation'],
    bodyText:
      'New Donation Submission\nDonor: {{donation.donorName}}\nAmount: {{donation.amount}} {{donation.currency}}\nCategory: {{donation.donationType}}\nMethod: {{donation.paymentMethodUsed}}\nReference: {{donation.transactionReference}}\nDIAN Tax Certificate Requested: {{donation.requestsTaxCertificate}}',
    bodyHtml: wrapHtmlCard(
      `<h2 style="color:#1b4332;margin-top:0">New Donation Notification</h2>
      <p><strong>Donor:</strong> {{donation.donorName}}<br />
      <strong>Amount:</strong> {{donation.amount}} {{donation.currency}}<br />
      <strong>Category:</strong> {{donation.donationType}}<br />
      <strong>Payment Method:</strong> {{donation.paymentMethodUsed}}<br />
      <strong>Transaction Ref:</strong> {{donation.transactionReference}}<br />
      <strong>DIAN Tax Certificate Requested:</strong> {{donation.requestsTaxCertificate}}</p>`,
      'ltr'
    ),
    design: buildUnlayerDesign(
      `<h2 style="color:#1b4332;margin-top:0">New Donation Notification</h2><p><strong>Donor:</strong> {{donation.donorName}}<br /><strong>Amount:</strong> {{donation.amount}} {{donation.currency}}<br /><strong>Category:</strong> {{donation.donationType}}<br /><strong>Payment Method:</strong> {{donation.paymentMethodUsed}}<br /><strong>Transaction Ref:</strong> {{donation.transactionReference}}<br /><strong>DIAN Tax Certificate Requested:</strong> {{donation.requestsTaxCertificate}}</p>`,
      'ltr'
    ),
  },
];

/**
 * Seeds the 15 multilingual (`es`, `en`, `ar`, `tr`) and staff admin email templates
 * into `plugin::email-designer-5.email-designer-template` on first boot without
 * overwriting any template that an administrator has already customized in Unlayer.
 */
export async function seedEmailDesignerTemplates(strapi: Core.Strapi): Promise<void> {
  try {
    const hasContentType = Boolean(strapi.contentTypes?.[EMAIL_DESIGNER_TEMPLATE_UID]);
    if (!hasContentType) {
      return;
    }

    const query = strapi.db.query(EMAIL_DESIGNER_TEMPLATE_UID);
    for (const tpl of INITIAL_EMAIL_TEMPLATES) {
      const existing = await query.findOne({
        where: { templateReferenceId: tpl.templateReferenceId },
      });

      if (!existing) {
        await query.create({
          data: {
            templateReferenceId: tpl.templateReferenceId,
            name: tpl.name,
            subject: tpl.subject,
            bodyHtml: tpl.bodyHtml,
            bodyText: tpl.bodyText,
            tags: tpl.tags,
            design: tpl.design,
          },
        });
      }
    }
  } catch {
    strapi.log.warn('Could not auto-seed email-designer-5 templates during bootstrap');
  }
}
