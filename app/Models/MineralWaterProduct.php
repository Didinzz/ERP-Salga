<?php
// app/Models/MineralWaterProduct.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class MineralWaterProduct extends Model
{

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'mineral_water_products';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_code',
        'name',
        'brand',
        'description',
        'price',
        'stock',
        'size',
        'bottle_type',
        'water_type',
        'origin',
        'image',
        'is_available',
        'manufactured_date',
        'expired_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
        'is_available' => 'boolean',
        'manufactured_date' => 'datetime',
        'expired_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'deleted_at',
    ];

    /**
     * The model's default values for attributes.
     *
     * @var array
     */
    protected $attributes = [
        'is_available' => true,
        'stock' => 0,
    ];

    /**
     * Scope a query to only include available products.
     */
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    /**
     * Scope a query to only include out of stock products.
     */
    public function scopeOutOfStock($query)
    {
        return $query->where('stock', '<=', 0);
    }

    /**
     * Scope a query to only include low stock products.
     */
    public function scopeLowStock($query, $threshold = 10)
    {
        return $query->where('stock', '<=', $threshold)->where('stock', '>', 0);
    }

    /**
     * Scope a query to only include products by brand.
     */
    public function scopeByBrand($query, $brand)
    {
        return $query->where('brand', $brand);
    }

    /**
     * Scope a query to only include products by bottle type.
     */
    public function scopeByBottleType($query, $bottleType)
    {
        return $query->where('bottle_type', $bottleType);
    }

    /**
     * Scope a query to only include products by water type.
     */
    public function scopeByWaterType($query, $waterType)
    {
        return $query->where('water_type', $waterType);
    }

    /**
     * Scope a query to only include products that are not expired.
     */
    public function scopeNotExpired($query)
    {
        return $query->where('expired_date', '>', now())->orWhereNull('expired_date');
    }

    /**
     * Check if product is out of stock.
     */
    public function isOutOfStock(): bool
    {
        return $this->stock <= 0;
    }

    /**
     * Check if product is low on stock.
     */
    public function isLowStock($threshold = 10): bool
    {
        return $this->stock > 0 && $this->stock <= $threshold;
    }

    /**
     * Check if product is expired.
     */
    public function isExpired(): bool
    {
        return $this->expired_date && $this->expired_date->isPast();
    }

    /**
     * Check if product will expire soon (within 30 days).
     */
    public function expiresSoon($days = 30): bool
    {
        return $this->expired_date && 
               $this->expired_date->isFuture() && 
               $this->expired_date->diffInDays(now()) <= $days;
    }

    /**
     * Get the days until expiration.
     */
    public function daysUntilExpiration(): ?int
    {
        if (!$this->expired_date) {
            return null;
        }

        return $this->expired_date->isPast() 
            ? 0 
            : $this->expired_date->diffInDays(now());
    }

    /**
     * Increase stock quantity.
     */
    public function increaseStock(int $quantity): bool
    {
        $this->stock += $quantity;
        return $this->save();
    }

    /**
     * Decrease stock quantity.
     */
    public function decreaseStock(int $quantity): bool
    {
        if ($this->stock < $quantity) {
            return false;
        }

        $this->stock -= $quantity;
        return $this->save();
    }

    /**
     * Mark product as available.
     */
    public function markAsAvailable(): bool
    {
        $this->is_available = true;
        return $this->save();
    }

    /**
     * Mark product as unavailable.
     */
    public function markAsUnavailable(): bool
    {
        $this->is_available = false;
        return $this->save();
    }

    /**
     * Get formatted price.
     */
    public function getFormattedPriceAttribute(): string
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }

    /**
     * Get stock status.
     */
    public function getStockStatusAttribute(): string
    {
        if ($this->isOutOfStock()) {
            return 'Habis';
        } elseif ($this->isLowStock()) {
            return 'Sedikit';
        } else {
            return 'Tersedia';
        }
    }

    /**
     * Get expiration status.
     */
    public function getExpirationStatusAttribute(): string
    {
        if ($this->isExpired()) {
            return 'Kadaluarsa';
        } elseif ($this->expiresSoon()) {
            return 'Akan kadaluarsa';
        } else {
            return 'Aman';
        }
    }

    /**
     * Get image URL or placeholder.
     */
    public function getImageUrlAttribute(): string
    {
        if ($this->image) {
            return asset('storage/products/' . $this->image);
        }
        
        return asset('images/placeholder-product.jpg');
    }

    /**
     * Get the size with unit for display.
     */
    public function getDisplaySizeAttribute(): string
    {
        return $this->size;
    }

    /**
     * Search scope for products.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('brand', 'like', "%{$search}%")
              ->orWhere('product_code', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    /**
     * Order by price scope.
     */
    public function scopeOrderByPrice($query, $direction = 'asc')
    {
        return $query->orderBy('price', $direction);
    }

    /**
     * Order by stock scope.
     */
    public function scopeOrderByStock($query, $direction = 'desc')
    {
        return $query->orderBy('stock', $direction);
    }

    /**
     * Filter by price range scope.
     */
    public function scopePriceRange($query, $minPrice = null, $maxPrice = null)
    {
        if ($minPrice) {
            $query->where('price', '>=', $minPrice);
        }
        
        if ($maxPrice) {
            $query->where('price', '<=', $maxPrice);
        }
        
        return $query;
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->product_code)) {
                $model->product_code = static::generateProductCode();
            }
        });

        static::updating(function ($model) {
            // Jika stok habis, otomatis tandai sebagai tidak tersedia
            if ($model->isDirty('stock') && $model->stock <= 0) {
                $model->is_available = false;
            }
        });
    }

    /**
     * Generate unique product code.
     */
    public static function generateProductCode(): string
    {
        $prefix = 'MWP'; // Mineral Water Product
        $timestamp = now()->format('YmdHis');
        $random = mt_rand(100, 999);
        
        return $prefix . '-' . $timestamp . '-' . $random;
    }
}