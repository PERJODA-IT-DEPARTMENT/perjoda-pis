<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AnnouncementController extends Controller
{
    /** GET /api/admin/announcements — every announcement, newest first. */
    public function index(Request $request): JsonResponse
    {
        $items = Announcement::query()
            ->latest('published_at')
            ->latest('id')
            ->paginate(min((int) $request->integer('per_page', 20), 100));

        return response()->json(['success' => true, 'data' => $items]);
    }

    public function show(Announcement $announcement): JsonResponse
    {
        return response()->json(['success' => true, 'data' => $announcement]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request);
        $data['slug'] = $this->uniqueSlug($data['title']);

        $announcement = Announcement::create($data);

        return response()->json(['success' => true, 'data' => $announcement], 201);
    }

    public function update(Request $request, Announcement $announcement): JsonResponse
    {
        $data = $this->validated($request, $announcement->id);

        if ($data['title'] !== $announcement->title) {
            $data['slug'] = $this->uniqueSlug($data['title'], $announcement->id);
        }

        $announcement->update($data);

        return response()->json(['success' => true, 'data' => $announcement]);
    }

    public function destroy(Announcement $announcement): JsonResponse
    {
        $announcement->delete();

        return response()->json(['success' => true, 'message' => 'Announcement deleted.']);
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:80'],
            'excerpt' => ['nullable', 'string', 'max:255'],
            'content' => ['required', 'string', 'max:20000'],
            'image' => ['nullable', 'string', 'max:2048'],
            'published_at' => ['nullable', 'date'],
            'is_published' => ['required', 'boolean'],
        ]);
    }

    private function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: 'announcement';
        $slug = $base;
        $i = 2;

        while (Announcement::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
