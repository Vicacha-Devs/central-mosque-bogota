---
title: Storybook 10 & Accessibility (WCAG) Guide
description: How to develop, preview, and audit components in Storybook 10 across themes and LTR/RTL directions.
---

## 1. Storybook 10 Setup (`frontend/.storybook/`)

Our Storybook environment uses `@storybook-astro/framework` (`1.8.0`) and `storybook` (`10.4.6`) to render native `.astro` components directly in Vite.

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
cd frontend

# Start interactive Storybook server on http://localhost:6006
pnpm storybook

# Build static production Storybook bundle to frontend/storybook-static/
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
