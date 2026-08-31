<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Fare extends Model
{
    protected $fillable = [
        'passenger_type',
        'amount',
        'note',
        'effective_date',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'effective_date' => 'date',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /**
     * Display-ready fare label, e.g. "₱13.00" or "To be announced".
     */
    protected function label(): Attribute
    {
        return Attribute::get(fn (): string => $this->amount !== null
            ? '₱'.number_format((float) $this->amount, 2)
            : 'To be announced');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
