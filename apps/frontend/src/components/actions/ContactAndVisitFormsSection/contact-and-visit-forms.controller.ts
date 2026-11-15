import { bindJsonFormSubmission } from "@utils/form-submission.utils";

function bindSubmissionForm(
  formId: string,
  statusId: string,
  formType: "contact" | "visit"
): void {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  const statusEl = document.getElementById(statusId);
  if (!form || !statusEl) return;

  bindJsonFormSubmission({
    form,
    statusEl,
    buildPayload: (formData, currentForm) => {
      const payload: Record<string, unknown> = {
        formType,
        locale: currentForm.getAttribute("data-locale") ?? "es",
      };
      formData.forEach((value, key) => {
        payload[key] = value;
      });
      return payload;
    },
    getMessages: (currentForm) => ({
      sending:
        currentForm.getAttribute("data-sending-text")
        ?? "Enviando solicitud...",
      error:
        currentForm.getAttribute("data-error-text")
        ?? "Por favor verifica los campos obligatorios e inténtalo de nuevo.",
      formatSuccess: () =>
        currentForm.getAttribute("data-success-text")
        ?? "¡Gracias! Tu mensaje ha sido registrado en nuestro sistema.",
    }),
  });
}

/**
 * Initializes the general contact and guided visit booking forms.
 */
export function initContactAndVisitForms(): void {
  bindSubmissionForm("contact-form", "contact-status", "contact");
  bindSubmissionForm("visit-form", "visit-status", "visit");
}
