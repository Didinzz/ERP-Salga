<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transactions extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'order_id',
        'user_id',
        'transaction_code',
        'payment_method',
        'total_bill',
        'amount_paid',
        'change_amount',
        'bank_name',
        'account_number',
        'sender_name',
        'payment_proof',
        'status',
        'notes',
        'paid_at',
    ];

    protected $casts = [
        'total_bill' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'change_amount' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    // --- Relationships ---

    /**
     * Transaksi milik satu Order.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Transaksi diproses oleh satu Kasir.
     */
    public function cashier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // --- Accessors & Mutators ---

    /**
     * Mendapatkan URL gambar bukti pembayaran secara otomatis.
     * Penggunaan di frontend: transaction.proof_url
     */
    protected $appends = ['proof_url'];

    public function getProofUrlAttribute()
    {
        if ($this->payment_proof) {
            return asset('storage/' . $this->payment_proof);
        }
        return null;
    }
}