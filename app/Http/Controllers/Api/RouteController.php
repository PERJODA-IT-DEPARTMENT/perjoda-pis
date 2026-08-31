<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RouteResource;
use App\Models\TransitRoute;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class RouteController extends Controller
{
    /**
     * GET /api/routes — active public routes with their ordered stops.
     */
    public function index(): AnonymousResourceCollection
    {
        $routes = TransitRoute::query()
            ->active()
            ->ordered()
            ->with('stops')
            ->get();

        return RouteResource::collection($routes)->additional(['success' => true]);
    }

    /**
     * GET /api/routes/{route} — a single active route.
     */
    public function show(TransitRoute $route): RouteResource
    {
        if (! $route->is_active) {
            throw new NotFoundHttpException('Route information is currently unavailable.');
        }

        $route->load('stops');

        return (new RouteResource($route))->additional(['success' => true]);
    }
}
