<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\ContactMessage;
use App\Models\Fare;
use App\Models\TransitRoute;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * GET /api/admin/dashboard — headline counts for the overview screen.
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'announcements_total' => Announcement::count(),
                'announcements_published' => Announcement::published()->count(),
                'routes_active' => TransitRoute::where('is_active', true)->count(),
                'fares_active' => Fare::where('is_active', true)->count(),
                'messages_total' => ContactMessage::count(),
                'messages_unhandled' => ContactMessage::whereNull('handled_at')->count(),
                'recent_messages' => ContactMessage::latest()->limit(5)->get(['id', 'name', 'subject', 'created_at', 'handled_at']),
            ],
        ]);
    }
}
