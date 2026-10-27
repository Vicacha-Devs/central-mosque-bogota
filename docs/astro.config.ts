import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

import { remarkPele } from "./src/plugins/remark-pele";

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkPele],
  },
  integrations: [
    starlight({
      title: {
        en: "Central Mosque of Bogotá — Engineering & CMS Docs",
        es: "Mezquita Central de Bogotá — Documentación Técnica y CMS",
      },
      defaultLocale: "en",
      locales: {
        en: {
          label: "English",
          lang: "en",
        },
        es: {
          label: "Español",
          lang: "es",
        },
      },
      customCss: ["./src/styles/custom.css"],
      head: [
        {
          tag: "script",
          attrs: {
            src: "/vendor/pele.global.js",
            defer: true,
          },
        },
        {
          tag: "script",
          attrs: {
            src: "/vendor/pele-init.js",
            defer: true,
          },
        },
      ],
      sidebar: [
        {
          label: "1. Getting Started & Onboarding",
          translations: { es: "1. Inicio Rápido y Onboarding" },
          items: [
            {
              slug: "01-getting-started/jr-dev-summary",
              label: "Jr. Dev Executive Summary",
              translations: { es: "Resumen Ejecutivo (Jr. Devs)" },
            },
            {
              slug: "01-getting-started/onboarding-guide",
              label: "Step-by-Step Onboarding",
              translations: { es: "Guía de Onboarding Paso a Paso" },
            },
            {
              slug: "01-getting-started/learning-roadmap",
              label: "4-Tier Learning Roadmap & Tutorials",
              translations: { es: "Ruta de Aprendizaje (4 Niveles) y YouTube" },
            },
            {
              slug: "01-getting-started/environment-setup",
              label: "Environment & Local Stack",
              translations: { es: "Variables de Entorno y Stack Local" },
            },
          ],
        },
        {
          label: "2. Architecture & ADRs",
          translations: { es: "2. Arquitectura y ADRs" },
          items: [
            {
              slug: "02-architecture/system-overview",
              label: "System Architecture Overview",
              translations: { es: "Visión General del Sistema" },
            },
            {
              slug: "02-architecture/frontend-astro-ssr",
              label: "Astro 7 SSR & Content Layers",
              translations: { es: "Astro 7 SSR y Capas de Contenido" },
            },
            {
              slug: "02-architecture/backend-strapi-v5",
              label: "Strapi v5 Headless CMS",
              translations: { es: "CMS Headless Strapi v5" },
            },
            {
              slug: "02-architecture/i18n-and-rtl",
              label: "4-Locale i18n & Arabic RTL",
              translations: { es: "i18n en 4 Idiomas y RTL Árabe" },
            },
            {
              slug: "02-architecture/adrs",
              label: "Architecture Decision Records",
              translations: { es: "Registros de Decisiones (ADRs)" },
            },
          ],
        },
        {
          label: "3. Frontend Deep Dive",
          translations: { es: "3. Frontend en Detalle" },
          items: [
            {
              slug: "03-frontend/components-and-starwind",
              label: "Component Taxonomy & Controllers",
              translations: { es: "Taxonomía de Componentes y Controladores" },
            },
            {
              slug: "03-frontend/content-loaders-and-mocks",
              label: "Resilient Strapi Loaders & Mocks",
              translations: { es: "Loaders Resilientes y Mocks" },
            },
            {
              slug: "03-frontend/islamic-api-and-prayer-engine",
              label: "IslamicAPI, Prayer & Zakat Engine",
              translations: { es: "Motor IslamicAPI, Oración y Zakat" },
            },
            {
              slug: "03-frontend/bff-endpoints-and-forms",
              label: "BFF API Endpoints & Forms",
              translations: { es: "Endpoints BFF y Formularios" },
            },
            {
              slug: "03-frontend/tiptap-rich-text",
              label: "Tiptap Blocks & Sanitization",
              translations: { es: "Bloques Tiptap y Sanitización" },
            },
          ],
        },
        {
          label: "4. Backend & Strapi Plugins",
          translations: { es: "4. Backend y Plugins Strapi" },
          items: [
            {
              slug: "04-backend-and-plugins/content-types-and-schemas",
              label: "17 Content-Types & Schemas",
              translations: { es: "17 Content-Types y Esquemas" },
            },
            {
              slug: "04-backend-and-plugins/vicacha-strapi-plugins",
              label: "10 Custom Strapi v5 Extensions",
              translations: { es: "10 Extensiones Strapi v5 Propias" },
            },
            {
              slug: "04-backend-and-plugins/bootstrap-and-permissions",
              label: "Bootstrap Seeding & Permissions",
              translations: { es: "Semilla Inicial y Permisos" },
            },
          ],
        },
        {
          label: "5. Verification TODO & QA",
          translations: { es: "5. TODO de Verificación y QA" },
          items: [
            {
              slug: "05-quality-and-verification/verification-todo-checklist",
              label: "Verification TODO Checklist",
              translations: { es: "Checklist TODO de Verificación" },
            },
            {
              slug: "05-quality-and-verification/testing-and-coverage",
              label: "Unit Testing & Coverage Guide",
              translations: { es: "Pruebas Unitarias y Cobertura" },
            },
            {
              slug: "05-quality-and-verification/storybook-and-a11y",
              label: "Storybook 10 & Accessibility",
              translations: { es: "Storybook 10 y Accesibilidad" },
            },
            {
              slug: "05-quality-and-verification/operational-runbook",
              label: "Operational & Deployment Runbook",
              translations: { es: "Runbook Operativo y Despliegue" },
            },
          ],
        },
        {
          label: "6. Editorial & CMS Handbook",
          translations: { es: "6. Manual Editorial del CMS" },
          items: [
            {
              slug: "06-editorial-guide/cms-editor-handbook",
              label: "Mosque Staff Strapi v5 Guide",
              translations: { es: "Guía de Strapi v5 para el Equipo" },
            },
          ],
        },
        {
          label: "7. TypeDoc API Reference",
          translations: { es: "7. Referencia API (TypeDoc)" },
          items: [
            {
              slug: "api/overview",
              label: "TypeScript API Reference",
              translations: { es: "Referencia de Módulos TypeScript" },
            },
          ],
        },
      ],
    }),
  ],
});
