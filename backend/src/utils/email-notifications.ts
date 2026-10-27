import type { Core } from '@strapi/strapi';
import {
  EMAIL_TEMPLATE_IDS,
  resolveTemplateLocale,
  type SupportedEmailLocale,
} from '../seed/email-templates-seed';

/**
 * Strictly escapes untrusted user input before interpolating into HTML email templates.
 */
export function escapeHtml(value: unknown): string {
  const str = String(value ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Prevents SMTP header injection by stripping CR/LF control characters from subjects/addresses.
 */
export function sanitizeHeaderLine(value: unknown, maxLen = 140): string {
  return String(value ?? '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

const MOSQUE_INFO_BY_LOCALE: Record<
  SupportedEmailLocale,
  { name: string; address: string; phone: string; email: string }
> = {
  es: {
    name: 'Mezquita Central Abu Bakr As-Siddiq',
    address: 'Calle 80 # 30-15, Bogotá D.C., Colombia',
    phone: '+57 (601) 250-8000',
    email: 'info@mezquitabogota.org',
  },
  en: {
    name: 'Abu Bakr As-Siddiq Central Mosque',
    address: 'Calle 80 # 30-15, Bogotá D.C., Colombia',
    phone: '+57 (601) 250-8000',
    email: 'info@mezquitabogota.org',
  },
  ar: {
    name: 'مسجد أبو بكر الصديق المركزي ببوغوتا',
    address: 'Calle 80 # 30-15، بوغوتا، كولومبيا',
    phone: '+57 (601) 250-8000',
    email: 'info@mezquitabogota.org',
  },
  tr: {
    name: 'Bogota Ebû Bekir Es-Sıddîk Merkez Camii',
    address: 'Calle 80 # 30-15, Bogota, Kolombiya',
    phone: '+57 (601) 250-8000',
    email: 'info@mezquitabogota.org',
  },
};

const CONFIRMATION_COPY: Record<
  SupportedEmailLocale,
  {
    contactSubject: string;
    contactHeading: string;
    contactBody: string;
    visitSubject: string;
    visitHeading: string;
    visitBody: string;
    donationSubject: string;
    donationHeading: string;
    donationBody: string;
    footer: string;
  }
> = {
  es: {
    contactSubject:
      'Hemos recibido tu mensaje — Mezquita Central Abu Bakr As-Siddiq',
    contactHeading: 'As-salamu alaykum,',
    contactBody:
      'Gracias por comunicarte con la Mezquita Central Abu Bakr As-Siddiq de Bogotá. Nuestro equipo ha recibido tu consulta y te responderá a la brevedad.',
    visitSubject:
      'Solicitud de visita guiada recibida — Mezquita Central de Bogotá',
    visitHeading: 'As-salamu alaykum,',
    visitBody:
      'Hemos registrado tu solicitud de visita guiada. Nuestro coordinador educativo revisará la disponibilidad en la fecha solicitada y confirmará tu reserva por correo o teléfono.',
    donationSubject:
      'Registro de aporte / solicitud de certificado — Mezquita Central de Bogotá',
    donationHeading: 'As-salamu alaykum,',
    donationBody:
      'Que Allah acepte tu generosidad (JazakAllahu Khayran). Hemos recibido el registro de tu aporte. Si solicitaste certificado tributario de donación (DIAN), nuestro equipo contable lo enviará una vez verificada la transferencia.',
    footer:
      'Mezquita Central Abu Bakr As-Siddiq • Calle 80 # 30-15, Bogotá D.C., Colombia',
  },
  en: {
    contactSubject:
      'We received your message — Abu Bakr As-Siddiq Central Mosque',
    contactHeading: 'As-salamu alaykum,',
    contactBody:
      'Thank you for reaching out to the Abu Bakr As-Siddiq Central Mosque of Bogotá. Our team has received your inquiry and will reply shortly.',
    visitSubject:
      'Guided tour booking request received — Central Mosque of Bogotá',
    visitHeading: 'As-salamu alaykum,',
    visitBody:
      'We have received your guided visit request. Our educational coordinator will verify availability for your preferred date and confirm your booking.',
    donationSubject:
      'Donation notification / tax certificate request — Central Mosque of Bogotá',
    donationHeading: 'As-salamu alaykum,',
    donationBody:
      'May Allah accept your generosity (JazakAllahu Khayran). We have received your donation report. If you requested a Colombian tax certificate (DIAN), our accounting team will issue it once the transfer is verified.',
    footer:
      'Abu Bakr As-Siddiq Central Mosque • Calle 80 # 30-15, Bogotá D.C., Colombia',
  },
  ar: {
    contactSubject: 'تم استلام رسالتكم — مسجد أبو بكر الصديق المركزي ببوغوتا',
    contactHeading: 'السلام عليكم ورحمة الله وبركاته،',
    contactBody:
      'شكراً لتواصلكم مع مسجد أبو بكر الصديق المركزي في بوغوتا. لقد استلم فريقنا استفساركم وسنقوم بالرد عليكم في أقرب وقت ممكن.',
    visitSubject:
      'تم استلام طلب الزيارة التعريفية — مسجد أبو بكر الصديق المركزي',
    visitHeading: 'السلام عليكم ورحمة الله وبركاته،',
    visitBody:
      'لقد تم تسجيل طلبكم للزيارة التعريفية. سيقوم منسق البرامج التعليمية بمراجعة الموعد المطلوب وتأكيد الحجز عبر البريد الإلكتروني أو الهاتف.',
    donationSubject: 'تأكيد استلام إشعار التبرع — مسجد أبو بكر الصديق المركزي',
    donationHeading: 'السلام عليكم ورحمة الله وبركاته،',
    donationBody:
      'جزاكم الله خيراً وتقبل الله منكم صالح الأعمال. لقد استلمنا إشعار مساهمتكم، وفي حال طلبكم شهادة التبرع الضريبية، سيقوم القسم المالي بإصدارها فور التحقق من التحويل.',
    footer: 'مسجد أبو بكر الصديق المركزي • بوغوتا، كولومبيا',
  },
  tr: {
    contactSubject:
      'Mesajınız alındı — Bogota Ebû Bekir Es-Sıddîk Merkez Camii',
    contactHeading: 'Es-selâmü aleyküm,',
    contactBody:
      'Bogota Ebû Bekir Es-Sıddîk Merkez Camii ile iletişime geçtiğiniz için teşekkür ederiz. Ekibimiz mesajınızı almıştır ve en kısa sürede dönüş yapacaktır.',
    visitSubject:
      'Rehberli ziyaret talebiniz alındı — Bogota Merkez Camii',
    visitHeading: 'Es-selâmü aleyküm,',
    visitBody:
      'Rehberli cami ziyareti talebiniz kaydedilmiştir. Eğitim koordinatörümüz talep ettiğiniz tarihteki uygunluğu kontrol ederek rezervasyonunuzu onaylayacaktır.',
    donationSubject:
      'Bağış bildirimi / vergi sertifikası talebi — Bogota Merkez Camii',
    donationHeading: 'Es-selâmü aleyküm,',
    donationBody:
      'Allah hayrınızı kabul etsin (Cezâkümullâhu hayran). Bağış bildiriminiz tarafımıza ulaşmıştır. Vergi muafiyet sertifikası (DIAN) talep ettiyseniz, transfer onaylandıktan sonra muhasebe ekibimiz tarafından iletilecektir.',
    footer:
      'Ebû Bekir Es-Sıddîk Merkez Camii • Calle 80 # 30-15, Bogota, Kolombiya',
  },
};

function getCopyForLocale(locale: unknown) {
  const code = resolveTemplateLocale(locale);
  return {
    code,
    dir: code === 'ar' ? 'rtl' : 'ltr',
    copy: CONFIRMATION_COPY[code],
    mosque: MOSQUE_INFO_BY_LOCALE[code],
  };
}

async function safeSendEmail(
  strapi: Core.Strapi,
  options: { to: string; replyTo?: string; subject: string; text: string; html: string }
): Promise<void> {
  if (!process.env.SMTP_HOST) {
    strapi.log.info(
      'Skipping transactional email dispatch because SMTP_HOST is not configured'
    );
    return;
  }

  try {
    const emailService = strapi.plugin('email')?.service('email');
    if (!emailService) return;
    await emailService.send(options);
  } catch {
    // Log generic error without exposing credentials or PII
    strapi.log.warn('Failed to send transactional notification email');
  }
}

/**
 * Attempts to render and send via `strapi-plugin-email-designer-5` first using the
 * corresponding `templateReferenceId`, falling back automatically to `safeSendEmail`
 * if the visual template has not been created yet or the plugin service is unavailable.
 */
async function sendDesignerOrFallbackEmail(
  strapi: Core.Strapi,
  options: { to: string; replyTo?: string; subject: string; text: string; html: string },
  templateReferenceId: number,
  templateData: Record<string, unknown>
): Promise<void> {
  if (!process.env.SMTP_HOST) {
    strapi.log.info(
      'Skipping transactional email dispatch because SMTP_HOST is not configured'
    );
    return;
  }

  try {
    const designerEmailService = strapi
      .plugin('email-designer-5')
      ?.service('email') as
      | {
          sendTemplatedEmail?: (
            emailOptions: { to: string; replyTo?: string },
            emailTemplate: { templateReferenceId: number; subject?: string },
            data: Record<string, unknown>
          ) => Promise<unknown>;
        }
      | undefined;

    if (typeof designerEmailService?.sendTemplatedEmail === 'function') {
      const result = await designerEmailService.sendTemplatedEmail(
        {
          to: options.to,
          ...(options.replyTo ? { replyTo: options.replyTo } : {}),
        },
        { templateReferenceId },
        templateData
      );
      if (result !== null) {
        return;
      }
    }
  } catch {
    strapi.log.warn(
      `Falling back to built-in HTML template for templateReferenceId=${templateReferenceId}`
    );
  }

  await safeSendEmail(strapi, options);
}

export async function notifyContactSubmission(
  strapi: Core.Strapi,
  record: Record<string, unknown>
): Promise<void> {
  const adminTo = (
    process.env.EMAIL_ADMIN_NOTIFICATION_TO || 'info@mezquitabogota.org'
  ).trim();
  const dataBag =
    record.data && typeof record.data === 'object'
      ? (record.data as Record<string, unknown>)
      : {};
  const rawNameVal =
    record.fullName ?? record.applicantName ?? dataBag.fullName ?? 'Visitor';
  const rawEmailVal =
    record.email ?? record.applicantEmail ?? dataBag.email ?? '';
  const rawPhoneVal =
    record.phone ?? record.applicantPhone ?? dataBag.phone ?? '—';
  const rawSubjectVal =
    record.subject ?? dataBag.subject ?? record.category ?? 'general';
  const rawMessageVal =
    record.message ?? dataBag.message ?? dataBag.details ?? '';

  const rawFullName = sanitizeHeaderLine(rawNameVal, 120);
  const fullName = escapeHtml(rawNameVal);
  const email = sanitizeHeaderLine(rawEmailVal, 120);
  const rawPhone = sanitizeHeaderLine(rawPhoneVal, 60);
  const phone = escapeHtml(rawPhoneVal);
  const rawSubjectCategory = sanitizeHeaderLine(rawSubjectVal, 60);
  const subjectCategory = escapeHtml(rawSubjectVal);
  const rawMessage = String(rawMessageVal).slice(0, 4000);
  const message = escapeHtml(rawMessageVal);
  const { code, dir, copy, mosque } = getCopyForLocale(record.locale);

  const templateData = {
    mosque,
    visitor: {
      fullName: rawFullName,
      email,
      phone: rawPhone,
      subject: rawSubjectCategory,
      message: rawMessage,
    },
  };

  await sendDesignerOrFallbackEmail(
    strapi,
    {
      to: adminTo,
      replyTo: email || undefined,
      subject: sanitizeHeaderLine(
        `[Mosque Contact] ${rawSubjectCategory.toUpperCase()} — ${rawFullName}`
      ),
      text: `New Contact Inquiry\nName: ${rawFullName}\nEmail: ${email}\nPhone: ${rawPhone}\nSubject: ${rawSubjectCategory}\n\nMessage:\n${rawMessage}`,
      html: `<div style="font-family:sans-serif;max-width:600px;line-height:1.5;color:#14281d">
        <h2 style="color:#1b4332">New Contact Inquiry</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Category:</strong> ${subjectCategory}</p>
        <hr style="border:none;border-top:1px solid #d8e2dc" />
        <p style="white-space:pre-wrap">${message}</p>
      </div>`,
    },
    EMAIL_TEMPLATE_IDS.adminAlerts.contact,
    templateData
  );

  if (email && email.includes('@')) {
    await sendDesignerOrFallbackEmail(
      strapi,
      {
        to: email,
        subject: copy.contactSubject,
        text: `${copy.contactHeading}\n\n${copy.contactBody}\n\n${copy.footer}`,
        html: `<div dir="${dir}" style="font-family:sans-serif;max-width:600px;line-height:1.6;color:#14281d">
          <h2 style="color:#1b4332">${escapeHtml(copy.contactHeading)} ${fullName}</h2>
          <p>${escapeHtml(copy.contactBody)}</p>
          <hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" />
          <p style="font-size:12px;color:#52796f">${escapeHtml(copy.footer)}</p>
        </div>`,
      },
      EMAIL_TEMPLATE_IDS.contactConfirmation[code],
      templateData
    );
  }
}

export async function notifyVisitBooking(
  strapi: Core.Strapi,
  record: Record<string, unknown>
): Promise<void> {
  const adminTo = (
    process.env.EMAIL_ADMIN_NOTIFICATION_TO || 'info@mezquitabogota.org'
  ).trim();
  const visitorVal = record.visitorName ?? record.customerName ?? 'Visitor';
  const orgVal = record.organizationOrSchool ?? record.organization ?? '—';
  const emailVal = record.email ?? record.customerEmail ?? '';
  const phoneVal = record.phone ?? record.customerPhone ?? '—';
  const dateVal = record.preferredDate ?? record.startDate ?? '';
  const slotVal = record.preferredTimeSlot ?? record.slotLabel ?? '';
  const sizeVal = record.groupSize ?? record.partySize ?? 1;
  const langVal =
    record.preferredGuideLanguage ?? record.preferredLanguage ?? record.locale ?? 'es';
  const notesVal = record.notes ?? '—';

  const rawVisitorName = sanitizeHeaderLine(visitorVal, 120);
  const visitorName = escapeHtml(visitorVal);
  const rawOrganization = sanitizeHeaderLine(orgVal, 140);
  const organization = escapeHtml(orgVal);
  const email = sanitizeHeaderLine(emailVal, 120);
  const rawPhone = sanitizeHeaderLine(phoneVal, 60);
  const phone = escapeHtml(phoneVal);
  const rawPreferredDate = sanitizeHeaderLine(dateVal, 40);
  const preferredDate = escapeHtml(dateVal);
  const rawPreferredTimeSlot = sanitizeHeaderLine(slotVal, 60);
  const preferredTimeSlot = escapeHtml(slotVal);
  const rawGroupSize = sanitizeHeaderLine(sizeVal, 20);
  const groupSize = escapeHtml(sizeVal);
  const rawGuideLang = sanitizeHeaderLine(langVal, 20);
  const guideLang = escapeHtml(langVal);
  const rawNotes = String(notesVal).slice(0, 2000);
  const notes = escapeHtml(notesVal);
  const { code, dir, copy, mosque } = getCopyForLocale(
    record.locale ?? record.preferredLanguage
  );

  const templateData = {
    mosque,
    visitor: {
      fullName: rawVisitorName,
      email,
      phone: rawPhone,
    },
    booking: {
      visitorName: rawVisitorName,
      organizationOrSchool: rawOrganization,
      preferredDate: rawPreferredDate,
      preferredTimeSlot: rawPreferredTimeSlot,
      groupSize: rawGroupSize,
      preferredGuideLanguage: rawGuideLang,
      notes: rawNotes,
    },
  };

  await sendDesignerOrFallbackEmail(
    strapi,
    {
      to: adminTo,
      replyTo: email || undefined,
      subject: sanitizeHeaderLine(
        `[Guided Visit] ${rawPreferredDate} (${rawGroupSize} guests) — ${rawVisitorName}`
      ),
      text: `New Guided Visit Booking\nVisitor: ${rawVisitorName}\nOrganization: ${rawOrganization}\nDate: ${rawPreferredDate} (${rawPreferredTimeSlot})\nGroup Size: ${rawGroupSize}\nGuide Language: ${rawGuideLang}\nEmail: ${email}\nPhone: ${rawPhone}\nNotes: ${rawNotes}`,
      html: `<div style="font-family:sans-serif;max-width:600px;line-height:1.5;color:#14281d">
        <h2 style="color:#1b4332">New Guided Visit Reservation</h2>
        <p><strong>Visitor:</strong> ${visitorName}</p>
        <p><strong>Organization / School:</strong> ${organization}</p>
        <p><strong>Preferred Date & Slot:</strong> ${preferredDate} (${preferredTimeSlot})</p>
        <p><strong>Group Size:</strong> ${groupSize}</p>
        <p><strong>Preferred Guide Language:</strong> ${guideLang}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Notes:</strong> ${notes}</p>
      </div>`,
    },
    EMAIL_TEMPLATE_IDS.adminAlerts.visit,
    templateData
  );

  if (email && email.includes('@')) {
    await sendDesignerOrFallbackEmail(
      strapi,
      {
        to: email,
        subject: copy.visitSubject,
        text: `${copy.visitHeading}\n\n${copy.visitBody}\n\nDate: ${rawPreferredDate} (${rawPreferredTimeSlot})\nGroup Size: ${rawGroupSize}\n\n${copy.footer}`,
        html: `<div dir="${dir}" style="font-family:sans-serif;max-width:600px;line-height:1.6;color:#14281d">
          <h2 style="color:#1b4332">${escapeHtml(copy.visitHeading)} ${visitorName}</h2>
          <p>${escapeHtml(copy.visitBody)}</p>
          <p><strong>${preferredDate}</strong> (${preferredTimeSlot}) • ${groupSize}</p>
          <hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" />
          <p style="font-size:12px;color:#52796f">${escapeHtml(copy.footer)}</p>
        </div>`,
      },
      EMAIL_TEMPLATE_IDS.visitConfirmation[code],
      templateData
    );
  }
}

export async function notifyDonationSubmission(
  strapi: Core.Strapi,
  record: Record<string, unknown>
): Promise<void> {
  const adminTo = (
    process.env.EMAIL_ADMIN_NOTIFICATION_TO || 'info@mezquitabogota.org'
  ).trim();
  const donationTypeVal = record.donationType ?? record.categoryKey ?? 'general';
  const paymentMethodVal =
    record.paymentMethodUsed ??
    record.paymentProvider ??
    record.paymentChannel ??
    'bancolombia';

  const rawDonorName = sanitizeHeaderLine(record.donorName || 'Donor', 120);
  const donorName = escapeHtml(record.donorName);
  const email = sanitizeHeaderLine(record.donorEmail, 120);
  const rawAmount = sanitizeHeaderLine(record.amount || '', 40);
  const amount = escapeHtml(record.amount);
  const rawCurrency = sanitizeHeaderLine(record.currency || 'COP', 10);
  const currency = escapeHtml(record.currency || 'COP');
  const rawDonationType = sanitizeHeaderLine(donationTypeVal, 40);
  const donationType = escapeHtml(donationTypeVal);
  const rawPaymentMethod = sanitizeHeaderLine(paymentMethodVal, 40);
  const paymentMethodUsed = escapeHtml(paymentMethodVal);
  const rawReference = sanitizeHeaderLine(record.transactionReference || '—', 80);
  const reference = escapeHtml(record.transactionReference || '—');
  const requestsCertificate = Boolean(
    record.requestsTaxCertificate ?? record.donorTaxId
  );
  const { code, dir, copy, mosque } = getCopyForLocale(record.locale);

  const templateData = {
    mosque,
    donation: {
      donorName: rawDonorName,
      amount: rawAmount,
      currency: rawCurrency,
      donationType: rawDonationType,
      paymentMethodUsed: rawPaymentMethod,
      transactionReference: rawReference,
      requestsTaxCertificate: requestsCertificate ? 'Yes' : 'No',
    },
  };

  await sendDesignerOrFallbackEmail(
    strapi,
    {
      to: adminTo,
      replyTo: email || undefined,
      subject: sanitizeHeaderLine(
        `[Donation Report] ${rawAmount} ${rawCurrency} (${rawDonationType})${requestsCertificate ? ' [DIAN Certificate Requested]' : ''}`
      ),
      text: `New Donation Submission\nDonor: ${rawDonorName}\nAmount: ${rawAmount} ${rawCurrency}\nType: ${rawDonationType}\nMethod: ${rawPaymentMethod}\nReference: ${rawReference}\nDIAN Tax Certificate Requested: ${requestsCertificate ? 'Yes' : 'No'}`,
      html: `<div style="font-family:sans-serif;max-width:600px;line-height:1.5;color:#14281d">
        <h2 style="color:#1b4332">New Donation Notification</h2>
        <p><strong>Donor:</strong> ${donorName}</p>
        <p><strong>Amount:</strong> ${amount} ${currency}</p>
        <p><strong>Category:</strong> ${donationType}</p>
        <p><strong>Payment Method:</strong> ${paymentMethodUsed}</p>
        <p><strong>Transaction Ref:</strong> ${reference}</p>
        <p><strong>DIAN Tax Certificate Requested:</strong> ${requestsCertificate ? 'Yes' : 'No'}</p>
      </div>`,
    },
    EMAIL_TEMPLATE_IDS.adminAlerts.donation,
    templateData
  );

  if (email && email.includes('@')) {
    await sendDesignerOrFallbackEmail(
      strapi,
      {
        to: email,
        subject: copy.donationSubject,
        text: `${copy.donationHeading}\n\n${copy.donationBody}\n\n${copy.footer}`,
        html: `<div dir="${dir}" style="font-family:sans-serif;max-width:600px;line-height:1.6;color:#14281d">
          <h2 style="color:#1b4332">${escapeHtml(copy.donationHeading)} ${donorName}</h2>
          <p>${escapeHtml(copy.donationBody)}</p>
          <p><strong>${amount} ${currency}</strong> (${donationType})</p>
          <hr style="border:none;border-top:1px solid #d8e2dc;margin:24px 0" />
          <p style="font-size:12px;color:#52796f">${escapeHtml(copy.footer)}</p>
        </div>`,
      },
      EMAIL_TEMPLATE_IDS.donationConfirmation[code],
      templateData
    );
  }
}
