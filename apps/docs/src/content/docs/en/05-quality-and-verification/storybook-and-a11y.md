---
title: Storybook 10 & Accessibility (WCAG) Guide
description: How to develop, preview, and audit components in Storybook 10 across themes and LTR/RTL directions.
---

## 1. Storybook 10 Setup (`apps/frontend/.storybook/`)

Our Storybook environment uses `@storybook-astro/framework` (`1.17.0`) and `storybook` (`10.6.5`) to render native `.astro` components directly in Vite.

| Addon | Package | Purpose |
| :--- | :--- | :--- |
| **Accessibility** | `@storybook/addon-a11y` | Runs automated `axe-core` WCAG 2.1 AA audits on every story |
| **RTL Direction** | `storybook-addon-rtl` | Toggles `dir="ltr"` and `dir="rtl"` in the Storybook preview iframe |
| **Themes** | `@storybook/addon-themes` | Toggles Light and Dark themes (`data-theme` / `.dark`) |
| **Docs** | `@storybook/addon-docs` | Generates interactive args tables and Autodocs documentation |
| **Vitest** | `@storybook/addon-vitest` | Runs stories as browser interaction tests via Playwright |

---

## 2. Running & Building Storybook

```bash
cd apps/frontend

# Start interactive Storybook server on http://localhost:6006
pnpm storybook

# Build static production Storybook bundle to apps/frontend/storybook-static/
./node_modules/.bin/storybook build
```

---

## 3. Writing a New Component Story (`*.stories.ts`)

Place your `.stories.ts` file next to the `.astro` component:

```ts
import { getLocalizedMocks } from "@utils/localized-mocks";
import MyComponent from "./MyComponent.astro";

export default {
  title: "Data Display/MyComponent",
  component: MyComponent,
  tags: ["autodocs"],
};

export const SpanishDefault = {
  args: {
    lang: "es",
    items: getLocalizedMocks("es").events,
  },
};

export const ArabicRTL = {
  args: {
    lang: "ar",
    items: getLocalizedMocks("ar").events,
  },
};
```

---

## 4. Viewports & RTL Synchronization

- **Viewports (`.storybook/constants.ts`)**: `Mobile Small (320px)`, `Mobile (365px)`, `Tablet (768px)`, `Desktop (1024px)`, and `Desktop Wide (1440px)` are configured in `CUSTOM_VIEW_PORTS`.
- **RTL Toolbar Toggle (`.storybook/preview.ts`)**: `applyDocumentDirection` syncs `globals.addonRtl` (`"ltr"` / `"rtl"`) onto `document.documentElement.dir`, `document.body.dir`, and `#storybook-root.dir` via Storybook's globals channel and preview decorator so `[dir="rtl"]` CSS and Tailwind `rtl:` utilities work across Astro stories.

---

## 5. Full-Page Playwright WCAG 2.2 AA & RTL E2E Audits (`apps/frontend/e2e/`)

In addition to component-level Storybook `addon-a11y`, run full-page Chromium browser audits via Playwright from the monorepo root:

```bash
pnpm qa:e2e
```

- **`apps/frontend/e2e/accessibility.spec.ts`**: Runs `@axe-core/playwright` (`wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa`) and keyboard-landmark assertions across localized pages.
- **`apps/frontend/e2e/i18n-and-rtl.spec.ts`**: Verifies `<html lang="ar" dir="rtl">` mirroring, zero horizontal overflow in Arabic RTL, and 4-locale routing (`es`, `en`, `ar`, `tr`).
- **`apps/frontend/e2e/core-journeys.spec.ts`**: Exercises interactive mosque journeys (prayer times, Zakat calculator, BFF feeds, and honeypot/validation guards).
