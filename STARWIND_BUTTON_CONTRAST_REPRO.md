# How to Create a Minimal Reproducible Example for Starwind `Button` Contrast Issues

Upstream Starwind UI (`starwind-ui/starwind-ui`) closed PR `#285` (`feat(button): add outline-inverse and ghost-inverse variants`) as **not planned**, noting:

> If a contrast problem persists with the standard styles, please share a minimal reproduction, installed version, and theme values so we can assess it separately.

Use the steps below if you need to file a minimal reproduction for standard `Button` (`variant="outline"` / `variant="ghost"`) contrast behavior.

---

## 1. Project Metadata to Include

- **Framework / Styling:** Astro + Tailwind CSS v4
- **Installed Starwind `button` version** (from `apps/frontend/starwind.config.json`): `2.3.2`
- **Relevant theme values** (from `apps/frontend/src/styles/global.css`):

```css
:root {
  --background: #f7f8fb;
  --foreground: #0f172a;
  --secondary: #212e80;
  --secondary-foreground: #ffffff;
  --muted: #eef1f6;
  --input: #cbd3e1;
  --outline: #212e80;
}

.dark,
[data-theme="dark"] {
  --background: #11131a;
  --foreground: #f4f2ec;
  --secondary: #212e80;
  --secondary-foreground: #ffffff;
  --muted: #222634;
  --input: #343a4f;
  --outline: #93c5fd;
}
```

---

## 2. Minimal Reproduction Steps

1. Create a minimal Astro + Tailwind CSS v4 project (e.g., on StackBlitz or a clean local repo).
2. Install Starwind `button` (`2.3.2`) via the Starwind CLI (`pnpm dlx starwind@latest add button`).
3. Copy only the `:root` / `.dark` CSS custom properties above into `src/styles/global.css`.
4. Render `Button` inside a dark container that sets `text-white` in `src/pages/index.astro`:

```astro
---
import { Button } from "@/components/starwind/button";
---

<main class="p-8 space-y-6">
  <!-- Light surface (expected baseline) -->
  <section class="p-6 border rounded-lg space-x-4">
    <Button variant="outline">Outline (light)</Button>
    <Button variant="ghost">Ghost (light)</Button>
  </section>

  <!-- Dark surface without .dark scope: demonstrates contrast failures -->
  <section class="bg-secondary p-6 rounded-lg text-white space-x-4">
    <!-- 1. outline sets bg-background (#f7f8fb) without text-foreground,
            so it inherits text-white on #f7f8fb (unreadable in light mode).
         2. focus-visible:ring-outline/50 uses --outline (#212e80),
            which matches bg-secondary (#212e80). -->
    <Button variant="outline">Outline (dark surface)</Button>

    <!-- focus-visible:ring-outline/50 (#212e80/50) is invisible on bg-secondary -->
    <Button variant="ghost">Ghost (dark surface)</Button>
  </section>
</main>
```

---

## 3. What to Report in the GitHub Issue

- Link to the minimal StackBlitz / GitHub repo.
- State the installed `button` version (`2.3.2`) and paste the `:root` / `.dark` CSS variables above.
- Specifically note the root cause observed in `button/variants.ts`:
  - `outline` sets `bg-background` without setting a default `text-foreground` (only `hover:text-foreground`), so inheriting `text-white` from a dark parent container produces white text on a light background (`#f7f8fb`).
  - `outline` and `ghost` rely on `--outline` for `focus-visible`, which must be overridden (or scoped via `.dark`) whenever the surface background is dark.
