<?php
// database/seeders/MineralWaterProductsSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema; // TAMBAHKAN INI
use Carbon\Carbon;

class MineralWaterProductsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        Schema::disableForeignKeyConstraints();
        
        $products = [
            // === AQUA PRODUCTS ===
            [
                'product_code' => 'AQUA-330ML',
                'name' => 'Aqua Botol 330ml',
                'brand' => 'Aqua',
                'description' => 'Air mineral kemasan botol 330ml dari Danone, segar dan alami',
                'price' => 3500,
                'stock' => 200,
                'size' => '330ml',
                'bottle_type' => 'botol_plastik',
                'water_type' => 'mineral',
                'origin' => 'Indonesia',
                'image' => 'aqua-330ml.jpg',
                'is_available' => true,
                'manufactured_date' => $now->copy()->subMonths(1),
                'expired_date' => $now->copy()->addYears(2),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'product_code' => 'AQUA-600ML',
                'name' => 'Aqua Botol 600ml',
                'brand' => 'Aqua',
                'description' => 'Air mineral kemasan botol 600ml, praktis untuk dibawa',
                'price' => 5000,
                'stock' => 150,
                'size' => '600ml',
                'bottle_type' => 'botol_plastik',
                'water_type' => 'mineral',
                'origin' => 'Indonesia',
                'image' => 'aqua-600ml.jpg',
                'is_available' => true,
                'manufactured_date' => $now->copy()->subMonths(2),
                'expired_date' => $now->copy()->addYears(2),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'product_code' => 'AQUA-1500ML',
                'name' => 'Aqua Botol 1.5L',
                'brand' => 'Aqua',
                'description' => 'Air mineral kemasan botol 1.5 liter, ekonomis untuk keluarga',
                'price' => 8000,
                'stock' => 100,
                'size' => '1.5L',
                'bottle_type' => 'botol_plastik',
                'water_type' => 'mineral',
                'origin' => 'Indonesia',
                'image' => 'aqua-1500ml.jpg',
                'is_available' => true,
                'manufactured_date' => $now->copy()->subMonths(1),
                'expired_date' => $now->copy()->addYears(2),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'product_code' => 'AQUA-GALON',
                'name' => 'Aqua Galon 19L',
                'brand' => 'Aqua',
                'description' => 'Air mineral kemasan galon 19 liter dengan tutup ulir',
                'price' => 22000,
                'stock' => 50,
                'size' => '19L',
                'bottle_type' => 'galon',
                'water_type' => 'mineral',
                'origin' => 'Indonesia',
                'image' => 'aqua-galon.jpg',
                'is_available' => true,
                'manufactured_date' => $now->copy()->subMonths(1),
                'expired_date' => $now->copy()->addYears(1),
                'created_at' => $now,
                'updated_at' => $now,
            ],

            // === LE MINERALE PRODUCTS ===
            [
                'product_code' => 'LEM-600ML',
                'name' => 'Le Minerale 600ml',
                'brand' => 'Le Minerale',
                'description' => 'Air mineral dengan protection seal, mengandung mineral alami',
                'price' => 4500,
                'stock' => 120,
                'size' => '600ml',
                'bottle_type' => 'botol_plastik',
                'water_type' => 'mineral',
                'origin' => 'Indonesia',
                'image' => 'leminerale-600ml.jpg',
                'is_available' => true,
                'manufactured_date' => $now->copy()->subMonths(3),
                'expired_date' => $now->copy()->addYears(2),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'product_code' => 'LEM-1500ML',
                'name' => 'Le Minerale 1.5L',
                'brand' => 'Le Minerale',
                'description' => 'Air mineral kemasan besar dengan seal protection',
                'price' => 7500,
                'stock' => 80,
                'size' => '1.5L',
                'bottle_type' => 'botol_plastik',
                'water_type' => 'mineral',
                'origin' => 'Indonesia',
                'image' => 'leminerale-1500ml.jpg',
                'is_available' => true,
                'manufactured_date' => $now->copy()->subMonths(2),
                'expired_date' => $now->copy()->addYears(2),
                'created_at' => $now,
                'updated_at' => $now,
            ],

            // === VIT PRODUCTS ===
            [
                'product_code' => 'VIT-600ML',
                'name' => 'Vit Botol 600ml',
                'brand' => 'Vit',
                'description' => 'Air minum dalam kemasan botol 600ml',
                'price' => 4000,
                'stock' => 90,
                'size' => '600ml',
                'bottle_type' => 'botol_plastik',
                'water_type' => 'reverse_osmosis',
                'origin' => 'Indonesia',
                'image' => 'vit-600ml.jpg',
                'is_available' => true,
                'manufactured_date' => $now->copy()->subMonths(4),
                'expired_date' => $now->copy()->addYears(2),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'product_code' => 'VIT-GALON',
                'name' => 'Vit Galon 19L',
                'brand' => 'Vit',
                'description' => 'Air mineral kemasan galon 19 liter',
                'price' => 20000,
                'stock' => 40,
                'size' => '19L',
                'bottle_type' => 'galon',
                'water_type' => 'reverse_osmosis',
                'origin' => 'Indonesia',
                'image' => 'vit-galon.jpg',
                'is_available' => true,
                'manufactured_date' => $now->copy()->subMonths(1),
                'expired_date' => $now->copy()->addYears(1),
                'created_at' => $now,
                'updated_at' => $now,
            ],

            // === CLUB PRODUCTS ===
            [
                'product_code' => 'CLUB-600ML',
                'name' => 'Club Botol 600ml',
                'brand' => 'Club',
                'description' => 'Air mineral dengan rasa segar alami',
                'price' => 4200,
                'stock' => 70,
                'size' => '600ml',
                'bottle_type' => 'botol_plastik',
                'water_type' => 'mineral',
                'origin' => 'Indonesia',
                'image' => 'club-600ml.jpg',
                'is_available' => true,
                'manufactured_date' => $now->copy()->subMonths(5),
                'expired_date' => $now->copy()->addYears(2),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'product_code' => 'CLUB-1500ML',
                'name' => 'Club Botol 1.5L',
                'brand' => 'Club',
                'description' => 'Air mineral kemasan ekonomis 1.5 liter',
                'price' => 6800,
                'stock' => 55,
                'size' => '1.5L',
                'bottle_type' => 'botol_plastik',
                'water_type' => 'mineral',
                'origin' => 'Indonesia',
                'image' => 'club-1500ml.jpg',
                'is_available' => true,
                'manufactured_date' => $now->copy()->subMonths(3),
                'expired_date' => $now->copy()->addYears(2),
                'created_at' => $now,
                'updated_at' => $now,
            ],

            // === CLEO PRODUCTS ===
            [
                'product_code' => 'CLEO-1500ML',
                'name' => 'Cleo Botol 1.5L',
                'brand' => 'Cleo',
                'description' => 'Air minum kemasan 1.5L, pure dan menyegarkan',
                'price' => 7000,
                'stock' => 60,
                'size' => '1.5L',
                'bottle_type' => 'botol_plastik',
                'water_type' => 'demineralized',
                'origin' => 'Indonesia',
                'image' => 'cleo-1500ml.jpg',
                'is_available' => true,
                'manufactured_date' => $now->copy()->subMonths(2),
                'expired_date' => $now->copy()->addYears(2),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'product_code' => 'CLEO-GALON',
                'name' => 'Cleo Galon 19L',
                'brand' => 'Cleo',
                'description' => 'Air minum galon isi ulang 19 liter',
                'price' => 19000,
                'stock' => 35,
                'size' => '19L',
                'bottle_type' => 'galon',
                'water_type' => 'demineralized',
                'origin' => 'Indonesia',
                'image' => 'cleo-galon.jpg',
                'is_available' => true,
                'manufactured_date' => $now->copy()->subMonths(3),
                'expired_date' => $now->copy()->addYears(1),
                'created_at' => $now,
                'updated_at' => $now,
            ],

            // === EQUIL (BOTOL KACA) ===
            [
                'product_code' => 'EQUIL-600ML',
                'name' => 'Equil Botol 600ml',
                'brand' => 'Equil',
                'description' => 'Air mineral alami dari pegunungan dalam kemasan kaca',
                'price' => 12000,
                'stock' => 30,
                'size' => '600ml',
                'bottle_type' => 'botol_kaca',
                'water_type' => 'spring_water',
                'origin' => 'Pegunungan Indonesia',
                'image' => 'equil-600ml.jpg',
                'is_available' => true,
                'manufactured_date' => $now->copy()->subMonths(1),
                'expired_date' => $now->copy()->addYears(2),
                'created_at' => $now,
                'updated_at' => $now,
            ],

            // === PRODUCT TIDAK TERSEDIA ===
            [
                'product_code' => 'AQUA-240ML',
                'name' => 'Aqua Botol 240ml',
                'brand' => 'Aqua',
                'description' => 'Air mineral kemasan botol kecil 240ml',
                'price' => 3000,
                'stock' => 0,
                'size' => '240ml',
                'bottle_type' => 'botol_plastik',
                'water_type' => 'mineral',
                'origin' => 'Indonesia',
                'image' => 'aqua-240ml.jpg',
                'is_available' => false,
                'manufactured_date' => $now->copy()->subMonths(6),
                'expired_date' => $now->copy()->addYears(2),
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        // Hapus data yang sudah ada tanpa menghapus tabel
        DB::table('mineral_water_products')->truncate();

        // Insert data baru
        DB::table('mineral_water_products')->insert($products);
        
        $this->command->info('Berhasil menambahkan ' . count($products) . ' produk air mineral!');
        $this->command->info('Merek: Aqua, Le Minerale, Vit, Club, Cleo, Equil');
        $this->command->info('Jenis botol: botol_plastik, botol_kaca, galon');
        $this->command->info('Jenis air: mineral, reverse_osmosis, spring_water, demineralized');
    }
}