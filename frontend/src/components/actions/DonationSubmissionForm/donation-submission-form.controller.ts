const initializedForms = new WeakSet<HTMLFormElement>();
const initializedButtons = new WeakSet<HTMLElement>();

const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function initDonationSubmissionForm(): void {
  const amountInput = document.getElementById(
    "donation-amount"
  ) as HTMLInputElement | null;
  const currencySelect = document.getElementById(
    "donation-currency"
  ) as HTMLSelectElement | null;
  const typeSelect = document.getElementById(
    "donation-type"
  ) as HTMLSelectElement | null;
  const campaignSelect = document.getElementById(
    "donation-campaign-slug"
  ) as HTMLSelectElement | null;
  const kindInput = document.getElementById(
    "donation-campaign-kind"
  ) as HTMLInputElement | null;
  const coversCheck = document.getElementById(
    "donation-covers-remaining"
  ) as HTMLInputElement | null;
  const bannerEl = document.getElementById("selected-invoice-banner");
  const bannerTitleEl = document.getElementById("selected-invoice-title");
  const clearBtn = document.getElementById("clear-selected-invoice");
  const formSection = document.getElementById("donation-form-section");

  document
    .querySelectorAll<HTMLButtonElement>("[data-invoice-chip]")
    .forEach((btn) => {
      if (initializedButtons.has(btn)) return;
      initializedButtons.add(btn);

      btn.addEventListener("click", () => {
        const slug = btn.getAttribute("data-slug") ?? "";
        const title = btn.getAttribute("data-title") ?? "";
        const amount = btn.getAttribute("data-amount") ?? "0";
        const isFull = btn.getAttribute("data-full") === "true";

        if (amountInput) amountInput.value = amount;
        if (currencySelect) currencySelect.value = "COP";
        if (typeSelect) typeSelect.value = "utility_bills";
        if (campaignSelect) campaignSelect.value = slug;
        if (kindInput) kindInput.value = "utility_invoice";
        if (coversCheck) coversCheck.checked = isFull;

        if (bannerEl && bannerTitleEl) {
          bannerTitleEl.textContent = `${title} — ${copFormatter.format(Number(amount))} COP`;
          bannerEl.classList.remove("hidden");
          bannerEl.classList.add("flex");
        }

        formSection?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

  if (clearBtn && !initializedButtons.has(clearBtn)) {
    initializedButtons.add(clearBtn);
    clearBtn.addEventListener("click", () => {
      if (campaignSelect) campaignSelect.value = "";
      if (kindInput) kindInput.value = "major_campaign";
      if (coversCheck) coversCheck.checked = false;
      bannerEl?.classList.add("hidden");
      bannerEl?.classList.remove("flex");
    });
  }

  const form = document.getElementById(
    "donation-form"
  ) as HTMLFormElement | null;
  const statusEl = document.getElementById("donation-status");
  if (!form || !statusEl || initializedForms.has(form)) return;
  initializedForms.add(form);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload: Record<string, unknown> = {
      formType: "donation",
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
    statusEl.textContent =
      form.getAttribute("data-submitting-text") ?? "Submitting...";

    void (async () => {
      try {
        const res = await fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const body = (await res.json().catch(() => ({}))) as {
          referenceCode?: string;
        };

        if (res.ok) {
          statusEl.classList.remove("bg-slate-100", "text-slate-800");
          statusEl.classList.add("bg-emerald-100", "text-emerald-800");
          const baseMsg =
            form.getAttribute("data-success-text") ?? "Registered!";
          statusEl.textContent = body.referenceCode
            ? `${baseMsg} ${body.referenceCode}`
            : baseMsg;
          form.reset();
        } else {
          statusEl.classList.remove("bg-slate-100", "text-slate-800");
          statusEl.classList.add("bg-red-100", "text-red-800");
          statusEl.textContent =
            form.getAttribute("data-error-text") ?? "Error";
        }
      } catch {
        statusEl.classList.remove("bg-slate-100", "text-slate-800");
        statusEl.classList.add("bg-red-100", "text-red-800");
        statusEl.textContent = form.getAttribute("data-error-text") ?? "Error";
      }
    })();
  });
}
