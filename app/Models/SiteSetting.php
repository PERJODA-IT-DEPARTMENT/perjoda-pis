<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * Key/value store for editable public-site content (contact details,
 * about copy, mission/vision, FAQ, fleet stats, fare notices).
 * Values are JSON so a "key" can hold a string, list, or nested object.
 */
class SiteSetting extends Model
{
    protected $fillable = ['key', 'value'];

    protected function casts(): array
    {
        return ['value' => 'array'];
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        $row = static::query()->where('key', $key)->first();

        return $row ? $row->value : $default;
    }

    public static function put(string $key, mixed $value): void
    {
        static::query()->updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget('site_content');
    }

    /**
     * The full public content document, assembled from all known keys.
     * Cached; call SiteSetting::put() (which busts the cache) to change it.
     */
    public static function document(): array
    {
        return Cache::rememberForever('site_content', function () {
            $all = static::query()->pluck('value', 'key');

            return [
                'organisation' => $all['organisation'] ?? [],
                'quickInfo' => $all['quickInfo'] ?? [],
                'about' => $all['about'] ?? ['paragraphs' => [], 'values' => []],
                'showcase' => $all['showcase'] ?? ['title' => '', 'description' => '', 'videos' => []],
                'missionVision' => $all['missionVision'] ?? [],
                'fleetStats' => $all['fleetStats'] ?? [],
                'faqs' => $all['faqs'] ?? [],
                'fareNotices' => $all['fareNotices'] ?? [],
            ];
        });
    }
}
