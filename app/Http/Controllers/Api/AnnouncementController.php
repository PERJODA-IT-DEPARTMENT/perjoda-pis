<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AnnouncementResource;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class AnnouncementController extends Controller
{
    /**
     * GET /api/announcements — latest published announcements only.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $limit = (int) $request->integer('limit', 6);
        $limit = max(1, min($limit, 20));

        $announcements = Announcement::query()
            ->published()
            ->limit($limit)
            ->get();

        return AnnouncementResource::collection($announcements)->additional(['success' => true]);
    }

    /**
     * GET /api/announcements/{announcement} — a single published announcement.
     */
    public function show(Announcement $announcement): AnnouncementResource
    {
        $isVisible = $announcement->is_published
            && $announcement->published_at !== null
            && $announcement->published_at->lessThanOrEqualTo(now());

        if (! $isVisible) {
            throw new NotFoundHttpException('This announcement is no longer available.');
        }

        return (new AnnouncementResource($announcement))->additional(['success' => true]);
    }
}
