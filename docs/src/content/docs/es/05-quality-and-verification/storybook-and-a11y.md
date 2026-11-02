---
title: Guía de Storybook 10 y Accesibilidad (WCAG)
description: Cómo desarrollar, previsualizar y auditar componentes en Storybook 10 en modos claro/oscuro y direcciones LTR/RTL.
---

## 1. Configuración de Storybook 10 (`frontend/.storybook/`)

Nuestro entorno Storybook utiliza `@storybook-astro/framework` (`1.8.0`) y `storybook` (`10.4.6`) para renderizar componentes `.astro` nativos directamente sobre Vite.

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
cd frontend

# Iniciar servidor interactivo en http://localhost:6006
pnpm storybook

# Compilar paquete estático en frontend/storybook-static/
./node_modules/.bin/storybook build
```
