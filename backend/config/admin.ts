import { resolveSecret } from "./security.utils";

// TODO(security): Enable OAuth/OIDC SSO provider (e.g., Google Workspace via strapi-plugin-sso) and MFA for Mosque admin accounts in production.
// TODO(security): Integrate HaveIBeenPwned leaked password detection hook on admin password change.

export default ({ env }) => {
  const clientUrl = env("FRONTEND_URL", "http://127.0.0.1:4321");
  const previewSecret = resolveSecret("PREVIEW_SECRET");

  return {
    auth: {
      secret: resolveSecret("ADMIN_JWT_SECRET"),
      sessions: {
        maxRefreshTokenLifespan: env.int(
          "ADMIN_MAX_REFRESH_LIFESPAN",
          60 * 60 * 24 * 7,
        ), // 7 days
        maxSessionLifespan: env.int("ADMIN_MAX_SESSION_LIFESPAN", 60 * 60 * 24), // 24 hours
      },
    },
    apiToken: {
      salt: resolveSecret("API_TOKEN_SALT"),
    },
    transfer: {
      token: {
        salt: resolveSecret("TRANSFER_TOKEN_SALT"),
      },
    },
    secrets: {
      encryptionKey: env("ENCRYPTION_KEY", resolveSecret("ADMIN_JWT_SECRET")),
    },
    forgotPassword: {
      from: env("EMAIL_DEFAULT_FROM", "no-reply@mezquitabogota.org"),
      replyTo: env("EMAIL_DEFAULT_REPLY_TO", "info@mezquitabogota.org"),
      expiresIn: env("ADMIN_FORGOT_PASSWORD_EXPIRES_IN", "1h"),
    },
    flags: {
      nps: env.bool("FLAG_NPS", false),
      promoteEE: env.bool("FLAG_PROMOTE_EE", false),
    },
    preview: {
      enabled: true,
      config: {
        allowedOrigins: [clientUrl],
        async handler(uid, { documentId, locale, status }) {
          const localePrefix = locale || "es";
          const searchParams = new URLSearchParams({
            uid,
            documentId,
            status: status || "draft",
            secret: previewSecret,
          });
          return `${clientUrl}/${localePrefix}/preview?${searchParams.toString()}`;
        },
      },
    },
  };
};
