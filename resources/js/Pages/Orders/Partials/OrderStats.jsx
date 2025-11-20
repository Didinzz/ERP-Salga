// resources/js/Pages/Orders/Partials/OrderStats.jsx

export default function OrderStats({ stats }) {
    const statCards = [
        {
            title: 'Total Pemesanan',
            value: stats.total_orders,
            icon: '📦',
            color: 'blue',
            description: 'Semua order'
        },
        {
            title: 'Pending',
            value: stats.pending_orders,
            icon: '⏳',
            color: 'yellow',
            description: 'Menunggu konfirmasi'
        },
        {
            title: 'Selesai',
            value: stats.completed_orders,
            icon: '✅',
            color: 'green',
            description: 'Order completed'
        },
        {
            title: 'Hari Ini',
            value: stats.today_orders,
            icon: '📅',
            color: 'purple',
            description: 'Order hari ini'
        },
        {
            title: 'Total Pendapatan',
            value: `Rp ${stats.total_revenue ? stats.total_revenue.toLocaleString('id-ID') : '0'}`,
            icon: '💰',
            color: 'green',
            description: 'Dari order completed'
        },
    ];

    const colorClasses = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        green: 'bg-green-50 border-green-200 text-green-700',
        yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {statCards.map((stat, index) => (
                <div
                    key={index}
                    className={`p-4 border rounded-lg ${colorClasses[stat.color]}`}
                >
                    <div className="flex items-center">
                        <div className="text-2xl mr-3">{stat.icon}</div>
                        <div className="flex-1">
                            <p className="text-sm font-medium opacity-75">{stat.title}</p>
                            <p className="text-xl font-bold">{stat.value}</p>
                            <p className="text-xs opacity-75 mt-1">{stat.description}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}