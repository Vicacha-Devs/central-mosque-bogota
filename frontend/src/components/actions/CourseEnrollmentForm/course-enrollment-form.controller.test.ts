import { createTestDom } from "@utils/test.helpers";
import { describe, expect, it, vi } from "vitest";

import { initCourseEnrollmentForm } from "./course-enrollment-form.controller";

describe("initCourseEnrollmentForm", () => {
  it("should submit course enrollment payload when form is submitted", async () => {
    const { close } = createTestDom(`
      <form
        id="course-enrollment-form"
        data-course-title="Árabe Clásico"
        data-locale="es"
        data-submit-label="Inscribirme"
        data-submitting-label="Enviando..."
        data-success-msg="Inscripción recibida"
        data-error-msg="Error"
      >
        <input name="fullName" value="Sara" />
        <input name="email" value="sara@example.com" />
        <input name="phone" value="+573001234567" />
        <input name="modality" value="hybrid" />
        <textarea name="message">Horario sabatino</textarea>
        <button type="submit" id="course-enrollment-submit">
          <span id="course-enrollment-submit-label">Inscribirme</span>
        </button>
      </form>
      <div id="course-enrollment-feedback" class="hidden"></div>
    `);

    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true, referenceCode: "MSG-555" }), {
        status: 201,
      })
    );

    try {
      initCourseEnrollmentForm();

      const form = document.getElementById(
        "course-enrollment-form"
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
          document.getElementById("course-enrollment-feedback")?.textContent
        ).toContain("Inscripción recibida (MSG-555)");
      });

      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: false }), { status: 400 })
      );
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
      await vi.waitFor(() => {
        expect(
          document.getElementById("course-enrollment-feedback")?.textContent
        ).toBe("Error");
      });

      fetchMock.mockRejectedValueOnce(new Error("Offline"));
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
      await vi.waitFor(() => {
        expect(
          document.getElementById("course-enrollment-feedback")?.textContent
        ).toBe("Error");
      });
    } finally {
      fetchMock.mockRestore();
      await close();
    }
  });
});
