<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\TransitRoute
 */
class RouteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'origin' => $this->origin,
            'destination' => $this->destination,
            'description' => $this->description,
            'service_type' => $this->service_type,
            'operating_hours' => $this->operating_hours,
            'stops' => $this->whenLoaded('stops', fn () => $this->stops->pluck('name')->values()),
        ];
    }
}
