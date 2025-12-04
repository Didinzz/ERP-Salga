<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Delivery;
use App\Models\User;
use App\Models\MineralWaterProduct;
use App\Models\Customer;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Data umum untuk semua role
        $commonData = [
            'user' => [
                'name' => $user->name,
                'role' => $user->role,
                'email' => $user->email,
                'created_at' => $user->created_at,
                'status' => $user->status,
            ]
        ];
        
        // Data khusus berdasarkan role
        $roleData = $this->getRoleSpecificData($user);
        
        // Render dashboard berdasarkan role
        $dashboardView = 'Dashboard/' . ucfirst($user->role);
        
        return Inertia::render($dashboardView, array_merge($commonData, $roleData));
    }
    
    private function getRoleSpecificData($user)
    {
        switch ($user->role) {
            case 'admin':
                return $this->getAdminDashboardData();
                
            case 'staff':
                return $this->getStaffDashboardData();
                
            case 'kasir':
                return $this->getKasirDashboardData();
                
            case 'driver':
                return $this->getDriverDashboardData($user);
                
            default:
                return $this->getDefaultDashboardData($user);
        }
    }
    
    private function getAdminDashboardData()
{
    $today = today();
    $yesterday = Carbon::yesterday();
    $startOfWeek = Carbon::now()->startOfWeek();
    $monthStart = Carbon::now()->startOfMonth();
    $yearStart = Carbon::now()->startOfYear();
    
    // ========== STATISTIK UTAMA ==========
    $stats = [
        // Orders
        'totalOrders' => Order::count(),
        'pendingOrders' => Order::where('status', 'pending')->count(),
        'processingOrders' => Order::where('status', 'processing')->count(),
        'completedOrders' => Order::where('status', 'completed')->count(),
        'cancelledOrders' => Order::where('status', 'cancelled')->count(),
        'totalRevenue' => (int) Order::where('status', 'completed')->sum('total_amount'),
        
        // Daily Orders
        'todayOrders' => Order::whereDate('order_date', $today)->count(),
        'yesterdayOrders' => Order::whereDate('order_date', $yesterday)->count(),
        'todayRevenue' => (int) Order::whereDate('order_date', $today)->where('status', 'completed')->sum('total_amount'),
        'yesterdayRevenue' => (int) Order::whereDate('order_date', $yesterday)->where('status', 'completed')->sum('total_amount'),
        'todayItemsSold' => (int) DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereDate('orders.order_date', $today)
            ->where('orders.status', 'completed')
            ->sum('order_items.quantity'),
        'totalItemsSold' => (int) DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'completed')
            ->sum('order_items.quantity'),
        
        // Products
        'totalProducts' => MineralWaterProduct::count(),
        'availableProducts' => MineralWaterProduct::where('is_available', true)->count(),
        'lowStockProducts' => MineralWaterProduct::where('stock', '<=', 10)->where('stock', '>', 0)->count(),
        'outOfStockProducts' => MineralWaterProduct::where('stock', 0)->count(),
        'expiringSoonProducts' => MineralWaterProduct::where('expired_date', '>', now())
            ->where('expired_date', '<=', now()->addDays(30))
            ->count(),
        'expiredProducts' => MineralWaterProduct::where('expired_date', '<', now())->count(),
        'totalStockValue' => (int) MineralWaterProduct::sum(DB::raw('price * stock')),
        'averageStock' => (float) number_format(MineralWaterProduct::avg('stock') ?: 0, 2),
        
        // Users
        'totalUsers' => User::count(),
        'adminUsers' => User::where('role', 'admin')->count(),
        'staffUsers' => User::where('role', 'staff')->count(),
        'kasirUsers' => User::where('role', 'kasir')->count(),
        'driverUsers' => User::where('role', 'driver')->count(),
        
        // Customers
        'totalCustomers' => Customer::count(),
        'activeCustomers' => Customer::where('status', 'active')->count(),
        
        // Payments
        'pendingPayments' => Order::where('payment_status', 'pending')->count(),
        'paidPayments' => Order::where('payment_status', 'paid')->count(),
        'partialPayments' => Order::where('payment_status', 'partial')->count(),
        'cashTransactions' => Order::whereDate('order_date', $today)->where('payment_method', 'cash')->count(),
        'transferTransactions' => Order::whereDate('order_date', $today)->where('payment_method', 'transfer')->count(),
        'qrisTransactions' => Order::whereDate('order_date', $today)->where('payment_method', 'qris')->count(),
        
        // Monthly/Yearly
        'monthOrders' => Order::whereBetween('order_date', [$monthStart, Carbon::now()->endOfMonth()])->count(),
        'monthRevenue' => (int) Order::whereBetween('order_date', [$monthStart, Carbon::now()->endOfMonth()])
            ->where('status', 'completed')
            ->sum('total_amount'),
        'yearOrders' => Order::whereBetween('order_date', [$yearStart, Carbon::now()->endOfYear()])->count(),
        'yearRevenue' => (int) Order::whereBetween('order_date', [$yearStart, Carbon::now()->endOfYear()])
            ->where('status', 'completed')
            ->sum('total_amount'),
        
        // Deliveries
        'totalDeliveries' => Delivery::count(),
        'completedDeliveries' => Delivery::where('status', 'delivered')->count(),
        'shippingDeliveries' => Delivery::where('status', 'shipping')->count(),
        'assignedDeliveries' => Delivery::where('status', 'assigned')->count(),
        'pendingDeliveries' => Delivery::where('status', 'pending')->count(),
        'todayDeliveries' => Delivery::whereDate('created_at', $today)->count(),
        'weeklyDeliveries' => Delivery::whereBetween('created_at', [$startOfWeek, Carbon::now()->endOfWeek()])->count(),
    ];
    
    // Calculate changes
    $stats['orderChange'] = $stats['yesterdayOrders'] > 0 ? 
        round((($stats['todayOrders'] - $stats['yesterdayOrders']) / $stats['yesterdayOrders']) * 100, 1) : 
        ($stats['todayOrders'] > 0 ? 100 : 0);
    $stats['revenueChange'] = $stats['yesterdayRevenue'] > 0 ? 
        round((($stats['todayRevenue'] - $stats['yesterdayRevenue']) / $stats['yesterdayRevenue']) * 100, 1) : 
        ($stats['todayRevenue'] > 0 ? 100 : 0);
    
    // ========== DATA TERBARU ==========
    $recentOrders = Order::with(['customer', 'items'])
        ->latest()
        ->take(5)
        ->get()
        ->map(fn($order) => [
            'id' => $order->id,
            'order_code' => $order->order_code,
            'customer' => $order->customer ? ['name' => $order->customer->name, 'phone' => $order->customer->phone] : null,
            'customer_name' => $order->customer_name,
            'total_amount' => $order->total_amount,
            'status' => $order->status,
            'payment_status' => $order->payment_status,
            'order_date' => $order->order_date,
            'created_at' => $order->created_at,
            'items_count' => $order->items->count(),
        ]);
    
    $recentUsers = User::latest()
        ->take(5)
        ->get()
        ->map(fn($user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'status' => $user->status,
            'created_at' => $user->created_at,
        ]);
    
    $todayDeliveryAssignments = Delivery::with(['order.customer', 'order.items', 'driver'])
        ->whereDate('created_at', $today)
        ->orderByRaw("FIELD(status, 'shipping', 'assigned', 'pending', 'delivered')")
        ->take(5)
        ->get()
        ->map(fn($delivery) => [
            'id' => $delivery->id,
            'do_code' => $delivery->do_code,
            'order' => $delivery->order ? [
                'order_code' => $delivery->order->order_code,
                'customer' => $delivery->order->customer ? ['name' => $delivery->order->customer->name, 'phone' => $delivery->order->customer->phone] : null,
                'customer_name' => $delivery->order->customer_name,
                'items_count' => $delivery->order->items->count(),
            ] : null,
            'driver' => $delivery->driver ? ['name' => $delivery->driver->name] : null,
            'status' => $delivery->status,
            'shipping_address' => $delivery->shipping_address,
            'recipient_name' => $delivery->recipient_name,
            'created_at' => $delivery->created_at,
        ]);
    
    // ========== PENJUALAN HARI INI ==========
    $todaySales = Order::with(['customer', 'items'])
        ->whereDate('order_date', $today)
        ->latest()
        ->take(10)
        ->get()
        ->map(function ($order) {
            return [
                'id' => $order->id,
                'order_code' => $order->order_code,
                'customer' => $order->customer ? [
                    'name' => $order->customer->name,
                    'phone' => $order->customer->phone,
                ] : null,
                'customer_name' => $order->customer_name,
                'total_amount' => $order->total_amount,
                'payment_status' => $order->payment_status,
                'payment_method' => $order->payment_method,
                'bank_name' => $order->bank_name,
                'items_count' => $order->items->count(),
                'total_quantity' => $order->items->sum('quantity'),
                'order_date' => $order->order_date->format('Y-m-d H:i:s'),
                'created_at' => $order->created_at,
            ];
        });
    
    // ========== DATA UNTUK CHART ==========
    
    // Data untuk chart bulanan - 12 bulan terakhir
    $monthlySalesData = [];
    $monthlyTransactionCount = [];
    $months = [];
    
    for ($i = 11; $i >= 0; $i--) {
        $date = Carbon::now()->subMonths($i);
        $monthStartDate = $date->copy()->startOfMonth();
        $monthEndDate = $date->copy()->endOfMonth();
        
        $months[] = $date->translatedFormat('M');
        
        // Total penjualan per bulan
        $monthlyRevenue = Order::whereBetween('order_date', [$monthStartDate, $monthEndDate])
            ->where('payment_status', 'paid')
            ->sum('total_amount');
        $monthlySalesData[] = (int) $monthlyRevenue;
        
        // Jumlah transaksi per bulan
        $transactionCount = Order::whereBetween('order_date', [$monthStartDate, $monthEndDate])
            ->where('payment_status', 'paid')
            ->count();
        $monthlyTransactionCount[] = $transactionCount;
    }
    
    // Data untuk chart tahunan - 4 tahun terakhir
    $yearlySalesData = [];
    $years = [];
    
    for ($i = 3; $i >= 0; $i--) {
        $year = Carbon::now()->year - $i;
        $yearStartDate = Carbon::create($year, 1, 1)->startOfYear();
        $yearEndDate = Carbon::create($year, 12, 31)->endOfYear();
        
        $years[] = (string) $year;
        
        // Total penjualan per tahun
        $yearlyRevenue = Order::whereBetween('order_date', [$yearStartDate, $yearEndDate])
            ->where('payment_status', 'paid')
            ->sum('total_amount');
        $yearlySalesData[] = (int) $yearlyRevenue;
    }
    
    // Data untuk chart pengiriman bulanan - 12 bulan terakhir
    $monthlyDeliveryData = [];
    $monthlyDeliveryMonths = [];
    
    for ($i = 11; $i >= 0; $i--) {
        $date = Carbon::now()->subMonths($i);
        $monthStartDate = $date->copy()->startOfMonth();
        $monthEndDate = $date->copy()->endOfMonth();
        
        $monthlyDeliveryMonths[] = $date->translatedFormat('M');
        
        // Hitung pengiriman yang berhasil per bulan
        $monthlyDeliveryCount = Delivery::whereBetween('delivered_at', [$monthStartDate, $monthEndDate])
            ->where('status', 'delivered')
            ->count();
        $monthlyDeliveryData[] = $monthlyDeliveryCount;
    }
    
    // Data untuk chart pengiriman tahunan - 4 tahun terakhir
    $yearlyDeliveryData = [];
    $yearlyDeliveryYears = [];
    
    for ($i = 3; $i >= 0; $i--) {
        $year = Carbon::now()->year - $i;
        $yearStartDate = Carbon::create($year, 1, 1)->startOfYear();
        $yearEndDate = Carbon::create($year, 12, 31)->endOfYear();
        
        $yearlyDeliveryYears[] = (string) $year;
        
        // Total pengiriman per tahun
        $yearlyDeliveryCount = Delivery::whereBetween('delivered_at', [$yearStartDate, $yearEndDate])
            ->where('status', 'delivered')
            ->count();
        $yearlyDeliveryData[] = $yearlyDeliveryCount;
    }
    
    $charts = [
        'monthlySales' => [
            'months' => $months,
            'data' => $monthlySalesData,
            'transactions' => $monthlyTransactionCount,
        ],
        'yearlySales' => [
            'years' => $years,
            'data' => $yearlySalesData,
        ],
        'monthlyDeliveries' => [
            'months' => $monthlyDeliveryMonths,
            'data' => $monthlyDeliveryData,
        ],
        'yearlyDeliveries' => [
            'years' => $yearlyDeliveryYears,
            'data' => $yearlyDeliveryData,
        ],
    ];
    
    return [
        'stats' => $stats,
        'recentOrders' => $recentOrders,
        'recentUsers' => $recentUsers,
        'todayDeliveryAssignments' => $todayDeliveryAssignments,
        'todaySales' => $todaySales,
        'date' => $today->format('Y-m-d'),
        'formattedDate' => $today->translatedFormat('l, d F Y'),
        'charts' => $charts,
    ];
}
    
    private function getStaffDashboardData()
    {
        // Statistik produk - Menggunakan query yang sesuai dengan MineralWaterProductController
        $totalProducts = MineralWaterProduct::count();
        $availableProducts = MineralWaterProduct::where('is_available', true)->count();
        $lowStockProducts = MineralWaterProduct::where('stock', '<=', 10)->where('stock', '>', 0)->count();
        $outOfStockProducts = MineralWaterProduct::where('stock', 0)->count();
        
        // Hitung produk yang akan kadaluarsa (30 hari ke depan)
        $expiringSoonProducts = MineralWaterProduct::where('expired_date', '>', now())
            ->where('expired_date', '<=', now()->addDays(30))
            ->count();
        
        // Hitung produk yang sudah kadaluarsa
        $expiredProducts = MineralWaterProduct::where('expired_date', '<', now())
            ->count();
        
        // Hitung total nilai stok
        $totalStockValue = MineralWaterProduct::sum(DB::raw('price * stock'));
        
        // Hitung rata-rata stok
        $averageStock = MineralWaterProduct::avg('stock');
        
        // Data untuk chart - Stock Distribution by Water Type
        $waterTypes = ['Mineral', 'RO', 'Distilled', 'Spring', 'Alkaline', 'Others'];
        $waterTypeData = [];
        
        foreach ($waterTypes as $type) {
            $count = MineralWaterProduct::where('water_type', $type)->count();
            if ($count > 0) {
                $waterTypeData[] = [
                    'value' => $count,
                    'name' => $type
                ];
            }
        }
        
        // Data untuk chart - Stock Distribution by Bottle Type
        $bottleTypes = ['Botol Plastik', 'Galon', 'Botol Kaca', 'Dispenser', 'Kemasan Lainnya'];
        $bottleTypeData = [];
        
        foreach ($bottleTypes as $type) {
            $count = MineralWaterProduct::where('bottle_type', $type)->count();
            if ($count > 0) {
                $bottleTypeData[] = [
                    'value' => $count,
                    'name' => $type
                ];
            }
        }
        
        // Data untuk chart - Top Products by Stock
        $topProductsByStock = MineralWaterProduct::orderBy('stock', 'desc')
            ->take(10)
            ->get()
            ->map(function ($product) {
                return [
                    'name' => $product->name,
                    'stock' => $product->stock,
                    'price' => $product->price,
                    'value' => $product->stock * $product->price
                ];
            });
        
        // Data untuk chart - Monthly Stock Trend (12 bulan terakhir)
        $monthlyStockData = [];
        $months = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthStart = $date->copy()->startOfMonth();
            $monthEnd = $date->copy()->endOfMonth();
            
            $months[] = $date->translatedFormat('M');
            
            // Hitung rata-rata stok per bulan
            $averageMonthlyStock = MineralWaterProduct::whereBetween('created_at', [$monthStart, $monthEnd])
                ->avg('stock');
            $monthlyStockData[] = (int) ($averageMonthlyStock ?: 0);
        }
        
        // Produk dengan stok rendah (<= 10)
        $lowStockProductsList = MineralWaterProduct::with([])
            ->where('stock', '<=', 10)
            ->where('stock', '>', 0)
            ->orderBy('stock', 'asc')
            ->take(5)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'product_code' => $product->product_code,
                    'name' => $product->name,
                    'brand' => $product->brand,
                    'stock' => $product->stock,
                    'price' => $product->price,
                    'size' => $product->size,
                    'water_type' => $product->water_type,
                    'bottle_type' => $product->bottle_type,
                    'is_available' => $product->is_available,
                    'stock_status' => $product->getStockStatusAttribute(),
                    'expired_date' => $product->expired_date ? $product->expired_date->format('Y-m-d') : null,
                    'days_until_expiration' => $product->daysUntilExpiration(),
                    'expiration_status' => $product->getExpirationStatusAttribute(),
                ];
            });
        
        // Produk yang akan kadaluarsa (30 hari ke depan)
        $expiringProductsList = MineralWaterProduct::with([])
            ->where('expired_date', '>', now())
            ->where('expired_date', '<=', now()->addDays(30))
            ->orderBy('expired_date', 'asc')
            ->take(5)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'product_code' => $product->product_code,
                    'name' => $product->name,
                    'brand' => $product->brand,
                    'stock' => $product->stock,
                    'price' => $product->price,
                    'size' => $product->size,
                    'expired_date' => $product->expired_date ? $product->expired_date->format('Y-m-d') : null,
                    'days_until_expiration' => $product->daysUntilExpiration(),
                    'expiration_status' => $product->getExpirationStatusAttribute(),
                    'water_type' => $product->water_type,
                    'bottle_type' => $product->bottle_type,
                ];
            });
        
        // Produk terlaris (berdasarkan stok yang tersisa paling sedikit)
        $bestSellingProducts = MineralWaterProduct::with([])
            ->where('stock', '>', 0)
            ->orderBy('stock', 'asc') // Stok paling sedikit diasumsikan paling laris
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'product_code' => $product->product_code,
                    'name' => $product->name,
                    'brand' => $product->brand,
                    'stock' => $product->stock,
                    'price' => $product->price,
                    'size' => $product->size,
                    'water_type' => $product->water_type,
                    'bottle_type' => $product->bottle_type,
                    'is_available' => $product->is_available,
                    'stock_status' => $product->getStockStatusAttribute(),
                    'formatted_price' => $product->getFormattedPriceAttribute(),
                ];
            });
        
        // Data untuk chart - Product Status
        $productStatusData = [
            ['value' => $availableProducts, 'name' => 'Tersedia', 'color' => '#10B981'],
            ['value' => $lowStockProducts, 'name' => 'Stok Rendah', 'color' => '#F59E0B'],
            ['value' => $outOfStockProducts, 'name' => 'Habis', 'color' => '#EF4444'],
        ];
        
        // Data untuk chart - Expiration Status
        $expirationStatusData = [
            ['value' => $expiredProducts, 'name' => 'Kadaluarsa', 'color' => '#EF4444'],
            ['value' => $expiringSoonProducts, 'name' => 'Akan Kadaluarsa', 'color' => '#F59E0B'],
            ['value' => $totalProducts - $expiredProducts - $expiringSoonProducts, 'name' => 'Aman', 'color' => '#10B981'],
        ];
        
        return [
            'stats' => [
                // Product Stats
                'totalProducts' => $totalProducts,
                'availableProducts' => $availableProducts,
                'lowStockProducts' => $lowStockProducts,
                'outOfStockProducts' => $outOfStockProducts,
                'expiringSoonProducts' => $expiringSoonProducts,
                'expiredProducts' => $expiredProducts,
                'totalStockValue' => (int) $totalStockValue,
                'averageStock' => (float) number_format($averageStock ?: 0, 2),
                
                // Brand Distribution
                'totalBrands' => MineralWaterProduct::distinct('brand')->count('brand'),
                'totalWaterTypes' => MineralWaterProduct::distinct('water_type')->count('water_type'),
                'totalBottleTypes' => MineralWaterProduct::distinct('bottle_type')->count('bottle_type'),
            ],
            'lowStockProducts' => $lowStockProductsList,
            'expiringProducts' => $expiringProductsList,
            'bestSellingProducts' => $bestSellingProducts,
            'charts' => [
                'monthlyStock' => [
                    'months' => $months,
                    'data' => $monthlyStockData,
                ],
                'productStatus' => $productStatusData,
                'expirationStatus' => $expirationStatusData,
                'waterTypeDistribution' => $waterTypeData,
                'bottleTypeDistribution' => $bottleTypeData,
                'topProductsByStock' => $topProductsByStock,
            ],
        ];
    }
    
    private function getKasirDashboardData()
    {
        $today = today();
        $yesterday = Carbon::yesterday();
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;
        
        // Statistik untuk kasir - Menggunakan query yang sesuai dengan KasirController
        $todayOrders = Order::whereDate('order_date', $today)->count();
        $yesterdayOrders = Order::whereDate('order_date', $yesterday)->count();
        $todayRevenue = Order::whereDate('order_date', $today)
            ->where('payment_status', 'paid')
            ->sum('total_amount');
        $yesterdayRevenue = Order::whereDate('order_date', $yesterday)
            ->where('payment_status', 'paid')
            ->sum('total_amount');
        $pendingPayments = Order::where('payment_status', 'pending')->count();
        $paidPayments = Order::where('payment_status', 'paid')->count();
        $partialPayments = Order::where('payment_status', 'partial')->count();
        
        // Perhitungan perubahan
        $orderChange = $yesterdayOrders > 0 ? 
            round((($todayOrders - $yesterdayOrders) / $yesterdayOrders) * 100, 1) : ($todayOrders > 0 ? 100 : 0);
        $revenueChange = $yesterdayRevenue > 0 ? 
            round((($todayRevenue - $yesterdayRevenue) / $yesterdayRevenue) * 100, 1) : ($todayRevenue > 0 ? 100 : 0);
        
        // Penjualan hari ini - sesuai dengan KasirController
        $todaySales = Order::with(['customer', 'items'])
            ->whereDate('order_date', $today)
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_code' => $order->order_code,
                    'customer' => $order->customer ? [
                        'name' => $order->customer->name,
                        'phone' => $order->customer->phone,
                    ] : null,
                    'customer_name' => $order->customer_name,
                    'total_amount' => $order->total_amount,
                    'payment_status' => $order->payment_status,
                    'payment_method' => $order->payment_method,
                    'bank_name' => $order->bank_name,
                    'items_count' => $order->items->count(),
                    'total_quantity' => $order->items->sum('quantity'),
                    'order_date' => $order->order_date->format('Y-m-d H:i:s'),
                    'created_at' => $order->created_at,
                ];
            });
        
        // Data untuk chart bulanan - 12 bulan terakhir
        $monthlySalesData = [];
        $monthlyTransactionCount = [];
        $months = [];
        
        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthStart = $date->copy()->startOfMonth();
            $monthEnd = $date->copy()->endOfMonth();
            
            $months[] = $date->translatedFormat('M');
            
            // Total penjualan per bulan
            $monthlyRevenue = Order::whereBetween('order_date', [$monthStart, $monthEnd])
                ->where('payment_status', 'paid')
                ->sum('total_amount');
            $monthlySalesData[] = (int) $monthlyRevenue;
            
            // Jumlah transaksi per bulan
            $transactionCount = Order::whereBetween('order_date', [$monthStart, $monthEnd])
                ->where('payment_status', 'paid')
                ->count();
            $monthlyTransactionCount[] = $transactionCount;
        }
        
        // Data untuk chart tahunan - 3 tahun terakhir
        $yearlySalesData = [];
        $years = [];
        
        for ($i = 3; $i >= 0; $i--) {
            $year = Carbon::now()->year - $i;
            $yearStart = Carbon::create($year, 1, 1)->startOfYear();
            $yearEnd = Carbon::create($year, 12, 31)->endOfYear();
            
            $years[] = (string) $year;
            
            // Total penjualan per tahun
            $yearlyRevenue = Order::whereBetween('order_date', [$yearStart, $yearEnd])
                ->where('payment_status', 'paid')
                ->sum('total_amount');
            $yearlySalesData[] = (int) $yearlyRevenue;
        }
        
        // Data untuk statistik metode pembayaran hari ini
        $cashTransactions = Order::whereDate('order_date', $today)
            ->where('payment_method', 'cash')
            ->count();
        $transferTransactions = Order::whereDate('order_date', $today)
            ->where('payment_method', 'transfer')
            ->count();
        $qrisTransactions = Order::whereDate('order_date', $today)
            ->where('payment_method', 'qris')
            ->count();
        
        // Data untuk ringkasan bulan ini
        $monthStart = Carbon::now()->startOfMonth();
        $monthEnd = Carbon::now()->endOfMonth();
        
        $monthOrders = Order::whereBetween('order_date', [$monthStart, $monthEnd])->count();
        $monthRevenue = Order::whereBetween('order_date', [$monthStart, $monthEnd])
            ->where('payment_status', 'paid')
            ->sum('total_amount');
        
        // Data untuk ringkasan tahun ini
        $yearStart = Carbon::now()->startOfYear();
        $yearEnd = Carbon::now()->endOfYear();
        
        $yearOrders = Order::whereBetween('order_date', [$yearStart, $yearEnd])->count();
        $yearRevenue = Order::whereBetween('order_date', [$yearStart, $yearEnd])
            ->where('payment_status', 'paid')
            ->sum('total_amount');
        
        return [
            'stats' => [
                'todayOrders' => $todayOrders,
                'yesterdayOrders' => $yesterdayOrders,
                'orderChange' => $orderChange,
                'todayRevenue' => (int) $todayRevenue,
                'yesterdayRevenue' => (int) $yesterdayRevenue,
                'revenueChange' => $revenueChange,
                'pendingPayments' => $pendingPayments,
                'paidPayments' => $paidPayments,
                'partialPayments' => $partialPayments,
                'cashTransactions' => $cashTransactions,
                'transferTransactions' => $transferTransactions,
                'qrisTransactions' => $qrisTransactions,
                'monthOrders' => $monthOrders,
                'monthRevenue' => (int) $monthRevenue,
                'yearOrders' => $yearOrders,
                'yearRevenue' => (int) $yearRevenue,
            ],
            'todaySales' => $todaySales,
            'date' => $today->format('Y-m-d'),
            'formattedDate' => $today->translatedFormat('l, d F Y'),
            'charts' => [
                'monthlySales' => [
                    'months' => $months,
                    'data' => $monthlySalesData,
                    'transactions' => $monthlyTransactionCount,
                ],
                'yearlySales' => [
                    'years' => $years,
                    'data' => $yearlySalesData,
                ],
            ],
        ];
    }
    
    private function getDriverDashboardData($user)
    {
        $today = today();
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();
        
        // Statistik untuk driver - Menggunakan query yang sesuai dengan DeliveryController
        $myDeliveries = Delivery::where('driver_id', $user->id)->count();
        $todayDeliveries = Delivery::where('driver_id', $user->id)
            ->whereDate('created_at', $today)
            ->count();
        $completedDeliveries = Delivery::where('driver_id', $user->id)
            ->where('status', 'delivered')
            ->count();
        $shippingDeliveries = Delivery::where('driver_id', $user->id)
            ->where('status', 'shipping')
            ->count();
        $assignedDeliveries = Delivery::where('driver_id', $user->id)
            ->where('status', 'assigned')
            ->count();
        $pendingDeliveries = Delivery::where('driver_id', $user->id)
            ->where('status', 'pending')
            ->count();
        
        // Pengiriman minggu ini
        $weeklyDeliveries = Delivery::where('driver_id', $user->id)
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->count();
        
        // Pengiriman hari ini - sesuai dengan DeliveryController
        $todayAssignments = Delivery::with(['order.customer', 'order.items'])
            ->where('driver_id', $user->id)
            ->whereDate('created_at', $today)
            ->orderByRaw("FIELD(status, 'shipping', 'assigned', 'pending', 'delivered')")
            ->get()
            ->map(function ($delivery) {
                return [
                    'id' => $delivery->id,
                    'do_code' => $delivery->do_code,
                    'order' => $delivery->order ? [
                        'order_code' => $delivery->order->order_code,
                        'customer' => $delivery->order->customer ? [
                            'name' => $delivery->order->customer->name,
                            'phone' => $delivery->order->customer->phone,
                        ] : null,
                        'customer_name' => $delivery->order->customer_name,
                        'items_count' => $delivery->order->items->count(),
                    ] : null,
                    'status' => $delivery->status,
                    'shipping_address' => $delivery->shipping_address,
                    'recipient_name' => $delivery->recipient_name,
                    'created_at' => $delivery->created_at,
                    'shipped_at' => $delivery->shipped_at,
                    'delivered_at' => $delivery->delivered_at,
                    'assigned_at' => $delivery->assigned_at,
                ];
            });
            
        // Riwayat pengiriman (5 terakhir)
        $deliveryHistory = Delivery::with(['order.customer'])
            ->where('driver_id', $user->id)
            ->where('status', 'delivered')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($delivery) {
                return [
                    'id' => $delivery->id,
                    'do_code' => $delivery->do_code,
                    'order' => $delivery->order ? [
                        'order_code' => $delivery->order->order_code,
                        'customer' => $delivery->order->customer ? [
                            'name' => $delivery->order->customer->name,
                        ] : null,
                        'customer_name' => $delivery->order->customer_name,
                    ] : null,
                    'delivered_at' => $delivery->delivered_at,
                    'updated_at' => $delivery->updated_at,
                ];
            });
        
        // Data untuk chart - Monthly Performance (Bulanan - 12 bulan terakhir)
        $monthlyPerformanceData = [];
        $months = [];
        
        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthStart = $date->copy()->startOfMonth();
            $monthEnd = $date->copy()->endOfMonth();
            
            // Format bulan dalam bahasa Indonesia
            $months[] = $date->translatedFormat('M');
            
            // Hitung pengiriman yang berhasil per bulan
            $monthlyCount = Delivery::where('driver_id', $user->id)
                ->whereBetween('delivered_at', [$monthStart, $monthEnd])
                ->where('status', 'delivered')
                ->count();
            $monthlyPerformanceData[] = $monthlyCount;
        }
        
        // Data untuk chart - Yearly Performance (3 tahun terakhir)
        $yearlyPerformanceData = [];
        $years = [];
        
        for ($i = 3; $i >= 0; $i--) {
            $year = Carbon::now()->year - $i;
            $yearStart = Carbon::create($year, 1, 1)->startOfYear();
            $yearEnd = Carbon::create($year, 12, 31)->endOfYear();
            
            $years[] = (string) $year;
            
            // Total pengiriman per tahun
            $yearlyCount = Delivery::where('driver_id', $user->id)
                ->whereBetween('delivered_at', [$yearStart, $yearEnd])
                ->where('status', 'delivered')
                ->count();
            $yearlyPerformanceData[] = $yearlyCount;
        }
        
        // Data pelanggan untuk peta - sesuai dengan MapsController
        $customerLocations = Customer::whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->where('status', 'active')
            ->get()
            ->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'owner' => $customer->owner_name,
                    'phone' => $customer->phone,
                    'address' => $customer->address,
                    'lat' => (float) $customer->latitude,
                    'lng' => (float) $customer->longitude,
                ];
            });
        
        return [
            'stats' => [
                'myDeliveries' => $myDeliveries,
                'todayDeliveries' => $todayDeliveries,
                'weeklyDeliveries' => $weeklyDeliveries,
                'completedDeliveries' => $completedDeliveries,
                'shippingDeliveries' => $shippingDeliveries,
                'assignedDeliveries' => $assignedDeliveries,
                'pendingDeliveries' => $pendingDeliveries,
            ],
            'todayAssignments' => $todayAssignments,
            'deliveryHistory' => $deliveryHistory,
            'customerLocations' => $customerLocations,
            'charts' => [
                'monthlyPerformance' => [
                    'months' => $months,
                    'data' => $monthlyPerformanceData,
                ],
                'yearlyPerformance' => [
                    'years' => $years,
                    'data' => $yearlyPerformanceData,
                ],
            ],
        ];
    }
    
    private function getDefaultDashboardData($user)
    {
        // Data untuk user dengan role yang tidak dikenali
        $recentActivity = Order::where('user_id', $user->id)
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_code' => $order->order_code,
                    'customer_name' => $order->customer_name,
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'order_date' => $order->order_date,
                ];
            });
        
        // Data untuk chart - Monthly Activity
        $monthlyActivity = [];
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::today()->subMonths($i);
            $months[] = $date->translatedFormat('M');
            $count = Order::where('user_id', $user->id)
                ->whereYear('order_date', $date->year)
                ->whereMonth('order_date', $date->month)
                ->count();
            $monthlyActivity[] = $count;
        }
        
        return [
            'stats' => [
                'totalOrders' => Order::where('user_id', $user->id)->count(),
                'completedOrders' => Order::where('user_id', $user->id)
                    ->where('status', 'completed')
                    ->count(),
                'pendingOrders' => Order::where('user_id', $user->id)
                    ->where('status', 'pending')
                    ->count(),
            ],
            'recentActivity' => $recentActivity,
            'charts' => [
                'monthlyActivity' => [
                    'months' => $months,
                    'data' => $monthlyActivity,
                ],
            ],
        ];
    }
}