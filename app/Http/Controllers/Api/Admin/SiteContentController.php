<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SiteContentController extends Controller
{
    /** GET /api/admin/site-content — full editable content document. */
    public function show(): JsonResponse
    {
        return response()->json(['success' => true, 'data' => SiteSetting::document()]);
    }

    /**
     * PUT /api/admin/site-content — update one or more content groups.
     * Only the groups present in the request are touched.
     */
    public function update(Request $request): JsonResponse
    {
        $rules = [
            'organisation' => ['sometimes', 'array'],
            'organisation.name' => ['required_with:organisation', 'string', 'max:120'],
            'organisation.legalName' => ['required_with:organisation', 'string', 'max:160'],
            'organisation.tagline' => ['nullable', 'string', 'max:200'],
            'organisation.address' => ['required_with:organisation', 'string', 'max:400'],
            'organisation.phone' => ['nullable', 'string', 'max:60'],
            'organisation.mobile' => ['nullable', 'string', 'max:60'],
            'organisation.email' => ['required_with:organisation', 'email', 'max:160'],
            'organisation.officeHours' => ['nullable', 'string', 'max:160'],
            'organisation.supportHours' => ['nullable', 'string', 'max:160'],

            'quickInfo' => ['sometimes', 'array'],
            'quickInfo.operatingHours' => ['nullable', 'string', 'max:120'],
            'quickInfo.routeSummary' => ['nullable', 'string', 'max:120'],
            'quickInfo.serviceSummary' => ['nullable', 'string', 'max:120'],
            'quickInfo.supportSummary' => ['nullable', 'string', 'max:120'],

            'about' => ['sometimes', 'array'],
            'about.paragraphs' => ['required_with:about', 'array', 'min:1'],
            'about.paragraphs.*' => ['string', 'max:2000'],
            'about.values' => ['required_with:about', 'array', 'min:1', 'max:6'],
            'about.values.*.icon' => ['required', 'string', 'max:60'],
            'about.values.*.title' => ['required', 'string', 'max:120'],
            'about.values.*.text' => ['required', 'string', 'max:400'],

            'showcase' => ['sometimes', 'array'],
            'showcase.title' => ['nullable', 'string', 'max:160'],
            'showcase.description' => ['nullable', 'string', 'max:600'],
            'showcase.videos' => ['nullable', 'array', 'max:12'],
            'showcase.videos.*.title' => ['nullable', 'string', 'max:160'],
            'showcase.videos.*.videoUrl' => ['required', 'string', 'max:500'],

            'missionVision' => ['sometimes', 'array'],
            'missionVision.mission' => ['required_with:missionVision', 'string', 'max:1000'],
            'missionVision.visionIntro' => ['nullable', 'string', 'max:400'],
            'missionVision.visionPoints' => ['nullable', 'array', 'max:8'],
            'missionVision.visionPoints.*' => ['string', 'max:600'],

            'fleetStats' => ['sometimes', 'array', 'max:8'],
            'fleetStats.*.count' => ['required', 'string', 'max:12'],
            'fleetStats.*.label' => ['required', 'string', 'max:120'],
            'fleetStats.*.icon' => ['required', 'string', 'max:60'],

            'faqs' => ['sometimes', 'array', 'max:20'],
            'faqs.*.q' => ['required', 'string', 'max:255'],
            'faqs.*.a' => ['required', 'string', 'max:2000'],

            'fareNotices' => ['sometimes', 'array'],
            'fareNotices.notice' => ['nullable', 'string', 'max:500'],
            'fareNotices.reminder' => ['nullable', 'string', 'max:500'],
        ];

        $validated = $request->validate($rules);

        foreach ($validated as $key => $value) {
            SiteSetting::put($key, $value);
        }

        return response()->json(['success' => true, 'data' => SiteSetting::document()]);
    }
}
