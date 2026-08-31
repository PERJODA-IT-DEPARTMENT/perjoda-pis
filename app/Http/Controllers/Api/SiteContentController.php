<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;

class SiteContentController extends Controller
{
    /**
     * GET /api/site-content — editable copy for the public site
     * (contact details, about, mission/vision, FAQ, fleet, fare notices).
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => SiteSetting::document(),
        ]);
    }
}
