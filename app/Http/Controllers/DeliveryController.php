<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use App\Models\User; // Driver adalah User dengan role tertentu
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeliveryController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status', 'date_from', 'date_to']);

        $deliveries = Delivery::with(['order', 'driver'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    // Cari berdasarkan Kode Surat Jalan (di tabel deliveries)
                    $q->where('do_code', 'like', "%{$search}%")
                        ->orWhere('recipient_name', 'like', "%{$search}%")

                        // 2. Cari di tabel orders (Order Code)
                        ->orWhereHas('order', function ($qOrder) use ($search) {
                        $qOrder->where('order_code', 'like', "%{$search}%")

                            // 3. Cari di tabel customers (Nama Pelanggan) via Order
                            ->orWhereHas('customer', function ($qCustomer) use ($search) {
                                $qCustomer->where('name', 'like', "%{$search}%");
                            });

                    });
                });
            })
            ->when($filters['status'] ?? null, fn($q, $status) => $q->where('status', $status))
            // Filter Tanggal (Berdasarkan kapan dibuat / jadwal)
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
                    // Menggunakan Accessor di Model Delivery (pastikan modelnya sudah ada getCustomerNameAttribute)
                    'customer_name' => $delivery->customer_name,
                    'shipping_address' => $delivery->shipping_address,
                    'status' => $delivery->status,
                    'shipped_at' => $delivery->shipped_at,
                    'created_at' => $delivery->created_at,
                ];
            });

        // Ambil Driver untuk Dropdown  
        $drivers = User::whereIn('role', ['driver'])->select('id', 'name')->get();

        return Inertia::render('Deliveries/Index', [
            'deliveries' => $deliveries,
            'filters' => $filters,
            'drivers' => $drivers,
            'stats' => [
                'total_deliveries' => Delivery::count(),
                'pending_deliveries' => Delivery::where('status', 'pending')->count(),
                'on_delivery' => Delivery::where('status', 'shipping')->count(),
                'delivered_today' => Delivery::where('status', 'delivered')->whereDate('updated_at', today())->count(),
            ]
        ]);
    }

    // Assign Driver
    public function assignDriver(Request $request, Delivery $delivery)
    {
        $request->validate(['driver_id' => 'required|exists:users,id']);

        $delivery->update([
            'driver_id' => $request->driver_id,
            'status' => 'assigned', // Ubah status jadi Assigned (Siap dikirim)
            'assigned_at' => now(),
        ]);

        return back()->with('success', 'Driver berhasil ditugaskan!');
    }

    // Driver Berangkat (Pickup barang dari gudang)
    public function pickup(Delivery $delivery)
    {
        if ($delivery->status !== 'assigned')
            return back()->with('error', 'Status harus Assigned dulu.');

        $delivery->update([
            'status' => 'shipping',
            'shipped_at' => now(),
        ]);

        return back()->with('success', 'Status pengiriman berubah: Dalam Perjalanan.');
    }

    // Barang Sampai (Delivered) - Biasanya dilakukan oleh Driver via Mobile App/Web
    public function deliver(Request $request, Delivery $delivery)
    {
        // Validasi bukti foto jika perlu (opsional untuk admin panel)
        $delivery->update([
            'status' => 'delivered',
            'delivered_at' => now(),
            'driver_notes' => $request->delivery_notes ?? 'Selesai via Admin Panel',
        ]);

        // Opsional: Update status Order jadi Completed jika belum
        $delivery->order->update(['status' => 'completed']);

        return back()->with('success', 'Pengiriman selesai! Barang diterima.');
    }
}