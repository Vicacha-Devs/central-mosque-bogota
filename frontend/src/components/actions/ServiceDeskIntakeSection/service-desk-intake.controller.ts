const initializedForms = new WeakSet<HTMLFormElement>();

export function initServiceDeskIntake(): void {
  const form = document.getElementById(
    "service-desk-form"
  ) as HTMLFormElement | null;
  const selectEl = document.getElementById(
    "sd-service-type"
  ) as HTMLSelectElement | null;
  const checklistCard = document.getElementById("service-desk-checklist-card");
  const checklistList = document.getElementById("service-desk-checklist-items");
  const statusEl = document.getElementById("service-desk-status");

  if (
    !form ||
    !selectEl ||
    !checklistCard ||
    !checklistList ||
    !statusEl ||
    initializedForms.has(form)
  ) {
    return;
  }
  initializedForms.add(form);

  let checklistsMap: Record<string, Array<string> | undefined> = {};
  try {
    checklistsMap = JSON.parse(
      checklistCard.getAttribute("data-checklists") ?? "{}"
    ) as Record<string, Array<string> | undefined>;
  } catch {
    checklistsMap = {};
  }

  selectEl.addEventListener("change", () => {
    const items = checklistsMap[selectEl.value] ?? [];
    checklistList.replaceChildren(
      ...items.map((text) => {
        const li = document.createElement("li");
        li.className = "flex items-start gap-2.5";
        const checkSpan = document.createElement("span");
        checkSpan.className = "mt-0.5 text-emerald-600 dark:text-emerald-400";
        checkSpan.textContent = "✓";
        const textSpan = document.createElement("span");
        textSpan.textContent = text;
        li.append(checkSpan, textSpan);
        return li;
      })
    );
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload: Record<string, unknown> = {
      formType: "service_desk",
      locale: form.getAttribute("data-locale") ?? "es",
    };
    fd.forEach((v, k) => {
      payload[k] = v;
    });

    statusEl.className =
      "rounded-xl px-4 py-2.5 text-sm font-semibold bg-slate-100 text-slate-800";
    statusEl.textContent = form.getAttribute("data-sending") ?? "Enviando...";

    void (async () => {
      try {
        const res = await fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = (await res.json()) as {
          ok?: boolean;
          referenceCode?: string;
        };
        if (res.ok && json.ok) {
          statusEl.className =
            "rounded-xl px-4 py-2.5 text-sm font-semibold bg-emerald-100 text-emerald-800";
          const prefix =
            form.getAttribute("data-success-prefix") ?? "Radicado:";
          const refCode = json.referenceCode ?? "";
          statusEl.textContent = `${prefix} ${refCode}`;
          form.reset();
        } else {
          statusEl.className =
            "rounded-xl px-4 py-2.5 text-sm font-semibold bg-red-100 text-red-800";
          statusEl.textContent = form.getAttribute("data-error") ?? "Error";
        }
      } catch {
        statusEl.className =
          "rounded-xl px-4 py-2.5 text-sm font-semibold bg-red-100 text-red-800";
        statusEl.textContent = form.getAttribute("data-error") ?? "Error";
      }
    })();
  });
}
