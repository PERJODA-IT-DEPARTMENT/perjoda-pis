<?php

namespace Database\Seeders;

use App\Models\Announcement;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class AnnouncementSeeder extends Seeder
{
    /**
     * Sample announcements. Content is placeholder text for demonstration
     * and should be replaced with official PERJODA advisories.
     */
    public function run(): void
    {
        $announcements = [
            [
                'title' => 'Temporary Route Advisory',
                'category' => 'Service Advisory',
                'excerpt' => 'Passengers may experience minor schedule adjustments along the route this week.',
                'content' => 'Please be advised of possible changes to transportation operations along the route due to ongoing road works and local events. Our teams are adjusting trips to keep waiting times as short as possible. Passengers are encouraged to allow extra travel time and to check this page for updates.',
                'published_at' => Carbon::create(2026, 8, 28, 8, 0),
                'is_published' => true,
            ],
            [
                'title' => 'Extended Service Hours During the Holiday Season',
                'category' => 'Announcement',
                'excerpt' => 'Additional trips will be added during the holiday period.',
                'content' => 'To support passengers travelling during the holiday season, additional trips will be scheduled along the route. Extra units will be deployed during morning and evening peak periods. Final schedules will be posted here and at terminals ahead of the holidays.',
                'published_at' => Carbon::create(2026, 8, 20, 9, 30),
                'is_published' => true,
            ],
            [
                'title' => 'Reminder: Prepare Exact Fare Before Boarding',
                'category' => 'Passenger Reminder',
                'excerpt' => 'Having exact fare ready helps keep boarding quick and orderly for everyone.',
                'content' => 'Passengers are reminded to prepare their exact fare before boarding. This helps keep boarding quick and orderly, especially during peak hours. Students, senior citizens, and persons with disability should have their valid IDs ready to claim the applicable discounted fare.',
                'published_at' => Carbon::create(2026, 8, 12, 7, 0),
                'is_published' => true,
            ],
            [
                'title' => 'Lost and Found Desk Now Available at Main Terminal',
                'category' => 'Announcement',
                'excerpt' => 'A dedicated lost and found desk is now open at the main terminal during operating hours.',
                'content' => 'A dedicated lost and found desk is now available at the main terminal during operating hours. Passengers who have left belongings on board may report the item through our contact channels or visit the desk in person with a valid ID and a description of the item.',
                'published_at' => Carbon::create(2026, 7, 30, 10, 0),
                'is_published' => true,
            ],
            [
                'title' => 'Draft: Upcoming Fare Matrix Review',
                'category' => 'Announcement',
                'excerpt' => 'Internal draft — not for public display.',
                'content' => 'This unpublished record exists to demonstrate that the API only returns published announcements.',
                'published_at' => null,
                'is_published' => false,
            ],
        ];

        foreach ($announcements as $data) {
            $data['slug'] = Str::slug($data['title']);
            Announcement::updateOrCreate(['slug' => $data['slug']], $data);
        }
    }
}
