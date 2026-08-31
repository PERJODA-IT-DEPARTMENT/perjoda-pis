<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FareResource;
use App\Models\Fare;
use App\Models\SiteSetting;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FareController extends Controller
{
    /**
     * GET /api/fares — active public fare listing.
     */
    public function index(): AnonymousResourceCollection
    {
        $fares = Fare::query()->active()->ordered()->get();

        $notices = SiteSetting::get('fareNotices', [
            'notice' => 'Fares shown are for informational purposes and may be subject to change.',
            'reminder' => 'Students, senior citizens, and persons with disability are entitled to a 20% fare discount upon presentation of a valid ID.',
        ]);

        return FareResource::collection($fares)->additional([
            'success' => true,
            'meta' => $notices,
        ]);
    }
}
