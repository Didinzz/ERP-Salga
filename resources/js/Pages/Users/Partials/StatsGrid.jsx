import { 
    HiUsers, 
    HiShieldCheck, 
    HiBriefcase, 
    HiCurrencyDollar,
    HiUserGroup,
    HiTruck 
} from "react-icons/hi2";

export default function StatsGrid({ stats }) {
    const roleStats = [
        {
            title: "Admin",
            value: stats?.roles?.admin || 0,
            icon: <HiShieldCheck className="w-6 h-6" />,
            color: "green",
            description: "Hak akses penuh",
        },
        {
            title: "Staff",
            value: stats?.roles?.staff || 0,
            icon: <HiBriefcase className="w-6 h-6" />,
            color: "blue",
            description: "Tim administrasi",
        },
        {
            title: "Kasir",
            value: stats?.roles?.kasir || 0,
            icon: <HiCurrencyDollar className="w-6 h-6" />,
            color: "orange",
            description: "Petugas kasir",
        },
        {
            title: "Driver",
            value: stats?.roles?.driver || 0,
            icon: <HiTruck className="w-6 h-6" />,
            color: "purple",
            description: "Pengemudi",
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
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {roleStats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow duration-300"
                >
                    {/* Icon dengan Background Bulat/Kotak */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2.5 rounded-lg ${colorClasses[stat.color]}`}>
                            {stat.icon}
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">
                                {stat.title}
                            </p>
                        </div>
                    </div>

                    {/* Text Info */}
                    <div>
                        <p className="text-2xl font-bold text-gray-800">
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