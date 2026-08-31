# PERJODA Transport Cooperative — Website + Admin Panel

Website for **PERJODA Transport Cooperative**, a Philippine public transportation
organization.

- **Public site** (`/`) — route, fares, passenger info, services, announcements,
  and a contact form.
- **Admin panel** (`/admin`) — staff operations panel to manage announcements,
  the route and its stops, fares, the contact inbox, editable site content, and
  staff accounts.

**Stack:** Laravel 13 (PHP 8.3+) REST API + MySQL/MariaDB · React 19 + Axios +
React Router + Bootstrap 5 + Bootstrap Icons, built with Vite · Sanctum bearer
tokens for admin auth.

---

## Requirements

PHP 8.3+ with `pdo_mysql` · Composer 2 · Node.js 20+ / npm · MySQL / MariaDB

## Setup

```bash
composer install
npm install

cp .env.example .env
php artisan key:generate

# edit .env:
#   DB_DATABASE / DB_USERNAME / DB_PASSWORD  (defaults: perjoda_db, root, no password)
#   ADMIN_EMAIL / ADMIN_PASSWORD             (the first admin account)

php artisan migrate --seed
php artisan storage:link      # for announcement image uploads
npm run build
```

## Running

```bash
php artisan serve      # http://localhost:8000
npm run dev            # Vite dev server with hot reload (development)
```

- Public site: `http://localhost:8000`
- Admin panel: `http://localhost:8000/admin`
  (default login `admin@perjoda.local` / `perjoda-admin` — **change it**)

---

## Public API (read-only, unauthenticated)

Consistent shape: `{ "success": true, "data": [], "meta": {} }`

| Method | Endpoint                  | Description                                    |
| ------ | ------------------------- | --------------------------------------------- |
| GET    | `/api/routes`             | Active routes with ordered stops              |
| GET    | `/api/routes/{id}`        | A single active route                         |
| GET    | `/api/fares`              | Active fares + notices (`meta`)               |
| GET    | `/api/announcements`      | Latest **published** announcements (`?limit`) |
| GET    | `/api/announcements/{id}` | A single published announcement               |
| GET    | `/api/site-content`       | Editable copy (contact, about, FAQ, …)        |
| POST   | `/api/contact`            | Submit a passenger enquiry                    |

Only published / active records are returned. Errors are normalized to
`{ "success": false, "message": "..." }` — no stack traces, SQL, or paths reach
the client (`bootstrap/app.php`). `GET`: 60 req/min/IP. `POST /api/contact`:
5 req/min/IP + hidden honeypot.

## Admin API (`/api/admin/*` — `auth:sanctum`)

| Method | Endpoint                              | Description                          |
| ------ | ------------------------------------- | ----------------------------------- |
| POST   | `/api/admin/login`                    | Exchange credentials for a token (5/min) |
| POST   | `/api/admin/logout`                   | Revoke the current token            |
| GET    | `/api/admin/me`                       | Current staff user                  |
| GET    | `/api/admin/dashboard`               | Headline counts                     |
| —      | `/api/admin/announcements`           | Full CRUD (all statuses)            |
| —      | `/api/admin/routes`                  | Full CRUD (stops sent as `stops: []`) |
| —      | `/api/admin/fares`                   | CRUD (no show)                      |
| PUT    | `/api/admin/fares-notices`           | The two fare-notice lines           |
| GET    | `/api/admin/contact-messages`        | Inbox (`?filter=unhandled`)         |
| PATCH  | `/api/admin/contact-messages/{id}`   | Toggle `handled`                    |
| DELETE | `/api/admin/contact-messages/{id}`   | Delete a message                    |
| GET/PUT| `/api/admin/site-content`            | Editable site copy (partial update) |
| POST   | `/api/admin/uploads`                 | Store an image, returns a URL       |
| —      | `/api/admin/users`                   | Staff CRUD (can't delete self / last) |

---

## Project layout

```
app/Http/Controllers/Api/
  RouteController, FareController, AnnouncementController, ContactController, SiteContentController
  Admin/  AuthController, DashboardController, AnnouncementController, RouteController,
          FareController, ContactMessageController, SiteContentController, UploadController, UserController
app/Models/  TransitRoute, RouteStop, Fare, Announcement, ContactMessage, SiteSetting, User
database/
  migrations/  routes, route_stops, fares, announcements, contact_messages, site_settings, personal_access_tokens
  seeders/     AdminUserSeeder, SiteContentSeeder, RouteSeeder, FareSeeder, AnnouncementSeeder
routes/
  api.php   public API + admin API
  web.php   /  → public React app,  /admin → admin React app
resources/
  views/app.blade.php    public shell (SEO, Open Graph, favicon)
  views/admin.blade.php   admin shell (noindex)
  css/app.css             public design system
  css/admin.css           admin styling
  js/
    main.jsx               public entry → <App/> (wrapped in SiteContentProvider)
    components/ pages/Home.jsx  public sections
    context/SiteContentContext.jsx   fetches /api/site-content, merges over static defaults
    services/api.js  hooks/  data/siteContent.js   (static fallback copy)
    admin.jsx             admin entry → <AdminApp/> (React Router, basename /admin)
    admin/  api.js, auth.jsx, ui.jsx, Layout.jsx, AdminApp.jsx, pages/*
public/
  favicon.svg
  images/logo/  perjoda-logo.png (transparent) / .jpeg (original)
  storage/      -> ../storage/app/public   (announcement uploads)
```

## Editing content

| Content | Where |
| --- | --- |
| Announcements, route & stops, fares | **Admin panel** (persisted to MySQL) |
| Contact details, hours, About, Mission/Vision, FAQ, fleet stats, fare notices | **Admin panel → Site Content** (`site_settings` table) |
| Services / passenger-info / why-choose lists, nav labels, hero pills | `resources/js/data/siteContent.js` (rarely changes) |
| Brand colors | CSS variables at the top of `resources/css/app.css` |
| Logo | replace `public/images/logo/perjoda-logo.png` (`siteContent.js → organisation.logo`) |

The public site reads editable copy from `/api/site-content` and falls back to
the values in `siteContent.js` if the request fails. Admin edits bust a
`site_content` cache and appear immediately.

## Notes

- Seeded fares, sample announcements, and placeholder contact details should be
  replaced with official information (all editable from the admin panel).
- The admin panel is `noindex` and unlinked from the public site.
