---
title: Strapi v5 Headless CMS Architecture
description: Configuration, database strategy, security middlewares, and plugin ecosystem of the Strapi v5 backend.
---

## 1. Backend Directory Layout (`backend/`)

```text
backend/
├── config/
│   ├── admin.ts          # Admin JWT, transfer tokens, preview button handler
│   ├── api.ts            # REST pagination limits (defaultLimit: 25, maxLimit: 100)
│   ├── database.ts       # Dual-mode SQLite (better-sqlite3) / PostgreSQL 16 (pg)
│   ├── middlewares.ts    # Strict CSP (Cloudinary + OpenStreetMap), CORS, security headers
│   ├── plugins.ts        # Configuration for 10 @vicacha-devs plugins + Tiptap + SEO + Cache
│   └── server.ts         # Host (127.0.0.1), Port (1337), Cron tasks
├── src/
│   ├── admin/            # 4-locale admin translations (es, en, ar, tr) & Vite bundle transforms
│   ├── api/              # 9 site-specific schemas (5 Single Types + 4 Collection Types) & /api/health
│   ├── bootstrap/        # Locales, permissions, Content Manager Organizer, field metadata & lifecycles
│   ├── components/       # 7 reusable Strapi schemas (shared.seo, shared.link, faith.pillar-card, etc.)
│   ├── seed/             # Idempotent 4-locale initial content, navigation, sitemap, tiptap & email seeds
│   └── index.ts          # Register & bootstrap lifecycle orchestrator
├── Dockerfile            # Multi-stage Node 24 Alpine production container
└── package.json
```

---

## 2. Dual Database Strategy (`backend/config/database.ts`)

```mermaid
flowchart LR
  Config["backend/config/database.ts"] --> Env{"env('DATABASE_CLIENT')"}
  Env -- "'sqlite' (Default)" --> SQLite["better-sqlite3 (.tmp/data.db)"]
  Env -- "'postgres'" --> PG["PostgreSQL 16 Pool (min: 2, max: 10)"]
```

- **Local Development (`sqlite`)**: Zero external dependencies; stores data in `backend/.tmp/data.db` and automatically seeds on first boot.
- **Staging & Production (`postgres`)**: Connects to PostgreSQL 16 (provisioned locally via `docker-compose.yml` bound to `127.0.0.1:5432`, or managed Cloud SQL / RDS in production).

---

## 3. Security & Middleware Hardening (`backend/config/middlewares.ts`)

1. **Content Security Policy (`strapi::security`)**:
   - Explicitly allow-lists `res.cloudinary.com` for media assets and `*.tile.openstreetmap.org` for location maps.
   - Blocks `upgradeInsecureRequests` only in local HTTP dev; enforces strict HTTPS in production.
2. **CORS (`strapi::cors`)**:
   - Restricts cross-origin requests to configured origins (`CORS_ORIGINS`, defaulting to `http://localhost:4321` and `http://127.0.0.1:4321`) and restricts methods to `GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS`.
3. **API Caching (`strapi-cache` `v1.13.0`)**:
   - Supports `memory` (LRU), `valkey`, and `redis` providers (`CACHE_TTL=3600000` / 1 hour, `CACHE_MAX_ITEMS=1000`).
   - Caches read-heavy `GET` responses for `/api/global-setting`, `/api/about-page`, `/api/donations-page`, `/api/islam-faith-page`, `/api/contact-page`, `/api/community-services`, `/api/articles`, `/api/leaders`, `/api/faqs`, `/api/events/occurrences`, `/api/events/spotlights`, `/api/media-feeds/episodes`, and `/api/donations/campaigns`, while explicitly excluding mutation and transactional endpoints (`/api/bookings`, `/api/inbox`, `/api/certificates/apply`, `/api/certificates/verify`, `/api/donations/pledges`, `/api/donations/webhooks`, `/api/events/register`, `/api/events/cancel`).
   - Ships native Admin UI translations for `en`, `es`, `ar`, `tr`, and `de` (`Purge Cache` / `Purge Entity Cache` buttons and settings page) and automatically purges cached keys on editorial updates.
