import { randomBytes } from "node:crypto";
import { defineMiddleware } from "astro:middleware";

/**
 * Applies security headers and a per-request CSP nonce to every SSR response.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const nonce = randomBytes(16).toString("base64");
  context.locals.cspNonce = nonce;

  const response = await next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(self), camera=(), microphone=()"
  );

  // Preserve stricter sandbox CSP if an API route already set one
  if (!response.headers.has("Content-Security-Policy")) {
    const scriptSrc = import.meta.env.DEV
      ? "'self' 'unsafe-inline'"
      : `'self' 'nonce-${nonce}'`;

    response.headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        `script-src ${scriptSrc}`,
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self' https:",
        "frame-ancestors 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join("; ")
    );
  }

  return response;
});
