<?php
// app/Models/OrderItem.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $table = 'order_items';

    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'unit_price',
        'subtotal',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    // Relationships
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(MineralWaterProduct::class, 'product_id');
    }

    // Methods
    public function calculateSubtotal()
    {
        return $this->quantity * $this->unit_price;
    }

    // Boot
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Hitung subtotal otomatis
            $model->subtotal = $model->calculateSubtotal();
        });

        static::updating(function ($model) {
            // Hitung ulang subtotal jika quantity atau unit_price berubah
            if ($model->isDirty(['quantity', 'unit_price'])) {
                $model->subtotal = $model->calculateSubtotal();
            }
        });

        static::created(function ($model) {
            // Update total order
            $model->order->updateTotal();
        });

        static::updated(function ($model) {
            // Update total order jika ada perubahan
            $model->order->updateTotal();
        });

        static::deleted(function ($model) {
            // Update total order
            $model->order->updateTotal();
        });
    }
}