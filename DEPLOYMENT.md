# Santhi Nursing Home – Cashless Insurance Team

## This version fixes “Library not found”
The application no longer depends on Bootstrap being downloaded from a CDN. Its required layout helpers, modal, and toast behavior are included locally, so the interface can load even when the Bootstrap library CDN is blocked or unavailable.

## Run locally
1. Extract the ZIP file.
2. Keep `index.html`, `app.js`, `styles.css`, and the `assets` folder together.
3. Open `index.html` in a modern browser, or preferably run it through a local static web server.
4. Select a provider, complete the required fields, and choose **Submit via WhatsApp**.
5. Confirm WhatsApp opens with the message. Review it and tap **Send** to submit.

## Deploy to a static host
1. Upload the contents of the `inssnh-main` folder to your approved static hosting provider (for example, the site's public web root).
2. Ensure `index.html` is at the web root and the `assets` directory is uploaded intact.
3. Enable HTTPS and test on Android and desktop.
4. Confirm the WhatsApp recipient number, hospital phone numbers, doctor list, provider names/logos, and message wording with hospital management.
5. Test every required field, invalid phone number, search, modal close/cancel, and WhatsApp hand-off before official use.

## Important production limitations
- This is a front-end static application. It does not provide staff login, a database, request tracking, audit logs, or automatic delivery confirmation.
- WhatsApp is opened with a prefilled message; a staff member must review and manually tap **Send**.
- Do not treat the page as a secure patient record system. Obtain hospital approval for processing patient information, restrict access to the deployed URL as appropriate, and follow applicable privacy and information-security requirements.
- If you later need login, storage, roles, and request tracking, add a secure backend and database rather than storing patient information in browser code.
