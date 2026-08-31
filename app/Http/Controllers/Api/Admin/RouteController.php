<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\TransitRoute;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RouteController extends Controller
{
    /** GET /api/admin/routes — all routes with stops. */
    public function index(): JsonResponse
    {
        $routes = TransitRoute::query()->ordered()->with('stops')->get();

        return response()->json(['success' => true, 'data' => $routes]);
    }

    public function show(TransitRoute $route): JsonResponse
    {
        $route->load('stops');

        return response()->json(['success' => true, 'data' => $route]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request);
        $route = TransitRoute::create($this->attributes($data));
        $this->syncStops($route, $data['stops'] ?? []);

        return response()->json(['success' => true, 'data' => $route->load('stops')], 201);
    }

    public function update(Request $request, TransitRoute $route): JsonResponse
    {
        $data = $this->validated($request);
        $route->update($this->attributes($data));
        $this->syncStops($route, $data['stops'] ?? []);

        return response()->json(['success' => true, 'data' => $route->load('stops')]);
    }

    public function destroy(TransitRoute $route): JsonResponse
    {
        $route->delete();

        return response()->json(['success' => true, 'message' => 'Route deleted.']);
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'origin' => ['nullable', 'string', 'max:255'],
            'destination' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'service_type' => ['nullable', 'string', 'max:80'],
            'operating_hours' => ['nullable', 'string', 'max:120'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
            'stops' => ['array'],
            'stops.*' => ['string', 'max:255'],
        ]);
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function attributes(array $data): array
    {
        return [
            'name' => $data['name'],
            'slug' => Str::slug(($data['origin'] ?? '').'-'.($data['destination'] ?? $data['name'])) ?: Str::slug($data['name']),
            'origin' => $data['origin'] ?? null,
            'destination' => $data['destination'] ?? null,
            'description' => $data['description'] ?? null,
            'service_type' => $data['service_type'] ?? 'Regular Service',
            'operating_hours' => $data['operating_hours'] ?? null,
            'sort_order' => $data['sort_order'] ?? 0,
            'is_active' => $data['is_active'],
        ];
    }

    /**
     * @param  array<int, string>  $stops
     */
    private function syncStops(TransitRoute $route, array $stops): void
    {
        $route->stops()->delete();

        foreach (array_values(array_filter($stops, fn ($s) => trim((string) $s) !== '')) as $index => $name) {
            $route->stops()->create(['name' => trim($name), 'sort_order' => $index + 1]);
        }
    }
}
