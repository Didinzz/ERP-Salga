<?php
// app/Http/Controllers/OrderController.php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\MineralWaterProduct;
use Illuminate\Http\Request;
use Inertia\Inertia;
use DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status', 'payment_status', 'date_from', 'date_to']);
        
        $orders = Order::with(['user', 'items.product'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('order_code', 'like', "%{$search}%")
                      ->orWhere('customer_name', 'like', "%{$search}%")
                      ->orWhere('customer_phone', 'like', "%{$search}%");
                });
            })
            ->when($filters['status'] ?? null, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($filters['payment_status'] ?? null, function ($query, $paymentStatus) {
                $query->where('payment_status', $paymentStatus);
            })
            ->when($filters['date_from'] ?? null, function ($query, $dateFrom) {
                $query->whereDate('order_date', '>=', $dateFrom);
            })
            ->when($filters['date_to'] ?? null, function ($query, $dateTo) {
                $query->whereDate('order_date', '<=', $dateTo);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // Stats untuk dashboard
        $stats = [
            'total_orders' => Order::count(),
            'pending_orders' => Order::pending()->count(),
            'completed_orders' => Order::completed()->count(),
            'today_orders' => Order::today()->count(),
            'total_revenue' => Order::completed()->sum('total_amount'),
        ];

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'filters' => $filters,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $products = MineralWaterProduct::available()->get();
        
        return Inertia::render('Orders/Create', [
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'customer_address' => 'nullable|string',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:mineral_water_products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            // Create order
            $order = Order::create([
                'user_id' => auth()->id(),
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $validated['customer_phone'],
                'customer_address' => $validated['customer_address'],
                'notes' => $validated['notes'],
                'status' => 'confirmed', // Auto confirm new orders
            ]);

            // Create order items
            foreach ($validated['items'] as $item) {
                $product = MineralWaterProduct::find($item['product_id']);
                
                // Check stock availability
                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Stok {$product->name} tidak mencukupi. Stok tersedia: {$product->stock}");
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                    'subtotal' => $product->price * $item['quantity'],
                ]);
            }

            // Update order total
            $order->updateTotal();

            DB::commit();

            return redirect()->route('orders.index')
                ->with('success', 'Pemesanan berhasil dibuat!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        $order->load(['user', 'items.product']);
        
        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        if ($order->status === 'completed' || $order->status === 'cancelled') {
            return redirect()->route('orders.index')
                ->with('error', 'Tidak dapat mengedit order yang sudah selesai atau dibatalkan.');
        }

        $order->load(['items.product']);
        $products = MineralWaterProduct::available()->get();
        
        return Inertia::render('Orders/Edit', [
            'order' => $order,
            'products' => $products,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        if ($order->status === 'completed' || $order->status === 'cancelled') {
            return back()->with('error', 'Tidak dapat mengupdate order yang sudah selesai atau dibatalkan.');
        }

        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'customer_address' => 'nullable|string',
            'notes' => 'nullable|string',
            'status' => 'required|in:pending,confirmed,processing,completed,cancelled',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:mineral_water_products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.id' => 'nullable|exists:order_items,id', // for existing items
        ]);

        DB::beginTransaction();

        try {
            // Update order
            $order->update([
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $validated['customer_phone'],
                'customer_address' => $validated['customer_address'],
                'notes' => $validated['notes'],
                'status' => $validated['status'],
            ]);

            // Handle order items
            $existingItemIds = [];
            foreach ($validated['items'] as $itemData) {
                $product = MineralWaterProduct::find($itemData['product_id']);
                
                if (isset($itemData['id'])) {
                    // Update existing item
                    $item = OrderItem::find($itemData['id']);
                    $quantityDiff = $itemData['quantity'] - $item->quantity;
                    
                    // Check stock if increasing quantity
                    if ($quantityDiff > 0 && $product->stock < $quantityDiff) {
                        throw new \Exception("Stok {$product->name} tidak mencukupi. Stok tersedia: {$product->stock}");
                    }

                    $item->update([
                        'product_id' => $itemData['product_id'],
                        'quantity' => $itemData['quantity'],
                        'unit_price' => $product->price,
                    ]);

                    // Adjust stock
                    if ($quantityDiff != 0) {
                        if ($quantityDiff > 0) {
                            $product->decreaseStock($quantityDiff);
                        } else {
                            $product->increaseStock(abs($quantityDiff));
                        }
                    }

                    $existingItemIds[] = $itemData['id'];
                } else {
                    // Create new item
                    if ($product->stock < $itemData['quantity']) {
                        throw new \Exception("Stok {$product->name} tidak mencukupi. Stok tersedia: {$product->stock}");
                    }

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $itemData['product_id'],
                        'quantity' => $itemData['quantity'],
                        'unit_price' => $product->price,
                    ]);

                    // Stock already decreased in OrderItem observer
                }
            }

            // Delete removed items
            OrderItem::where('order_id', $order->id)
                ->whereNotIn('id', $existingItemIds)
                ->delete();

            // Update order total
            $order->updateTotal();

            DB::commit();

            return redirect()->route('orders.index')
                ->with('success', 'Pemesanan berhasil diperbarui!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        if ($order->status === 'completed') {
            return back()->with('error', 'Tidak dapat menghapus order yang sudah selesai.');
        }

        DB::beginTransaction();

        try {
            // Cancel order to return stock
            $order->cancelOrder();
            $order->delete();

            DB::commit();

            return redirect()->route('orders.index')
                ->with('success', 'Pemesanan berhasil dihapus!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menghapus pemesanan.');
        }
    }

    /**
     * Update payment for order
     */
    public function updatePayment(Request $request, Order $order)
    {
        $validated = $request->validate([
            'paid_amount' => 'required|numeric|min:0',
        ]);

        $order->update([
            'paid_amount' => $validated['paid_amount'],
        ]);

        // Auto complete order if fully paid and in processable status
        if ($order->canBeCompleted()) {
            $order->markAsCompleted();
        }

        return back()->with('success', 'Pembayaran berhasil diperbarui!');
    }

    /**
     * Complete order
     */
    public function complete(Order $order)
    {
        if ($order->canBeCompleted()) {
            $order->markAsCompleted();
            return back()->with('success', 'Order berhasil diselesaikan!');
        }

        return back()->with('error', 'Order tidak dapat diselesaikan. Pastikan status dan pembayaran sudah lengkap.');
    }

    /**
     * Cancel order
     */
    public function cancel(Order $order)
    {
        if (!in_array($order->status, ['completed'])) {
            $order->cancelOrder();
            return back()->with('success', 'Order berhasil dibatalkan!');
        }

        return back()->with('error', 'Order yang sudah selesai tidak dapat dibatalkan.');
    }
}