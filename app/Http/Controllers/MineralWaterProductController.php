<?php

namespace App\Http\Controllers;

use App\Models\MineralWaterProduct;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MineralWaterProductController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'brand', 'bottle_type', 'water_type', 'stock_status']);

        $products = MineralWaterProduct::query()
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('brand', 'like', "%{$search}%")
                        ->orWhere('product_code', 'like', "%{$search}%");
                });
            })
            ->when($filters['brand'] ?? null, fn($q, $b) => $q->where('brand', $b))
            ->when($filters['bottle_type'] ?? null, fn($q, $b) => $q->where('bottle_type', $b))
            ->when($filters['water_type'] ?? null, fn($q, $b) => $q->where('water_type', $b))
            ->when($filters['stock_status'] ?? null, function ($query, $stockStatus) {
                if ($stockStatus === 'low') {
                    $query->where('stock', '<=', 10)->where('stock', '>', 0);
                } elseif ($stockStatus === 'out') {
                    $query->where('stock', 0);
                }
            })
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'brand' => $product->brand,
                    'description' => $product->description,
                    'price' => (float) $product->price,
                    'stock' => $product->stock,
                    'size' => $product->size,
                    'bottle_type' => $product->bottle_type,
                    'water_type' => $product->water_type,
                    'origin' => $product->origin,
                    'product_code' => $product->product_code,
                    'is_available' => $product->is_available,
                    'manufactured_date' => $product->manufactured_date,
                    'expired_date' => $product->expired_date,
                    // Cek apakah file ada di storage sebelum generate URL
                    'image_url' => ($product->image && Storage::disk('public')->exists($product->image))
                        ? asset('storage/' . $product->image)
                        : null,
                    'stock_status' => $product->stock === 0 ? 'Habis' : ($product->stock <= 10 ? 'Sedikit' : 'Tersedia'),
                ];
            });

        $stats = [
            'total_products' => MineralWaterProduct::count(),
            'available_products' => MineralWaterProduct::where('is_available', true)->count(),
            'low_stock_products' => MineralWaterProduct::where('stock', '<=', 10)->where('stock', '>', 0)->count(),
            'out_of_stock_products' => MineralWaterProduct::where('stock', 0)->count(),
        ];

        $filterOptions = [
            'brands' => MineralWaterProduct::distinct()->pluck('brand')->sort()->values(),
            'bottle_types' => MineralWaterProduct::distinct()->pluck('bottle_type')->sort()->values(),
            'water_types' => MineralWaterProduct::distinct()->pluck('water_type')->sort()->values(),
        ];

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => $filters,
            'stats' => $stats,
            'filterOptions' => $filterOptions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'size' => 'required|string|max:50',
            'bottle_type' => 'required|in:botol_plastik,botol_kaca,galon,cup,pouch',
            'water_type' => 'required|in:mineral,reverse_osmosis,spring_water,demineralized',
            'origin' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'manufactured_date' => 'nullable|date',
            'expired_date' => 'nullable|date|after:manufactured_date',
        ]);

        $validated['product_code'] = 'PRD-' . strtoupper(uniqid());

        // --- GAYA UPLOAD MANUAL (Sesuai Request) ---
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            // Buat nama file unik: products/WAKTU_NAMAASLI.ext
            $fileName = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
            $localPath = 'products/' . $fileName;

            // Simpan manual menggunakan put()
            Storage::disk('public')->put($localPath, file_get_contents($file));

            // Simpan path ke database
            $validated['image'] = $localPath;
        }

        MineralWaterProduct::create($validated);

        return redirect()->route('products.index')->with('success', 'Produk berhasil ditambahkan!');
    }

    public function update(Request $request, MineralWaterProduct $product)
    {
        // dd($request->all());
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'size' => 'required|string|max:50',
            'bottle_type' => 'required|in:botol_plastik,botol_kaca,galon,cup,pouch',
            'water_type' => 'required|in:mineral,reverse_osmosis,spring_water,demineralized',
            'origin' => 'nullable|string|max:255',
            'manufactured_date' => 'nullable|date',
            'expired_date' => 'nullable|date|after:manufactured_date',
        ]);

        if ($request->hasFile('image')) {
            if (!empty($product->image) && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }

            $file = $request->file('image');
            $fileName = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
            $localPath = 'products/' . $fileName;

            Storage::disk('public')->put($localPath, file_get_contents($file));

            $validated['image'] = $localPath;
        }

        $product->update($validated);

        return redirect()->route('products.index')->with('success', 'Produk berhasil diperbarui!');
    }

    

    public function updateStock(Request $request, MineralWaterProduct $product)
    {
        $validated = $request->validate([
            'stock' => 'required|integer|min:0',
            'action' => 'required|in:set,increase,decrease',
        ]);

        $action = $validated['action'];
        $quantity = $validated['stock'];

        if ($action === 'set') {
            $product->stock = $quantity;
        } elseif ($action === 'increase') {
            $product->increment('stock', $quantity);
        } elseif ($action === 'decrease') {
            if ($product->stock < $quantity) {
                return back()->with('error', 'Stok tidak mencukupi untuk dikurangi!');
            }
            $product->decrement('stock', $quantity);
        }

        return back()->with('success', 'Stok berhasil diperbarui!');
    }

    public function toggleAvailability(MineralWaterProduct $product)
    {
        $product->is_available = !$product->is_available;
        $product->save();

        $status = $product->is_available ? 'diaktifkan' : 'dinonaktifkan';
        return back()->with('success', "Produk berhasil {$status}!");
    }

    public function destroy(MineralWaterProduct $product)
    {
        try {
            $imagePath = $product->image;

            $product->delete();

            if (!empty($imagePath) && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }

            return redirect()->route('products.index')->with('success', 'Produk berhasil dihapus!');

        } catch (QueryException $e) {
            if ($e->getCode() == "23000") {
                return redirect()->back()->with('error', 'Gagal menghapus! Produk ini sudah tercatat dalam riwayat transaksi. Silakan nonaktifkan produk ini saja.');
            }

            return redirect()->back()->with('error', 'Terjadi kesalahan database: ' . $e->getMessage());
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan sistem.');
        }
    }
}