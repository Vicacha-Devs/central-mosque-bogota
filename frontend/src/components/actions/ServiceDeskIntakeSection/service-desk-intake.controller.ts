import { bindJsonFormSubmission } from "@utils/form-submission.utils";

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

  bindJsonFormSubmission({
    form,
    statusEl,
    buildPayload: (fd, currentForm) => {
      const payload: Record<string, unknown> = {
        formType: "service_desk",
        locale: currentForm.getAttribute("data-locale") ?? "es",
      };
      fd.forEach((v, k) => {
        payload[k] = v;
      });
      return payload;
    },
    getMessages: (currentForm) => ({
      sending: currentForm.getAttribute("data-sending") ?? "Enviando...",
      error: currentForm.getAttribute("data-error") ?? "Error",
      formatSuccess: (json) => {
        const prefix =
          currentForm.getAttribute("data-success-prefix") ?? "Radicado:";
        const refCode = json.referenceCode ?? "";
        return `${prefix} ${refCode}`;
      },
    }),
  });
}
