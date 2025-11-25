<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\MineralWaterProduct;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class KasirController extends Controller
{
    public function index()
    {
        $products = MineralWaterProduct::where('is_available', true)
            ->where('stock', '>', 0)
            ->select('id', 'name', 'price', 'stock', 'image', 'size', 'product_code')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => (float) $product->price,
                    'stock' => $product->stock,
                    'size' => $product->size,
                    'code' => $product->product_code,
                    'image_url' => $product->image
                        ? asset('storage/' . $product->image)
                        : 'https://placehold.co/300x300/e2e8f0/1e40af?text=No+Image',
                ];
            });

        $transactions = Order::where('status', 'completed')
            ->with(['user', 'items.product']) // Eager load product biar efisien
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_code' => $order->order_code,
                    'customer_name' => $order->customer_name,
                    'total_amount' => (float) $order->total_amount,
                    'payment_method' => $order->payment_method,
                    'payment_status' => $order->payment_status,
                    'order_date' => $order->order_date->format('d/m/Y H:i'),
                    'items' => $order->items->map(function ($item) {
                        return [
                            // Ambil dari snapshot product_name jika ada, atau fallback ke relasi
                            'product_name' => $item->product_name ?? $item->product->name ?? 'Produk Dihapus',
                            'quantity' => $item->quantity,
                            'subtotal' => (float) $item->subtotal,
                        ];
                    }),
                ];
            });

            $customer = Customer::select('id', 'name', 'owner_name', 'phone', 'address')->get();

        return Inertia::render('Kasir/Index', [
            'products' => $products,
            'initialTransactions' => $transactions,
            'cashierName' => auth()->user()->name ?? 'kasir',
            'customer' => $customer,
            'date' => now()->translatedFormat('l, d F Y'),
        ]);
    }

    public function processOrder(Request $request)
    {
        // Validasi
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:mineral_water_products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'paid_amount' => 'required|numeric|min:0',
            'payment_status' => 'required|in:pending,paid,partial',
            'payment_method' => 'required|in:cash,transfer,qris',
            'payment_proof' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'bank_name' => 'nullable|string',
            'notes' => 'nullable|string',
        ], [
            'customer_id.exists' => 'Pelanggan tidak ditemukan.',
            'items.required' => 'Tidak ada item dalam pesanan.',
        ]);

        try {
            DB::transaction(function () use ($request) {

                // Upload Bukti
                $paymentProofPath = null;
                if ($request->hasFile('payment_proof')) {
                    $file = $request->file('payment_proof');
                    $fileName = 'proof-' . time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $file->move(public_path('uploads/payment-proofs'), $fileName);
                    $paymentProofPath = 'uploads/payment-proofs/' . $fileName;
                }

                // Create Order
                $order = Order::create([
                    'order_code' => Order::generateOrderCode(),
                    'user_id' => auth()->id(),

                    // Simpan Customer ID
                    'customer_id' => $request->customer_id,

                    'status' => 'completed',
                    'total_amount' => 0, // Update nanti
                    'paid_amount' => $request->paid_amount,
                    'payment_status' => $request->payment_status,
                    'payment_method' => $request->payment_method,

                    // Simpan Nama Bank
                    'bank_name' => $request->bank_name,

                    'payment_proof' => $paymentProofPath,
                    'notes' => $request->notes,
                    'order_date' => now(),
                    'completed_date' => now(),
                ]);

                $totalAmount = 0;

                // Create Items
                foreach ($request->items as $item) {
                    $product = MineralWaterProduct::lockForUpdate()->find($item['product_id']);

                    if (!$product)
                        throw new \Exception("Produk tidak ditemukan");
                    if ($product->stock < $item['quantity']) {
                        throw new \Exception("Stok {$product->name} habis. Sisa: {$product->stock}");
                    }

                    $subtotal = $product->price * $item['quantity'];

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item['product_id'],

                        // Snapshot Data Penting
                        'product_name' => $product->name,
                        'product_code' => $product->product_code,

                        'quantity' => $item['quantity'],
                        'unit_price' => $product->price,
                        'subtotal' => $subtotal,
                    ]);

                    $product->decrement('stock', $item['quantity']);
                    $totalAmount += $subtotal;
                }

                $order->update(['total_amount' => $totalAmount]);
            });

            return redirect()->back()->with('success', 'Transaksi berhasil disimpan!');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Gagal: ' . $e->getMessage()]);
        }
    }

    /**
     * Menampilkan detail order spesifik
     */
    public function showOrder(Order $order)
    {
        // Load relasi user (kasir) dan items beserta produk aslinya (untuk ambil gambar jika perlu)
        $order->load(['user', 'items.product']);

        return Inertia::render('Kasir/OrderDetail', [
            'order' => [
                'id' => $order->id,
                'order_code' => $order->order_code,
                'customer_name' => $order->customer->name,
                'customer_id' => $order->customer_id,
                'customer_phone' => $order->customer->phone,
                'customer_address' => $order->customer->address,

                // Status & Keuangan
                'status' => $order->status,
                'total_amount' => (float) $order->total_amount,
                'paid_amount' => (float) $order->paid_amount,
                'payment_status' => $order->payment_status,
                'payment_method' => $order->payment_method,
                'bank_name' => $order->bank_name,

                // Bukti Bayar (Generate URL asset)
                'payment_proof' => $order->payment_proof ? asset($order->payment_proof) : null,

                'notes' => $order->notes,

                // Waktu
                'order_date' => $order->order_date->format('d/m/Y H:i'),
                'completed_date' => $order->completed_date?->format('d/m/Y H:i'),

                'cashier_name' => $order->user->name ?? 'Sistem',

                // Items
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        // PENTING: Ambil nama dari snapshot order_items dulu (sejarah), baru fallback ke master product
                        'product_name' => $item->product_name ?? $item->product->name ?? 'Produk dihapus',
                        'product_code' => $item->product_code ?? $item->product->product_code ?? '-',
                        'quantity' => $item->quantity,
                        'unit_price' => (float) $item->unit_price,
                        'subtotal' => (float) $item->subtotal,
                        // Gambar tetap ambil dari master product terkini (opsional)
                        'image_url' => $item->product && $item->product->image
                            ? asset('storage/' . $item->product->image)
                            : 'https://placehold.co/300x300/e2e8f0/1e40af?text=No+Image',
                    ];
                }),
            ]
        ]);
    }


    public function printInvoice(Order $order)
    {
        $order->load(['user', 'items']); // Hapus .product jika pake snapshot product_name

        $data = [
            'order' => $order,
            'company' => [
                'name' => 'PT SALGA MANDIRI',
                'address' => 'Gorontalo, Indonesia',
                'email' => 'salgamandiri@salgamandiri.com',
                'phone' => '(0435) 123456',
            ]
        ];

        $pdf = Pdf::loadView('pdf.invoice', $data);
        return $pdf->download('invoice-' . $order->order_code . '.pdf');
    }
}