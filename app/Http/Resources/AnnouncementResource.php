<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

/**
 * @mixin \App\Models\Announcement
 */
class AnnouncementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'category' => $this->category,
            'excerpt' => $this->excerpt ?: Str::limit(strip_tags($this->content), 160),
            'content' => $this->content,
            'image' => $this->image ? asset($this->image) : null,
            'published_at' => optional($this->published_at)->toDateString(),
        ];
    }
}
