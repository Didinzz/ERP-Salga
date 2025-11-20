<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MineralWaterProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\DeliveryController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth'])->group(function () {
    // ... routes lainnya
    
    // Delivery Routes
    Route::resource('deliveries', DeliveryController::class)->except(['edit']);
    
    // Additional delivery routes
    Route::post('/deliveries/{delivery}/assign-driver', [DeliveryController::class, 'assignDriver'])
         ->name('deliveries.assign-driver');
    Route::post('/deliveries/{delivery}/pickup', [DeliveryController::class, 'markAsPickedUp'])
         ->name('deliveries.pickup');
    Route::post('/deliveries/{delivery}/deliver', [DeliveryController::class, 'markAsDelivered'])
         ->name('deliveries.deliver');
    Route::post('/deliveries/{delivery}/fail', [DeliveryController::class, 'markAsFailed'])
         ->name('deliveries.fail');
    Route::post('/deliveries/{delivery}/cancel', [DeliveryController::class, 'cancel'])
         ->name('deliveries.cancel');
});

Route::middleware(['auth'])->group(function () {
    // ... routes lainnya
    
    // Order Routes
    Route::resource('orders', OrderController::class);
    
    // Additional order routes
    Route::post('/orders/{order}/update-payment', [OrderController::class, 'updatePayment'])
         ->name('orders.update-payment');
    Route::post('/orders/{order}/complete', [OrderController::class, 'complete'])
         ->name('orders.complete');
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel'])
         ->name('orders.cancel');
});

// Routes untuk Produk Air Mineral
Route::middleware(['auth'])->group(function () {
    Route::get('/products', [MineralWaterProductController::class, 'index'])->name('products.index');
    Route::post('/products', [MineralWaterProductController::class, 'store'])->name('products.store');
    Route::get('/products/create', [MineralWaterProductController::class, 'create'])->name('products.create');
    Route::get('/products/{product}/edit', [MineralWaterProductController::class, 'edit'])->name('products.edit');
    Route::put('/products/{product}', [MineralWaterProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [MineralWaterProductController::class, 'destroy'])->name('products.destroy');
    
    // Additional routes
    Route::post('/products/{product}/update-stock', [MineralWaterProductController::class, 'updateStock'])->name('products.update-stock');
    Route::post('/products/{product}/toggle-availability', [MineralWaterProductController::class, 'toggleAvailability'])->name('products.toggle-availability');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // !!user
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
});

require __DIR__ . '/auth.php';
