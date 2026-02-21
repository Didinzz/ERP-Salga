<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // Pastikan ini diimport
use Inertia\Inertia;

class DeliveryController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status', 'date_from', 'date_to']);

        $deliveries = Delivery::with(['order.customer', 'driver'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    // Cari di tabel deliveries
                    $q->where('do_code', 'like', "%{$search}%")
                        ->orWhere('recipient_name', 'like', "%{$search}%")
                        // Cari di tabel orders (via relasi customer)
                        ->orWhereHas('order', function ($qOrder) use ($search) {
                        $qOrder->where('order_code', 'like', "%{$search}%")
                            ->orWhereHas('customer', function ($qCustomer) use ($search) {
                                $qCustomer->where('name', 'like', "%{$search}%");
                            });
                    });
                });
            })
            ->when($filters['status'] ?? null, fn($q, $status) => $q->where('status', $status))
            ->when($filters['date_from'] ?? null, fn($q, $date) => $q->whereDate('created_at', '>=', $date))
            ->when($filters['date_to'] ?? null, fn($q, $date) => $q->whereDate('created_at', '<=', $date))
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function ($delivery) {
                return [
                    'id' => $delivery->id,
                    'do_code' => $delivery->do_code,
                    'order' => [
                        'id' => $delivery->order->id,
                        'order_code' => $delivery->order->order_code,
                        'notes' => $delivery->order->notes,
                        'payment_status' => $delivery->order->payment_status,
                    ],
                    'driver' => $delivery->driver ? [
                        'id' => $delivery->driver->id,
                        'name' => $delivery->driver->name,
                        'phone' => $delivery->driver->kontak,
                    ] : null,
                    'customer_name' => $delivery->customer_name,
                    'shipping_address' => $delivery->shipping_address,
                    'status' => $delivery->status,
                    'shipped_at' => $delivery->shipped_at,
                    'created_at' => $delivery->created_at,
                    // Cek apakah file ada sebelum generate URL
                    'proof_photo' => ($delivery->proof_photo && Storage::disk('public')->exists($delivery->proof_photo))
                        ? asset('storage/' . $delivery->proof_photo)
                        : null,
                    'driver_notes' => $delivery->driver_notes,
                ];
            });

        $drivers = User::whereIn('role', ['driver'])->select('id', 'name')->get();

        return Inertia::render('Deliveries/Index', [
            'deliveries' => $deliveries,
            'filters' => $filters,
            'drivers' => $drivers,
            'stats' => [
                'total_deliveries' => Delivery::count(),
                'pending_deliveries' => Delivery::where('status', 'pending')->count(),
                'on_delivery' => Delivery::where('status', 'shipping')->count(),
                'total_delivered' => Delivery::where('status', 'delivered')->count(),
            ]
        ]);
    }

    public function assignDriver(Request $request, Delivery $delivery)
    {
        $request->validate(['driver_id' => 'required|exists:users,id']);

        $delivery->update([
            'driver_id' => $request->driver_id,
            'status' => 'assigned',
            'assigned_at' => now(),
        ]);

        return back()->with('success', 'Driver berhasil ditugaskan!');
    }

    public function pickup(Delivery $delivery)
    {
        if ($delivery->status !== 'assigned') {
            return back()->with('error', 'Status pengiriman harus Assigned dulu.');
        }

        $delivery->update([
            'status' => 'shipping',
            'shipped_at' => now()
        ]);

        return back()->with('success', 'Status: Dalam Perjalanan');
    }

    // --- UPDATE BAGIAN INI (GAYA UPLOAD MANUAL) ---
    public function deliver(Request $request, Delivery $delivery)
    {
        $request->validate([
            'delivery_notes' => 'nullable|string',
            'proof_photo' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $path = null;

        // 1. Upload Manual
        if ($request->hasFile('proof_photo')) {
            $file = $request->file('proof_photo');
            // Nama unik: delivery-proofs/WAKTU_NAMAASLI.ext
            $fileName = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
            $localPath = 'delivery-proofs/' . $fileName;

            // Simpan menggunakan put() dan file_get_contents()
            Storage::disk('public')->put($localPath, file_get_contents($file));

            $path = $localPath;
        }

        $delivery->update([
            'status' => 'delivered',
            'delivered_at' => now(),
            'driver_notes' => $request->delivery_notes,
            'proof_photo' => $path,
        ]);

        $delivery->order->update(['status' => 'completed']);

        return back()->with('success', 'Pengiriman Selesai! Barang diterima.');
    }

    // --- UPDATE BAGIAN INI JUGA ---
    public function fail(Request $request, Delivery $delivery)
    {
        $request->validate([
            'delivery_notes' => 'nullable|string',
            'proof_photo' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $path = null;

        // 1. Upload Manual
        if ($request->hasFile('proof_photo')) {
            $file = $request->file('proof_photo');
            $fileName = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
            $localPath = 'delivery-proofs/' . $fileName;

            Storage::disk('public')->put($localPath, file_get_contents($file));

            $path = $localPath;
        }

        $delivery->update([
            'status' => 'failed',
            'driver_notes' => $request->delivery_notes,
            'proof_photo' => $path,
        ]);

        return back()->with('error', 'Pengiriman ditandai Gagal.');
    }

    public function cancel(Delivery $delivery)
    {
        if ($delivery->status === 'delivered') {
            return back()->with('error', 'Tidak bisa membatalkan pengiriman yang sudah selesai.');
        }

        $delivery->update([
            'status' => 'failed',
            'driver_notes' => 'Dibatalkan oleh Admin',
            'driver_id' => null
        ]);

        return back()->with('success', 'Pengiriman dibatalkan.');
    }

    public function destroy(Delivery $delivery)
    {
        // Hapus foto bukti jika ada sebelum hapus data
        if ($delivery->proof_photo && Storage::disk('public')->exists($delivery->proof_photo)) {
            Storage::disk('public')->delete($delivery->proof_photo);
        }

        $delivery->delete();
        return back()->with('success', 'Data dihapus.');
    }
}