import { createTestDom } from "@utils/test.helpers";
import { describe, expect, it, vi } from "vitest";

import { initFooterNewsletter } from "./footer-newsletter.controller";

describe("initFooterNewsletter", () => {
  it("should submit newsletter payload and render confirmation when form is submitted", async () => {
    const { root, close } = createTestDom(`
      <form id="footer-newsletter-form" data-locale="es">
        <input name="email" value="comunidad@mezquitabogota.org" />
        <input name="website" value="" />
        <button type="submit">Subscribe</button>
      </form>
      <p id="footer-newsletter-status" class="hidden"></p>
    `);

    const okRes = new Response(JSON.stringify({ ok: true }), { status: 200 });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(okRes);

    try {
      initFooterNewsletter(root);

      const form = root.querySelector<HTMLFormElement>(
        "#footer-newsletter-form"
      );
      form?.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );

      await vi.waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          "/api/submissions",
          expect.objectContaining({
            method: "POST",
          })
        );
        expect(
          root.querySelector("#footer-newsletter-status")?.textContent
        ).toContain("¡Suscrito!");
      });
    } finally {
      fetchMock.mockRestore();
      await close();
    }
  });

  it("should render localized invalid email message when server responds with 400", async () => {
    const { root, close } = createTestDom(`
      <form
        id="footer-newsletter-form"
        data-locale="en"
        data-invalid-msg="Invalid email address."
      >
        <input name="email" value="invalid" />
        <input name="website" value="" />
        <button type="submit">Subscribe</button>
      </form>
      <p id="footer-newsletter-status" class="hidden"></p>
    `);

    const badRes = new Response(JSON.stringify({ ok: false }), { status: 400 });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(badRes);

    try {
      initFooterNewsletter(root);
      const form = root.querySelector<HTMLFormElement>(
        "#footer-newsletter-form"
      );
      form?.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );

      await vi.waitFor(() => {
        expect(
          root.querySelector("#footer-newsletter-status")?.textContent
        ).toBe("Invalid email address.");
      });
    } finally {
      fetchMock.mockRestore();
      await close();
    }
  });
});
