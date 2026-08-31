<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the admin account and the public website content.
     */
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            SiteContentSeeder::class,
            RouteSeeder::class,
            FareSeeder::class,
            AnnouncementSeeder::class,
        ]);
    }
}
