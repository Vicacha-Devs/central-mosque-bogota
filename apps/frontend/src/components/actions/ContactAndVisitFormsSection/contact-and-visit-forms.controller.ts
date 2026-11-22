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
        currentForm.getAttribute("data-sending-text") ??
        "Enviando solicitud...",
      error:
        currentForm.getAttribute("data-error-text") ??
        "Por favor verifica los campos obligatorios e inténtalo de nuevo.",
      formatSuccess: () =>
        currentForm.getAttribute("data-success-text") ??
        "¡Gracias! Tu mensaje ha sido registrado en nuestro sistema.",
    }),
  });
}

function bindDynamicVisitSlots(): void {
  const visitForm = document.getElementById(
    "visit-form"
  ) as HTMLFormElement | null;
  const dateInput = document.getElementById(
    "visit-date"
  ) as HTMLInputElement | null;
  const sizeInput = document.getElementById(
    "visit-size"
  ) as HTMLInputElement | null;
  const slotSelect = document.getElementById(
    "visit-slot"
  ) as HTMLSelectElement | null;
  if (!visitForm || !dateInput || !slotSelect) return;
  if (dateInput.getAttribute("data-slots-bound") === "true") return;
  dateInput.setAttribute("data-slots-bound", "true");

  const defaultOptions = Array.from(slotSelect.options).map((opt) => ({
    value: opt.value,
    label: opt.textContent,
  }));

  const renderOptions = (options: Array<{ value: string; label: string }>) => {
    const prevValue = slotSelect.value;
    slotSelect.replaceChildren();
    for (const opt of options) {
      const el = document.createElement("option");
      el.value = opt.value;
      el.textContent = opt.label;
      if (opt.value === prevValue) el.selected = true;
      slotSelect.appendChild(el);
    }
  };

  let activeController: AbortController | null = null;

  const refreshSlots = async () => {
    const date = dateInput.value.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      activeController?.abort();
      activeController = null;
      renderOptions(defaultOptions);
      return;
    }
    activeController?.abort();
    const controller = new AbortController();
    activeController = controller;

    const locale = visitForm.getAttribute("data-locale") ?? "es";
    const partySize = Math.max(1, Number(sizeInput?.value ?? 1) || 1);
    try {
      const res = await fetch(
        `/api/bookings/available-slots?date=${encodeURIComponent(date)}&partySize=${encodeURIComponent(String(partySize))}&locale=${encodeURIComponent(locale)}`,
        { signal: controller.signal }
      );
      if (!res.ok) return;
      const data = (await res.json()) as {
        slots?: Array<{ value: string; label: string }> | null;
      };
      if (controller.signal.aborted) return;
      if (Array.isArray(data.slots) && data.slots.length > 0) {
        renderOptions(data.slots);
      } else {
        renderOptions(defaultOptions);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      renderOptions(defaultOptions);
    }
  };

  dateInput.addEventListener("change", () => {
    void refreshSlots();
  });
  sizeInput?.addEventListener("change", () => {
    if (dateInput.value.trim()) {
      void refreshSlots();
    }
  });
}

/**
 * Initializes the general contact and guided visit booking forms.
 */
export function initContactAndVisitForms(): void {
  bindSubmissionForm("contact-form", "contact-status", "contact");
  bindSubmissionForm("visit-form", "visit-status", "visit");
  bindDynamicVisitSlots();
}
