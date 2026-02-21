<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;


class MapsController extends Controller
{
    public function index(): Response
    {
        $customers = Customer::whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get()
            ->map(function ($c) {
                return [
                    'id' => $c->id,
                    'name' => $c->name,
                    'owner' => $c->owner_name,
                    'phone' => $c->phone,
                    'status' => $c->status,
                    'address' => $c->address,
                    'lat' => (float) $c->latitude, // Pastikan float untuk Leaflet
                    'lng' => (float) $c->longitude,
                ];
            });

        return Inertia::render('Maps/Index', [
            'customers' => $customers
        ]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'owner_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'status' => 'required|in:active,inactive',
        ], [
            'name.required' => 'Nama wajib di isi',
            'address.required' => 'Alamat wajib di isi',
            'latitude.required' => 'Latitude wajib di isi',
            'longitude.required' => 'Longitude wajib di isi',
            'status.required' => 'Status wajib di isi',
            'status.in' => 'Status wajib harus active atau inactive',
        ]);

        Customer::create($validated);

        return redirect()->back()->with('success', 'Lokasi pelanggan berhasil ditambahkan.');
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'owner_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'required|string',
            // Lat/Lng opsional saat edit, jika tidak digeser mapnya
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'status' => 'required|in:active,inactive',
        ], [
            'name.required' => 'Nama wajib di isi',
            'address.required' => 'Alamat wajib di isi',
            'latitude.required' => 'Latitude wajib di isi',
            'longitude.required' => 'Longitude wajib di isi',
            'status.required' => 'Status wajib di isi',
            'status.in' => 'Status wajib harus active atau inactive',
        ]);

        $customer->update($validated);

        return redirect()->back()->with('success', 'Data pelanggan berhasil diperbarui.');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return redirect()->back()->with('success', 'Lokasi pelanggan dihapus.');
    }

}
