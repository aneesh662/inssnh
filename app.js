(() => {
  "use strict";

  // WhatsApp recipient in international format: country code + number, digits only.
  const WHATSAPP_NUMBER = "918075916160";
  const providers = [
    {name:"Tata AIG Insurance", short:"TATA AIG", type:"Insurance", color:"#07549c"},
    {name:"Aditya Birla Health Insurance", short:"ABHI", type:"Health Insurance", color:"#c52e35"},
    {name:"Vidal Health (NORKA Care Plus)", short:"VIDAL", type:"TPA / Health Team", color:"#18856b"},
    {name:"SBI General Insurance", short:"SBI", type:"General Insurance", color:"#742b88"},
    {name:"MD India Health Insurance", short:"MD", type:"TPA", color:"#c92d48"},
    {name:"Medi Assist", short:"MEDI", type:"TPA", color:"#d51e3e"},
    {name:"FHPL", short:"FHPL", type:"TPA", color:"#8c347d"},
    {name:"HDFC ERGO General Insurance", short:"HDFC", type:"General Insurance", color:"#cf202f"},
    {name:"ICICI Lombard General Insurance", short:"ICICI", type:"General Insurance", color:"#b77716"},
    {name:"ManipalCigna Health Insurance", short:"MC", type:"Health Insurance", color:"#258a9d"},
    {name:"ACKO General Insurance", short:"ACKO", type:"General Insurance", color:"#6224c5"},
    {name:"Chola MS General Insurance", short:"CHOLA", type:"General Insurance", color:"#a42d3c"},
    {name:"Ericson Insurance TPA", short:"ERICSON", type:"TPA", color:"#1559a2"},
    {name:"Galaxy Health Insurance", short:"GALAXY", type:"Health Insurance", color:"#187bb6"},
    {name:"General Central Insurance", short:"GCI", type:"General Insurance", color:"#1764ad"},
    {name:"IFFCO Tokio General Insurance", short:"IFFCO", type:"General Insurance", color:"#198653"},
    {name:"Link-K Insurance TPA", short:"LINK-K", type:"TPA", color:"#167eae"},
    {name:"Liberty General Insurance", short:"LIBERTY", type:"General Insurance", color:"#24477b"},
    {name:"Narayana Health Insurance", short:"NARAYANA", type:"Health Insurance", color:"#1555a3"},
    {name:"Reliance General Insurance", short:"RELIANCE", type:"General Insurance", color:"#164b8b"},
    {name:"Royal Sundaram General Insurance", short:"ROYAL", type:"General Insurance", color:"#1c5088"},
    {name:"Universal Sompo General Insurance", short:"US", type:"General Insurance", color:"#1875b6"},
    {name:"Volo Health", short:"VOLO", type:"TPA / Health Team", color:"#4c9b51"},
    {name:"Magma HDI General Insurance", short:"MAGMA", type:"General Insurance", color:"#b72835"},
    {name:"Zuno General Insurance", short:"ZUNO", type:"General Insurance", color:"#6c28be"}
  ];

  const byId = id => document.getElementById(id);
  const grid = byId("providerGrid");
  const modalEl = byId("requestModal");
  const form = byId("requestForm");
  if (!grid || !modalEl || !form) {
    console.error("Cashless Insurance app could not initialise. Required HTML elements are missing.");
    return;
  }

  // Lightweight built-in modal and toast controls: no Bootstrap JavaScript/CDN required.
  const toastEl = byId("formToast");
  let toastTimer = null;
  function showModal() {
    modalEl.classList.add("show");
    modalEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    const firstInput = modalEl.querySelector("input:not([readonly]), select");
    if (firstInput) setTimeout(() => firstInput.focus(), 50);
  }
  function hideModal() {
    modalEl.classList.remove("show");
    modalEl.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }
  function showToast() {
    if (!toastEl) return;
    toastEl.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 4500);
  }
  modalEl.querySelectorAll('[data-bs-dismiss="modal"]').forEach(button => button.addEventListener("click", hideModal));
  toastEl?.querySelectorAll('[data-bs-dismiss="toast"]').forEach(button => button.addEventListener("click", () => toastEl.classList.remove("show")));
  modalEl.addEventListener("click", event => { if (event.target === modalEl) hideModal(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") hideModal(); });
  let selectedProvider = null;

  const escapeHTML = value => String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[ch]));

  providers.forEach((provider, index) => {
    const col = document.createElement("div");
    col.className = "col-6 col-md-4 col-lg-3 col-xl-2";
    col.innerHTML = `
      <button type="button" class="provider-card" data-provider-index="${index}" aria-label="Select ${escapeHTML(provider.name)}">
        <div class="provider-logo">
          <img class="provider-logo-image" src="assets/logos/provider-${String(index + 1).padStart(2, "0")}.png" alt="${escapeHTML(provider.name)} logo" loading="lazy">
        </div>
        <span class="provider-name">${escapeHTML(provider.name)}</span>
        <span class="provider-type">${escapeHTML(provider.type)}</span>
      </button>`;
    grid.appendChild(col);
  });

  const providerSearch = byId("providerSearch");
  const clearProviderSearch = byId("clearProviderSearch");
  const searchStatus = byId("searchStatus");
  const noProvidersFound = byId("noProvidersFound");

  function filterProviders() {
    const query = (providerSearch?.value || "").trim().toLocaleLowerCase();
    let visible = 0;
    grid.querySelectorAll("[data-provider-index]").forEach(button => {
      const provider = providers[Number(button.dataset.providerIndex)];
      const searchable = `${provider.name} ${provider.short} ${provider.type}`.toLocaleLowerCase();
      const matches = !query || searchable.includes(query);
      button.closest(".col-6").hidden = !matches;
      if (matches) visible++;
    });
    if (clearProviderSearch) clearProviderSearch.hidden = query.length === 0;
    if (searchStatus) searchStatus.textContent = `${visible} ${visible === 1 ? "provider" : "providers"} found`;
    if (noProvidersFound) noProvidersFound.hidden = visible !== 0;
    if (byId("providerCount")) byId("providerCount").textContent = query ? `${visible} found` : `${providers.length} providers`;
  }

  providerSearch?.addEventListener("input", filterProviders);
  clearProviderSearch?.addEventListener("click", () => {
    providerSearch.value = "";
    filterProviders();
    providerSearch.focus();
  });

  function updateDateTime() {
    const now = new Date();
    byId("requestDate").value = now.toLocaleDateString("en-IN", {day:"2-digit", month:"2-digit", year:"numeric"});
    byId("requestTime").value = now.toLocaleTimeString("en-IN", {hour:"2-digit", minute:"2-digit", hour12:true});
  }

  grid.addEventListener("click", event => {
    const button = event.target.closest("[data-provider-index]");
    if (!button) return;
    selectedProvider = providers[Number(button.dataset.providerIndex)];
    byId("selectedProviderName").textContent = selectedProvider.name;
    byId("selectedProviderIcon").textContent = selectedProvider.short;
    byId("selectedProviderIcon").style.background = selectedProvider.color;
    byId("requestModalTitle").textContent = "Cashless Insurance Request";
    form.reset();
    form.classList.remove("was-validated");
    ["contact", "whatsapp"].forEach(id => byId(id).setCustomValidity(""));
    updateDateTime();
    showModal();
  });

  function validPhone(input) {
    const digits = input.value.replace(/\D/g, "");
    // Accept 10-digit Indian mobile numbers, optionally prefixed by 91 or 0.
    const normalized = digits.replace(/^91(?=\d{10}$)/, "").replace(/^0(?=\d{10}$)/, "");
    const valid = /^[6-9]\d{9}$/.test(normalized);
    input.setCustomValidity(valid ? "" : "Enter a valid 10-digit Indian mobile number");
    return valid;
  }

  ["contact", "whatsapp"].forEach(id => {
    const input = byId(id);
    input.addEventListener("input", () => validPhone(input));
    input.addEventListener("blur", () => { if (input.value.trim()) validPhone(input); });
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const contact = byId("contact");
    const whatsapp = byId("whatsapp");
    validPhone(contact);
    validPhone(whatsapp);
    form.classList.add("was-validated");

    if (!form.checkValidity() || !selectedProvider) {
      const firstInvalid = form.querySelector(":invalid");
      if (firstInvalid) firstInvalid.focus();
      byId("toastMessage").textContent = "Please complete all required fields and enter valid phone numbers.";
      showToast();
      return;
    }

    const value = id => (byId(id)?.value || "").trim();
    const message = [
      "CASHLESS INSURANCE REQUEST",
      "Santhi Nursing Home | Cashless Insurance Team",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "",
      "PATIENT DETAILS",
      `Patient Name: ${value("patientName")}`,
      `Age: ${value("age")}`,
      `Room No.: ${value("roomNo") || "Not provided"}`,
      `House Name: ${value("houseName")}`,
      `Place: ${value("place")}`,
      `District: ${value("district") || "Not provided"}`,
      "",
      "INSURANCE & MEDICAL DETAILS",
      `Insurance Company / TPA: ${selectedProvider.name}`,
      `Doctor Name: ${value("doctor")}`,
      "",
      "CONTACT DETAILS",
      `Contact Number: ${value("contact")}`,
      `WhatsApp Number: ${value("whatsapp")}`,
      "",
      "REQUEST TIMESTAMP",
      `Date: ${value("requestDate")}`,
      `Time: ${value("requestTime")}`,
      "",
      "Kindly review this request and assist with the cashless insurance process.",
      "Thank you."
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) {
      byId("toastMessage").textContent = "Your browser blocked the WhatsApp window. Allow pop-ups for this site and submit again.";
    } else {
      byId("toastMessage").textContent = "WhatsApp opened with the request. Review the details and tap Send to submit it to the Insurance Team.";
    }
    showToast();
  });

  byId("providerCount").textContent = `${providers.length} providers`;
  filterProviders();
})();
