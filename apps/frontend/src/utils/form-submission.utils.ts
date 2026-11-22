export type TSubmissionApiResponse = {
  ok?: boolean;
  referenceCode?: string;
  error?: string;
};

export type TStatusStyleClasses = {
  pending: Array<string>;
  success: Array<string>;
  error: Array<string>;
};

const DEFAULT_STATUS_CLASSES: TStatusStyleClasses = {
  pending: ["bg-slate-100", "text-slate-800"],
  success: ["bg-emerald-100", "text-emerald-800"],
  error: ["bg-red-100", "text-red-800"],
};

const boundForms = new WeakSet<HTMLFormElement>();

function setStatusClasses(
  statusEl: HTMLElement,
  activeState: keyof TStatusStyleClasses,
  classes: TStatusStyleClasses
): void {
  statusEl.classList.remove(
    "hidden",
    ...classes.pending,
    ...classes.success,
    ...classes.error
  );
  statusEl.classList.add(...classes[activeState]);
}

export type TBindJsonFormOptions = {
  form: HTMLFormElement;
  statusEl: HTMLElement;
  buildPayload: (
    formData: FormData,
    form: HTMLFormElement
  ) => Record<string, unknown>;
  getMessages: (form: HTMLFormElement) => {
    sending: string;
    error: string;
    formatSuccess: (res: TSubmissionApiResponse) => string;
  };
  submitButton?: HTMLButtonElement | null;
  submitLabelEl?: HTMLElement | null;
  getButtonLabels?: (form: HTMLFormElement) => {
    defaultLabel: string;
    submittingLabel: string;
  };
  statusClasses?: TStatusStyleClasses;
  endpoint?: string;
};

/**
 * Binds a form to a JSON POST submission with WeakSet idempotency,
 * double-submit locking (`disabled` + `aria-busy`), safe JSON parsing,
 * and accessible status feedback.
 */
export function bindJsonFormSubmission(options: TBindJsonFormOptions): void {
  const {
    form,
    statusEl,
    buildPayload,
    getMessages,
    submitLabelEl,
    getButtonLabels,
    statusClasses = DEFAULT_STATUS_CLASSES,
    endpoint = "/api/submissions",
  } = options;

  if (boundForms.has(form)) return;
  boundForms.add(form);

  const submitBtn =
    options.submitButton ??
    form.querySelector<HTMLButtonElement>(
      'button[type="submit"], button:not([type]), input[type="submit"]'
    );

  let isSubmitting = false;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (isSubmitting || submitBtn?.disabled) return;
    isSubmitting = true;

    const formData = new FormData(form);
    const payload = buildPayload(formData, form);
    const messages = getMessages(form);
    const buttonLabels = getButtonLabels?.(form);

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute("aria-busy", "true");
    }
    if (submitLabelEl && buttonLabels) {
      submitLabelEl.textContent = buttonLabels.submittingLabel;
    }

    setStatusClasses(statusEl, "pending", statusClasses);
    statusEl.textContent = messages.sending;

    void (async () => {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = (
          typeof res.json === "function"
            ? await res.json().catch(() => ({}))
            : {}
        ) as TSubmissionApiResponse;

        if (res.ok && json.ok !== false) {
          setStatusClasses(statusEl, "success", statusClasses);
          statusEl.textContent = messages.formatSuccess(json);
          form.reset();
        } else {
          setStatusClasses(statusEl, "error", statusClasses);
          statusEl.textContent = messages.error;
        }
      } catch {
        setStatusClasses(statusEl, "error", statusClasses);
        statusEl.textContent = messages.error;
      } finally {
        isSubmitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute("aria-busy");
        }
        if (submitLabelEl && buttonLabels) {
          submitLabelEl.textContent = buttonLabels.defaultLabel;
        }
      }
    })();
  });
}
