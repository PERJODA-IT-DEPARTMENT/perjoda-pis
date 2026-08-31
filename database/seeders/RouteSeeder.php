<?php

namespace Database\Seeders;

use App\Models\TransitRoute;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RouteSeeder extends Seeder
{
    /**
     * PERJODA currently operates a single route. Stop names are provided by
     * the cooperative; adjust here (or later via an admin interface) as the
     * service changes.
     */
    public function run(): void
    {
        $routes = [
            [
                'name' => 'SM Pala-Pala ↔ EPZA (Rosario)',
                'origin' => 'SM Pala-Pala',
                'destination' => 'EPZA (Rosario)',
                'description' => 'Regular public transportation service running between SM Pala-Pala and EPZA in Rosario, passing through the Langkaan and Tejero areas.',
                'operating_hours' => '5:00 AM – 10:00 PM',
                'stops' => [
                    'SM Pala-Pala',
                    'Langkaan (Caltex)',
                    'Langkaan (Bridge)',
                    'FCIE',
                    'De Fuego',
                    'Monterey / San Miguel',
                    'Maravilla',
                    'Country / Pabahay',
                    'Crystal Aire / Sunny Brooke',
                    'Nevada / Elang',
                    'G. Resort (Elang)',
                    'Carapiohan',
                    'Sulucan / Tirona',
                    'Pascam II',
                    'Pascam I',
                    'Riverside / Camachille Subd.',
                    'Navarro / Sta. Clara',
                    'Malabon',
                    'San Juan I',
                    'San Juan II',
                    'Tejero',
                    'EPZA (Rosario)',
                ],
            ],
        ];

        foreach ($routes as $index => $data) {
            $stops = $data['stops'];
            unset($data['stops']);

            $data['service_type'] = 'Regular Service';
            $data['sort_order'] = $index + 1;
            $data['is_active'] = true;
            $data['slug'] = Str::slug($data['origin'].'-'.$data['destination']);

            $route = TransitRoute::updateOrCreate(['slug' => $data['slug']], $data);

            $route->stops()->delete();

            foreach ($stops as $stopIndex => $stopName) {
                $route->stops()->create([
                    'name' => $stopName,
                    'sort_order' => $stopIndex + 1,
                ]);
            }
        }
    }
}
