import { createTestDom } from "@utils/test.helpers";
import { describe, expect, it, vi } from "vitest";

import { initDonationSubmissionForm } from "./donation-submission-form.controller";

describe("initDonationSubmissionForm", () => {
  it("should populate utility invoice fields and submit when an invoice chip is clicked", async () => {
    const { close } = createTestDom(`
      <button
        type="button"
        data-invoice-chip
        data-slug="factura-energia"
        data-title="Energía Eléctrica"
        data-amount="450000"
        data-full="true"
      >
        Chip
      </button>
      <div id="selected-invoice-banner" class="hidden">
        <span id="selected-invoice-title"></span>
        <button type="button" id="clear-selected-invoice">Clear</button>
      </div>
      <form
        id="donation-form"
        data-locale="es"
        data-submitting-text="Enviando..."
        data-success-text="¡Registrado!"
        data-error-text="Error"
      >
        <input id="donation-amount" name="amount" value="100000" />
        <select id="donation-currency" name="currency"><option value="COP">COP</option></select>
        <select id="donation-type" name="donationType">
          <option value="sadaqah">Sadaqah</option>
          <option value="utility_bills">Servicios</option>
        </select>
        <select id="donation-campaign-slug" name="campaignSlug">
          <option value="">None</option>
          <option value="factura-energia">Energía</option>
        </select>
        <input id="donation-campaign-kind" name="campaignKind" value="major_campaign" />
        <input type="checkbox" id="donation-covers-remaining" name="coversRemainingInvoice" />
      </form>
      <p id="donation-status" class="hidden"></p>
    `);

    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify({ ok: true, referenceCode: "DON-2026-001" }),
          { status: 201 }
        )
      );

    try {
      initDonationSubmissionForm();

      const chip = document.querySelector<HTMLButtonElement>(
        "[data-invoice-chip]"
      );
      chip?.click();

      expect(
        (document.getElementById("donation-amount") as HTMLInputElement).value
      ).toBe("450000");
      expect(
        (document.getElementById("donation-type") as HTMLSelectElement).value
      ).toBe("utility_bills");
      expect(
        (
          document.getElementById(
            "donation-covers-remaining"
          ) as HTMLInputElement
        ).checked
      ).toBe(true);

      const form = document.getElementById("donation-form") as HTMLFormElement;
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );

      await vi.waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          "/api/submissions",
          expect.objectContaining({ method: "POST" })
        );
        expect(
          document.getElementById("donation-status")?.textContent
        ).toContain("DON-2026-001");
      });

      const clearBtn = document.getElementById("clear-selected-invoice");
      clearBtn?.click();
      expect(
        document
          .getElementById("selected-invoice-banner")
          ?.classList.contains("hidden")
      ).toBe(true);

      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), { status: 200 })
      );
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
      await vi.waitFor(() => {
        expect(document.getElementById("donation-status")?.textContent).toBe(
          "¡Registrado!"
        );
      });

      fetchMock.mockResolvedValueOnce(new Response("bad", { status: 500 }));
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
      await vi.waitFor(() => {
        expect(document.getElementById("donation-status")?.textContent).toBe(
          "Error"
        );
      });

      fetchMock.mockRejectedValueOnce(new Error("Network error"));
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
      await vi.waitFor(() => {
        expect(document.getElementById("donation-status")?.textContent).toBe(
          "Error"
        );
      });
    } finally {
      fetchMock.mockRestore();
      await close();
    }
  });

  it("should handle minimal DOM and default messages when optional elements are omitted", async () => {
    const { close } = createTestDom(`
      <button type="button" data-invoice-chip></button>
      <button type="button" id="clear-selected-invoice"></button>
      <form id="donation-form"></form>
      <p id="donation-status"></p>
    `);

    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), { status: 200 })
      )
      .mockResolvedValueOnce(new Response("err", { status: 500 }))
      .mockRejectedValueOnce(new Error("Offline"));

    try {
      initDonationSubmissionForm();
      initDonationSubmissionForm();

      document.querySelector<HTMLButtonElement>("[data-invoice-chip]")?.click();
      document.getElementById("clear-selected-invoice")?.click();

      const form = document.getElementById("donation-form") as HTMLFormElement;
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
      await vi.waitFor(() => {
        expect(document.getElementById("donation-status")?.textContent).toBe(
          "Registered!"
        );
      });

      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
      await vi.waitFor(() => {
        expect(document.getElementById("donation-status")?.textContent).toBe(
          "Error"
        );
      });

      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
      await vi.waitFor(() => {
        expect(document.getElementById("donation-status")?.textContent).toBe(
          "Error"
        );
      });
    } finally {
      fetchMock.mockRestore();
      await close();
    }
  });
});
