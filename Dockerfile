# syntax=docker/dockerfile:1.7
#
# PERJODA Transport Cooperative — production image
# Laravel 13 (PHP 8.4 FPM) + React 19 / Vite build + Nginx, one container, port 80.
# NOTE: PHP 8.4 (not 8.3) — composer.lock pins Symfony 8.1, which needs php >=8.4.1.
#
#   Stage 1  frontend  — compile the React/Vite production bundle
#   Stage 2  php-base   — PHP 8.4-fpm-alpine + required extensions (shared)
#   Stage 3  vendor     — Composer production dependencies (no dev)
#   Stage 4  runtime    — Nginx + PHP-FPM under supervisord (final image)
#
# The runtime image contains NO Node.js, NO Composer and NO dev dependencies.

# ---------------------------------------------------------------------------
# Stage 1: Frontend build (React + Vite)
# ---------------------------------------------------------------------------
FROM node:22-alpine AS frontend

WORKDIR /app

# Install JS dependencies from the lockfile for reproducible builds.
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# Only the sources Vite needs to produce public/build/*.
COPY vite.config.js ./
COPY resources ./resources
COPY public ./public

# VITE_APP_NAME is the only VITE_* the project references. Override at build
# time with:  --build-arg VITE_APP_NAME="..."
ARG VITE_APP_NAME="PERJODA Transport Cooperative"
ENV VITE_APP_NAME=${VITE_APP_NAME}

# -> public/build/manifest.json + public/build/assets/*
RUN npm run build


# ---------------------------------------------------------------------------
# Stage 2: PHP base with the extensions the app needs (shared by 3 and 4)
# ---------------------------------------------------------------------------
FROM php:8.4-fpm-alpine AS php-base

# mlocati's installer pulls the right apk build deps automatically.
COPY --from=mlocati/php-extension-installer:2 /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions \
        pdo_mysql \
        mbstring \
        bcmath \
        gd \
        zip \
        intl \
        exif \
        pcntl \
        opcache


# ---------------------------------------------------------------------------
# Stage 3: Composer production dependencies
# ---------------------------------------------------------------------------
FROM php-base AS vendor

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

WORKDIR /var/www/html

# Resolve dependencies first (better layer caching), scripts disabled so no
# database / app bootstrap is required during the image build.
COPY composer.json composer.lock ./
RUN composer install \
        --no-dev \
        --no-scripts \
        --no-autoloader \
        --no-interaction \
        --no-progress \
        --prefer-dist

# Bring in the application code and build the optimized autoloader.
# --no-scripts keeps the build hermetic (no artisan boot / no .env needed);
# Laravel discovers packages at runtime from vendor/composer/installed.json.
COPY . .
RUN composer dump-autoload --optimize --classmap-authoritative --no-dev --no-scripts \
 && mkdir -p \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/views \
        storage/logs \
        bootstrap/cache \
 && rm -rf node_modules public/build public/hot


# ---------------------------------------------------------------------------
# Stage 4: Runtime — Nginx + PHP-FPM (final image)
# ---------------------------------------------------------------------------
FROM php-base AS runtime

RUN apk add --no-cache nginx supervisor tini bash curl \
 && mkdir -p /run/nginx /var/lib/nginx/tmp \
 && chown -R www-data:www-data /run/nginx /var/lib/nginx

WORKDIR /var/www/html

# --- Service configuration -------------------------------------------------
COPY docker/php/php.ini            /usr/local/etc/php/conf.d/zz-app.ini
COPY docker/php/www.conf           /usr/local/etc/php-fpm.d/zz-www.conf
COPY docker/nginx/default.conf     /etc/nginx/nginx.conf
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# --- Application ---------------------------------------------------------
# App + vendor from stage 3, compiled front-end assets from stage 1.
COPY --from=vendor   --chown=www-data:www-data /var/www/html            /var/www/html
COPY --from=frontend --chown=www-data:www-data /app/public/build        /var/www/html/public/build

COPY docker/entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint \
 && chown -R www-data:www-data storage bootstrap/cache \
 && chmod -R ug+rwX storage bootstrap/cache

EXPOSE 80

# Laravel's built-in health endpoint (registered in bootstrap/app.php).
HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 \
    CMD curl -fsS http://127.0.0.1:80/up || exit 1

ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/entrypoint"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf", "-n"]
