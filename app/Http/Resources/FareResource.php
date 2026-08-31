<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Fare
 */
class FareResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'passenger_type' => $this->passenger_type,
            'fare' => $this->label,
            'note' => $this->note,
            'effective_date' => optional($this->effective_date)->toDateString(),
        ];
    }
}
