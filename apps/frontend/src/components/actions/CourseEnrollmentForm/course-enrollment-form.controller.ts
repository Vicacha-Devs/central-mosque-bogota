import { bindJsonFormSubmission } from "@utils/form-submission.utils";

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

  if (!form || !feedback || !submitBtn || !submitLabel) return;

  bindJsonFormSubmission({
    form,
    statusEl: feedback,
    submitButton: submitBtn,
    submitLabelEl: submitLabel,
    statusClasses: {
      pending: ["hidden"],
      success: [
        "rounded-xl",
        "border",
        "border-emerald-500/30",
        "bg-emerald-500/10",
        "p-3.5",
        "text-sm",
        "font-medium",
        "text-emerald-700",
        "dark:text-emerald-300",
      ],
      error: [
        "rounded-xl",
        "border",
        "border-amber-500/30",
        "bg-amber-500/10",
        "p-3.5",
        "text-sm",
        "font-medium",
        "text-amber-700",
        "dark:text-amber-300",
      ],
    },
    buildPayload: (formData, currentForm) => {
      const courseTitle = currentForm.getAttribute("data-course-title") ?? "";
      const locale = currentForm.getAttribute("data-locale") ?? "es";
      const modality = getFormStr(formData, "modality", "in-person");
      const message = getFormStr(formData, "message");
      return {
        formType: "contact",
        locale,
        website: getFormStr(formData, "website"),
        fullName: getFormStr(formData, "fullName"),
        email: getFormStr(formData, "email"),
        phone: getFormStr(formData, "phone"),
        subject: "education",
        message: `[Academy: ${courseTitle}] (${modality}) ${message}`.trim(),
      };
    },
    getMessages: (currentForm) => {
      const successMsg = currentForm.getAttribute("data-success-msg") ?? "OK";
      return {
        sending: "",
        error: currentForm.getAttribute("data-error-msg") ?? "Error",
        formatSuccess: (json) =>
          json.referenceCode
            ? `${successMsg} (${json.referenceCode})`
            : successMsg,
      };
    },
    getButtonLabels: (currentForm) => ({
      defaultLabel: currentForm.getAttribute("data-submit-label") ?? "Submit",
      submittingLabel:
        currentForm.getAttribute("data-submitting-label") ?? "...",
    }),
  });
}
