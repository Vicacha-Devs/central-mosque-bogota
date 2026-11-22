import { expect, test } from "@playwright/test";

const AUDIT_ROUTES = ["/es", "/en", "/ar", "/es/donate", "/es/events-and-programs"];

test.describe("Central Mosque — WCAG 2.2 AA Automated Accessibility Audits", () => {
  for (const route of AUDIT_ROUTES) {
    test(`${route} satisfies landmark, heading, image alt, and label invariants`, async ({
      page,
    }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });

      const audit = await page.evaluate(() => {
        const missingAlt = Array.from(document.querySelectorAll("img"))
          .filter((img) => !img.hasAttribute("alt"))
          .map((img) => img.getAttribute("src") ?? "inline-img");

        const unlabeledInputs = Array.from(
          document.querySelectorAll("input, select, textarea")
        )
          .filter((el) => {
            const input = el as HTMLInputElement;
            if (input.type === "hidden") return false;
            const id = input.id;
            const hasForLabel = id
              ? Boolean(document.querySelector(`label[for="${CSS.escape(id)}"]`))
              : false;
            const hasWrapLabel = Boolean(input.closest("label"));
            const hasAria =
              Boolean(input.getAttribute("aria-label")) ||
              Boolean(input.getAttribute("aria-labelledby"));
            return !hasForLabel && !hasWrapLabel && !hasAria;
          })
          .map((el) => el.outerHTML.slice(0, 80));

        const positiveTabindex = document.querySelectorAll(
          "[tabindex]:not([tabindex='0']):not([tabindex='-1'])"
        ).length;

        return {
          title: document.title.trim(),
          mainCount: document.querySelectorAll("main").length,
          h1Count: document.querySelectorAll("h1").length,
          missingAlt,
          unlabeledInputs,
          positiveTabindex,
        };
      });

      expect(audit.title.length).toBeGreaterThan(0);
      expect(audit.mainCount).toBe(1);
      expect(audit.h1Count).toBeGreaterThanOrEqual(1);
      expect(audit.missingAlt).toEqual([]);
      expect(audit.unlabeledInputs).toEqual([]);
      expect(audit.positiveTabindex).toBe(0);
    });
  }
});
