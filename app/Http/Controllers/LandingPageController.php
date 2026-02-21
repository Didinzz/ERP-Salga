<?php
// app/Http/Controllers/LandingPageController.php

namespace App\Http\Controllers;

use App\Models\MineralWaterProduct;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingPageController extends Controller
{
    /**
     * Display the landing page with products.
     */
    public function index()
    {
        // Ambil produk yang tersedia (is_available = true)
        $products = MineralWaterProduct::available()
            ->notExpired()
            ->orderBy('size', 'asc')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'desc' => $product->description,
                    'price' => $product->formatted_price,
                    'type' => $this->determineProductType($product),
                    'viewBox' => $this->getViewBox($product),
                    'widthClass' => $this->getWidthClass($product),
                    'image_url' => $product->image_url, // Tambahkan ini untuk memanggil gambar
                    'original_product' => [
                        'size' => $product->size,
                        'bottle_type' => $product->bottle_type,
                        'stock_status' => $product->stock_status,
                        'water_type' => $product->water_type,
                        'brand' => $product->brand,
                    ]
                ];
            });

        return Inertia::render('Welcome', [
            'canLogin' => \Route::has('login'),
            'canRegister' => \Route::has('register'),
            'laravelVersion' => \Illuminate\Foundation\Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'products' => $products,
        ]);
    }

    /**
     * Determine product type based on size and bottle type
     */
    private function determineProductType($product): string
    {
        $size = strtolower($product->size);
        $bottleType = strtolower($product->bottle_type);

        // Cek berdasarkan ukuran
        if (str_contains($size, '240ml') || str_contains($size, '240 ml') || str_contains($size, 'cup')) {
            return 'cup';
        } elseif (str_contains($size, '600ml') || str_contains($size, '600 ml')) {
            return 'bottle_medium';
        } elseif (str_contains($size, '1500ml') || str_contains($size, '1500 ml') || str_contains($size, '1.5l')) {
            return 'bottle_large';
        } elseif (str_contains($size, '19l') || str_contains($size, '19 liter') || str_contains($size, 'galon')) {
            return 'gallon';
        }

        // Cek berdasarkan tipe botol
        if ($bottleType === 'cup' || $bottleType === 'gelas') {
            return 'cup';
        } elseif ($bottleType === 'botol kecil' || $bottleType === 'small bottle') {
            return 'bottle_medium';
        } elseif ($bottleType === 'botol besar' || $bottleType === 'large bottle') {
            return 'bottle_large';
        } elseif ($bottleType === 'galon' || $bottleType === 'gallon') {
            return 'gallon';
        }

        return 'bottle_medium';
    }

    /**
     * Get viewBox based on product type
     */
    private function getViewBox($product): string
    {
        $type = $this->determineProductType($product);
        
        switch ($type) {
            case 'cup':
                return '0 0 100 160';
            case 'bottle_medium':
                return '0 0 100 160';
            case 'bottle_large':
                return '0 0 120 180';
            case 'gallon':
                return '0 0 140 180';
            default:
                return '0 0 100 160';
        }
    }

    /**
     * Get width class based on product type
     */
    private function getWidthClass($product): string
    {
        $type = $this->determineProductType($product);
        
        switch ($type) {
            case 'cup':
                return 'w-20 h-32';
            case 'bottle_medium':
                return 'w-24 h-36';
            case 'bottle_large':
                return 'w-28 h-40';
            case 'gallon':
                return 'w-32 h-40';
            default:
                return 'w-24 h-36';
        }
    }
}