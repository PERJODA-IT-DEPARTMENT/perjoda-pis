<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Restricts a route to the given roles, e.g. `role:superadmin,admin`.
 * Must run after `auth:sanctum` so `$request->user()` is populated.
 */
class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (! $request->user()?->hasAnyRole(...$roles)) {
            abort(403, 'You do not have permission to access this resource.');
        }

        return $next($request);
    }
}
