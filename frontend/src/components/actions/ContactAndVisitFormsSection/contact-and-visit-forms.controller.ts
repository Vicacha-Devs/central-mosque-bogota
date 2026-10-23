function bindSubmissionForm(
  formId: string,
  statusId: string,
  formType: "contact" | "visit"
): void {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  const statusEl = document.getElementById(statusId);
  if (!form || !statusEl || form.dataset.bound === "true") return;
  form.dataset.bound = "true";

  const sendingMessage =
    form.getAttribute("data-sending-text") ?? "Enviando solicitud...";
  const successMessage =
    form.getAttribute("data-success-text") ??
    "¡Gracias! Tu mensaje ha sido registrado en nuestro sistema.";
  const errorMessage =
    form.getAttribute("data-error-text") ??
    "Por favor verifica los campos obligatorios e inténtalo de nuevo.";

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload: Record<string, unknown> = {
      formType,
      locale: form.getAttribute("data-locale") ?? "es",
    };

    formData.forEach((value, key) => {
      payload[key] = value;
    });

    statusEl.classList.remove(
      "hidden",
      "bg-red-100",
      "text-red-800",
      "bg-emerald-100",
      "text-emerald-800"
    );
    statusEl.classList.add("bg-slate-100", "text-slate-800");
    statusEl.textContent = sendingMessage;

    void (async () => {
      try {
        const res = await fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          statusEl.classList.remove("bg-slate-100", "text-slate-800");
          statusEl.classList.add("bg-emerald-100", "text-emerald-800");
          statusEl.textContent = successMessage;
          form.reset();
        } else {
          statusEl.classList.remove("bg-slate-100", "text-slate-800");
          statusEl.classList.add("bg-red-100", "text-red-800");
          statusEl.textContent = errorMessage;
        }
      } catch {
        statusEl.classList.remove("bg-slate-100", "text-slate-800");
        statusEl.classList.add("bg-red-100", "text-red-800");
        statusEl.textContent = errorMessage;
      }
    })();
  });
}

/**
 * Initializes the general contact and guided visit booking forms.
 */
export function initContactAndVisitForms(): void {
  bindSubmissionForm("contact-form", "contact-status", "contact");
  bindSubmissionForm("visit-form", "visit-status", "visit");
}
