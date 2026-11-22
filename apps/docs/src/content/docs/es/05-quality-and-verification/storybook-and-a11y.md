---
title: Guía de Storybook 10 y Accesibilidad (WCAG)
description: Cómo desarrollar, previsualizar y auditar componentes en Storybook 10 en modos claro/oscuro y direcciones LTR/RTL.
---

## 1. Configuración de Storybook 10 (`apps/frontend/.storybook/`)

Nuestro entorno Storybook utiliza `@storybook-astro/framework` (`1.17.0`) y `storybook` (`10.6.5`) para renderizar componentes `.astro` nativos directamente sobre Vite.

| Addon | Paquete | Propósito |
| :--- | :--- | :--- |
| **Accesibilidad** | `@storybook/addon-a11y` | Ejecuta auditorías automatizadas WCAG 2.1 AA con `axe-core` en cada historia |
| **Dirección RTL** | `storybook-addon-rtl` | Alterna `dir="ltr"` y `dir="rtl"` en el iframe de previsualización |
| **Temas** | `@storybook/addon-themes` | Alterna entre tema Claro y Oscuro (`data-theme` / `.dark`) |
| **Documentación** | `@storybook/addon-docs` | Genera tablas interactivas de propiedades y páginas Autodocs |
| **Vitest** | `@storybook/addon-vitest` | Ejecuta historias como pruebas de interacción en navegador con Playwright |

---

## 2. Ejecución y Compilación de Storybook

```bash
cd apps/frontend

# Iniciar servidor interactivo en http://localhost:6006
pnpm storybook

# Compilar paquete estático en apps/frontend/storybook-static/
./node_modules/.bin/storybook build
```

---

## 3. Viewports y Sincronización RTL

- **Viewports (`.storybook/constants.ts`)**: `Mobile Small (320px)`, `Mobile (365px)`, `Tablet (768px)`, `Desktop (1024px)` y `Desktop Wide (1440px)` están configurados en `CUSTOM_VIEW_PORTS`.
- **Selector RTL en Barra Superior (`.storybook/preview.ts`)**: `applyDocumentDirection` sincroniza `globals.addonRtl` (`"ltr"` / `"rtl"`) sobre `document.documentElement.dir`, `document.body.dir` y `#storybook-root.dir` mediante el canal de globals y el decorador de preview para que las reglas `[dir="rtl"]` y las utilidades `rtl:` de Tailwind funcionen en todas las historias Astro.

---

## 4. Auditorías E2E de Página Completa WCAG 2.2 AA y RTL (`apps/frontend/e2e/`)

Además de `addon-a11y` por componente en Storybook, ejecuta auditorías completas en Chromium con Playwright desde la raíz del monorepo:

```bash
pnpm qa:e2e
```

- **`apps/frontend/e2e/accessibility.spec.ts`**: Ejecuta `@axe-core/playwright` (`wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa`) y validaciones de navegación por teclado en páginas localizadas.
- **`apps/frontend/e2e/i18n-and-rtl.spec.ts`**: Verifica `<html lang="ar" dir="rtl">`, ausencia de desbordamiento horizontal en árabe RTL y enrutamiento en los 4 idiomas (`es`, `en`, `ar`, `tr`).
- **`apps/frontend/e2e/core-journeys.spec.ts`**: Valida flujos interactivos clave (horarios de oración, calculadora de Zakat, feeds BFF y protecciones antispam/validación).
