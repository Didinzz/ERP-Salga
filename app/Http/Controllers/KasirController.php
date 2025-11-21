<?php

namespace App\Http\Controllers;

use App\Models\MineralWaterProduct;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
                    'price' => $product->price,
                    'stock' => $product->stock,
                    'size' => $product->size,
                    'code' => $product->product_code,
                    // Logika URL Gambar: Gunakan storage jika ada, atau placeholder default
                    'image_url' => $product->image
                        ? asset('storage/' . $product->image)
                        : 'https://placehold.co/300x300/e2e8f0/1e40af?text=No+Image',
                ];
            });

        return Inertia::render('Kasir/Index', [
            'products' => $products,
            'cashierName' => auth()->user()->name ?? 'Staff',
            'date' => now()->translatedFormat('l, d F Y'),
        ]);
    }
}
