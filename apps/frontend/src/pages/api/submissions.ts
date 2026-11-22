import { fetchStrapiData } from "@services/strapi";
import type { APIRoute } from "astro";
import { randomBytes } from "node:crypto";

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
const ALLOWED_SERVICE_TYPES = new Set([
  "nikah",
  "shahada",
  "hajj_umrah",
  "halal",
  "janazah",
]);
const CERTIFICATE_TEMPLATE_BY_SERVICE: Record<string, string> = {
  shahada: "shahada-certificate",
  nikah: "nikah-certificate",
  hajj_umrah: "consular-muslim-certificate",
  halal: "halal-compliance-certificate",
};
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const RATE_LIMIT_MAX_KEYS = 1000;
const rateLimitBuckets = new Map<string, Array<number>>();

function isRateLimited(clientKey: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  if (rateLimitBuckets.size > RATE_LIMIT_MAX_KEYS) {
    for (const [key, times] of rateLimitBuckets.entries()) {
      const fresh = times.filter((ts) => ts > windowStart);
      if (fresh.length === 0) {
        rateLimitBuckets.delete(key);
      } else {
        rateLimitBuckets.set(key, fresh);
      }
    }
    if (rateLimitBuckets.size > RATE_LIMIT_MAX_KEYS) {
      const oldestKey = rateLimitBuckets.keys().next().value;
      if (oldestKey !== undefined) {
        rateLimitBuckets.delete(oldestKey);
      }
    }
  }

  const timestamps = (rateLimitBuckets.get(clientKey) ?? []).filter(
    (ts) => ts > windowStart
  );
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitBuckets.set(clientKey, timestamps);
    return true;
  }
  timestamps.push(now);
  rateLimitBuckets.set(clientKey, timestamps);
  return false;
}

function sanitizeText(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, maxLength);
}

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function generateReferenceCode(prefix: string): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${datePart}-${randomPart}`;
}

function isUpstreamHttpRejection(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  if (
    "status" in err &&
    typeof (err as { status?: unknown }).status === "number"
  ) {
    return (err as { status: number }).status >= 400;
  }
  return /Strapi API request failed \(\d+\)/.test(err.message);
}

function isOriginAllowed(request: Request, url?: URL): boolean {
  if (!url) return true;
  const origin = request.headers.get("origin");
  if (origin) {
    return origin === url.origin;
  }
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin === url.origin;
    } catch {
      return false;
    }
  }
  return true;
}

async function handleContact(
  body: Record<string, unknown>,
  locale: string
): Promise<Response> {
  const fullName = sanitizeText(body.fullName, 120);
  const email = sanitizeText(body.email, 160);
  const phone = sanitizeText(body.phone, 40);
  const rawSubject = sanitizeText(body.subject, 30);
  const subject = ALLOWED_CONTACT_SUBJECTS.has(rawSubject)
    ? rawSubject
    : "general";
  const message = sanitizeText(body.message, 4000);

  if (!fullName || !EMAIL_REGEX.test(email) || !message) {
    return jsonResponse(
      { ok: false, error: "Invalid contact submission fields" },
      400
    );
  }

  const referenceCode = generateReferenceCode("INB");

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
  } catch (err) {
    if (isUpstreamHttpRejection(err)) {
      return jsonResponse(
        { ok: false, error: "Upstream service rejected submission" },
        502
      );
    }
  }

  return jsonResponse({ ok: true, referenceCode });
}

async function handleVisit(
  body: Record<string, unknown>,
  locale: string
): Promise<Response> {
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
    return jsonResponse(
      { ok: false, error: "Invalid visit booking fields" },
      400
    );
  }

  const fallbackReferenceCode = generateReferenceCode("BKG");
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
  } catch (err) {
    if (isUpstreamHttpRejection(err)) {
      return jsonResponse(
        { ok: false, error: "Upstream booking service rejected request" },
        502
      );
    }
  }

  return jsonResponse({ ok: true, referenceCode });
}

async function handleDonation(
  body: Record<string, unknown>,
  locale: string
): Promise<Response> {
  const donorName = sanitizeText(body.donorName, 140);
  const donorEmail = sanitizeText(body.donorEmail, 160);
  const donorPhone = sanitizeText(body.donorPhone, 40);
  const rawDocType = sanitizeText(body.documentType, 20);
  const documentType = ALLOWED_DOC_TYPES.has(rawDocType) ? rawDocType : "CC";
  const documentNumber = sanitizeText(body.documentNumber, 40);
  const amountNum = Number(body.amount ?? 0);
  const amount = Number.isFinite(amountNum) && amountNum > 0 ? amountNum : 0;
  const rawCurrency = sanitizeText(body.currency, 10);
  const currency = ALLOWED_CURRENCIES.has(rawCurrency) ? rawCurrency : "COP";
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
  const fallbackReferenceCode = generateReferenceCode(
    campaignKind === "utility_invoice" ? "INV" : "DON"
  );
  let referenceCode = fallbackReferenceCode;

  if (!donorName || !EMAIL_REGEX.test(donorEmail) || amount <= 0) {
    return jsonResponse(
      { ok: false, error: "Invalid donation submission fields" },
      400
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
  } catch (err) {
    if (isUpstreamHttpRejection(err)) {
      return jsonResponse(
        { ok: false, error: "Upstream donation service rejected request" },
        502
      );
    }
  }

  return jsonResponse({ ok: true, referenceCode });
}

async function handleServiceDesk(
  body: Record<string, unknown>,
  locale: string
): Promise<Response> {
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
    return jsonResponse(
      { ok: false, error: "Invalid service-desk application fields" },
      400
    );
  }

  let referenceCode = generateReferenceCode("INB");
  const certificateTemplateSlug = CERTIFICATE_TEMPLATE_BY_SERVICE[serviceType];

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
      // Continue to inbox submission when certificate endpoint is offline
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
  } catch (err) {
    if (isUpstreamHttpRejection(err)) {
      return jsonResponse(
        { ok: false, error: "Upstream service-desk rejected application" },
        502
      );
    }
  }

  return jsonResponse({ ok: true, referenceCode });
}

async function handleNewsletter(
  body: Record<string, unknown>,
  locale: string
): Promise<Response> {
  const email = sanitizeText(body.email, 160);
  const fullName = sanitizeText(body.fullName, 120);
  const phone = sanitizeText(body.phone, 40);
  const sourceFormSlug =
    sanitizeText(body.sourceFormSlug, 60) || "footer-newsletter";
  const topics = Array.isArray(body.topics)
    ? body.topics.map((t) => sanitizeText(t, 30)).filter(Boolean)
    : ["announcements", "events"];

  if (!EMAIL_REGEX.test(email)) {
    return jsonResponse({ ok: false, error: "Invalid email address" }, 400);
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
  } catch (err) {
    if (isUpstreamHttpRejection(err)) {
      return jsonResponse(
        { ok: false, error: "Upstream subscription service rejected request" },
        502
      );
    }
  }

  return jsonResponse({ ok: true, status: "pending" });
}

const SUBMISSION_HANDLERS: Record<
  string,
  (body: Record<string, unknown>, locale: string) => Promise<Response>
> = {
  contact: handleContact,
  visit: handleVisit,
  donation: handleDonation,
  service_desk: handleServiceDesk,
  newsletter: handleNewsletter,
};

/**
 * BFF API Route for forwarding validated Contact, Guided Visit, Service Desk,
 * Newsletter & Donation submissions to Strapi v5.
 * Enforces Content-Type, Origin, rate limiting, honeypot rejection, and allow-lists.
 */
export const POST: APIRoute = async ({ request, url, clientAddress }) => {
  try {
    const contentType =
      request.headers.get("content-type")?.toLowerCase() ?? "";
    const mediaType = contentType.split(";")[0]?.trim() ?? "";
    if (mediaType !== "application/json") {
      return jsonResponse({ ok: false, error: "Unsupported Media Type" }, 415);
    }

    if (!isOriginAllowed(request, url)) {
      return jsonResponse({ ok: false, error: "Forbidden origin" }, 403);
    }

    const addr = (clientAddress as string | undefined) ?? "";
    const forwardedIp = request.headers
      .get("x-forwarded-for")
      ?.split(",")[0]
      ?.trim();
    const clientKey =
      addr.length > 0
        ? addr
        : forwardedIp && forwardedIp.length > 0
          ? forwardedIp
          : "unknown";
    if (isRateLimited(clientKey)) {
      return jsonResponse({ ok: false, error: "Too many requests" }, 429);
    }

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return jsonResponse({ ok: false, error: "Invalid JSON payload" }, 400);
    }

    if (!rawBody || typeof rawBody !== "object" || Array.isArray(rawBody)) {
      return jsonResponse({ ok: false, error: "Invalid JSON object" }, 400);
    }
    const body = rawBody as Record<string, unknown>;

    // Honeypot anti-bot check
    const honeypot = sanitizeText(body.website ?? body._hp, 100);
    if (honeypot.length > 0) {
      return jsonResponse({ ok: false, error: "Invalid form submission" }, 400);
    }

    const formType = sanitizeText(body.formType ?? body.type, 20);
    const rawLocale = sanitizeText(body.locale, 5);
    const locale = ALLOWED_LOCALES.has(rawLocale) ? rawLocale : "es";

    const handler = Object.hasOwn(SUBMISSION_HANDLERS, formType)
      ? SUBMISSION_HANDLERS[formType]
      : undefined;
    if (!handler) {
      return jsonResponse({ ok: false, error: "Unsupported form type" }, 400);
    }

    return await handler(body, locale);
  } catch {
    return jsonResponse({ ok: false, error: "Unable to process request" }, 500);
  }
};
