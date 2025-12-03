<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('deliveries', function (Blueprint $table) {
            $table->id();

            // 1. Kunci Utama: Link ke Order
            // Dari Order kita bisa tahu siapa Customernya: $delivery->order->customer
            $table->foreignId('order_id')->constrained()->onDelete('cascade');

            // 2. Kode Surat Jalan
            $table->string('do_code')->unique(); // DO-241125-0001

            // 3. Driver yang bertugas (Bisa null di awal)
            $table->foreignId('driver_id')->nullable()->constrained('users')->onDelete('set null');

            // 4. Status Pengiriman
            $table->enum('status', [
                'pending',    // Menunggu Driver
                'assigned',   // Driver Siap
                'shipping',   // Sedang Diantar
                'delivered',  // Diterima
                'failed'      // Gagal
            ])->default('pending')->index();

            // 5. Bukti Pengiriman (Diisi Driver di lapangan)
            $table->string('recipient_name')->nullable(); // Siapa yang terima di rumah
            $table->string('proof_photo')->nullable();    // Foto bukti
            $table->text('driver_notes')->nullable();     // Catatan driver

            // 6. Waktu Tracking
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('deliveries');
    }
};