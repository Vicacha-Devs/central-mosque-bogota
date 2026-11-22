# Abu Bakr As-Siddiq — Central Mosque of Bogotá

Full-stack multilingual (`es`, `en`, `ar`, `tr`) web platform and bilingual (`en`, `es`) engineering documentation portal for the **Central Mosque of Bogotá (Mezquita Central Abu Bakr As-Siddiq)**.

---

## Monorepo Architecture

| Workspace | Path | Stack & Responsibilities | Default Port |
| :--- | :--- | :--- | :--- |
| **Frontend (`frontend`)** | [`./frontend`](./apps/frontend/README.md) | **Astro 7 SSR** (`@astrojs/node` / `@astrojs/vercel`), Tailwind CSS v4, Starwind UI, `@sensinum/astro-strapi-loader`, `@vicacha-devs/astro-tiptap-blocks`, IslamicAPI prayer & Zakat engine, Vitest, and Storybook 10. | `http://localhost:4321` |
| **Backend (`@central-mosque-bogota/backend`)** | [`./backend`](./apps/backend/README.md) | **Strapi v5 Headless CMS** (`5.61.1`), SQLite (local dev) / PostgreSQL 16 (production), Cloudinary CDN, `strapi-cache` (`^1.13.0`), and 17 custom `@vicacha-devs/strapi-plugin-*` domain and editorial extensions (including `tiptap-editor`, `seo`, `sitemap`, `global-search`, `opentelemetry`, and `notes`). | `http://127.0.0.1:1337` |
| **Docs (`@central-mosque-bogota/docs`)** | [`./docs`](./apps/docs/README.md) | **Astro Starlight** bilingual (`en` + `es`) handbook with **Pele** (`https://pele.run/`) build-time SVG Mermaid diagrams, **Archify** interactive HTML explainers, and **TypeDoc** API reference generation (`<= 500 lines` per file). | `http://localhost:4322` |

---

## Interactive Architecture & Developer Portal Links

### Standalone Interactive Explainers (Archify)

- **System Architecture Explorer (Dark/Light + Motion)**: [`apps/docs/public/archify/central-mosque-architecture.html`](./apps/docs/public/archify/central-mosque-architecture.html)
- **One-Page Platform Explainer**: [`apps/docs/public/archify/central-mosque-explainer.html`](./apps/docs/public/archify/central-mosque-explainer.html)

### Bilingual Starlight Documentation (`/docs`) & Junior Learning Plan

- **Junior Developer 4-Tier Learning Roadmap & YouTube Tutorials**: [`./JUNIOR_ONBOARDING_PLAN.md`](./JUNIOR_ONBOARDING_PLAN.md)

| Guide | English (`en`) | Español (`es`) |
| :--- | :--- | :--- |
| **Jr. Dev 10-Minute Executive Summary** | [`01-getting-started/jr-dev-summary.md`](./apps/docs/src/content/docs/en/01-getting-started/jr-dev-summary.md) | [`01-getting-started/jr-dev-summary.md`](./apps/docs/src/content/docs/es/01-getting-started/jr-dev-summary.md) |
| **Step-by-Step Onboarding Guide** | [`01-getting-started/onboarding-guide.md`](./apps/docs/src/content/docs/en/01-getting-started/onboarding-guide.md) | [`01-getting-started/onboarding-guide.md`](./apps/docs/src/content/docs/es/01-getting-started/onboarding-guide.md) |
| **4-Tier Learning Roadmap & YouTube Tutorials** | [`01-getting-started/learning-roadmap.md`](./apps/docs/src/content/docs/en/01-getting-started/learning-roadmap.md) | [`01-getting-started/learning-roadmap.md`](./apps/docs/src/content/docs/es/01-getting-started/learning-roadmap.md) |
| **Environment Setup** | [`01-getting-started/environment-setup.md`](./apps/docs/src/content/docs/en/01-getting-started/environment-setup.md) | [`01-getting-started/environment-setup.md`](./apps/docs/src/content/docs/es/01-getting-started/environment-setup.md) |
| **System Overview & Data Flows** | [`02-architecture/system-overview.md`](./apps/docs/src/content/docs/en/02-architecture/system-overview.md) | [`02-architecture/system-overview.md`](./apps/docs/src/content/docs/es/02-architecture/system-overview.md) |
| **System Architecture ADRs (001–012)** | [`02-architecture/adrs.md`](./apps/docs/src/content/docs/en/02-architecture/adrs.md) | [`02-architecture/adrs.md`](./apps/docs/src/content/docs/es/02-architecture/adrs.md) |
| **Verification TODO Checklist** | [`05-quality-and-verification/verification-todo-checklist.md`](./apps/docs/src/content/docs/en/05-quality-and-verification/verification-todo-checklist.md) | [`05-quality-and-verification/verification-todo-checklist.md`](./apps/docs/src/content/docs/es/05-quality-and-verification/verification-todo-checklist.md) |
| **Mosque Staff Strapi v5 Handbook** | [`06-editorial-guide/cms-editor-handbook.md`](./apps/docs/src/content/docs/en/06-editorial-guide/cms-editor-handbook.md) | [`06-editorial-guide/cms-editor-handbook.md`](./apps/docs/src/content/docs/es/06-editorial-guide/cms-editor-handbook.md) |

---

## Core Platform Capabilities

1. **Offline-First Resilient Content Layer**:
   - Every Strapi v5 collection and single-type loader in [`apps/frontend/src/services/strapi/loader.ts`](./apps/frontend/src/services/strapi/loader.ts) and [`apps/frontend/src/services/strapi/api.ts`](./apps/frontend/src/services/strapi/api.ts) automatically falls back to deterministic 4-locale mocks in [`apps/frontend/src/utils/`](./apps/frontend/src/utils/) when Strapi is offline.
2. **4-Locale & Native RTL Support (`es`, `en`, `ar`, `tr`)**:
   - Full UI dictionary parity, localized route slugs, and logical CSS layout properties (`ps-*`, `pe-*`, `ms-*`, `me-*`, `text-start`) with automatic `dir="rtl"` rendering for Arabic (`ar`).
3. **Zero-`set:html` Rich Text Rendering**:
   - Rich text content authored in `@vicacha-devs/strapi-plugin-tiptap-editor` is sanitized and rendered through native Astro components via `@vicacha-devs/astro-tiptap-blocks` ([`TiptapContent.astro`](./apps/frontend/src/components/data/display/TiptapContent/TiptapContent.astro)).
4. **Islamic Prayer Engine, Qibla & Zakat Calculator**:
   - Real-time Bogotá prayer schedule calculation, Hijri calendar conversions, Qibla bearing & observances, and live Zakat Nisab gold/silver thresholds via [`apps/frontend/src/services/islamicAPI/`](./apps/frontend/src/services/islamicAPI/).
5. **Astro SSR BFF Endpoints (`/api/*`)**:
   - Unified form submissions proxy (`POST /api/submissions`) for contact messages, guided visit bookings, and donation pledges, plus `GET /api/prayer-calendar.ics`, `GET /api/events/feed.ics`, `GET /api/media-feeds/rss.xml`, and `GET /api/resources/publications/[slug]/download`.

---

## Getting Started

### Prerequisites

- **Node.js**: `>= 24` (Frontend & Root) / `>= 18.18.0 <= 26.x.x` (Strapi Backend)
- **Package Manager**: `pnpm >= 10`

### 1. Start the Astro 7 Frontend (`/frontend`) — Works Offline Out-of-the-Box

```bash
pnpm --filter frontend install
pnpm run dev:frontend
```

Accessible at `http://localhost:4321` (automatically uses 4-locale domain mocks in `apps/frontend/src/utils/*-mocks.ts` when Strapi is not running).

### 2. Start the Strapi v5 Backend (`/backend`)

```bash
cd apps/backend
cp .env.example .env
pnpm install
pnpm run develop
```

Accessible at `http://127.0.0.1:1337/admin`. On first boot, Strapi automatically provisions the `es`, `en`, `ar`, and `tr` locales, configures least-privilege Public API permissions, and seeds initial multilingual content.

> **Docker Option**: Run `docker compose up --build` from the repository root to launch PostgreSQL 16 + Strapi v5 in containers.

### 3. Start the Bilingual Starlight + Pele + TypeDoc Docs Portal (`/docs`)

```bash
pnpm --filter @central-mosque-bogota/docs install
pnpm --filter @central-mosque-bogota/docs run typedoc
pnpm run dev:docs
```

Accessible at `http://localhost:4322`.

### 4. Run Full Monorepo Verification (`pnpm verify`)

```bash
pnpm run verify
```

Executes [`scripts/verify-all.ts`](./scripts/verify-all.ts), which enforces:
1. All documentation files in `apps/docs/src/content/docs/` are `<= 500 lines`.
2. `oxfmt --check` formatting gate.
3. `eslint . --quiet` static analysis gate.
4. `astro check` TypeScript & Astro template diagnostics.
5. `vitest --project=unit --run --coverage` unit test & coverage gate.
6. `astro build` production SSR build.
7. `storybook build` component catalog build.
8. `docs` TypeDoc sync + Starlight production build.

---

## Root Workspace Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `pnpm dev:frontend` | `pnpm --filter frontend dev` | Start Astro 7 SSR dev server on `:4321` |
| `pnpm dev:backend` | `pnpm --filter @central-mosque-bogota/backend develop` | Start Strapi v5 CMS in watch mode on `:1337` |
| `pnpm dev:docs` | `pnpm --filter @central-mosque-bogota/docs dev` | Start Starlight documentation portal on `:4322` |
| `pnpm build:frontend` | `pnpm --filter frontend build` | Build Astro 7 SSR production bundle |
| `pnpm build:storybook` | `pnpm --filter frontend build:storybook` | Build static Storybook 10 catalog |
| `pnpm build:docs` | `pnpm --filter @central-mosque-bogota/docs build` | Sync TypeDoc API docs and build Starlight site |
| `pnpm test:unit` | `pnpm --filter frontend test:unit --run` | Run frontend unit & Astro Container test suite |
| `pnpm test:coverage` | `pnpm --filter frontend test:unit --run --coverage` | Run frontend unit tests with V8 coverage report |
| `pnpm test:backend` | `pnpm --filter @central-mosque-bogota/backend test` | Run backend config, lifecycle & 10-plugin runtime E2E tests |
| `pnpm verify` | `node ./scripts/verify-all.ts` | Run all monorepo formatting, lint, test, and build gates |
| `pnpm qa:doctor` | `node ./scripts/qa/doctor.ts` | Check Node version, plugin links, Strapi parity & loopback Compose security |
| `pnpm qa:judges` | `node ./scripts/qa/judges.ts` | Run offline adversarial judges (doc `<= 500` lines, 4-locale parity, XSS `set:html`, E2E suite) |
| `pnpm qa:verify` | `node ./scripts/qa/verify.ts` | Run doctor + judges + backend & frontend unit suites; emits `.qa/report.json` & `.qa/dashboard.html` |
| `pnpm qa:report` | `node ./scripts/qa/report.ts` | Aggregate sibling Vicacha repos into multi-repo interactive HTML Control Center |
| `pnpm qa:link:status` | `node ./scripts/qa/link-plugins.ts --status` | Inspect local `file:` vs npm semver mode for `@vicacha-devs/*` plugins & packages |
| `pnpm qa:link:local` / `qa:link:npm` | `node ./scripts/qa/link-plugins.ts --local/--npm` | Switch `@vicacha-devs/*` deps between local sibling repos and `.qa-plugin-versions.json` npm ranges |
| `pnpm qa:dev:local` | `node ./scripts/qa/dev-local.ts` | Watch linked sibling Strapi plugins + run Mosque backend & Astro frontend in one terminal (`-- --plugins=seo,inbox --build-first`) |
| `pnpm qa:docker:up` / `qa:docker:down` | `docker compose -f docker-compose.qa.yml ...` | Start/stop port-isolated `127.0.0.1` QA stack (`5433/6380/8109/1026`) |
| `pnpm qa:smoke` / `pnpm qa:e2e` | `scripts/qa/smoke.ts` / Playwright (`apps/frontend/e2e/`) | Live HTTP route/feed smoke checks & Playwright E2E + WCAG 2.2 AA accessibility suite |

---

## QA Automation, Local/NPM Link Switching & Cross-Repo CI

- **Standalone CI vs. Local Plugin Development**: `scripts/qa/link-plugins.ts` switches all 17 `@vicacha-devs/strapi-plugin-*` packages, root `pnpm.overrides`, and `@vicacha-devs/astro-tiptap-blocks` cleanly between local `file:` paths and published npm versions. `.github/workflows/ci.yml` and `.github/workflows/e2e.yml` automatically fall back to `--npm` when sibling repos are absent, while `.github/workflows/qa-cross-repo.yml` checks out `strapi-v5-extensions` and `astro-tiptap-blocks` together for live cross-repo compatibility verification.
- **Playwright E2E & Accessibility (`apps/frontend/e2e/`)**: Covers 4-locale & Arabic RTL rendering (`i18n-and-rtl.spec.ts`), core pages plus `.ics`/`.xml` feeds (`core-journeys.spec.ts`), and automated WCAG 2.2 AA checks (`accessibility.spec.ts`).
- **Port-Isolated QA Docker Stack**: Copy `.env.qa.example` to `.env.qa` and run `pnpm qa:docker:up` for loopback-only (`127.0.0.1`) Postgres (`5433`), Valkey (`6380`), Typesense (`8109`), and Mailpit (`1026`/`8026`) with zero collision against other local Vicacha projects.

---

## Dependency Notes

- **`@strapi/sdk-plugin` pinned to `6.1.1`** (root `package.json` → `pnpm.overrides`): our `@vicacha-devs/strapi-plugin-*` packages accept `^5.0.0 || ^6.0.0`, but third-party plugins declare conflicting peer ranges — `strapi-plugin-navigation`, `strapi-plugin-preview-button`, `strapi-plugin-email-designer-5` and `@sensinum/strapi-utils` want `^5.x`, while `@juadariasmar/strapi-plugin-typesense` and `strapi-plugin-form-builder-cms` want `^6.x`. The override resolves the "Conflicting peer dependencies" warning by installing a single version. The `^5`-only plugins run on v6 outside their declared range, so re-run `pnpm test:backend` and start the backend after bumping any of them, and remove the override once they support v6.
- **`file:../strapi-v5-extensions/...` overrides** (`calendar`, `bookings`, `certificates`): the local plugins depend on each other with `workspace:*`, which only resolves inside the `strapi-v5-extensions` workspace. Check out that repository next to this one before running `pnpm install`.

---

## License

**Private & Proprietary**
© Central Mosque of Bogotá (Abu Bakr As-Siddiq). All rights reserved.
