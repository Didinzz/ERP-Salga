<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search']);

        $users = User::query()
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('kontak', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // Hitung statistik
        $totalUsers = User::count();
        $activeUsers = User::where('status', 'Aktif')->count();
        $adminUsers = User::where('role', 'Admin')->count();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => $filters,
            'stats' => [
                'total' => $totalUsers,
                'active' => $activeUsers,
                'admin' => $adminUsers,
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'kontak' => 'required|unique:users,kontak',
            'role'=> 'required|in:admin,staff,kasir,driver',
            'status' => 'required|in:aktif,nonaktif',
            'password' => 'required|min:8',
        ], [
            'name.required' => 'Nama wajib di isi',
            'email.required' => 'Email wajib di isi',
            'email.unique' => 'Email sudah pernah digunakan',
            'kontak.required' => 'Nomor wajib di isi',
            'kontak.unique' => 'Nomor sudah pernah digunakan',
            'password.required' => 'Password wajib di isi',
            'role.in'=> 'Role tidak valid',
            'password.min' => 'Password minimal harus 8 karakter'
        ]);

        // Set default values untuk role dan status
        $validated['password'] = Hash::make($validated['password']);

        User::create($validated);

        return redirect()->back()->with('success', 'Pengguna berhasil ditambahkan!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {

        // dd($request->all());
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'kontak' => 'required|unique:users,kontak,' . $user->id,
            'role' => 'required|in:admin,staff,kasir,driver',
            'status' => 'required|in:aktif,nonaktif',
        ];

        $messages = [
            'name.required' => 'Nama wajib di isi',
            'email.required' => 'Email wajib di isi',
            'email.unique' => 'Email sudah pernah digunakan',
            'kontak.required' => 'Nomor wajib di isi',
            'kontak.unique' => 'Nomor sudah pernah digunakan',
            'role.in' => 'role tidak valid',

        ];

        // Jika password diisi, tambahkan validasi
        if ($request->filled('password')) {
            $rules['password'] = 'min:8';
            $messages['password.min'] = 'Password minimal harus 8 karakter';
        }

        $validated = $request->validate($rules, $messages);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'kontak' => $validated['kontak'],
            'role'=> $validated['role'],
            'status' => $validated['status'],
        ];

        // Update password hanya jika diisi
        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return redirect()->back()->with('success', 'Pengguna berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Prevent user from deleting themselves
        if (auth()->id() === $user->id) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus akun sendiri.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'Pengguna berhasil dihapus!');
    }
}