# Santhi Nursing Home — Cashless Insurance Request App

## Latest changes
- Removed the full poster from the main page.
- Removed the “Before you begin” section.
- Updated the page subtitle to “Cashless Insurance Team”.
- Replaced the text SNH header badge with an enhanced hospital emblem on a clean white background.
- Added 25 enhanced, high-resolution PNG provider logo crops from the supplied insurance poster, with a white background.
- Kept the mobile full-screen form, scrollable fields, visible action buttons, validation, and WhatsApp submission.

## Files
- `index.html` — responsive main page and request form
- `styles.css` — responsive layout
- `app.js` — providers, form validation, automatic date/time and WhatsApp message generation
- `assets/santhi-hospital-logo.png` — hospital emblem cropped from the supplied poster
- `assets/logos/` — 25 enhanced high-resolution PNG logo crops taken from the supplied poster

## Run
1. Extract the ZIP file.
2. Open `index.html` in a modern browser or host the folder on a static web server.
3. Internet access is required for Bootstrap loaded from jsDelivr.
4. Select an insurance provider, complete the form, and submit via WhatsApp.
5. WhatsApp opens a prefilled message to `+91 85899 00277`. The user must review and tap Send.

## Important
Provider logo images are cropped from the supplied poster and may include some of the surrounding tile background; verify each logo crop and the official provider list before live deployment. The app does not silently send WhatsApp messages or save form submissions to a database. Use HTTPS and restrict access to authorized staff.


Image quality note: the supplied poster is the source for the logos. Images have been upscaled and sharpened for display, but original vector/high-resolution company logo files would be needed for true source-level HD quality.

- Added an optional **Room No.** field to the request form and WhatsApp message.


## Latest update
- Added tap-to-call numbers at the top: `9207861643` and `8075916160`.
- WhatsApp request recipient changed to `+91 80759 16160`.
- WhatsApp message now uses a professional format with sections for patient, insurance/medical, contact, and request timestamp details.


## Latest update
- Translated the main instruction sentence into Malayalam: `രോഗിയുടെ വിവരങ്ങൾ നൽകുന്നതിനായി താഴെ നിന്ന് നിങ്ങളുടെ ഇൻഷുറൻസ് കമ്പനിയെയോ TPA-യെയോ തിരഞ്ഞെടുക്കുക.`
- Added live search for insurance company / TPA names, abbreviations, and provider type. Search results update as the user types; a Clear button resets the search.
