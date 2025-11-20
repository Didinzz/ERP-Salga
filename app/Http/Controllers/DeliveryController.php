<?php
// app/Http/Controllers/DeliveryController.php

namespace App\Http\Controllers;

use App\Models\Delivery;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use DB;

class DeliveryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status', 'date_from', 'date_to']);
        
        $deliveries = Delivery::with(['order', 'driver', 'order.items.product'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('delivery_code', 'like', "%{$search}%")
                      ->orWhere('recipient_name', 'like', "%{$search}%")
                      ->orWhere('recipient_phone', 'like', "%{$search}%")
                      ->orWhereHas('order', function ($q) use ($search) {
                          $q->where('order_code', 'like', "%{$search}%");
                      });
                });
            })
            ->when($filters['status'] ?? null, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($filters['date_from'] ?? null, function ($query, $dateFrom) {
                $query->whereDate('scheduled_date', '>=', $dateFrom);
            })
            ->when($filters['date_to'] ?? null, function ($query, $dateTo) {
                $query->whereDate('scheduled_date', '<=', $dateTo);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // Stats untuk dashboard
        $stats = [
            'total_deliveries' => Delivery::count(),
            'pending_deliveries' => Delivery::pending()->count(),
            'on_delivery' => Delivery::onDelivery()->count(),
            'delivered_today' => Delivery::delivered()->whereDate('delivered_at', today())->count(),
        ];

        // Semua user bisa jadi driver
        $drivers = User::all(['id', 'name']);

        return Inertia::render('Deliveries/Index', [
            'deliveries' => $deliveries,
            'filters' => $filters,
            'stats' => $stats,
            'drivers' => $drivers,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $orders = Order::where('status', 'confirmed')
            ->whereDoesntHave('delivery')
            ->with(['items.product'])
            ->get();

        $drivers = User::all(['id', 'name']);

        return Inertia::render('Deliveries/Create', [
            'orders' => $orders,
            'drivers' => $drivers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'driver_id' => 'nullable|exists:users,id',
            'recipient_name' => 'required|string|max:255',
            'recipient_phone' => 'required|string|max:20',
            'delivery_address' => 'required|string',
            'delivery_cost' => 'required|numeric|min:0',
            'scheduled_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            $delivery = Delivery::create([
                'order_id' => $validated['order_id'],
                'driver_id' => $validated['driver_id'],
                'recipient_name' => $validated['recipient_name'],
                'recipient_phone' => $validated['recipient_phone'],
                'delivery_address' => $validated['delivery_address'],
                'delivery_cost' => $validated['delivery_cost'],
                'scheduled_date' => $validated['scheduled_date'],
                'notes' => $validated['notes'],
                'status' => $validated['driver_id'] ? 'assigned' : 'pending',
            ]);

            if ($validated['driver_id']) {
                $delivery->assigned_at = now();
                $delivery->save();
            }

            DB::commit();

            return redirect()->route('deliveries.index')
                ->with('success', 'Pengiriman berhasil dibuat!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal membuat pengiriman: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Delivery $delivery)
    {
        $delivery->load(['order.items.product', 'driver']);
        
        return Inertia::render('Deliveries/Show', [
            'delivery' => $delivery,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Delivery $delivery)
    {
        if (in_array($delivery->status, ['delivered', 'cancelled'])) {
            return back()->with('error', 'Tidak dapat mengupdate pengiriman yang sudah selesai atau dibatalkan.');
        }

        $validated = $request->validate([
            'driver_id' => 'nullable|exists:users,id',
            'recipient_name' => 'required|string|max:255',
            'recipient_phone' => 'required|string|max:20',
            'delivery_address' => 'required|string',
            'delivery_cost' => 'required|numeric|min:0',
            'scheduled_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $delivery->update($validated);

        return redirect()->route('deliveries.index')
            ->with('success', 'Pengiriman berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Delivery $delivery)
    {
        if (!in_array($delivery->status, ['pending', 'cancelled'])) {
            return back()->with('error', 'Tidak dapat menghapus pengiriman yang sudah diproses.');
        }

        $delivery->delete();

        return redirect()->route('deliveries.index')
            ->with('success', 'Pengiriman berhasil dihapus!');
    }

    /**
     * Assign driver to delivery
     */
    public function assignDriver(Request $request, Delivery $delivery)
    {
        if (!$delivery->canBeAssigned()) {
            return back()->with('error', 'Pengiriman tidak dapat ditugaskan.');
        }

        $validated = $request->validate([
            'driver_id' => 'required|exists:users,id',
        ]);

        $delivery->assignDriver($validated['driver_id']);

        return back()->with('success', 'Driver berhasil ditugaskan!');
    }

    /**
     * Mark delivery as picked up
     */
    public function markAsPickedUp(Delivery $delivery)
    {
        if (!$delivery->canBePickedUp()) {
            return back()->with('error', 'Pengiriman tidak dapat dipickup.');
        }

        $delivery->markAsPickedUp();

        return back()->with('success', 'Status pengiriman diubah menjadi dalam perjalanan!');
    }

    /**
     * Mark delivery as delivered
     */
    public function markAsDelivered(Request $request, Delivery $delivery)
    {
        if (!$delivery->canBeDelivered()) {
            return back()->with('error', 'Pengiriman tidak dapat diselesaikan.');
        }

        $validated = $request->validate([
            'delivery_notes' => 'nullable|string',
        ]);

        $delivery->markAsDelivered($validated['delivery_notes']);

        return back()->with('success', 'Pengiriman berhasil diselesaikan!');
    }

    /**
     * Mark delivery as failed
     */
    public function markAsFailed(Request $request, Delivery $delivery)
    {
        $validated = $request->validate([
            'delivery_notes' => 'required|string',
        ]);

        $delivery->markAsFailed($validated['delivery_notes']);

        return back()->with('success', 'Pengiriman ditandai sebagai gagal!');
    }

    /**
     * Cancel delivery
     */
    public function cancel(Delivery $delivery)
    {
        if (in_array($delivery->status, ['delivered'])) {
            return back()->with('error', 'Tidak dapat membatalkan pengiriman yang sudah selesai.');
        }

        $delivery->cancelDelivery();

        return back()->with('success', 'Pengiriman berhasil dibatalkan!');
    }
}