<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpKernel\Exception\HttpException;

class UserController extends Controller
{
    /** GET /api/admin/users — all staff accounts. */
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => User::query()->orderBy('name')->get(['id', 'name', 'email', 'role', 'created_at']),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'max:255'],
            'role' => ['required', Rule::in(User::ROLES)],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
        ]);

        return response()->json([
            'success' => true,
            'data' => $user->only(['id', 'name', 'email', 'role', 'created_at']),
        ], 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8', 'max:255'],
            'role' => ['sometimes', Rule::in(User::ROLES)],
        ]);

        if (array_key_exists('role', $data) && $request->user()->id === $user->id) {
            throw new HttpException(422, 'You cannot change your own role.');
        }

        if (
            array_key_exists('role', $data)
            && $data['role'] !== User::ROLE_SUPERADMIN
            && $user->role === User::ROLE_SUPERADMIN
            && User::where('role', User::ROLE_SUPERADMIN)->count() <= 1
        ) {
            throw new HttpException(422, 'At least one superadmin account must remain.');
        }

        $user->name = $data['name'];
        $user->email = $data['email'];
        if (! empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }
        if (array_key_exists('role', $data)) {
            $user->role = $data['role'];
        }
        $user->save();

        return response()->json([
            'success' => true,
            'data' => $user->only(['id', 'name', 'email', 'role', 'created_at']),
        ]);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($request->user()->id === $user->id) {
            throw new HttpException(422, 'You cannot delete your own account.');
        }

        if (User::count() <= 1) {
            throw new HttpException(422, 'At least one staff account must remain.');
        }

        if ($user->role === User::ROLE_SUPERADMIN && User::where('role', User::ROLE_SUPERADMIN)->count() <= 1) {
            throw new HttpException(422, 'At least one superadmin account must remain.');
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json(['success' => true, 'message' => 'Staff account removed.']);
    }
}
