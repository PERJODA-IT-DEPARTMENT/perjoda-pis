<?php

use App\Http\Controllers\Api\Admin\AnnouncementController as AdminAnnouncementController;
use App\Http\Controllers\Api\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Api\Admin\ContactMessageController as AdminContactMessageController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\FareController as AdminFareController;
use App\Http\Controllers\Api\Admin\PermissionController as AdminPermissionController;
use App\Http\Controllers\Api\Admin\RouteController as AdminRouteController;
use App\Http\Controllers\Api\Admin\SiteContentController as AdminSiteContentController;
use App\Http\Controllers\Api\Admin\UploadController as AdminUploadController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\FareController;
use App\Http\Controllers\Api\RouteController;
use App\Http\Controllers\Api\SiteContentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API (read-only, unauthenticated)
|--------------------------------------------------------------------------
*/

Route::get('routes', [RouteController::class, 'index']);
Route::get('routes/{route}', [RouteController::class, 'show'])->whereNumber('route');

Route::get('fares', [FareController::class, 'index']);

Route::get('announcements', [AnnouncementController::class, 'index']);
Route::get('announcements/{announcement}', [AnnouncementController::class, 'show'])->whereNumber('announcement');

Route::get('site-content', [SiteContentController::class, 'index']);

Route::post('contact', [ContactController::class, 'store'])->middleware('throttle:contact');

/*
|--------------------------------------------------------------------------
| Admin API (staff only — bearer token via Sanctum)
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->group(function () {
    Route::post('login', [AdminAuthController::class, 'login'])->middleware('throttle:admin-login');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me', [AdminAuthController::class, 'me']);
        Route::post('logout', [AdminAuthController::class, 'logout']);

        Route::get('dashboard', [AdminDashboardController::class, 'index']);

        // Every area below is gated by a togglable permission, not a hardcoded
        // role list — superadmin always passes; admin/staff pass only if a
        // superadmin has switched that permission on for their role (see the
        // Permissions page and RolePermission::DEFAULTS for the starting matrix).
        Route::middleware('permission:announcements.manage')->group(function () {
            Route::apiResource('announcements', AdminAnnouncementController::class);
            Route::post('uploads', [AdminUploadController::class, 'store']);
        });

        Route::middleware('permission:messages.manage')->group(function () {
            Route::get('contact-messages', [AdminContactMessageController::class, 'index']);
            Route::patch('contact-messages/{message}', [AdminContactMessageController::class, 'update']);
            Route::delete('contact-messages/{message}', [AdminContactMessageController::class, 'destroy']);
        });

        Route::middleware('permission:routes.manage')->group(function () {
            Route::apiResource('routes', AdminRouteController::class);
        });

        Route::middleware('permission:fares.manage')->group(function () {
            Route::put('fares-notices', [AdminFareController::class, 'updateNotices']);
            Route::apiResource('fares', AdminFareController::class)->except(['show']);
        });

        Route::middleware('permission:site_content.manage')->group(function () {
            Route::get('site-content', [AdminSiteContentController::class, 'show']);
            Route::put('site-content', [AdminSiteContentController::class, 'update']);
            Route::post('uploads/video', [AdminUploadController::class, 'storeVideo']);
        });

        // Staff accounts, roles, and the permission matrix itself — superadmin
        // only. Never togglable: a lower role could otherwise grant itself
        // this access.
        Route::middleware('role:superadmin')->group(function () {
            Route::apiResource('users', AdminUserController::class)->except(['show']);
            Route::get('permissions', [AdminPermissionController::class, 'index']);
            Route::put('permissions', [AdminPermissionController::class, 'update']);
        });
    });
});

Route::fallback(fn () => response()->json([
    'success' => false,
    'message' => 'The requested resource was not found.',
], 404));
