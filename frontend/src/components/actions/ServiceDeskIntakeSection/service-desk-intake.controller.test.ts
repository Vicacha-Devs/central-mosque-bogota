import { createTestDom } from "@utils/test.helpers";
import { describe, expect, it, vi } from "vitest";

import { initServiceDeskIntake } from "./service-desk-intake.controller";

describe("initServiceDeskIntake", () => {
  it("should update checklist items and post payload when service type changes", async () => {
    const { close } = createTestDom(`
      <div
        id="service-desk-checklist-card"
        data-checklists='${JSON.stringify({
          nikah: ["Documento de identidad", "Dos testigos"],
          shahada: ["Cita con el Imán"],
        })}'
      >
        <ul id="service-desk-checklist-items"></ul>
      </div>
      <form
        id="service-desk-form"
        data-locale="es"
        data-sending="Enviando..."
        data-success-prefix="Radicado:"
        data-error="Error"
      >
        <select id="sd-service-type" name="serviceType">
          <option value="nikah">Nikah</option>
          <option value="shahada">Shahada</option>
        </select>
        <input name="requesterName" value="Ahmad" />
      </form>
      <div id="service-desk-status"></div>
    `);

    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true, referenceCode: "SD-901" }), {
        status: 201,
      })
    );

    try {
      initServiceDeskIntake();

      const selectEl = document.getElementById(
        "sd-service-type"
      ) as HTMLSelectElement;
      selectEl.value = "shahada";
      selectEl.dispatchEvent(new Event("change"));

      const listItems = document.querySelectorAll(
        "#service-desk-checklist-items li"
      );
      expect(listItems).toHaveLength(1);
      expect(listItems[0].textContent).toContain("Cita con el Imán");

      const form = document.getElementById(
        "service-desk-form"
      ) as HTMLFormElement;
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );

      await vi.waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          "/api/submissions",
          expect.objectContaining({ method: "POST" })
        );
        expect(
          document.getElementById("service-desk-status")?.textContent
        ).toContain("SD-901");
      });

      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: false }), { status: 400 })
      );
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
      await vi.waitFor(() => {
        expect(
          document.getElementById("service-desk-status")?.textContent
        ).toBe("Error");
      });

      fetchMock.mockRejectedValueOnce(new Error("Offline"));
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
      await vi.waitFor(() => {
        expect(
          document.getElementById("service-desk-status")?.textContent
        ).toBe("Error");
      });
    } finally {
      fetchMock.mockRestore();
      await close();
    }
  });
});
