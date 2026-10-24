(() => {
  "use strict";

  // WhatsApp number: India country code + phone number.
  const WHATSAPP_NUMBER = "918075916160";

  const providers = [
    {name:"Tata AIG Insurance",short:"TATA AIG",type:"Insurance",color:"#07549c"},
    {name:"Aditya Birla Health Insurance",short:"ABHI",type:"Health Insurance",color:"#c52e35"},
    {name:"Vidal Health (NORKA Care Plus)",short:"VIDAL",type:"TPA / Health Team",color:"#18856b"},
    {name:"SBI General Insurance",short:"SBI",type:"General Insurance",color:"#742b88"},
    {name:"MD India Health Insurance",short:"MD",type:"TPA",color:"#c92d48"},
    {name:"Medi Assist",short:"MEDI",type:"TPA",color:"#d51e3e"},
    {name:"FHPL",short:"FHPL",type:"TPA",color:"#8c347d"},
    {name:"HDFC ERGO General Insurance",short:"HDFC",type:"General Insurance",color:"#cf202f"},
    {name:"ICICI Lombard General Insurance",short:"ICICI",type:"General Insurance",color:"#b77716"},
    {name:"ManipalCigna Health Insurance",short:"MC",type:"Health Insurance",color:"#258a9d"},
    {name:"ACKO General Insurance",short:"ACKO",type:"General Insurance",color:"#6224c5"},
    {name:"Chola MS General Insurance",short:"CHOLA",type:"General Insurance",color:"#a42d3c"},
    {name:"Ericson Insurance TPA",short:"ERICSON",type:"TPA",color:"#1559a2"},
    {name:"Galaxy Health Insurance",short:"GALAXY",type:"Health Insurance",color:"#187bb6"},
    {name:"General Central Insurance",short:"GCI",type:"General Insurance",color:"#1764ad"},
    {name:"IFFCO Tokio General Insurance",short:"IFFCO",type:"General Insurance",color:"#198653"},
    {name:"Link-K Insurance TPA",short:"LINK-K",type:"TPA",color:"#167eae"},
    {name:"Liberty General Insurance",short:"LIBERTY",type:"General Insurance",color:"#24477b"},
    {name:"Narayana Health Insurance",short:"NARAYANA",type:"Health Insurance",color:"#1555a3"},
    {name:"Reliance General Insurance",short:"RELIANCE",type:"General Insurance",color:"#164b8b"},
    {name:"Royal Sundaram General Insurance",short:"ROYAL",type:"General Insurance",color:"#1c5088"},
    {name:"Universal Sompo General Insurance",short:"US",type:"General Insurance",color:"#1875b6"},
    {name:"Volo Health",short:"VOLO",type:"TPA / Health Team",color:"#4c9b51"},
    {name:"Magma HDI General Insurance",short:"MAGMA",type:"General Insurance",color:"#b72835"},
    {name:"Zuno General Insurance",short:"ZUNO",type:"General Insurance",color:"#6c28be"}
  ];

  // Validate required HTML elements.
  const requiredIds = [
    "providerGrid", "requestModal", "requestForm",
    "formToast", "toastMessage", "providerSearch",
    "clearProviderSearch", "searchStatus", "noProvidersFound",
    "providerCount", "requestDate", "requestTime",
    "selectedProviderName", "selectedProviderIcon",
    "requestModalTitle", "expiryDate", "contact",
    "whatsapp", "patientName", "age", "roomNo",
    "houseName", "place", "district", "doctor"
  ];

  const elements = {};

  for (const id of requiredIds) {
    elements[id] = document.getElementById(id);

    if (!elements[id]) {
      console.error(Missing HTML element: #${id});
      alert(
        `Application setup error: #${id} was not found. ` +
        "Please check your HTML element IDs."
      );
      return;
    }
  }

  if (!window.bootstrap ||
      !window.bootstrap.Modal ||
      !window.bootstrap.Toast) {
    alert("Bootstrap 5 JavaScript is not loaded. Please check your Bootstrap script.");
    return;
  }

  const grid = elements.providerGrid;
  const modalEl = elements.requestModal;
  const form = elements.requestForm;
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  const toast = bootstrap.Toast.getOrCreateInstance(
    elements.formToast
  );

  let selectedProvider = null;

  function showMessage(message) {
    elements.toastMessage.textContent = message;
    toast.show();
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character]));
  }

  // Build the insurance provider cards.
  grid.replaceChildren();

  providers.forEach((provider, index) => {
    const col = document.createElement("div");
    col.className = "col-6 col-md-4 col-lg-3 col-xl-2";

    col.innerHTML = `
      <button type="button"
        class="provider-card"
        data-provider-index="${index}"
        aria-label="Select ${escapeHTML(provider.name)}">

        <div class="provider-logo">
          <img
            class="provider-logo-image"
            src="assets/logos/provider-${String(index + 1).padStart(2, "0")}.png"
            alt="${escapeHTML(provider.name)} logo"
            loading="lazy"
            onerror="this.style.display='none'">
        </div>

        <span class="provider-name">
          ${escapeHTML(provider.name)}
        </span>

        <span class="provider-type">
          ${escapeHTML(provider.type)}
        </span>
      </button>
    `;

    grid.appendChild(col);
  });

  // Provider search.
  function filterProviders() {
    const query = elements.providerSearch.value
      .trim()
      .toLocaleLowerCase();

    let visible = 0;

    grid.querySelectorAll("[data-provider-index]").forEach(button => {
      const provider =
        providers[Number(button.dataset.providerIndex)];

      const searchable =
        ${provider.name} ${provider.short} ${provider.type}
          .toLocaleLowerCase();

      const matches = !query || searchable.includes(query);

      // Find the actual Bootstrap column, regardless of other wrappers.
      const column = button.closest(".col-6") || button.parentElement;
      column.hidden = !matches;

      if (matches) visible++;
    });

    elements.clearProviderSearch.hidden = !query;

    elements.searchStatus.textContent =
      ${visible} ${visible === 1 ? "provider" : "providers"} found;

    elements.noProvidersFound.hidden = visible !== 0;

    elements.providerCount.textContent = query
      ? ${visible} found
      : ${providers.length} providers;
  }

  elements.providerSearch.addEventListener("input", filterProviders);

  elements.clearProviderSearch.addEventListener("click", () => {
    elements.providerSearch.value = "";
    filterProviders();
    elements.providerSearch.focus();
  });

  elements.providerCount.textContent = ${providers.length} providers;

  // Set current date and time.
  function updateDateTime() {
    const now = new Date();

    elements.requestDate.value = now.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });

    elements.requestTime.value = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  }

  // Validate Indian mobile numbers and international numbers.
  function validPhone(input) {
    const digits = input.value.replace(/\D/g, "");

    // Allow 10-digit local numbers or international numbers
    // containing 8 to 15 digits.
    const valid =
      (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) ||
      (/^[1-9]\d{7,14}$/.test(digits));

    input.setCustomValidity(
      valid ? "" : "Enter a valid phone number with country code if required."
    );

    return valid;
  }

  ["contact", "whatsapp"].forEach(id => {
    const input = elements[id];

    input.addEventListener("input", () => {
      validPhone(input);
    });
  });

  // Select an insurance provider.
  grid.addEventListener("click", event => {
    const button = event.target.closest("[data-provider-index]");

    if (!button) return;

    selectedProvider =
      providers[Number(button.dataset.providerIndex)];

    elements.selectedProviderName.textContent =
      selectedProvider.name;

    elements.selectedProviderIcon.textContent =
      selectedProvider.short;

    elements.selectedProviderIcon.style.background =
      selectedProvider.color;

    elements.requestModalTitle.textContent =
      "Cashless Insurance Request";

    form.reset();
    form.classList.remove("was-validated");

    // Clear old custom validation errors.
    ["contact", "whatsapp"].forEach(id => {
      elements[id].setCustomValidity("");
    });

    updateDateTime();

    // Let the browser handle the insurance expiry date field.
    elements.expiryDate.min = "";

    modal.show();
  });

  // Refresh date and time whenever the modal opens.
  modalEl.addEventListener("show.bs.modal", updateDateTime);

  // Build the complete WhatsApp message.
  function buildWhatsAppMessage() {
    const value = id => {
      const element = document.getElementById(id);
      return element ? element.value.trim() : "";
    };

    return [
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
  }

  // Corrected WhatsApp destination and mobile-friendly opening.
  function openWhatsApp(message) {
    const phone = WHATSAPP_NUMBER.replace(/\D/g, "");

    if (!/^[1-9]\d{7,14}$/.test(phone)) {
      showMessage(
        "Invalid WhatsApp destination. Please check the hospital number."
      );
      return;
    }

    const url =
      "https://api.whatsapp.com/send?phone=" +
      phone +
      "&text=" +
      encodeURIComponent(message);

    // Navigate directly instead of opening a popup.
    // This helps avoid popup blockers on mobile devices.
    window.location.assign(url);
  }

  // Submit the form.
  form.addEventListener("submit", event => {
    event.preventDefault();

    if (!selectedProvider) {
      showMessage("Please select an insurance company or TPA first.");
      return;
    }

    validPhone(elements.contact);
    validPhone(elements.whatsapp);

    form.classList.add("was-validated");

    if (!form.checkValidity()) {
      const firstInvalid = form.querySelector(":invalid");

      if (firstInvalid) {
        firstInvalid.focus();
        if (typeof firstInvalid.reportValidity === "function") {
          firstInvalid.reportValidity();
        }
      }

      showMessage(
        "Please complete all required fields and correct the phone numbers."
      );

      return;
    }

    const message = buildWhatsAppMessage();

    // Called directly from the user's Submit action.
    openWhatsApp(message);
  });

  // Initial setup.
  updateDateTime();
  filterProviders();

})();
