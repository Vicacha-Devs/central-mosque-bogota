# Central Mosque of Bogotá — Strapi v5 Headless CMS (`/backend`)

Headless CMS backend for the **Central Mosque of Bogotá (Mezquita Central Abu Bakr As-Siddiq)**, powered by **Strapi v5** (`@strapi/strapi` `^5.39.0`), `@notum-cz/strapi-plugin-tiptap-editor`, and 10 custom `@vicacha-devs/strapi-plugin-*` domain extensions.

---

## Key Capabilities

1. **17 Core Content Types & Health Check (`src/api/`)**:
   - **Collection Types**: `article`, `community-service`, `contact-submission`, `donation-campaign`, `donation-submission`, `event`, `faq`, `leader`, `media-highlight`, `visit-booking`.
   - **Single Types**: `about-page`, `contact-page`, `donations-page`, `global-setting`, `islam-faith-page`, `prayer-setting`.
   - **Operational Endpoint**: `health` (`GET /api/health`).
2. **10 Custom `@vicacha-devs` Domain Plugins (`config/vicachaPlugins.ts`)**:
   - `@vicacha-devs/strapi-plugin-bookings` — Guided mosque visit & facility reservations
   - `@vicacha-devs/strapi-plugin-broadcasts` — Livestream & Jumu'ah audio/video broadcast management
   - `@vicacha-devs/strapi-plugin-calendar` — Hijri & Gregorian observance and event iCalendar feeds
   - `@vicacha-devs/strapi-plugin-certificates` — Shahada & Nikah certificate issuance and verification
   - `@vicacha-devs/strapi-plugin-donations` — Sadaqah, Zakat, and utility invoice transparency tracking
   - `@vicacha-devs/strapi-plugin-events` — Event scheduling, recurring halaqas, and capacity management
   - `@vicacha-devs/strapi-plugin-inbox` — Community contact inquiries and pastoral routing
   - `@vicacha-devs/strapi-plugin-islam` — Prayer calculation parameters, Qibla, and Zakat Nisab configuration
   - `@vicacha-devs/strapi-plugin-media-feeds` — Podcast/khutbah RSS and media syndication
   - `@vicacha-devs/strapi-plugin-resources` — Multilingual books, PDFs, and educational downloads
3. **Zero-Touch First-Boot Bootstrap (`src/index.ts` & `src/seed/`)**:
   - Automatically registers all 4 supported locales (`es`, `en`, `ar`, `tr`) with `es` as default.
   - Configures least-privilege Public role permissions (read-only access on public content types, write-only `create` access on `contact-submission`, `visit-booking`, and `donation-submission`).
   - Seeds initial multilingual content idempotently when the database is empty.

---

## Quick Start

### Local Development (SQLite)

```bash
cd backend
cp .env.example .env
pnpm install
pnpm run develop
```

The Strapi Admin Panel will be available at `http://127.0.0.1:1337/admin`.

### Docker Compose (PostgreSQL 16 + Strapi v5)

From the monorepo root:

```bash
docker compose up --build
```

---

## Scripts

| Command | Description |
| :--- | :--- |
| `pnpm develop` | Start Strapi v5 in development watch mode on `http://127.0.0.1:1337` |
| `pnpm build` | Build the Strapi Admin Panel bundle |
| `pnpm start` | Run Strapi v5 in production mode |
| `pnpm typecheck` | Run TypeScript compiler validation (`tsc --noEmit`) |
| `pnpm config-sync` | Export/import Strapi configuration via `strapi-plugin-config-sync` |
