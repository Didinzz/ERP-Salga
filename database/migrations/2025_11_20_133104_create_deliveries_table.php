<?php
// database/migrations/xxxx_xx_xx_xxxxxx_create_deliveries_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('deliveries', function (Blueprint $table) {
            $table->id();
            $table->string('delivery_code')->unique();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('driver_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('recipient_name');
            $table->string('recipient_phone');
            $table->text('delivery_address');
            $table->decimal('delivery_cost', 10, 2)->default(0);
            $table->enum('status', ['pending', 'assigned', 'on_delivery', 'delivered', 'cancelled', 'failed'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamp('scheduled_date')->nullable();
            $table->timestamp('assigned_at')->nullable();
            $table->timestamp('picked_up_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->text('delivery_notes')->nullable();
            $table->string('proof_image')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('deliveries');
    }
};