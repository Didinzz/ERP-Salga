import { FaStore, FaReceipt, FaMoneyBillWave, FaChartLine, FaUser } from "react-icons/fa6";

export default function HeaderStats({ cashierName, date, cartItemsCount, cartTotal, initialTransactions }) {
    // Hitung statistik dari transaksi
    const totalTransactions = initialTransactions?.length || 0;
    const totalRevenue = initialTransactions?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
    
    // Cari produk terlaris
    const findBestSeller = () => {
        if (!initialTransactions || initialTransactions.length === 0) return '-';
        
        const productSales = {};
        
        initialTransactions.forEach(order => {
            order.items?.forEach(item => {
                const productName = item.product_name;
                if (productSales[productName]) {
                    productSales[productName] += item.quantity;
                } else {
                    productSales[productName] = item.quantity;
                }
            });
        });
        
        const bestSeller = Object.entries(productSales).reduce((max, [product, quantity]) => {
            return quantity > max.quantity ? { product, quantity } : max;
        }, { product: '', quantity: 0 });
        
        return bestSeller.product || '-';
    };

    const bestSellerProduct = findBestSeller();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID').format(amount);
    };

    return (
        <header className="mb-6">
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-8">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Kasir POS</h1>
                    <p className="text-gray-600">Sistem Point of Sale - Mineral Water Store</p>
                </div>
                
                <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Tanggal</p>
                        <p className="text-sm font-bold text-gray-700">{date}</p>
                    </div>
                    <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Kasir</p>
                            <p className="text-sm font-bold text-gray-700">{cashierName}</p>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-full">
                            <FaUser className="text-blue-600" size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Cart Summary */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-2xl shadow-lg text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase opacity-90">Keranjang Aktif</p>
                            <p className="text-2xl font-bold mt-1">{cartItemsCount} Item</p>
                            <p className="text-lg font-semibold mt-2">Rp {formatCurrency(cartTotal)}</p>
                        </div>
                        <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                            <FaStore size={24} />
                        </div>
                    </div>
                </div>

                {/* Total Transactions */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-green-50 rounded-xl text-green-600">
                        <FaReceipt size={24} />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 font-bold uppercase">Total Transaksi</p>
                        <p className="text-2xl font-bold text-gray-800">{totalTransactions}</p>
                        <p className="text-xs text-gray-500 mt-1">Hari Ini</p>
                    </div>
                </div>

                {/* Total Revenue */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                        <FaMoneyBillWave size={24} />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 font-bold uppercase">Total Omset</p>
                        <p className="text-2xl font-bold text-gray-800">Rp {formatCurrency(totalRevenue)}</p>
                        <p className="text-xs text-gray-500 mt-1">Hari Ini</p>
                    </div>
                </div>

                {/* Best Seller */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                        <FaChartLine size={24} />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 font-bold uppercase">Produk Terlaris</p>
                        <p className="text-lg font-bold text-gray-800 line-clamp-1" title={bestSellerProduct}>
                            {bestSellerProduct}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Berdasarkan penjualan</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500 font-medium">Avg. Transaction</p>
                    <p className="text-sm font-bold text-gray-800">
                        {totalTransactions > 0 ? `Rp ${formatCurrency(Math.round(totalRevenue / totalTransactions))}` : 'Rp 0'}
                    </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500 font-medium">Items Sold</p>
                    <p className="text-sm font-bold text-gray-800">
                        {initialTransactions?.reduce((total, order) => 
                            total + order.items?.reduce((sum, item) => sum + item.quantity, 0), 0) || 0}
                    </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500 font-medium">Success Rate</p>
                    <p className="text-sm font-bold text-gray-800">100%</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500 font-medium">Payment Methods</p>
                    <p className="text-sm font-bold text-gray-800">
                        {new Set(initialTransactions?.map(order => order.payment_method)).size || 0}
                    </p>
                </div>
            </div>
        </header>
    );
}