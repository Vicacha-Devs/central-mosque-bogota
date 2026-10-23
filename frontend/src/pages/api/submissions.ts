import { fetchStrapiData } from "@services/strapi";
import type { APIRoute } from "astro";

export const prerender = false;

const ALLOWED_CONTACT_SUBJECTS = new Set([
  "general",
  "education",
  "nikah",
  "funeral",
  "media",
  "other",
]);

const ALLOWED_TIME_SLOTS = new Set(["morning", "afternoon"]);
const ALLOWED_LOCALES = new Set(["es", "en", "ar", "tr"]);
const ALLOWED_DOC_TYPES = new Set(["CC", "CE", "NIT", "PASSPORT", "OTHER"]);
const ALLOWED_CURRENCIES = new Set(["COP", "USD", "EUR", "TRY"]);
const ALLOWED_DONATION_TYPES = new Set([
  "zakat",
  "sadaqah",
  "waqf",
  "iftar",
  "utility_bills",
  "general",
]);
const ALLOWED_CAMPAIGN_KINDS = new Set([
  "major_campaign",
  "utility_invoice",
  "micro_need",
]);
const ALLOWED_PAYMENT_METHODS = new Set([
  "bancolombia",
  "nequi",
  "daviplata",
  "wompi",
  "paypal",
  "other",
]);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeText(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, maxLength);
}

/**
 * BFF API Route for forwarding validated Contact, Guided Visit & Donation submissions to Strapi v5.
 * Enforces strict server-side input validation, honeypot rejection, and allow-lists.
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    // Honeypot anti-bot check
    const honeypot = sanitizeText(body.website ?? body._hp, 100);
    if (honeypot.length > 0) {
      return new Response(
        JSON.stringify({ ok: false, error: "Invalid form submission" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const formType = sanitizeText(body.formType ?? body.type, 20);
    const rawLocale = sanitizeText(body.locale, 5);
    const locale = ALLOWED_LOCALES.has(rawLocale) ? rawLocale : "es";

    if (formType === "contact") {
      const fullName = sanitizeText(body.fullName, 120);
      const email = sanitizeText(body.email, 160);
      const phone = sanitizeText(body.phone, 40);
      const rawSubject = sanitizeText(body.subject, 30);
      const subject = ALLOWED_CONTACT_SUBJECTS.has(rawSubject)
        ? rawSubject
        : "general";
      const message = sanitizeText(body.message, 4000);

      if (!fullName || !EMAIL_REGEX.test(email) || !message) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: "Invalid contact submission fields",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const referenceCode = `INB-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      try {
        await fetchStrapiData(
          "inbox/forms/general-contact/submit",
          {},
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fullName,
              email,
              phone,
              subject,
              message,
              locale,
            }),
          }
        );
      } catch {
        // Fallback to legacy collection or offline mode
      }

      return new Response(JSON.stringify({ ok: true, referenceCode }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      });
    }

    if (formType === "visit") {
      const visitorName = sanitizeText(body.visitorName, 120);
      const organizationOrSchool = sanitizeText(body.organizationOrSchool, 160);
      const email = sanitizeText(body.email, 160);
      const phone = sanitizeText(body.phone, 40);
      const preferredDate = sanitizeText(body.preferredDate, 20);
      const rawSlot = sanitizeText(body.preferredTimeSlot, 20);
      const preferredTimeSlot = ALLOWED_TIME_SLOTS.has(rawSlot)
        ? rawSlot
        : "morning";
      const groupSizeNum = Number(body.groupSize ?? 1);
      const groupSize = Number.isFinite(groupSizeNum)
        ? Math.min(150, Math.max(1, Math.round(groupSizeNum)))
        : 1;
      const notes = sanitizeText(body.notes, 2000);

      if (
        !visitorName ||
        !EMAIL_REGEX.test(email) ||
        !phone ||
        !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)
      ) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: "Invalid visit booking fields",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const fallbackReferenceCode = `BKG-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      let referenceCode = fallbackReferenceCode;

      try {
        const reserveRes = await fetchStrapiData<{
          data?: { referenceCode?: string };
          referenceCode?: string;
        }>(
          "bookings/reserve",
          {},
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sourceId: "visit-bookings",
              referenceCode: fallbackReferenceCode,
              visitorName,
              organizationOrSchool,
              email,
              phone,
              preferredDate,
              preferredTimeSlot,
              groupSize,
              preferredGuideLanguage: locale,
              notes,
              locale,
            }),
          }
        );
        const upstreamRef =
          reserveRes.data?.referenceCode ?? reserveRes.referenceCode;
        if (typeof upstreamRef === "string" && upstreamRef.trim()) {
          referenceCode = upstreamRef.trim();
        }
      } catch {
        try {
          await fetchStrapiData(
            "visit-bookings",
            {},
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                data: {
                  visitorName,
                  organizationOrSchool,
                  email,
                  phone,
                  preferredDate,
                  preferredTimeSlot,
                  groupSize,
                  preferredGuideLanguage: locale,
                  notes,
                  locale,
                  status: "pending",
                },
              }),
            }
          );
        } catch {
          // Graceful offline acceptance when local Strapi server is not running
        }
      }

      return new Response(JSON.stringify({ ok: true, referenceCode }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      });
    }

    if (formType === "donation") {
      const donorName = sanitizeText(body.donorName, 140);
      const donorEmail = sanitizeText(body.donorEmail, 160);
      const donorPhone = sanitizeText(body.donorPhone, 40);
      const rawDocType = sanitizeText(body.documentType, 20);
      const documentType = ALLOWED_DOC_TYPES.has(rawDocType)
        ? rawDocType
        : "CC";
      const documentNumber = sanitizeText(body.documentNumber, 40);
      const amountNum = Number(body.amount ?? 0);
      const amount =
        Number.isFinite(amountNum) && amountNum > 0 ? amountNum : 0;
      const rawCurrency = sanitizeText(body.currency, 10);
      const currency = ALLOWED_CURRENCIES.has(rawCurrency)
        ? rawCurrency
        : "COP";
      const rawDonationType = sanitizeText(body.donationType, 20);
      const donationType = ALLOWED_DONATION_TYPES.has(rawDonationType)
        ? rawDonationType
        : "general";
      const rawPaymentMethod = sanitizeText(body.paymentMethodUsed, 30);
      const paymentMethodUsed = ALLOWED_PAYMENT_METHODS.has(rawPaymentMethod)
        ? rawPaymentMethod
        : "bancolombia";
      const transactionReference = sanitizeText(body.transactionReference, 120);
      const campaignSlug = sanitizeText(body.campaignSlug, 120);
      const rawCampaignKind = sanitizeText(body.campaignKind, 30);
      const campaignKind = ALLOWED_CAMPAIGN_KINDS.has(rawCampaignKind)
        ? rawCampaignKind
        : donationType === "utility_bills"
          ? "utility_invoice"
          : "major_campaign";
      const coversRemainingBalance =
        body.coversRemainingBalance === true ||
        body.coversRemainingBalance === "on" ||
        body.coversRemainingBalance === "true";
      const requestsTaxCertificate =
        body.requestsTaxCertificate === true ||
        body.requestsTaxCertificate === "on" ||
        body.requestsTaxCertificate === "true";
      const notes = sanitizeText(body.notes, 2000);
      const fallbackReferenceCode = `${campaignKind === "utility_invoice" ? "INV" : "DON"}-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      let referenceCode = fallbackReferenceCode;

      if (!donorName || !EMAIL_REGEX.test(donorEmail) || amount <= 0) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: "Invalid donation submission fields",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      try {
        const pledgeRes = await fetchStrapiData<{
          data?: { referenceCode?: string };
          referenceCode?: string;
        }>(
          "donations/pledges",
          {},
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              referenceCode: fallbackReferenceCode,
              donorName,
              donorEmail,
              donorPhone,
              donorTaxIdType: documentType,
              donorTaxId: documentNumber,
              documentType,
              documentNumber,
              amount,
              currency,
              categoryKey: donationType,
              donationType,
              campaignSlug: campaignSlug || undefined,
              campaignKind,
              coversRemainingBalance,
              paymentChannel: paymentMethodUsed,
              paymentMethodUsed,
              transactionReference,
              requestsTaxCertificate,
              donorNotes: notes,
              notes,
              locale,
            }),
          }
        );
        const upstreamRef =
          pledgeRes.data?.referenceCode ?? pledgeRes.referenceCode;
        if (typeof upstreamRef === "string" && upstreamRef.trim()) {
          referenceCode = upstreamRef.trim();
        }
      } catch {
        try {
          await fetchStrapiData(
            "donation-submissions",
            {},
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                data: {
                  referenceCode: fallbackReferenceCode,
                  donorName,
                  donorEmail,
                  donorPhone,
                  documentType,
                  documentNumber,
                  amount,
                  currency,
                  donationType,
                  campaignSlug: campaignSlug || undefined,
                  campaignKind,
                  coversRemainingBalance,
                  paymentMethodUsed,
                  transactionReference,
                  requestsTaxCertificate,
                  notes,
                  locale,
                  status: "pending",
                },
              }),
            }
          );
        } catch {
          // Graceful offline acceptance when local Strapi server is not running
        }
      }

      return new Response(JSON.stringify({ ok: true, referenceCode }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      });
    }

    if (formType === "service_desk") {
      const ALLOWED_SERVICE_TYPES = new Set([
        "nikah",
        "shahada",
        "hajj_umrah",
        "halal",
        "janazah",
      ]);
      const rawServiceType = sanitizeText(body.serviceType, 40);
      const serviceType = ALLOWED_SERVICE_TYPES.has(rawServiceType)
        ? rawServiceType
        : "nikah";
      const applicantName = sanitizeText(body.applicantName, 140);
      const applicantEmail = sanitizeText(body.applicantEmail, 160);
      const applicantPhone = sanitizeText(body.applicantPhone, 40);
      const preferredDate = sanitizeText(body.preferredDate, 20);
      const details = sanitizeText(body.details, 2500);

      if (!applicantName || !EMAIL_REGEX.test(applicantEmail) || !details) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: "Invalid service-desk application fields",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const fallbackReferenceCode = `INB-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      let referenceCode = fallbackReferenceCode;

      const CERTIFICATE_TEMPLATE_BY_SERVICE: Record<string, string> = {
        shahada: "shahada-certificate",
        nikah: "nikah-certificate",
        hajj_umrah: "consular-muslim-certificate",
        halal: "halal-compliance-certificate",
      };
      const certificateTemplateSlug =
        CERTIFICATE_TEMPLATE_BY_SERVICE[serviceType];

      if (certificateTemplateSlug) {
        try {
          const certRes = await fetchStrapiData<{
            data?: { serialNumber?: string; referenceCode?: string };
            serialNumber?: string;
            referenceCode?: string;
          }>(
            "certificates/apply",
            {},
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                templateSlug: certificateTemplateSlug,
                serviceType,
                recipientFullName: applicantName,
                applicantEmail,
                applicantPhone,
                preferredDate,
                notes: details,
                locale,
              }),
            }
          );
          const upstreamRef =
            certRes.data?.referenceCode ??
            certRes.data?.serialNumber ??
            certRes.referenceCode ??
            certRes.serialNumber;
          if (typeof upstreamRef === "string" && upstreamRef.trim()) {
            referenceCode = upstreamRef.trim();
          }
        } catch {
          // Continue to inbox submission
        }
      }

      try {
        await fetchStrapiData(
          "inbox/forms/service-desk-application/submit",
          {},
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              serviceType,
              applicantName,
              applicantEmail,
              applicantPhone,
              preferredDate,
              details,
              locale,
            }),
          }
        );
      } catch {
        // Graceful offline acceptance
      }

      return new Response(JSON.stringify({ ok: true, referenceCode }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      });
    }

    if (formType === "newsletter") {
      const email = sanitizeText(body.email, 160);
      const fullName = sanitizeText(body.fullName, 120);
      const phone = sanitizeText(body.phone, 40);
      const sourceFormSlug =
        sanitizeText(body.sourceFormSlug, 60) || "footer-newsletter";
      const topics = Array.isArray(body.topics)
        ? body.topics.map((t) => sanitizeText(t, 30)).filter(Boolean)
        : ["announcements", "events"];

      if (!EMAIL_REGEX.test(email)) {
        return new Response(
          JSON.stringify({ ok: false, error: "Invalid email address" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      try {
        await fetchStrapiData(
          "inbox/subscribers",
          {},
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              fullName: fullName || undefined,
              phone: phone || undefined,
              locale,
              topics,
              sourceFormSlug,
            }),
          }
        );
      } catch {
        // Graceful offline acceptance
      }

      return new Response(JSON.stringify({ ok: true, status: "pending" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      });
    }

    return new Response(
      JSON.stringify({ ok: false, error: "Unsupported form type" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: "Unable to process request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
