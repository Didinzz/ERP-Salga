<?php
// app/Http/Controllers/MineralWaterProductController.php

namespace App\Http\Controllers;

use App\Models\MineralWaterProduct;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MineralWaterProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'brand', 'bottle_type', 'water_type', 'stock_status']);
        
        $products = MineralWaterProduct::query()
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->search($search);
            })
            ->when($filters['brand'] ?? null, function ($query, $brand) {
                $query->byBrand($brand);
            })
            ->when($filters['bottle_type'] ?? null, function ($query, $bottleType) {
                $query->byBottleType($bottleType);
            })
            ->when($filters['water_type'] ?? null, function ($query, $waterType) {
                $query->byWaterType($waterType);
            })
            ->when($filters['stock_status'] ?? null, function ($query, $stockStatus) {
                if ($stockStatus === 'low') {
                    $query->lowStock();
                } elseif ($stockStatus === 'out') {
                    $query->outOfStock();
                }
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // Stats untuk dashboard
        $stats = [
            'total_products' => MineralWaterProduct::count(),
            'available_products' => MineralWaterProduct::available()->count(),
            'low_stock_products' => MineralWaterProduct::lowStock()->count(),
            'out_of_stock_products' => MineralWaterProduct::outOfStock()->count(),
        ];

        // Filter options
        $filterOptions = [
            'brands' => MineralWaterProduct::distinct()->pluck('brand')->sort(),
            'bottle_types' => MineralWaterProduct::distinct()->pluck('bottle_type')->sort(),
            'water_types' => MineralWaterProduct::distinct()->pluck('water_type')->sort(),
        ];

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => $filters,
            'stats' => $stats,
            'filterOptions' => $filterOptions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Products/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
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
            'image' => 'nullable|string|max:255',
            'manufactured_date' => 'nullable|date',
            'expired_date' => 'nullable|date|after:manufactured_date',
        ]);

        MineralWaterProduct::create($validated);

        return redirect()->route('products.index')
            ->with('success', 'Produk berhasil ditambahkan!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MineralWaterProduct $product)
    {
        return Inertia::render('Products/Edit', [
            'product' => $product,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MineralWaterProduct $product)
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
            'image' => 'nullable|string|max:255',
            'manufactured_date' => 'nullable|date',
            'expired_date' => 'nullable|date|after:manufactured_date',
        ]);

        $product->update($validated);

        return redirect()->route('products.index')
            ->with('success', 'Produk berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MineralWaterProduct $product)
    {
        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Produk berhasil dihapus!');
    }

    /**
     * Update product stock
     */
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
            $product->increaseStock($quantity);
        } elseif ($action === 'decrease') {
            $success = $product->decreaseStock($quantity);
            if (!$success) {
                return back()->with('error', 'Stok tidak mencukupi!');
            }
        }

        $product->save();

        return back()->with('success', 'Stok berhasil diperbarui!');
    }

    /**
     * Toggle product availability
     */
    public function toggleAvailability(MineralWaterProduct $product)
    {
        $product->is_available = !$product->is_available;
        $product->save();

        $status = $product->is_available ? 'diaktifkan' : 'dinonaktifkan';
        
        return back()->with('success', "Produk berhasil {$status}!");
    }
}