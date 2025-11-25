import { HiUsers, HiShieldCheck, HiBriefcase, HiCurrencyDollar } from "react-icons/hi2";

export default function StatsGrid({ totalUsers }) {
    const stats = [
        {
            title: "Total Pengguna",
            value: totalUsers,
            icon: <HiUsers className="w-6 h-6" />,
            color: "blue",
            description: "Akun terdaftar",
        },
        {
            title: "Admin",
            value: "12", // Nanti bisa diganti props dinamis
            icon: <HiShieldCheck className="w-6 h-6" />,
            color: "green",
            description: "Hak akses penuh",
        },
        {
            title: "Distributor",
            value: "186", // Nanti bisa diganti props dinamis
            icon: <HiBriefcase className="w-6 h-6" />,
            color: "purple",
            description: "Mitra penyalur",
        },
        {
            title: "Sales",
            value: "50", // Nanti bisa diganti props dinamis
            icon: <HiCurrencyDollar className="w-6 h-6" />,
            color: "orange",
            description: "Tim penjualan",
        },
    ];

    // Mapping warna untuk styling dinamis
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow duration-300"
                >
                    {/* Icon dengan Background Bulat/Kotak */}
                    <div className={`p-3 rounded-xl ${colorClasses[stat.color]}`}>
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