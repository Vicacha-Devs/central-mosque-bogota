export default ({ env }) => [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'default-src': ["'self'"],
          'connect-src': ["'self'", 'https:'],
          'script-src': ["'self'", 'editor.unlayer.com'],
          'frame-src': ["'self'", 'editor.unlayer.com'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'res.cloudinary.com',
            'lh3.googleusercontent.com',
            'editor.unlayer.com',
            'cdn.tools.unlayer.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'res.cloudinary.com',
          ],
          'frame-ancestors': ["'self'"],
          'object-src': ["'none'"],
          upgradeInsecureRequests: null,
        },
      },
      frameguard: {
        action: 'deny',
      },
      contentTypeOptions: true, // Sets X-Content-Type-Options: nosniff
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: env.array('CORS_ORIGINS', [
        'http://localhost:4321',
        'http://127.0.0.1:4321',
      ]),
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      formLimit: '10mb',
      jsonLimit: '2mb',
      textLimit: '2mb',
      formidable: {
        maxFileSize: 10 * 1024 * 1024, // 10 MB
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
