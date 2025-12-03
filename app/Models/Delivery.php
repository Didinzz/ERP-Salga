<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    // Relasi ke Order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Relasi ke Driver
    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    // --- ACCESSOR PINTAR (Smart Accessors) ---
    // Ini trik agar di Frontend kita tetap bisa panggil 'delivery.customer_name'
    // padahal datanya diambil "numpang" lewat relasi order -> customer

    public function getCustomerNameAttribute()
    {
        // Cek apakah order punya customer (relasi), jika tidak ambil snapshot nama di order
        return $this->order->customer
            ? $this->order->customer->name
            : $this->order->customer_name;
    }

    public function getShippingAddressAttribute()
    {
        // Ambil alamat dari tabel Customer Master
        return $this->order->customer
            ? $this->order->customer->address
            : $this->order->customer_address;
    }

    public function getCustomerPhoneAttribute()
    {
        return $this->order->customer
            ? $this->order->customer->phone
            : $this->order->customer_phone;
    }

    // Generate Kode Surat Jalan
    public static function generateDOCode()
    {
        return 'DO-' . date('ymd') . '-' . strtoupper(substr(uniqid(), -4));
    }
}