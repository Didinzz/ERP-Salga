<?php
// app/Models/Delivery.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Delivery extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'deliveries';

    protected $fillable = [
        'delivery_code',
        'order_id',
        'driver_id',
        'recipient_name',
        'recipient_phone',
        'delivery_address',
        'delivery_cost',
        'status',
        'notes',
        'scheduled_date',
        'assigned_at',
        'picked_up_at',
        'delivered_at',
        'delivery_notes',
        'proof_image',
    ];

    protected $casts = [
        'delivery_cost' => 'decimal:2',
        'scheduled_date' => 'datetime',
        'assigned_at' => 'datetime',
        'picked_up_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    // Relationships
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeAssigned($query)
    {
        return $query->where('status', 'assigned');
    }

    public function scopeOnDelivery($query)
    {
        return $query->where('status', 'on_delivery');
    }

    public function scopeDelivered($query)
    {
        return $query->where('status', 'delivered');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('scheduled_date', today());
    }

    // Methods
    public function assignDriver($driverId)
    {
        $this->update([
            'driver_id' => $driverId,
            'status' => 'assigned',
            'assigned_at' => now(),
        ]);
    }

    public function markAsPickedUp()
    {
        if ($this->status === 'assigned') {
            $this->update([
                'status' => 'on_delivery',
                'picked_up_at' => now(),
            ]);
        }
    }

    public function markAsDelivered($notes = null, $proofImage = null)
    {
        if (in_array($this->status, ['assigned', 'on_delivery'])) {
            $this->update([
                'status' => 'delivered',
                'delivered_at' => now(),
                'delivery_notes' => $notes,
                'proof_image' => $proofImage,
            ]);

            // Auto complete the order if not already completed
            if ($this->order->status !== 'completed') {
                $this->order->markAsCompleted();
            }
        }
    }

    public function markAsFailed($notes = null)
    {
        $this->update([
            'status' => 'failed',
            'delivery_notes' => $notes,
        ]);
    }

    public function cancelDelivery()
    {
        $this->update([
            'status' => 'cancelled',
        ]);
    }

    public function canBeAssigned()
    {
        return $this->status === 'pending';
    }

    public function canBePickedUp()
    {
        return $this->status === 'assigned';
    }

    public function canBeDelivered()
    {
        return in_array($this->status, ['assigned', 'on_delivery']);
    }

    // Accessors
    public function getFormattedDeliveryCostAttribute()
    {
        return 'Rp ' . number_format($this->delivery_cost, 0, ',', '.');
    }

    public function getStatusBadgeAttribute()
    {
        $badges = [
            'pending' => 'bg-yellow-100 text-yellow-800',
            'assigned' => 'bg-blue-100 text-blue-800',
            'on_delivery' => 'bg-purple-100 text-purple-800',
            'delivered' => 'bg-green-100 text-green-800',
            'cancelled' => 'bg-red-100 text-red-800',
            'failed' => 'bg-red-100 text-red-800',
        ];

        return $badges[$this->status] ?? 'bg-gray-100 text-gray-800';
    }

    public function getStatusTextAttribute()
    {
        $statuses = [
            'pending' => 'Menunggu',
            'assigned' => 'Ditugaskan',
            'on_delivery' => 'Dalam Pengiriman',
            'delivered' => 'Terkirim',
            'cancelled' => 'Dibatalkan',
            'failed' => 'Gagal',
        ];

        return $statuses[$this->status] ?? $this->status;
    }

    // Boot
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->delivery_code)) {
                $model->delivery_code = static::generateDeliveryCode();
            }

            // Set default recipient info from order
            if ($model->order && empty($model->recipient_name)) {
                $model->recipient_name = $model->order->customer_name;
                $model->recipient_phone = $model->order->customer_phone;
                $model->delivery_address = $model->order->customer_address;
            }
        });

        static::created(function ($model) {
            // Update order status to processing when delivery is created
            if ($model->order->status === 'confirmed') {
                $model->order->update(['status' => 'processing']);
            }
        });
    }

    public static function generateDeliveryCode()
    {
        $prefix = 'DEL';
        $timestamp = now()->format('YmdHis');
        $random = mt_rand(100, 999);
        
        return $prefix . '-' . $timestamp . '-' . $random;
    }
}