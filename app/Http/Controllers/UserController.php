<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        // Ambil parameter search dari URL (jika ada)
        $query = User::query();

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('email', 'like', '%' . $request->search . '%');
        }

        // Ambil data dengan pagination (10 per halaman)
        $users = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Users/Index', [
            'users' => $users,
            // Kirim kembali filter search agar input tidak reset saat reload
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        // Validasi dan Simpan User (Simplifikasi)
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            // password default atau generate random
            'password' => 'required|min:8',
        ]);

        $validated['password'] = bcrypt($validated['password']);

        User::create($validated);

        return redirect()->back()->with('success', 'Pengguna berhasil ditambahkan!');
    }
}