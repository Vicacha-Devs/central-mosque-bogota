import { createTestDom } from "@utils/test.helpers";
import { describe, expect, test, vi } from "vitest";

import { initContactAndVisitForms } from "./contact-and-visit-forms.controller";

describe("contact-and-visit-forms.controller", () => {
  test("submits contact and visit forms to /api/submissions and updates status text", async () => {
    const { root, close } = createTestDom(`
      <form id="contact-form" data-locale="en" data-sending-text="Sending..." data-success-text="Contact Sent!" data-error-text="Failed">
        <input name="fullName" value="Tariq" />
        <input name="email" value="tariq@example.com" />
        <textarea name="message">Assalamu Alaikum</textarea>
      </form>
      <p id="contact-status" class="hidden"></p>

      <form id="visit-form" data-locale="en" data-sending-text="Sending..." data-success-text="Visit Booked!" data-error-text="Failed">
        <input name="visitorName" value="Dr. Gomez" />
        <input name="email" value="gomez@uni.edu" />
      </form>
      <p id="visit-status" class="hidden"></p>
    `);

    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    initContactAndVisitForms();

    const contactForm = root.querySelector("#contact-form");
    contactForm?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );
    await new Promise((r) => setTimeout(r, 15));

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/submissions",
      expect.objectContaining({ method: "POST" })
    );
    expect(root.querySelector("#contact-status")?.textContent).toBe(
      "Contact Sent!"
    );

    const visitForm = root.querySelector("#visit-form");
    visitForm?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );
    await new Promise((r) => setTimeout(r, 15));

    expect(root.querySelector("#visit-status")?.textContent).toBe(
      "Visit Booked!"
    );

    fetchMock.mockResolvedValueOnce({ ok: false });
    contactForm?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );
    await new Promise((r) => setTimeout(r, 15));
    expect(root.querySelector("#contact-status")?.textContent).toBe("Failed");

    fetchMock.mockRejectedValueOnce(new Error("Offline"));
    visitForm?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );
    await new Promise((r) => setTimeout(r, 15));
    expect(root.querySelector("#visit-status")?.textContent).toBe("Failed");

    await close();
  });
});
