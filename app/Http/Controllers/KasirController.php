<?php

namespace App\Http\Controllers;

use App\Models\MineralWaterProduct;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
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

        // PERBAIKAN: Ambil semua transaksi completed, bukan hanya hari ini
        $transactions = Order::where('status', 'completed')
            ->with(['user', 'items'])
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_code' => $order->order_code,
                    'customer_name' => $order->customer_name,
                    'total_amount' => (float) $order->total_amount,
                    'paid_amount' => (float) $order->paid_amount,
                    'payment_status' => $order->payment_status,
                    'payment_method' => $order->payment_method,
                    'status' => $order->status,
                    'order_date' => $order->order_date->format('d/m/Y H:i'),
                    'items' => $order->items->map(function ($item) {
                        return [
                            'product_name' => $item->product->name ?? 'Produk tidak ditemukan',
                            'quantity' => $item->quantity,
                            'unit_price' => (float) $item->unit_price,
                            'subtotal' => (float) $item->subtotal,
                        ];
                    }),
                ];
            });

        return Inertia::render('Kasir/Index', [
            'products' => $products,
            'cashierName' => auth()->user()->name ?? 'Staff',
            'initialTransactions' => $transactions, // PERBAIKAN: Ganti dari todayTransactions ke transactions
            'date' => now()->translatedFormat('l, d F Y'),
        ]);
    }

    public function processOrder(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'customer_address' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:mineral_water_products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'paid_amount' => 'required|numeric|min:0',
            'payment_status' => 'required|in:pending,paid,partial',
            'payment_method' => 'required|in:cash,transfer,qris',
            'payment_proof' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'notes' => 'nullable|string',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                // Simpan bukti pembayaran jika ada
                $paymentProofPath = null;
                if ($request->hasFile('payment_proof')) {
                    $file = $request->file('payment_proof');
                    
                    // Generate nama file unik
                    $fileName = 'payment-proof-' . time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
                    
                    // Simpan di public/uploads/payment-proofs
                    $file->move(public_path('uploads/payment-proofs'), $fileName);
                    
                    $paymentProofPath = 'uploads/payment-proofs/' . $fileName;
                }

                // Create order
                $order = Order::create([
                    'order_code' => Order::generateOrderCode(),
                    'user_id' => auth()->id(),
                    'customer_name' => $request->customer_name,
                    'customer_phone' => $request->customer_phone,
                    'customer_address' => $request->customer_address,
                    'status' => 'completed',
                    'total_amount' => 0,
                    'paid_amount' => $request->paid_amount,
                    'payment_status' => $request->payment_status,
                    'payment_method' => $request->payment_method,
                    'payment_proof' => $paymentProofPath, // Simpan path bukti pembayaran
                    'notes' => $request->notes,
                    'order_date' => now(),
                    'completed_date' => now(),
                ]);

                $totalAmount = 0;

                // Create order items
                foreach ($request->items as $item) {
                    $product = MineralWaterProduct::find($item['product_id']);
                    
                    if (!$product) {
                        throw new \Exception("Produk tidak ditemukan");
                    }

                    if ($product->stock < $item['quantity']) {
                        throw new \Exception("Produk {$product->name} stok tidak mencukupi. Stok tersedia: {$product->stock}");
                    }

                    $unitPrice = $product->price;
                    $subtotal = $unitPrice * $item['quantity'];

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $unitPrice,
                        'subtotal' => $subtotal,
                    ]);

                    // Update product stock
                    $product->decrement('stock', $item['quantity']);

                    $totalAmount += $subtotal;
                }

                // Update order total amount
                $order->update([
                    'total_amount' => $totalAmount,
                ]);

                // Untuk Inertia, return redirect dengan flash message
                if ($request->header('X-Inertia')) {
                    return redirect()->back()->with('success', 'Pesanan berhasil diproses!');
                }

                // Untuk API request, return JSON
                return response()->json([
                    'success' => true,
                    'order' => [
                        'id' => $order->id,
                        'order_code' => $order->order_code,
                        'customer_name' => $order->customer_name,
                        'total_amount' => (float) $order->total_amount,
                        'paid_amount' => (float) $order->paid_amount,
                        'payment_status' => $order->payment_status,
                        'payment_method' => $order->payment_method,
                        'payment_proof' => $order->payment_proof ? asset($order->payment_proof) : null,
                        'items' => $order->items->map(function ($item) {
                            return [
                                'product_name' => $item->product->name ?? 'Produk tidak ditemukan',
                                'quantity' => $item->quantity,
                                'unit_price' => (float) $item->unit_price,
                                'subtotal' => (float) $item->subtotal,
                            ];
                        })
                    ],
                    'message' => 'Pesanan berhasil diproses'
                ]);
            });
        } catch (\Exception $e) {
            // Handle error untuk Inertia
            if ($request->header('X-Inertia')) {
                return redirect()->back()->with('error', $e->getMessage());
            }

            // Handle error untuk API
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show order detail
     */
    /**
     * Show order detail
     */
    public function showOrder(Order $order)
    {
        // Load relationships
        $order->load(['user', 'items.product']);

        return Inertia::render('Kasir/OrderDetail', [
            'order' => [
                'id' => $order->id,
                'order_code' => $order->order_code,
                'customer_name' => $order->customer_name,
                'customer_phone' => $order->customer_phone,
                'customer_address' => $order->customer_address,
                'status' => $order->status,
                'total_amount' => (float) $order->total_amount,
                'paid_amount' => (float) $order->paid_amount,
                'payment_status' => $order->payment_status,
                'payment_method' => $order->payment_method,
                'payment_proof' => $order->payment_proof_url, // Menggunakan accessor
                'notes' => $order->notes,
                'order_date' => $order->order_date->format('d/m/Y H:i'),
                'completed_date' => $order->completed_date?->format('d/m/Y H:i'),
                'cashier_name' => $order->user->name,
                'items' => $order->items->map(function ($item) {
                    return [
                        'product_name' => $item->product->name ?? 'Produk tidak ditemukan',
                        'product_code' => $item->product->product_code ?? '-',
                        'quantity' => $item->quantity,
                        'unit_price' => (float) $item->unit_price,
                        'subtotal' => (float) $item->subtotal,
                    ];
                })
            ]
        ]);
    }

    /**
     * Upload payment proof
     */
    public function uploadPaymentProof(Request $request, Order $order)
    {
        $request->validate([
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        try {
            // Hapus bukti lama jika ada
            if ($order->payment_proof && file_exists(public_path($order->payment_proof))) {
                unlink(public_path($order->payment_proof));
            }

            $file = $request->file('payment_proof');
            
            // Generate nama file unik
            $fileName = 'payment-proof-' . time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            
            // Simpan di public/uploads/payment-proofs
            $file->move(public_path('uploads/payment-proofs'), $fileName);
            
            $paymentProofPath = 'uploads/payment-proofs/' . $fileName;

            $order->update([
                'payment_proof' => $paymentProofPath
            ]);

            return response()->json([
                'success' => true,
                'payment_proof_url' => asset($paymentProofPath),
                'message' => 'Bukti pembayaran berhasil diupload'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal upload bukti pembayaran: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Print invoice
     */
    public function printInvoice(Order $order)
    {
        // Load relationships
        $order->load(['user', 'items.product']);

        $data = [
            'order' => $order,
            'company' => [
                'name' => 'SALGA MANDIRI',
                'address' => 'Jl. Contoh Alamat Perusahaan No. 123',
                'phone' => '(021) 1234-5678',
                'email' => 'info@salga-mandiri.com'
            ]
        ];

        // PERBAIKAN: Gunakan facade yang benar
        $pdf = Pdf::loadView('pdf.invoice', $data);
        
        return $pdf->download('invoice-' . $order->order_code . '.pdf');
    }

    public function getOrderHistory()
    {
        $orders = Order::with(['user', 'items.product'])
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_code' => $order->order_code,
                    'customer_name' => $order->customer_name,
                    'total_amount' => (float) $order->total_amount,
                    'paid_amount' => (float) $order->paid_amount,
                    'payment_status' => $order->payment_status,
                    'payment_method' => $order->payment_method,
                    'status' => $order->status,
                    'order_date' => $order->order_date->format('d/m/Y H:i'),
                    'items' => $order->items->map(function ($item) {
                        return [
                            'product_name' => $item->product->name ?? 'Produk tidak ditemukan',
                            'quantity' => $item->quantity,
                            'unit_price' => (float) $item->unit_price,
                            'subtotal' => (float) $item->subtotal,
                        ];
                    }),
                ];
            });

        return response()->json($orders);
    }
}