<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

/**
 * Seeds the editable public-site content. Mirrors the defaults that used to
 * live in resources/js/data/siteContent.js. Only seeds a key if it is missing
 * so admin edits are never overwritten by re-seeding.
 */
class SiteContentSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            'organisation' => [
                'name' => 'PERJODA',
                'legalName' => 'PERJODA Transport Cooperative',
                'tagline' => 'Moving People. Connecting Communities.',
                'address' => 'PERJODA Administrative Office, 231 Arnaldo Highway, Barangay Santiago, City of General Trias, Cavite, Philippines',
                'phone' => '(046) 000 0000',
                'mobile' => '+63 900 000 0000',
                'email' => 'info@perjoda.example',
                'officeHours' => 'Monday to Saturday, 8:00 AM – 5:00 PM',
                'supportHours' => 'Available during transportation operating hours',
            ],
            'quickInfo' => [
                'operatingHours' => '4:00 AM – 10:00 PM',
                'routeSummary' => 'SM Pala-Pala ↔ EPZA (Rosario)',
                'serviceSummary' => 'Daily Transportation',
                'supportSummary' => 'Passenger Assistance',
            ],
            'about' => [
                'paragraphs' => [
                    'PERJODA Transport Cooperative is a public transportation organization committed to providing reliable, safe, and accessible travel for the communities it serves. Our work is built around the everyday needs of passengers — getting to work and school, running errands, and staying connected with family.',
                    'We focus on dependable schedules, well-managed routes, and clear passenger information so that every trip feels predictable and stress-free. Safety guides how we operate, from the condition of our units to the conduct of our drivers and conductors.',
                    'Our fleet combines battery-electric E-future jeepneys with Ankai and Forland buses, giving passengers cleaner, quieter, and more comfortable rides while we keep transportation moving and communities connected.',
                ],
                'values' => [
                    ['icon' => 'bi-shield-check', 'title' => 'Safety', 'text' => 'Putting passenger and road safety at the heart of our operations.'],
                    ['icon' => 'bi-check2-circle', 'title' => 'Reliability', 'text' => 'Providing dependable transportation services for everyday journeys.'],
                    ['icon' => 'bi-people', 'title' => 'Service', 'text' => 'Creating a better experience for passengers and the communities we serve.'],
                ],
            ],
            'missionVision' => [
                'mission' => 'PERJODA Transport Cooperative is committed to creating a better, safer, and more comfortable riding experience for every commuter.',
                'visionIntro' => 'To be a leader in the transport industry, guided by these commitments:',
                'visionPoints' => [
                    'Build a well-developed and extensive service operation powered by a modern mode of transportation.',
                    'Sustain high standards and professionalism among our employees and stakeholders, raising the level of superior-quality transport service that helps build stronger socio-economic conditions.',
                    'Create economic opportunity by continuously strengthening the capital formation of the cooperative through both internal and external sources.',
                ],
            ],
            'fleetStats' => [
                ['count' => '13', 'label' => 'Electric E-future jeepneys', 'icon' => 'bi-ev-front'],
                ['count' => '10', 'label' => 'Ankai passenger buses', 'icon' => 'bi-bus-front'],
                ['count' => '2', 'label' => 'Forland passenger buses', 'icon' => 'bi-truck-front'],
            ],
            'faqs' => [
                ['q' => 'What route does PERJODA serve?', 'a' => 'PERJODA currently operates the SM Pala-Pala ↔ EPZA (Rosario) route. You can see its operating hours and full list of stops in the Route section above.'],
                ['q' => 'Where can I check fares?', 'a' => 'Current fare information for regular, student, senior citizen, and PWD passengers is listed in the Fare Information section.'],
                ['q' => 'What should I do if I lose my ticket?', 'a' => 'Please inform the conductor as soon as possible. Keeping your ticket for the whole trip helps with verification and assistance if any concern comes up.'],
                ['q' => 'How can I report a concern?', 'a' => 'You can send us a message using the contact form, or reach our passenger support team using the contact details provided.'],
                ['q' => 'Where can I find service announcements?', 'a' => 'Service advisories and updates are posted in the Latest Announcements section, which is updated as new information becomes available.'],
            ],
            'fareNotices' => [
                'notice' => 'Fares shown are for informational purposes and may be subject to change.',
                'reminder' => 'Students, senior citizens, and persons with disability are entitled to a 20% fare discount upon presentation of a valid ID.',
            ],
        ];

        foreach ($defaults as $key => $value) {
            if (! SiteSetting::query()->where('key', $key)->exists()) {
                SiteSetting::query()->create(['key' => $key, 'value' => $value]);
            }
        }
    }
}
