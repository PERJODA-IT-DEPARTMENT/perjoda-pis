<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * Per-role toggle switches for admin panel areas. Superadmin is never
 * stored here — it always has every permission (see User::hasPermission).
 * Admin/Staff rows are optional; a missing row falls back to DEFAULTS so
 * behaviour is unchanged until a superadmin edits the matrix.
 */
class RolePermission extends Model
{
    protected $fillable = ['role', 'permissions'];

    protected function casts(): array
    {
        return ['permissions' => 'array'];
    }

    /** Known permission keys, in display order, with their sidebar/label text. */
    public const KEYS = [
        'routes.manage' => 'Routes & Stops',
        'fares.manage' => 'Fares',
        'site_content.manage' => 'Site Content',
        'announcements.manage' => 'Announcements',
        'messages.manage' => 'Contact Messages',
    ];

    public const DEFAULTS = [
        'admin' => [
            'routes.manage',
            'fares.manage',
            'site_content.manage',
            'announcements.manage',
            'messages.manage',
        ],
        'staff' => [
            'announcements.manage',
            'messages.manage',
        ],
    ];

    public static function permissionsFor(string $role): array
    {
        if ($role === User::ROLE_SUPERADMIN) {
            return array_keys(self::KEYS);
        }

        return Cache::rememberForever("role_permissions:{$role}", function () use ($role) {
            $row = static::query()->where('role', $role)->first();

            return $row ? $row->permissions : (self::DEFAULTS[$role] ?? []);
        });
    }

    public static function setPermissionsFor(string $role, array $permissions): void
    {
        $permissions = array_values(array_intersect($permissions, array_keys(self::KEYS)));

        static::query()->updateOrCreate(['role' => $role], ['permissions' => $permissions]);
        Cache::forget("role_permissions:{$role}");
    }
}
