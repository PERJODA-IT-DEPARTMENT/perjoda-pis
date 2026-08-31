<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Creates the first PERJODA admin account. Override the credentials with
     * ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD in .env before seeding.
     * Additional staff accounts are created from inside the admin panel.
     */
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@perjoda.com');

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => env('ADMIN_NAME', 'PERJODA Administrator'),
                'password' => Hash::make(env('ADMIN_PASSWORD', 'perjoda-admin')),
            ],
        );

        $this->command?->info("Admin account ready: {$user->email}");
    }
}
