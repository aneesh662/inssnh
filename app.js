(() => {
  "use strict";
  const WHATSAPP_NUMBER = "918075916160"; // India country code + hospital WhatsApp number
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
  const grid = document.getElementById("providerGrid");
  const modalEl = document.getElementById("requestModal");
  const modal = new bootstrap.Modal(modalEl);
  const form = document.getElementById("requestForm");
  const toast = new bootstrap.Toast(document.getElementById("formToast"));
  let selectedProvider = null;

  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, ch => ({
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

  // Live search filters provider cards by company name, TPA name, and abbreviation.
  const providerSearch = document.getElementById("providerSearch");
  const clearProviderSearch = document.getElementById("clearProviderSearch");
  const searchStatus = document.getElementById("searchStatus");
  const noProvidersFound = document.getElementById("noProvidersFound");

  function filterProviders() {
    const query = providerSearch.value.trim().toLocaleLowerCase();
    let visible = 0;
    grid.querySelectorAll("[data-provider-index]").forEach(button => {
      const provider = providers[Number(button.dataset.providerIndex)];
      const searchable = ${provider.name} ${provider.short} ${provider.type}.toLocaleLowerCase();
      const matches = !query || searchable.includes(query);
      button.closest(".col-6").hidden = !matches;
      if (matches) visible++;
    });
    clearProviderSearch.hidden = query.length === 0;
    searchStatus.textContent = ${visible} ${visible === 1 ? "provider" : "providers"} found;
    noProvidersFound.hidden = visible !== 0;
    document.getElementById("providerCount").textContent = query ? ${visible} found : ${providers.length} providers;
  }

  providerSearch.addEventListener("input", filterProviders);
  clearProviderSearch.addEventListener("click", () => {
    providerSearch.value = "";
    filterProviders();
    providerSearch.focus();
  });

  function updateDateTime() {
    const now = new Date();
    document.getElementById("requestDate").value = now.toLocaleDateString("en-IN", {day:"2-digit", month:"2-digit", year:"numeric"});
    document.getElementById("requestTime").value = now.toLocaleTimeString("en-IN", {hour:"2-digit", minute:"2-digit", hour12:true});
  }

  grid.addEventListener("click", event => {
    const button = event.target.closest("[data-provider-index]");
    if (!button) return;
    selectedProvider = providers[Number(button.dataset.providerIndex)];
    document.getElementById("selectedProviderName").textContent = selectedProvider.name;
    document.getElementById("selectedProviderIcon").textContent = selectedProvider.short;
    document.getElementById("selectedProviderIcon").style.background = selectedProvider.color;
    document.getElementById("requestModalTitle").textContent = "Cashless Insurance Request";
    form.reset();
    form.classList.remove("was-validated");
    updateDateTime();
    document.getElementById("expiryDate").min = "";
    modal.show();
  });

  function validPhone(input) {
    const digits = input.value.replace(/\D/g, "");
    const valid = digits.length >= 10 && digits.length <= 15;
    input.setCustomValidity(valid ? "" : "Enter a valid phone number");
    return valid;
  }

  ["contact", "whatsapp"].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener("input", () => validPhone(input));
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const contact = document.getElementById("contact");
    const whatsapp = document.getElementById("whatsapp");
    validPhone(contact);
    validPhone(whatsapp);
    form.classList.add("was-validated");
    if (!form.checkValidity() || !selectedProvider) {
      const firstInvalid = form.querySelector(":invalid");
      if (firstInvalid) firstInvalid.focus();
      document.getElementById("toastMessage").textContent = "Please complete the required fields and check the phone numbers.";
      toast.show();
      return;
    }

    const value = id => document.getElementById(id).value.trim();
    const message = [
      "CASHLESS INSURANCE REQUEST",
      "Santhi Nursing Home | Insurance Team",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "",
      "PATIENT DETAILS",
      Patient Name: ${value("patientName")},
      Age: ${value("age")},
      Room No.: ${value("roomNo") || "Not provided"},
      House Name: ${value("houseName")},
      Place: ${value("place")},
      District: ${value("district")},
      "",
      "INSURANCE & MEDICAL DETAILS",
      Insurance Company / TPA: ${selectedProvider.name},
      Doctor Name: ${value("doctor")},
      Insurance Expiry Date: ${value("expiryDate")},
      "",
      "CONTACT DETAILS",
      Contact Number: ${value("contact")},
      WhatsApp Number: ${value("whatsapp")},
      "",
      "REQUEST TIMESTAMP",
      Date: ${value("requestDate")},
      Time: ${value("requestTime")},
      "",
      "Reminder: ഇൻഷുറൻസ് കാർഡ്, ആധാർ കാർഡ് കൈവശം വെക്കുക",
      "",
      "Kindly review this request and assist with the cashless insurance process.",
      "Thank you."
    ].join("\n");

    const url = https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)};
    window.open(url, "_blank", "noopener,noreferrer");
    document.getElementById("toastMessage").textContent = "WhatsApp opened with your request. Review the details and tap Send to submit to the Insurance Team.";
    toast.show();
  });

  // Keep displayed date/time current while the form remains open, but users cannot edit them.
  modalEl.addEventListener("show.bs.modal", updateDateTime);
  document.getElementById("providerCount").textContent = ${providers.length} providers;
})();
