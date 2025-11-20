<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mineral_water_products', function (Blueprint $table) {
            $table->id();
            $table->string('product_code')->unique()->nullable();
            $table->string('name');
            $table->string('brand');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('stock');
            $table->string('size'); // dalam ml atau liter, e.g., '330ml', '600ml', '1.5L', '19L'
            $table->enum('bottle_type', [
                'botol_plastik', 
                'botol_kaca', 
                'galon', 
                'cup', 
                'pouch'
            ]);
            $table->enum('water_type', [
                'mineral',
                'reverse_osmosis', 
                'spring_water',
                'demineralized'
            ])->default('mineral');
            $table->string('origin')->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_available')->default(true);
            $table->timestamp('manufactured_date')->nullable();
            $table->timestamp('expired_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mineral_water_products');
    }
};