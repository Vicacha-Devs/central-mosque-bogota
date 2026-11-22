import { expect, test } from "@playwright/test";

const LOCALES = [
  { code: "es", dir: "ltr" },
  { code: "en", dir: "ltr" },
  { code: "ar", dir: "rtl" },
  { code: "tr", dir: "ltr" },
] as const;

test.describe("Central Mosque — Multilingual & RTL Parity", () => {
  for (const locale of LOCALES) {
    test(`/${locale.code} renders cleanly with dir="${locale.dir}" and no overflow`, async ({
      page,
    }) => {
      const pageErrors: Array<string> = [];
      page.on("pageerror", (err) => pageErrors.push(err.message));

      const response = await page.goto(`/${locale.code}`, {
        waitUntil: "domcontentloaded",
      });
      expect(response?.status()).toBe(200);

      const html = page.locator("html");
      await expect(html).toHaveAttribute("lang", new RegExp(`^${locale.code}`, "i"));
      await expect(html).toHaveAttribute("dir", locale.dir);

      const hasMain = await page.locator("main").count();
      expect(hasMain).toBe(1);

      const overflowPx = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth
      );
      expect(overflowPx).toBeLessThanOrEqual(4);
      expect(pageErrors).toEqual([]);
    });
  }
});
