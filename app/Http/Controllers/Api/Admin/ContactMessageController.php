<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    /** GET /api/admin/contact-messages — inbox, newest first. */
    public function index(Request $request): JsonResponse
    {
        $query = ContactMessage::query()->latest();

        if ($request->string('filter')->toString() === 'unhandled') {
            $query->whereNull('handled_at');
        }

        return response()->json([
            'success' => true,
            'data' => $query->paginate(min((int) $request->integer('per_page', 20), 100)),
        ]);
    }

    /** PATCH /api/admin/contact-messages/{message} — toggle handled state. */
    public function update(Request $request, ContactMessage $message): JsonResponse
    {
        $data = $request->validate(['handled' => ['required', 'boolean']]);
        $message->update(['handled_at' => $data['handled'] ? now() : null]);

        return response()->json(['success' => true, 'data' => $message]);
    }

    public function destroy(ContactMessage $message): JsonResponse
    {
        $message->delete();

        return response()->json(['success' => true, 'message' => 'Message deleted.']);
    }
}
