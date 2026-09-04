# Deployment (Docker + Coolify)

Production runs **one container** — Nginx + PHP-FPM (Laravel 13) under
`supervisord`, exposing **port 80**. React/Vite assets are compiled during the
image build. The database is a **separate Coolify-managed MySQL resource**.

```
Dockerfile
├── frontend  (node:22-alpine)      npm ci → npm run build → public/build
├── php-base  (php:8.4-fpm-alpine)  + pdo_mysql mbstring bcmath gd zip intl exif pcntl opcache
├── vendor    (php-base + composer) composer install --no-dev --optimize-autoloader
└── runtime   (php-base)            + nginx + supervisor  ← final image (no Node, no Composer)

docker/
├── entrypoint.sh               dirs → wait for DB → migrate → (seed) → cache config/views
├── nginx/default.conf          root = /var/www/html/public, PHP → 127.0.0.1:9000, port 80
├── php/php.ini                 prod OPcache + limits
├── php/www.conf                php-fpm pool, clear_env=no (Coolify env passthrough)
└── supervisor/supervisord.conf php-fpm + nginx (+ optional queue worker, off by default)
```

## Local testing

```bash
docker compose up --build          # http://localhost:8080  ·  /admin
docker compose down -v             # reset local DB + storage
```

`docker-compose.yml` is **local only** — Coolify never uses it. Its `db` service
is bound to `127.0.0.1` and is a throwaway.

## Coolify — one-time setup

1. **Project / Environment**: create project `perjoda` with environment
   `production` (add `staging` later for the develop branch).
2. **Database**: *+ New Resource → Database → MySQL 8*. Name it `perjoda-mysql`,
   database `perjoda`, user `perjoda`. Note the **internal hostname** and
   password — that is `DB_HOST` / `DB_PASSWORD`.
3. **Application**: *+ New Resource → Application → Public/Private Git*.
   - Repository: `https://github.com/PERJODA-IT-DEPARTMENT/perjoda-pis`
   - Branch: `main`
   - Build Pack: **Dockerfile**  ·  Dockerfile location: `/Dockerfile`
   - Ports Exposed: `80`
   - Health check path: `/up`  (interval 30s, timeout 5s, start period 45s)
   - Connect it to the same Coolify network as `perjoda-mysql`.
4. **Environment variables**: paste from `../.env.production.example`, fill every
   `CHANGE-ME`. `APP_KEY` = output of `php artisan key:generate --show`.
   For the **first deploy only** also set `DB_SEED_ON_DEPLOY=true` plus
   `ADMIN_EMAIL` / `ADMIN_PASSWORD`, then remove `DB_SEED_ON_DEPLOY` afterwards.
5. **Persistent storage** (Application → Storages), so uploads and logs survive
   redeploys:
   - `/var/www/html/storage/app/public`
   - `/var/www/html/storage/logs`
6. **Deploy**. Watch the build log. `migrate --force` runs automatically once the
   database is reachable.

`APP_URL` should match the URL Coolify serves (its generated `*.sslip.io`
address while you have no domain). Update it + redeploy when a domain is added.

## Branch → environment workflow

| Branch    | Coolify application     | Auto-deploy |
|-----------|-------------------------|-------------|
| `develop` | `perjoda` / `staging`   | on push     |
| `main`    | `perjoda` / `production`| on push (or manual — safer) |

- Create a **second Coolify application** from the same repo, branch `develop`,
  its own `staging` MySQL resource and env (`APP_ENV=staging`, `APP_DEBUG=false`,
  its own `APP_KEY`).
- Enable Coolify's GitHub webhook per application so only that branch triggers
  that environment. Feature branches deploy **nothing**.

Day-to-day:

```bash
git switch -c feature/xyz develop     # work
git push -u origin feature/xyz        # open PR → develop
# merge PR → Coolify deploys staging → test at the staging URL
git switch develop && git pull
git switch main && git merge --ff-only develop && git push   # → production
```

Roll back from the Coolify **Deployments** tab (redeploy a previous build).
