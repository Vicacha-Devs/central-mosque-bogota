const initializedForms = new WeakSet<HTMLFormElement>();

function getFormStr(fd: FormData, key: string, fallback = ""): string {
  const val = fd.get(key);
  return typeof val === "string" && val.length > 0 ? val.trim() : fallback;
}

export function initBroadcastSubscriptionForm(): void {
  const form = document.getElementById(
    "mosque-broadcast-subscribe-form"
  ) as HTMLFormElement | null;
  const feedback = document.getElementById(
    "mosque-broadcast-subscribe-feedback"
  );
  if (!form || !feedback || initializedForms.has(form)) return;
  initializedForms.add(form);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const email = getFormStr(formData, "email");
    const phone = getFormStr(formData, "phone");
    const website = getFormStr(formData, "website");
    const locale = getFormStr(formData, "locale", "es");
    const topics = formData
      .getAll("topics")
      .filter((t): t is string => typeof t === "string");

    if (!email) return;

    void (async () => {
      try {
        await fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formType: "newsletter",
            email,
            phone: phone || undefined,
            website,
            locale,
            topics: topics.length > 0 ? topics : ["announcements"],
            sourceFormSlug: "community-broadcast-channels",
          }),
        });
      } catch {
        // Offline or static preview fallback
      }

      feedback.textContent =
        feedback.getAttribute("data-success-msg") ?? "Subscribed";
      feedback.classList.remove("hidden");
      form.reset();
    })();
  });
}
