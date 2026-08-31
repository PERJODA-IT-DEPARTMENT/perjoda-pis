<?php

namespace Database\Seeders;

use App\Models\Fare;
use Illuminate\Database\Seeder;

class FareSeeder extends Seeder
{
    /**
     * Placeholder fare values. These are sample figures for layout purposes
     * and do not represent officially approved PERJODA fares.
     */
    public function run(): void
    {
        $fares = [
            ['passenger_type' => 'Regular', 'amount' => 15.00, 'note' => 'Standard fare for regular passengers.'],
            ['passenger_type' => 'Student', 'amount' => 12.00, 'note' => '20% discount applied. Valid school ID required upon boarding.'],
            ['passenger_type' => 'Senior Citizen', 'amount' => 12.00, 'note' => '20% discount applied. Valid senior citizen ID required upon boarding.'],
            ['passenger_type' => 'Person with Disability (PWD)', 'amount' => 12.00, 'note' => '20% discount applied. Valid PWD ID required upon boarding.'],
        ];

        foreach ($fares as $index => $data) {
            $data['sort_order'] = $index + 1;
            $data['is_active'] = true;
            $data['effective_date'] = null;

            Fare::updateOrCreate(['passenger_type' => $data['passenger_type']], $data);
        }
    }
}
