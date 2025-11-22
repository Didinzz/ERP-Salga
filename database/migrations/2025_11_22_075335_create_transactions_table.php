<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();

            // Relasi
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained(); // Kasir yang memproses pembayaran ini

            // Identitas Transaksi (Unik)
            $table->string('transaction_code')->unique()->index(); // cth: TRX-20241122-0001

            // Metode Pembayaran
            $table->enum('payment_method', ['cash', 'transfer', 'qris']);

            // Detail Keuangan
            // total_bill: Berapa yang harus dibayar saat transaksi ini dibuat
            $table->decimal('total_bill', 12, 2);

            // amount_paid: Uang yang diserahkan customer (Inputan Kasir)
            // Cth: Tagihan 45.000, Customer kasih 50.000 -> amount_paid = 50.000
            $table->decimal('amount_paid', 12, 2);

            // change_amount: Kembalian (amount_paid - total_bill)
            $table->decimal('change_amount', 12, 2)->default(0);

            // Detail Tambahan (Khusus Transfer/QRIS)
            $table->string('bank_name')->nullable();      // Cth: BCA, Mandiri
            $table->string('account_number')->nullable(); // No Rek Tujuan (jika perlu dicatat)
            $table->string('sender_name')->nullable();    // Nama pengirim (opsional)
            $table->string('payment_proof')->nullable();  // Path/URL Gambar Bukti Bayar

            // Status Transaksi Pembayaran
            $table->enum('status', ['pending', 'success', 'failed'])->default('pending')->index();
            $table->text('notes')->nullable();

            // Waktu Pembayaran
            $table->timestamp('paid_at')->useCurrent();

            $table->timestamps();
            $table->softDeletes(); // Soft delete penting untuk data keuangan
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};