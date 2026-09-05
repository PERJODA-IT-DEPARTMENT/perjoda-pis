<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Staff account for the PERJODA admin panel. There is no public
 * registration — every user row is a cooperative staff member, scoped
 * by role:
 *  - superadmin: full access, including managing staff accounts/roles.
 *  - admin: full access to content (routes, fares, site content,
 *    announcements, messages) but cannot manage staff accounts.
 *  - staff: limited to announcements and contact messages.
 */
#[Fillable(['name', 'email', 'password', 'role'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    public const ROLE_SUPERADMIN = 'superadmin';
    public const ROLE_ADMIN = 'admin';
    public const ROLE_STAFF = 'staff';

    public const ROLES = [self::ROLE_SUPERADMIN, self::ROLE_ADMIN, self::ROLE_STAFF];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === self::ROLE_SUPERADMIN;
    }

    public function hasAnyRole(string ...$roles): bool
    {
        return in_array($this->role, $roles, true);
    }

    public function hasPermission(string $permission): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        return in_array($permission, RolePermission::permissionsFor($this->role), true);
    }

    /** @return array<int, string> */
    public function effectivePermissions(): array
    {
        return RolePermission::permissionsFor($this->role);
    }
}
