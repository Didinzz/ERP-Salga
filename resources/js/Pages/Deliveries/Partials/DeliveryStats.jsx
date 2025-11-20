// resources/js/Pages/Deliveries/Partials/DeliveryStats.jsx

export default function DeliveryStats({ stats }) {
    const statCards = [
        {
            title: 'Total Pengiriman',
            value: stats.total_deliveries,
            icon: '🚚',
            color: 'blue',
            description: 'Semua pengiriman'
        },
        {
            title: 'Menunggu',
            value: stats.pending_deliveries,
            icon: '⏳',
            color: 'yellow',
            description: 'Belum ditugaskan'
        },
        {
            title: 'Dalam Perjalanan',
            value: stats.on_delivery,
            icon: '🛵',
            color: 'purple',
            description: 'Sedang dikirim'
        },
        {
            title: 'Terkirim Hari Ini',
            value: stats.delivered_today,
            icon: '✅',
            color: 'green',
            description: 'Berhasil dikirim'
        },
    ];

    const colorClasses = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        green: 'bg-green-50 border-green-200 text-green-700',
        yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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