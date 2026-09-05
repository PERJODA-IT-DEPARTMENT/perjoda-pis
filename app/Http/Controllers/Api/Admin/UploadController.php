<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    /**
     * POST /api/admin/uploads — store an image and return its public URL.
     * Used for announcement images. Requires `php artisan storage:link`.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ]);

        $path = $request->file('file')->store('announcements', 'public');

        return response()->json([
            'success' => true,
            'data' => [
                'path' => $path,
                'url' => asset('storage/'.$path),
            ],
        ]);
    }

    /**
     * POST /api/admin/uploads/video — store a showcase video and return its public URL.
     * Requires `php artisan storage:link`.
     */
    public function storeVideo(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimetypes:video/mp4,video/webm,video/quicktime', 'max:204800'],
        ]);

        $path = $request->file('file')->store('showcase', 'public');

        return response()->json([
            'success' => true,
            'data' => [
                'path' => $path,
                'url' => asset('storage/'.$path),
            ],
        ]);
    }
}
