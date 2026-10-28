import { createTestDom } from "@utils/test.helpers";
import { describe, expect, it, vi } from "vitest";

import { initBroadcastSubscriptionForm } from "./community-broadcast-channels.controller";

describe("initBroadcastSubscriptionForm", () => {
  it("should post newsletter subscription and reveal feedback when submitted", async () => {
    const { close } = createTestDom(`
      <form id="mosque-broadcast-subscribe-form">
        <input name="locale" value="es" />
        <input name="email" value="ali@example.com" />
        <input name="phone" value="+573001112233" />
        <input type="checkbox" name="topics" value="jumuah" checked />
      </form>
      <p
        id="mosque-broadcast-subscribe-feedback"
        class="hidden"
        data-success-msg="¡Suscripción confirmada!"
      ></p>
    `);

    const okRes = new Response(JSON.stringify({ ok: true }), { status: 201 });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(okRes);

    try {
      initBroadcastSubscriptionForm();

      const form = document.getElementById(
        "mosque-broadcast-subscribe-form"
      ) as HTMLFormElement;
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );

      await vi.waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          "/api/submissions",
          expect.objectContaining({ method: "POST" })
        );
        const feedback = document.getElementById(
          "mosque-broadcast-subscribe-feedback"
        );
        expect(feedback?.classList.contains("hidden")).toBe(false);
        expect(feedback?.textContent).toBe("¡Suscripción confirmada!");
      });
    } finally {
      fetchMock.mockRestore();
      await close();
    }
  });
});
