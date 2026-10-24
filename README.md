# Santhi Nursing Home – Cashless Insurance Team

Responsive static web form for selecting an insurance provider/TPA and preparing a cashless insurance request for WhatsApp.

## Files
- `index.html` — page and form markup
- `styles.css` — styles and local responsive/layout helpers
- `app.js` — provider search, form validation, and WhatsApp message creation
- `assets/` — hospital logo and 25 provider logo images
- `DEPLOYMENT.md` — setup, deployment, testing, and limitations

## Quick start
Extract the ZIP and open `index.html` in a modern browser. No Bootstrap CDN or external JavaScript library is required for the interface. For best results, serve the folder using any static web server.

When a valid form is submitted, WhatsApp opens with a prefilled request message addressed to the configured hospital WhatsApp number. The user must check the message and press **Send** in WhatsApp.

## Before official use
Verify the WhatsApp destination number, hospital telephone numbers, provider logos/names, doctor list, and all form wording with hospital management. This is a front-end only app; it has no authentication, database, audit trail, or automatic submission confirmation. Review `DEPLOYMENT.md` before handling real patient data.
