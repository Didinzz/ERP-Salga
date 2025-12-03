import { FaTruck, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function DeliveryStats({ stats }) {
    const statCards = [
        {
            title: 'Total Pengiriman',
            value: stats.total_deliveries,
            icon: <FaTruck size={24} />,
            color: 'blue',
            description: 'Semua data pengiriman'
        },
        {
            title: 'Menunggu Driver',
            value: stats.pending_deliveries,
            icon: <FaClock size={24} />,
            color: 'yellow',
            description: 'Belum ditugaskan'
        },
        {
            title: 'Sedang Diantar',
            value: stats.on_delivery,
            icon: <FaTruck size={24} />, // Bisa ganti icon lain jika mau
            color: 'purple',
            description: 'Driver dalam perjalanan'
        },
        {
            title: 'Selesai Hari Ini',
            value: stats.delivered_today,
            icon: <FaCheckCircle size={24} />,
            color: 'green',
            description: 'Berhasil sampai tujuan'
        },
    ];

    const iconStyles = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        purple: 'bg-purple-50 text-purple-600',
        red: 'bg-red-50 text-red-600',
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow duration-300"
                >
                    <div className={`p-3 rounded-xl ${iconStyles[stat.color]}`}>
                        {stat.icon}
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">
                            {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-800 mt-0.5">
                            {stat.value}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 font-medium">
                            {stat.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}