const initializedRoots = new WeakSet<HTMLElement>();

const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function populateDonationFormWithZakat(rawAmount: number): void {
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
  const coversCheck = document.getElementById(
    "donation-covers-remaining"
  ) as HTMLInputElement | null;
  const formSection = document.getElementById("donation-form-section");

  if (rawAmount > 0 && amountInput) {
    amountInput.value = String(rawAmount);
  }
  if (currencySelect) currencySelect.value = "COP";
  if (typeSelect) typeSelect.value = "zakat";
  if (campaignSelect) campaignSelect.value = "";
  if (coversCheck) coversCheck.checked = false;
  formSection?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function initZakatCalculator(): void {
  const calcRoot = document.getElementById("zakat-calculator");
  if (calcRoot && !initializedRoots.has(calcRoot)) {
    initializedRoots.add(calcRoot);

    const goldNisab = Number(
      calcRoot.getAttribute("data-gold-nisab") ?? 32725000
    );
    const silverNisab = Number(
      calcRoot.getAttribute("data-silver-nisab") ?? 2618000
    );
    const belowText = calcRoot.getAttribute("data-below-text") ?? "Below Nisab";
    const aboveText =
      calcRoot.getAttribute("data-above-text") ?? "Meets Nisab (2.5%)";

    const standardSelect = document.getElementById(
      "zakat-standard-select"
    ) as HTMLSelectElement | null;
    const cashInput = document.getElementById(
      "zakat-cash"
    ) as HTMLInputElement | null;
    const invInput = document.getElementById(
      "zakat-investments"
    ) as HTMLInputElement | null;
    const debtsInput = document.getElementById(
      "zakat-debts"
    ) as HTMLInputElement | null;
    const netEl = document.getElementById("zakat-net-worth");
    const statusEl = document.getElementById("zakat-status");
    const dueEl = document.getElementById("zakat-due-amount");
    const applyZakatBtn = document.getElementById("apply-zakat-to-form-btn");

    const recalculate = (): void => {
      const cash = Math.max(0, Number(cashInput?.value ?? 0));
      const inv = Math.max(0, Number(invInput?.value ?? 0));
      const debts = Math.max(0, Number(debtsInput?.value ?? 0));
      const net = Math.max(0, cash + inv - debts);

      const threshold =
        standardSelect?.value === "silver" ? silverNisab : goldNisab;
      const meetsNisab = net >= threshold;
      const zakatDue = meetsNisab ? Math.round(net * 0.025) : 0;

      if (netEl) netEl.textContent = `${copFormatter.format(net)} COP`;
      if (statusEl) statusEl.textContent = meetsNisab ? aboveText : belowText;
      if (dueEl) {
        dueEl.textContent = `${copFormatter.format(zakatDue)} COP`;
        dueEl.setAttribute("data-raw-zakat", String(zakatDue));
      }
    };

    [standardSelect, cashInput, invInput, debtsInput].forEach((el) => {
      el?.addEventListener("input", recalculate);
      el?.addEventListener("change", recalculate);
    });

    applyZakatBtn?.addEventListener("click", () => {
      const rawZakat = Number(dueEl?.getAttribute("data-raw-zakat") ?? 0);
      populateDonationFormWithZakat(rawZakat);
    });
  }

  const fitranaRoot = document.getElementById("fitrana-fidyah-calculator");
  if (fitranaRoot && !initializedRoots.has(fitranaRoot)) {
    initializedRoots.add(fitranaRoot);

    const fitranaRate = Math.max(
      0,
      Number(fitranaRoot.getAttribute("data-fitrana-rate") ?? 25000)
    );
    const fidyahRate = Math.max(
      0,
      Number(fitranaRoot.getAttribute("data-fidyah-rate") ?? 20000)
    );
    const kaffarahRate = Math.max(
      0,
      Number(fitranaRoot.getAttribute("data-kaffarah-rate") ?? 1200000)
    );

    const membersInput = document.getElementById(
      "fitrana-members"
    ) as HTMLInputElement | null;
    const fidyahInput = document.getElementById(
      "fidyah-days"
    ) as HTMLInputElement | null;
    const kaffarahInput = document.getElementById(
      "kaffarah-count"
    ) as HTMLInputElement | null;
    const fitranaSubEl = document.getElementById("fitrana-subtotal");
    const fidyahSubEl = document.getElementById("fidyah-kaffarah-subtotal");
    const fitranaTotalEl = document.getElementById("fitrana-total-due");
    const applyFitranaBtn = document.getElementById(
      "apply-fitrana-to-form-btn"
    );

    const recalcFitrana = (): void => {
      const members = Math.max(0, Math.trunc(Number(membersInput?.value ?? 0)));
      const fidyahDays = Math.max(
        0,
        Math.trunc(Number(fidyahInput?.value ?? 0))
      );
      const kaffarahCount = Math.max(
        0,
        Math.trunc(Number(kaffarahInput?.value ?? 0))
      );

      const fitranaSub = members * fitranaRate;
      const fidyahKaffarahSub =
        fidyahDays * fidyahRate + kaffarahCount * kaffarahRate;
      const total = fitranaSub + fidyahKaffarahSub;

      if (fitranaSubEl) {
        fitranaSubEl.textContent = `${copFormatter.format(fitranaSub)} COP`;
      }
      if (fidyahSubEl) {
        fidyahSubEl.textContent = `${copFormatter.format(fidyahKaffarahSub)} COP`;
      }
      if (fitranaTotalEl) {
        fitranaTotalEl.textContent = `${copFormatter.format(total)} COP`;
        fitranaTotalEl.setAttribute("data-raw-fitrana", String(total));
      }
    };

    [membersInput, fidyahInput, kaffarahInput].forEach((el) => {
      el?.addEventListener("input", recalcFitrana);
      el?.addEventListener("change", recalcFitrana);
    });

    applyFitranaBtn?.addEventListener("click", () => {
      const rawTotal = Number(
        fitranaTotalEl?.getAttribute("data-raw-fitrana") ?? 0
      );
      populateDonationFormWithZakat(rawTotal);
    });
  }
}
