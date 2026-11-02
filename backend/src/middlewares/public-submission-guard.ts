import type { Core } from '@strapi/strapi';

interface RateLimitBucket {
  timestamps: number[];
}

const ipBuckets = new Map<string, RateLimitBucket>();
const MAX_TRACKED_IPS = 5000;

function pruneBuckets(now: number, windowMs: number): void {
  if (ipBuckets.size < MAX_TRACKED_IPS) return;
  for (const [ip, bucket] of ipBuckets.entries()) {
    const active = bucket.timestamps.filter((t) => now - t < windowMs);
    if (active.length === 0) {
      ipBuckets.delete(ip);
    } else {
      bucket.timestamps = active;
    }
  }
}

async function verifyTurnstileToken(
  secretKey: string,
  token: string,
  remoteIp: string
): Promise<boolean> {
  try {
    const formData = new URLSearchParams();
    formData.set('secret', secretKey);
    formData.set('response', token);
    if (remoteIp) {
      formData.set('remoteip', remoteIp);
    }

    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }
    );

    if (!response.ok) return false;
    const result = (await response.json()) as { success?: boolean };
    return Boolean(result.success);
  } catch {
    // Fail closed if Turnstile verification is enabled and cannot be verified
    return false;
  }
}

/**
 * Middleware protecting public POST submission endpoints (`contact-submission`, `visit-booking`, `donation-submission`):
 * 1. Sliding-window per-IP rate limiting
 * 2. Honeypot field trap (`website` / `_hp`)
 * 3. Optional Cloudflare Turnstile token verification when `TURNSTILE_SECRET_KEY` is configured
 */
export default (
  _config: Record<string, unknown>,
  { strapi }: { strapi: Core.Strapi }
) => {
  return async (ctx: any, next: () => Promise<void>) => {
    const maxRequests = Math.max(
      1,
      Number.parseInt(process.env.PUBLIC_FORM_RATE_LIMIT_MAX || '5', 10) || 5
    );
    const windowMs = Math.max(
      10_000,
      Number.parseInt(
        process.env.PUBLIC_FORM_RATE_LIMIT_WINDOW_MS || '600000',
        10
      ) || 600_000
    );

    const now = Date.now();
    pruneBuckets(now, windowMs);

    const clientIp =
      (typeof ctx.request?.ip === 'string' && ctx.request.ip) || 'unknown';
    const bucket = ipBuckets.get(clientIp) ?? { timestamps: [] };
    bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

    if (bucket.timestamps.length >= maxRequests) {
      ctx.set('Retry-After', String(Math.ceil(windowMs / 1000)));
      return ctx.tooManyRequests(
        'Too many submissions from this IP address. Please wait and try again.'
      );
    }

    bucket.timestamps.push(now);
    ipBuckets.set(clientIp, bucket);

    const rawBody = ctx.request?.body ?? {};
    const payload =
      rawBody && typeof rawBody.data === 'object' && rawBody.data !== null
        ? rawBody.data
        : rawBody;

    // Honeypot trap: bots commonly fill hidden `website` or `_hp` inputs
    const honeypotValue =
      payload?.website ?? payload?._hp ?? rawBody?.website ?? rawBody?._hp;
    if (typeof honeypotValue === 'string' && honeypotValue.trim().length > 0) {
      strapi.log.warn('Blocked public form submission triggered by honeypot');
      return ctx.badRequest('Invalid form submission.');
    }

    // Optional Cloudflare Turnstile verification
    const turnstileSecret = (process.env.TURNSTILE_SECRET_KEY || '').trim();
    const turnstileToken =
      payload?.turnstileToken ??
      rawBody?.turnstileToken ??
      ctx.request?.headers?.['cf-turnstile-response'];

    if (turnstileSecret) {
      if (typeof turnstileToken !== 'string' || !turnstileToken.trim()) {
        return ctx.badRequest('Security verification token is required.');
      }
      const isValid = await verifyTurnstileToken(
        turnstileSecret,
        turnstileToken.trim(),
        clientIp
      );
      if (!isValid) {
        return ctx.badRequest('Security verification failed.');
      }
    }

    // Strip anti-bot metadata fields before Strapi validates the schema
    if (payload && typeof payload === 'object') {
      delete payload.website;
      delete payload._hp;
      delete payload.turnstileToken;
    }
    if (rawBody && typeof rawBody === 'object') {
      delete rawBody.website;
      delete rawBody._hp;
      delete rawBody.turnstileToken;
    }

    await next();
  };
};
