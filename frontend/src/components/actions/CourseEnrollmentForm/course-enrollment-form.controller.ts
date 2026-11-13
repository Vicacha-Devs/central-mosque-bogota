const initializedForms = new WeakSet<HTMLFormElement>();

function getFormStr(fd: FormData, key: string, fallback = ""): string {
  const val = fd.get(key);
  return typeof val === "string" && val.length > 0 ? val.trim() : fallback;
}

export function initCourseEnrollmentForm(): void {
  const form = document.getElementById(
    "course-enrollment-form"
  ) as HTMLFormElement | null;
  const feedback = document.getElementById("course-enrollment-feedback");
  const submitBtn = document.getElementById(
    "course-enrollment-submit"
  ) as HTMLButtonElement | null;
  const submitLabel = document.getElementById("course-enrollment-submit-label");

  if (
    !form ||
    !feedback ||
    !submitBtn ||
    !submitLabel ||
    initializedForms.has(form)
  ) {
    return;
  }
  initializedForms.add(form);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const courseTitle = form.getAttribute("data-course-title") ?? "";
    const locale = form.getAttribute("data-locale") ?? "es";
    const defaultLabel = form.getAttribute("data-submit-label") ?? "Submit";
    const submittingLabel = form.getAttribute("data-submitting-label") ?? "...";
    const successMsg = form.getAttribute("data-success-msg") ?? "OK";
    const errorMsg = form.getAttribute("data-error-msg") ?? "Error";

    const formData = new FormData(form);
    const fullName = getFormStr(formData, "fullName");
    const email = getFormStr(formData, "email");
    const phone = getFormStr(formData, "phone");
    const website = getFormStr(formData, "website");
    const modality = getFormStr(formData, "modality", "in-person");
    const message = getFormStr(formData, "message");

    submitBtn.disabled = true;
    submitLabel.textContent = submittingLabel;
    feedback.classList.add("hidden");

    void (async () => {
      try {
        const res = await fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formType: "contact",
            locale,
            website,
            fullName,
            email,
            phone,
            subject: "education",
            message:
              `[Academy: ${courseTitle}] (${modality}) ${message}`.trim(),
          }),
        });

        const json = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          referenceCode?: string;
        };
        if (!res.ok || json.ok === false) {
          throw new Error("Request failed");
        }

        feedback.textContent = json.referenceCode
          ? `${successMsg} (${json.referenceCode})`
          : successMsg;
        feedback.className =
          "rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm font-medium text-emerald-700 dark:text-emerald-300";
        form.reset();
      } catch {
        feedback.textContent = errorMsg;
        feedback.className =
          "rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-sm font-medium text-amber-700 dark:text-amber-300";
      } finally {
        submitBtn.disabled = false;
        submitLabel.textContent = defaultLabel;
      }
    })();
  });
}
