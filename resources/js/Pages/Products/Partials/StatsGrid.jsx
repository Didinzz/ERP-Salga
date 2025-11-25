import { FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FaBoxOpen,   } from "react-icons/fa6";

export default function StatsGrid({ stats }) {
    const statCards = [
        {
            title: 'Total Produk',
            value: stats.total_products,
            icon: <FaBoxOpen size={24} />,
            color: 'blue',
            description: 'Semua produk terdaftar'
        },
        {
            title: 'Tersedia',
            value: stats.available_products,
            icon: <FaCheckCircle size={24} />,
            color: 'green',
            description: 'Produk status aktif'
        },
        {
            title: 'Stok Sedikit',
            value: stats.low_stock_products,
            icon: <FaExclamationTriangle size={24} />,
            color: 'yellow',
            description: 'Perlu restock segera'
        },
        {
            title: 'Habis',
            value: stats.out_of_stock_products,
            icon: <FaTimesCircle size={24} />,
            color: 'red',
            description: 'Stok kosong'
        },
    ];

    // Style Map untuk Ikon
    const iconStyles = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        red: 'bg-red-50 text-red-600',
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow duration-300"
                >
                    {/* Icon dengan Background Bulat/Kotak */}
                    <div className={`p-3 rounded-xl ${iconStyles[stat.color]}`}>
                        {stat.icon}
                    </div>

                    {/* Text Info */}
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