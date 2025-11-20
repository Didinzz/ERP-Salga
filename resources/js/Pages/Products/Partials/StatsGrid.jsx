// resources/js/Pages/Products/Partials/StatsGrid.jsx

export default function StatsGrid({ stats }) {
    const statCards = [
        {
            title: 'Total Produk',
            value: stats.total_products,
            icon: '📦',
            color: 'blue',
            description: 'Semua produk'
        },
        {
            title: 'Tersedia',
            value: stats.available_products,
            icon: '✅',
            color: 'green',
            description: 'Produk aktif'
        },
        {
            title: 'Stok Sedikit',
            value: stats.low_stock_products,
            icon: '⚠️',
            color: 'yellow',
            description: 'Stok ≤ 10'
        },
        {
            title: 'Habis',
            value: stats.out_of_stock_products,
            icon: '❌',
            color: 'red',
            description: 'Stok habis'
        },
    ];

    const colorClasses = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        green: 'bg-green-50 border-green-200 text-green-700',
        yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
        red: 'bg-red-50 border-red-200 text-red-700',
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statCards.map((stat, index) => (
                <div
                    key={index}
                    className={`p-6 border rounded-lg ${colorClasses[stat.color]}`}
                >
                    <div className="flex items-center">
                        <div className="text-2xl mr-4">{stat.icon}</div>
                        <div className="flex-1">
                            <p className="text-sm font-medium opacity-75">{stat.title}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-xs opacity-75 mt-1">{stat.description}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}