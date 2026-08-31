<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Fare;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FareController extends Controller
{
    /** GET /api/admin/fares — all fares + the editable fare notices. */
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Fare::query()->ordered()->get(),
            'notices' => SiteSetting::get('fareNotices', ['notice' => '', 'reminder' => '']),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $fare = Fare::create($this->validated($request));

        return response()->json(['success' => true, 'data' => $fare], 201);
    }

    public function update(Request $request, Fare $fare): JsonResponse
    {
        $fare->update($this->validated($request));

        return response()->json(['success' => true, 'data' => $fare]);
    }

    public function destroy(Fare $fare): JsonResponse
    {
        $fare->delete();

        return response()->json(['success' => true, 'message' => 'Fare deleted.']);
    }

    /** PUT /api/admin/fares-notices — update the two informational lines. */
    public function updateNotices(Request $request): JsonResponse
    {
        $data = $request->validate([
            'notice' => ['nullable', 'string', 'max:500'],
            'reminder' => ['nullable', 'string', 'max:500'],
        ]);

        SiteSetting::put('fareNotices', $data);

        return response()->json(['success' => true, 'data' => $data]);
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'passenger_type' => ['required', 'string', 'max:120'],
            'amount' => ['nullable', 'numeric', 'min:0', 'max:100000'],
            'note' => ['nullable', 'string', 'max:255'],
            'effective_date' => ['nullable', 'date'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ]);
    }
}
