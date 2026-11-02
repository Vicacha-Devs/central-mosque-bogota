import { resolveSecret } from "../security.utils";

// TODO(security): Integrate Cloudinary malware/antivirus moderation add-on (e.g., AWS Rekognition / Metadefender CDR) on uploaded PDFs and media in production.

const UPLOAD_SIZE_LIMIT_BYTES = 10 * 1024 * 1024; // 10 MB max upload size

const UPLOAD_SECURITY_POLICY = {
  allowedTypes: [
    "image/*",
    "video/*",
    "audio/*",
    "application/pdf",
    "application/zip",
    "text/plain",
    "text/csv",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.*",
  ],
  deniedTypes: [
    "application/x-sh",
    "application/x-dosexec",
    "application/x-msdownload",
    "application/x-executable",
    "text/html",
    "application/javascript",
  ],
};

export function buildCoreInfrastructurePlugins(env: any) {
  const cloudinaryName = env("CLOUDINARY_NAME", "");
  const smtpHost = env("SMTP_HOST", "");

  return {
    "users-permissions": {
      config: {
        jwtSecret: resolveSecret("JWT_SECRET"),
        jwt: {
          expiresIn: env("JWT_EXPIRES_IN", "7d"),
        },
        ratelimit: {
          interval: 60000,
          max: 10,
        },
      },
    },

    upload: cloudinaryName
      ? {
          config: {
            sizeLimit: UPLOAD_SIZE_LIMIT_BYTES,
            security: UPLOAD_SECURITY_POLICY,
            provider: "cloudinary",
            providerOptions: {
              cloud_name: cloudinaryName,
              api_key: env("CLOUDINARY_KEY", ""),
              api_secret: env("CLOUDINARY_SECRET", ""),
            },
            actionOptions: {
              upload: {
                folder: env("CLOUDINARY_FOLDER", "central-mosque-bogota"),
                resource_type: "auto",
              },
              uploadStream: {
                folder: env("CLOUDINARY_FOLDER", "central-mosque-bogota"),
                resource_type: "auto",
              },
              delete: {},
            },
          },
        }
      : {
          config: {
            sizeLimit: UPLOAD_SIZE_LIMIT_BYTES,
            security: UPLOAD_SECURITY_POLICY,
          },
        },

    email: {
      config: {
        provider: "nodemailer",
        providerOptions: smtpHost
          ? {
              host: smtpHost,
              port: env.int("SMTP_PORT", 587),
              secure: env.bool("SMTP_SECURE", false),
              ...(env("SMTP_USERNAME", "")
                ? {
                    auth: {
                      user: env("SMTP_USERNAME", ""),
                      pass: env("SMTP_PASSWORD", ""),
                    },
                  }
                : {}),
            }
          : {
              jsonTransport: true,
            },
        settings: {
          defaultFrom: env("EMAIL_DEFAULT_FROM", "no-reply@mezquitabogota.org"),
          defaultReplyTo: env(
            "EMAIL_DEFAULT_REPLY_TO",
            "info@mezquitabogota.org",
          ),
        },
      },
    },
  };
}
