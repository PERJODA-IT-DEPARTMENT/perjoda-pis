<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Public transportation route.
 *
 * Mapped to the "routes" table. The class is named TransitRoute to avoid
 * colliding with Laravel's Route facade inside controllers.
 */
class TransitRoute extends Model
{
    protected $table = 'routes';

    protected $fillable = [
        'name',
        'slug',
        'origin',
        'destination',
        'description',
        'service_type',
        'operating_hours',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function stops(): HasMany
    {
        return $this->hasMany(RouteStop::class, 'route_id')->orderBy('sort_order');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }
}
