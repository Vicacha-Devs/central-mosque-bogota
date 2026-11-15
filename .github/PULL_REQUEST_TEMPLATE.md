## Summary

<!-- Provide a concise description of what this PR accomplishes and why. -->

## Related Issue(s)

<!-- Link related GitHub issues or tickets, e.g. Closes #123 -->
- Closes #

## Type of Change

- [ ] `feat`: New feature (frontend route/component, BFF endpoint, or Strapi schema/plugin)
- [ ] `fix`: Bug fix
- [ ] `docs`: Documentation update (`docs/` Starlight site or repository READMEs)
- [ ] `style`: UI/UX styling, Tailwind CSS v4 tokens, or RTL layout adjustment
- [ ] `refactor`: Code refactoring without functional changes
- [ ] `perf`: Performance or caching improvement
- [ ] `test`: Unit (Vitest), component (Storybook), or E2E (Playwright) tests
- [ ] `build` / `ci` / `chore`: Build, dependencies, Docker, or CI/CD configuration

## Affected Workspaces & Areas

- [ ] **Frontend** (`frontend/` — Astro 6 SSR, Components, Pages, Stores)
- [ ] **Backend** (`backend/` — Strapi v5 Content Types, Components, Seed, Plugins)
- [ ] **Documentation** (`docs/` — Astro Starlight documentation portal)
- [ ] **Infrastructure** (`docker-compose.yml`, CI workflows, root scripts)

## Architecture & Quality Checklist

### Code Quality & Verification
- [ ] `pnpm verify` passes from the repository root (markdown line budget `<= 500` lines, `oxfmt --check`, `eslint`, `astro check`, unit tests + coverage, production build, Storybook build, and docs build)
- [ ] All modified source and documentation files remain under the **500-line modularity budget**

### Internationalization (4-Locale Parity) & RTL
- [ ] Translation keys added/updated across **all 4 locales**: `es`, `en`, `ar`, and `tr` (`frontend/src/i18n/locales/*.json`)
- [ ] Layout uses **logical CSS properties** (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`, `text-end`) and renders properly in Arabic (`dir="rtl"`)

### Resilience, Security & Accessibility
- [ ] If touching Strapi or Islamic API integrations, offline fallback mocks (`frontend/src/utils/*-mocks.ts`) are updated so SSR never crashes when backends are unreachable
- [ ] No unsanitized `set:html` usage introduced; BFF endpoints validate input with **Zod** and enforce rate-limiting/CSRF checks
- [ ] Interactive UI meets **WCAG 2.2 AA** contrast, keyboard navigation, and ARIA semantics in both light and dark modes

## Screenshots / Visual Evidence (if applicable)

| Light Mode (LTR - `es`/`en`) | Dark Mode (LTR) | Arabic RTL (`ar`) |
| :---: | :---: | :---: |
| <!-- Screenshot --> | <!-- Screenshot --> | <!-- Screenshot --> |

## How to Test

1. 
2. 
3. 
