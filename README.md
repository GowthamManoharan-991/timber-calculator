# Timber Calculator & Billing

A responsive, installable (PWA) web app for timber shops and carpenters to
calculate Cubic Feet (CFT), material cost, labour charges, and generate
professional quotations. Built with **React + Vite**, currently storing all
data in the browser's **Local Storage**, and structured so a future
**Node.js + Express + MySQL** backend can be dropped in without touching any
UI component.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`). The app
works fully offline once loaded, and can be installed from the browser
(look for "Install app" / the install icon in the address bar).

```bash
npm run build     # production build -> dist/
npm run preview   # preview the production build locally
```

## How the formulas work

```
CFT    = (Width(in) × Thickness(in) × Length(ft) × Quantity) / 144
Amount = CFT × Rate per CFT
Grand Total = Sum of all section amounts + Additional charges
```

See `src/utils/calculations.js`.

## Project structure

```
src/
  services/         # Data access layer (see "Architecture" below)
                     #   customerService, quotationService, settingsService,
                     #   reportService, userService, authService, rateRuleService
  context/           # React Context: AppContext (data), ThemeContext (dark mode),
                      # ToastContext, LanguageContext (i18n), AuthContext (RBAC)
  i18n/              # translations.js - the en/ta dictionary
  components/
    ui/               # Generic building blocks: Button, Input, Modal, Card, ...
    layout/            # Sidebar, Topbar, MobileNav, Layout
    customers/         # Customer form + list row
    calculator/        # Wood section/row, charges panel, totals, customer picker
    quotation/          # Printable quotation document
    auth/               # RequireRole route guard
    admin/              # BrandingForm, PricingRulesTable, UserForm, UserManagement
  pages/             # One component per route (Dashboard, Customers, Calculator,
                      # History, Reports, Settings, Admin, Login, ...)
  routes/            # React Router route table
  utils/             # calculations, validators, formatters, constants, id, password
```

## Architecture: why this is "future ready"

Every screen calls a **domain service** (`customerService`, `quotationService`,
`settingsService`, `reportService`) — never `localStorage` directly. Each
domain service in turn calls the single **`localStorageService`**, which
exposes a small, generic, **Promise-based** CRUD contract:

```js
getAll(collection)
getById(collection, id)
create(collection, data)
update(collection, id, updates)
remove(collection, id)
getObject(key) / setObject(key, value)   // for singleton data like settings
```

Because every method already returns a Promise (like `fetch` would), the UI
layer never assumes storage is synchronous. **To connect the real backend**,
create `src/services/apiService.js` that implements this same contract using
`fetch`/axios against your Express routes, then re-point the domain services
(`customerService.js`, `quotationService.js`, `settingsService.js`) to import
`apiService` instead of `localStorageService`. No component, page, or context
needs to change.

Suggested REST mapping for the future backend:

| Domain service method      | REST endpoint                  |
|-----------------------------|---------------------------------|
| `customerService.getCustomers()`   | `GET /api/customers`          |
| `customerService.addCustomer()`    | `POST /api/customers`         |
| `customerService.updateCustomer()` | `PUT /api/customers/:id`      |
| `customerService.deleteCustomer()` | `DELETE /api/customers/:id`   |
| `quotationService.getQuotations()` | `GET /api/quotations`         |
| `quotationService.saveQuotation()` | `POST /api/quotations`        |
| `quotationService.updateQuotation()`| `PUT /api/quotations/:id`    |
| `quotationService.deleteQuotation()`| `DELETE /api/quotations/:id` |
| `settingsService.getSettings()`    | `GET /api/settings`           |
| `settingsService.saveSettings()`   | `PUT /api/settings`           |
| `userService.getUsers()`           | `GET /api/users` (admin only) |
| `userService.addUser()`            | `POST /api/users` (admin only)|
| `userService.updateUser()`         | `PUT /api/users/:id` (admin only) |
| `userService.deleteUser()`         | `DELETE /api/users/:id` (admin only) |
| `authService.login()`              | `POST /api/auth/login` (returns JWT) |
| `authService.logout()`             | `POST /api/auth/logout` (or client-side token discard) |
| `rateRuleService.getRateRules()`   | `GET /api/rate-rules`         |
| `rateRuleService.addRateRule()`    | `POST /api/rate-rules`        |
| `rateRuleService.updateRateRule()` | `PUT /api/rate-rules/:id`     |
| `rateRuleService.deleteRateRule()` | `DELETE /api/rate-rules/:id`  |

When JWT auth is added, it can live entirely inside `apiService.js` (attach
`Authorization` header) plus a small `authService.js` / `AuthContext` — again
without touching pages or components.

## PWA notes

This project uses a hand-written `public/manifest.json` and
`public/service-worker.js` (registered in `src/main.jsx`) rather than a
build-plugin, to keep the dependency list minimal. The service worker caches
the app shell for offline use; all actual data still lives in Local Storage
on the device, not in the cache.

## Print / PDF export

The Quotation page's "Print / Save PDF" button calls `window.print()`. Print
styles in `src/index.css` (`@media print`) hide the app chrome and print only
the quotation document — in the browser's print dialog, choosing "Save as
PDF" as the destination produces a clean PDF with no extra setup or library.

## Language (English / Tamil)

The app ships with a lightweight i18n system (`src/context/LanguageContext.jsx`
+ `src/i18n/translations.js`) — no external i18n library required.

- Switch language from the selector in the top bar, or from **Settings ->
  Language**. The choice is saved to Local Storage (`timbercalc_language`)
  and persists across reloads.
- To add a new string: add a key to `src/i18n/translations.js` with both
  `en` and `ta` values, then call `t('your.key')` from any component via
  `const { t } = useLanguage();`.
- To add a third language, add its code/label to `SUPPORTED_LANGUAGES` in
  `translations.js` and add that language's value to every key.

## Admin Panel & role-based access

A minimal client-side auth layer (`src/services/authService.js` +
`src/services/userService.js` + `src/context/AuthContext.jsx`) gates the
`/admin` route by role:

- **First run**: a default admin account is seeded automatically —
  username `admin`, password `admin123`. **Change this password immediately**
  from Admin -> User Management once you've logged in the first time.
- **Login**: go to `/login` (or the "Login" link in the sidebar).
- **Roles**: `ADMIN` and `USER` (see `ROLES` in `src/utils/constants.js`).
  Only `ADMIN` accounts can open `/admin`; a logged-in `USER` sees an
  "Access denied" message instead of a silent redirect.
- **Admin Dashboard** (`src/pages/Admin.jsx`) has three tabs:
  1. **Shop Branding** — name, GSTIN, phone, address, logo. This is the
     same data shown in Settings and printed on every quotation.
  2. **Rate & Pricing Rules** — a default ₹/CFT rate per wood type. The
     Calculator auto-fills a new row's rate from these rules (carpenters
     can still override any individual row).
  3. **User Management** — add/edit/deactivate accounts and assign roles.

⚠️ **Security note**: there is still no backend, so this is a client-side
convenience gate, not real security — passwords are SHA-256 hashed (see
`src/utils/password.js`) rather than stored in plain text, but anyone with
local access to the browser's Local Storage can still see/edit the raw
data. When the Node/Express/MySQL backend is connected, replace
`authService.login()` with a real `POST /api/auth/login` call that issues a
JWT, and move password hashing (bcrypt/argon2) server-side — the rest of
the app (AuthContext, RequireRole, Admin UI) does not need to change.

## Deploying to Hostinger

```bash
npm run build
```

This produces a static `dist/` folder. To deploy:

1. Upload the **contents** of `dist/` (not the folder itself) to your
   Hostinger hosting root — usually `public_html/` for the domain root, or
   `public_html/your-subfolder/` if hosting under a sub-path.
2. Make sure `.htaccess` (already inside `dist/`, copied from
   `public/.htaccess` at build time) is uploaded too — enable "Show hidden
   files" in Hostinger's File Manager if you don't see it. This file makes
   client-side routes like `/calculator` or `/admin` work on a full page
   reload/direct link instead of 404ing (Apache SPA fallback), and sets
   sensible caching headers.
3. **Sub-folder deployments only**: if the app lives at
   `https://yourdomain.com/timber-app/` instead of the domain root, create
   a `.env.production` file with:
   ```
   VITE_BASE_PATH=/timber-app/
   ```
   then rebuild, and uncomment the `RewriteBase /timber-app/` line in
   `.htaccess`.
4. (Recommended) Enable free SSL for your domain in Hostinger's hPanel —
   the PWA install prompt and service worker require HTTPS (localhost is
   exempt for local development).

## Known limits of this version

- Local Storage has a browser-enforced size limit (usually 5–10MB). Company
  logos are capped at 500KB and downsized via the file input to stay safe.
- Local Storage is per-browser/per-device; there is no multi-device sync
  until the MySQL backend is connected.
