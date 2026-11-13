const FALLBACK_MESSAGES: Record<
  string,
  { success: string; invalid: string; error: string }
> = {
  es: {
    success: "¡Suscrito! Revisa tu correo para confirmar tu suscripción.",
    invalid: "Correo electrónico inválido.",
    error: "Error de conexión. Inténtalo de nuevo.",
  },
  en: {
    success: "Subscribed! Please check your email to confirm (double opt-in).",
    invalid: "Invalid email address.",
    error: "Connection error. Please try again.",
  },
  ar: {
    success: "تم الاشتراك! يرجى تأكيد بريدك الإلكتروني.",
    invalid: "البريد الإلكتروني غير صالح.",
    error: "خطأ في الاتصال. يرجى المحاولة مرة أخرى.",
  },
  tr: {
    success: "Abone olundu! Lütfen e-postanızı onaylayın.",
    invalid: "Geçersiz e-posta adresi.",
    error: "Bağlantı hatası. Lütfen tekrar deneyin.",
  },
};

function getFormStr(fd: FormData, key: string, fallback = ""): string {
  const val = fd.get(key);
  return typeof val === "string" && val.length > 0 ? val.trim() : fallback;
}

/**
 * Initializes the footer newsletter subscription form (`#footer-newsletter-form`)
 * routing through the unified `/api/submissions` BFF endpoint.
 */
export function initFooterNewsletter(root: ParentNode = document): void {
  const form = root.querySelector<HTMLFormElement>("#footer-newsletter-form");
  const statusEl = root.querySelector<HTMLElement>("#footer-newsletter-status");
  if (!form || !statusEl) return;
  if (form.getAttribute("data-newsletter-bound") === "true") return;
  form.setAttribute("data-newsletter-bound", "true");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const email = getFormStr(fd, "email");
    const website = getFormStr(fd, "website");
    const locale = form.getAttribute("data-locale") ?? "es";
    const fallback = FALLBACK_MESSAGES[locale] ?? FALLBACK_MESSAGES.es;

    const successMsg =
      form.getAttribute("data-success-msg") ?? fallback.success;
    const invalidMsg =
      form.getAttribute("data-invalid-msg") ?? fallback.invalid;
    const errorMsg = form.getAttribute("data-error-msg") ?? fallback.error;

    statusEl.classList.remove("hidden", "text-red-300");
    statusEl.classList.add("text-emerald-300");

    void (async () => {
      try {
        const res = await fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formType: "newsletter",
            email,
            website,
            locale,
            topics: ["announcements", "events", "courses"],
          }),
        });
        if (res.ok) {
          statusEl.textContent = successMsg;
          form.reset();
        } else {
          statusEl.classList.replace("text-emerald-300", "text-red-300");
          statusEl.textContent = invalidMsg;
        }
      } catch {
        statusEl.classList.replace("text-emerald-300", "text-red-300");
        statusEl.textContent = errorMsg;
      }
    })();
  });
}
