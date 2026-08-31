<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactRequest;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    /**
     * POST /api/contact — store a passenger enquiry.
     */
    public function store(ContactRequest $request): JsonResponse
    {
        $data = $request->safe()->only(['name', 'email', 'contact_number', 'subject', 'message']);

        ContactMessage::create([
            ...$data,
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 255),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thank you for reaching out. Our passenger support team will get back to you shortly.',
        ], 201);
    }
}
