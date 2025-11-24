<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_code')->unique()->index(); // Tambahkan index untuk pencarian cepat

            // Kasir yang menangani order
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Info Customer (Dibuat nullable agar fleksibel untuk pelanggan "Walk-in")
            $table->string('customer_name')->default('Pelanggan Umum');
            $table->string('customer_phone')->nullable();
            $table->text('customer_address')->nullable();

            // Status Workflow
            $table->enum('status', ['pending', 'confirmed', 'processing', 'completed', 'cancelled'])->default('pending')->index();

            // Keuangan (Ringkasan)
            $table->decimal('total_amount', 12, 2)->default(0);

            // paid_amount di sini adalah "Total yang sudah dibayar" (akumulasi dari tabel transactions)
            // Berguna untuk mengecek apakah pesanan sudah lunas atau masih kurang bayar (hutang)
            $table->decimal('paid_amount', 12, 2)->default(0);
            $table->enum('payment_status', ['pending', 'paid', 'partial', 'cancelled'])->default('pending');
            $table->enum('payment_method', ['cash', 'transfer', 'qris'])->default('cash'); // TAMBAHKAN INI
            $table->string('payment_proof')->nullable();
            $table->text('notes')->nullable();

            // Waktu
            $table->timestamp('order_date')->useCurrent();
            $table->timestamp('completed_date')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');

            // Jika produk dihapus dari master, data di sini jangan hilang (set null atau biarkan constrained tapi tanpa cascade delete)
            // Tapi biasanya cascade delete produk tidak disarankan di sistem nyata, lebih baik soft delete produk.
            $table->foreignId('product_id')->constrained('mineral_water_products');

            // Snapshot Data (Penting untuk integritas histori)
            $table->string('product_name'); // Simpan nama produk saat beli
            $table->string('product_code')->nullable(); // Simpan kode produk saat beli

            $table->integer('quantity');
            $table->decimal('unit_price', 12, 2); // Harga satuan saat transaksi terjadi
            $table->decimal('subtotal', 12, 2);   // quantity * unit_price

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};