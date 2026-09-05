<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Restricts a route to a togglable permission, e.g. `permission:routes.manage`.
 * Superadmin always passes. Admin/Staff pass only if a superadmin has
 * switched that permission on for their role (see RolePermission).
 * Must run after `auth:sanctum` so `$request->user()` is populated.
 */
class EnsurePermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (! $request->user()?->hasPermission($permission)) {
            abort(403, 'You do not have permission to access this resource.');
        }

        return $next($request);
    }
}
