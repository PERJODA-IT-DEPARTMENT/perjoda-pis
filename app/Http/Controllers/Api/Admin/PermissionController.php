<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\RolePermission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PermissionController extends Controller
{
    /** GET /api/admin/permissions — the togglable matrix for Admin and Staff. */
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'keys' => collect(RolePermission::KEYS)
                    ->map(fn ($label, $key) => ['key' => $key, 'label' => $label])
                    ->values(),
                'roles' => [
                    'admin' => RolePermission::permissionsFor('admin'),
                    'staff' => RolePermission::permissionsFor('staff'),
                ],
            ],
        ]);
    }

    /** PUT /api/admin/permissions — replace the permission set for one role. */
    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'role' => ['required', Rule::in(['admin', 'staff'])],
            'permissions' => ['present', 'array'],
            'permissions.*' => [Rule::in(array_keys(RolePermission::KEYS))],
        ]);

        RolePermission::setPermissionsFor($data['role'], $data['permissions']);

        return response()->json([
            'success' => true,
            'data' => [
                'roles' => [
                    'admin' => RolePermission::permissionsFor('admin'),
                    'staff' => RolePermission::permissionsFor('staff'),
                ],
            ],
        ]);
    }
}
