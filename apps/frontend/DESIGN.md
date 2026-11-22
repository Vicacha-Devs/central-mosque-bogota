# DESIGN.md — Central Mosque of Bogotá (`apps/frontend`)

## Visual Direction

Editorial-architectural clarity grounded in Bogotá's Central Mosque: deep sapphire blue (`--secondary`) and warm sand (`--surface-sand`) carry structure and calm, while crimson (`--primary`) is reserved for high-intent calls to action, urgent alerts, and active prayer/date indicators.

## Color Tokens (`src/styles/global.css`)

- **Brand**: `--primary: #c13026`, `--secondary: #212e80`
- **Surfaces (Light)**: `--background: #f7f8fb`, `--card: #ffffff`, `--surface-sand: #f6f5f1`
- **Surfaces (Dark)**: `--background: #11131a`, `--card: #181b25`, `--surface-sand: #151822`
- **Theme Contract**: `color-scheme: light dark` with `[data-theme="light"|"dark"]` and `prefers-color-scheme: dark` synchronization. Always pair `--card` / `--secondary` / `--primary` with their `-foreground` tokens.

## Typography

- **Display & Headings**: `Plus Jakarta Sans` (`--font-display`), balanced headings (`text-wrap: balance`).
- **Body**: `Public Sans` (`--font-sans`), `text-wrap: pretty`.
- **Arabic / RTL**: `--font-arabic` & `--font-arabic-serif` activated via `:lang(ar), [dir="rtl"]`.
- **Numerals**: `tabular-nums` enforced on all `<time>`, countdowns, calendar days, and COP currency amounts.

## Key Layout Patterns

- **Centered Full-Bleed Hero (`HeroHijri.astro`)**: Full-bleed mosque photo (`fetchpriority="high"`, responsive `widths`/`sizes`) with `.hero-overlay` vertical sapphire gradient scrim (`from-secondary/55 via-secondary/75 to-secondary/95`), centered headline/phrase/CTAs, and bottom clearance (`pb-28 sm:pb-32 lg:pb-36`) for the overlapping `DailyPrayTime` card.
- **Alternating Surface Rhythm**: Alternate `--background` with `bg-surface-sand` (`rounded-3xl p-6 sm:p-10`) on major homepage and catalog bands (`CommunityServicesSection`, `NextEventsSection`, `EventsCatalogSection`).
- **Events `Lista | Calendario` (`EventsCatalogSection.astro`)**: Segmented `tablist` synced with category filters; 7-column monthly grid on `md+`, compact dot-marked calendar + daily agenda on `< md`.
- **Zakat Sticky Summary (`ZakatCalculatorSection.astro`)**: `lg:sticky lg:top-24` summary rail with `min-w-0 break-words tabular-nums` to prevent large COP overflow.
- **Donation Transparency (`DonationImpactSection.astro`)**: Progress bar paired with `90% Programs / 10% Admin` trust callouts.
