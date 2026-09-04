#!/usr/bin/env bash
# PERJODA — container startup. Prepares writable dirs, waits for the database,
# migrates, primes caches, then hands over to supervisord (exec "$@").
set -euo pipefail

cd /var/www/html

log() { echo "[entrypoint] $*"; }

# --- 1. Writable directories -------------------------------------------------
log "Preparing storage + bootstrap/cache ..."
mkdir -p \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    storage/app/public \
    bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
chmod -R ug+rwX storage bootstrap/cache

# --- 2. Required configuration --------------------------------------------
if [ -z "${APP_KEY:-}" ]; then
    log "ERROR: APP_KEY is empty. Generate one locally with"
    log "       php artisan key:generate --show"
    log "       and set it as an environment variable in Coolify."
    exit 1
fi

# --- 3. storage:link (public/storage -> storage/app/public) ---------------
if [ ! -L public/storage ]; then
    log "Linking public/storage ..."
    php artisan storage:link --force || true
fi

# --- 4. Database: wait, then migrate ------------------------------------
DB_CONNECTION="${DB_CONNECTION:-mysql}"
if [ "$DB_CONNECTION" != "sqlite" ]; then
    log "Waiting for database at ${DB_HOST:-db}:${DB_PORT:-3306} ..."
    attempts=0
    until php -r '
        $h = getenv("DB_HOST") ?: "db";
        $p = getenv("DB_PORT") ?: "3306";
        $u = getenv("DB_USERNAME") ?: "root";
        $w = getenv("DB_PASSWORD") ?: "";
        $d = getenv("DB_DATABASE") ?: "";
        try {
            new PDO("mysql:host=$h;port=$p;dbname=$d", $u, $w, [PDO::ATTR_TIMEOUT => 3]);
            exit(0);
        } catch (Throwable $e) {
            exit(1);
        }
    '; do
        attempts=$((attempts + 1))
        if [ "$attempts" -ge 30 ]; then
            log "ERROR: database not reachable after ~60s. Check DB_* env vars"
            log "       and that the Coolify database service is running."
            exit 1
        fi
        sleep 2
    done
    log "Database is reachable."

    log "Running migrations (php artisan migrate --force) ..."
    php artisan migrate --force --no-interaction

    # First deploy only: set DB_SEED_ON_DEPLOY=true in Coolify to seed the
    # admin account + starter site content, then remove it. Never destructive.
    if [ "${DB_SEED_ON_DEPLOY:-false}" = "true" ]; then
        log "DB_SEED_ON_DEPLOY=true -> php artisan db:seed --force"
        php artisan db:seed --force --no-interaction || log "WARN: seeding failed (may already be seeded)"
    fi
fi

# --- 5. Optimize caches ---------------------------------------------------
log "Rebuilding framework caches ..."
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Caches were written as root; hand them back to the runtime user.
chown -R www-data:www-data storage bootstrap/cache

log "Startup complete. Starting: $*"
exec "$@"
