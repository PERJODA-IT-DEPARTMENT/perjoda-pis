<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Behind Coolify's reverse proxy (Traefik). Trust its forwarded
        // headers so HTTPS URLs and client IPs resolve correctly.
        $middleware->trustProxies(at: '*');
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        // Public users must never see stack traces, SQL, or server paths.
        // Everything served under /api/* is normalised to a friendly JSON shape.
        $exceptions->render(function (Throwable $e, Request $request): ?Response {
            if (! $request->is('api/*') && ! $request->expectsJson()) {
                return null;
            }

            if ($e instanceof ValidationException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Please review the highlighted fields and try again.',
                    'errors' => $e->errors(),
                ], 422);
            }

            if ($e instanceof AuthenticationException) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorised to perform this action.',
                ], 401);
            }

            if ($e instanceof ThrottleRequestsException) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have sent too many requests. Please wait a moment and try again.',
                ], 429);
            }

            if ($e instanceof ModelNotFoundException) {
                return response()->json([
                    'success' => false,
                    'message' => 'The requested information could not be found.',
                ], 404);
            }

            if ($e instanceof NotFoundHttpException) {
                $previous = $e->getPrevious();
                $message = $previous instanceof ModelNotFoundException
                    ? 'The requested information could not be found.'
                    : ($e->getMessage() ?: 'The requested information could not be found.');

                return response()->json([
                    'success' => false,
                    'message' => $message,
                ], 404);
            }

            $status = $e instanceof HttpExceptionInterface ? $e->getStatusCode() : 500;

            $message = match (true) {
                $status >= 500 => 'Something went wrong on our end. Please try again shortly.',
                $status === 403 => 'You do not have permission to access this resource.',
                default => $e->getMessage() ?: 'The request could not be completed.',
            };

            return response()->json([
                'success' => false,
                'message' => $message,
            ], $status);
        });
    })->create();
