<?php
// app/Models/Order.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'orders';

    protected $fillable = [
        'order_code',
        'user_id',
        'customer_name',
        'customer_phone',
        'customer_address',
        'status',
        'total_amount',
        'paid_amount',
        'payment_status',
        'payment_method',
        'payment_proof',
        'notes',
        'order_date',
        'completed_date',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'order_date' => 'datetime',
        'completed_date' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeProcessing($query)
    {
        return $query->where('status', 'processing');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('order_date', today());
    }

    public function scopeThisWeek($query)
    {
        return $query->whereBetween('order_date', [now()->startOfWeek(), now()->endOfWeek()]);
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('order_date', now()->month)
            ->whereYear('order_date', now()->year);
    }

    // Methods
    public function calculateTotal()
    {
        return $this->items->sum('subtotal');
    }

    public function updateTotal()
    {
        $this->total_amount = $this->calculateTotal();
        $this->save();
    }

    public function getRemainingAmount()
    {
        return $this->total_amount - $this->paid_amount;
    }

    public function isFullyPaid()
    {
        return $this->paid_amount >= $this->total_amount;
    }

    public function canBeCompleted()
    {
        return in_array($this->status, ['confirmed', 'processing']) && $this->isFullyPaid();
    }

    public function markAsCompleted()
    {
        if ($this->canBeCompleted()) {
            $this->status = 'completed';
            $this->completed_date = now();
            $this->save();
        }
    }

    public function cancelOrder()
    {
        // Kembalikan stok saat order dibatalkan
        foreach ($this->items as $item) {
            if ($item->product) {
                $item->product->increment('stock', $item->quantity);
            }
        }

        $this->status = 'cancelled';
        $this->save();
    }

    // Accessors
    public function getFormattedTotalAttribute()
    {
        return 'Rp ' . number_format($this->total_amount, 0, ',', '.');
    }

    public function getFormattedPaidAttribute()
    {
        return 'Rp ' . number_format($this->paid_amount, 0, ',', '.');
    }

    public function getFormattedRemainingAttribute()
    {
        return 'Rp ' . number_format($this->getRemainingAmount(), 0, ',', '.');
    }

    public function getStatusBadgeAttribute()
    {
        $badges = [
            'pending' => 'bg-yellow-100 text-yellow-800',
            'confirmed' => 'bg-blue-100 text-blue-800',
            'processing' => 'bg-purple-100 text-purple-800',
            'completed' => 'bg-green-100 text-green-800',
            'cancelled' => 'bg-red-100 text-red-800',
        ];

        return $badges[$this->status] ?? 'bg-gray-100 text-gray-800';
    }

    public function getPaymentStatusBadgeAttribute()
    {
        $badges = [
            'pending' => 'bg-yellow-100 text-yellow-800',
            'paid' => 'bg-green-100 text-green-800',
            'partial' => 'bg-blue-100 text-blue-800',
            'cancelled' => 'bg-red-100 text-red-800',
        ];

        return $badges[$this->payment_status] ?? 'bg-gray-100 text-gray-800';
    }

    // Boot
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->order_code)) {
                $model->order_code = static::generateOrderCode();
            }
        });

        static::updated(function ($model) {
            // Auto update payment status based on paid amount
            if ($model->isDirty('paid_amount')) {
                if ($model->paid_amount >= $model->total_amount) {
                    $model->payment_status = 'paid';
                } elseif ($model->paid_amount > 0) {
                    $model->payment_status = 'partial';
                } else {
                    $model->payment_status = 'pending';
                }
                $model->saveQuietly();
            }
        });
    }

    public static function generateOrderCode()
    {
        $prefix = 'ORD';
        $date = now()->format('Ymd');
        $random = mt_rand(1000, 9999);

        return $prefix . '-' . $date . '-' . $random;
    }

    // Di app/Models/Order.php
    public function getPaymentProofUrlAttribute()
    {
        if ($this->payment_proof) {
            return asset($this->payment_proof);
        }
        return null;
    }

    // Method untuk cek apakah ada bukti pembayaran
    public function hasPaymentProof()
    {
        return !empty($this->payment_proof);
    }
}