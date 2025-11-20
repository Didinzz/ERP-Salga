import StatCard from '@/Components/UI/StatCard';
import { HiUsers, HiShieldCheck, HiBriefcase, HiCurrencyDollar } from "react-icons/hi2";

export default function StatsGrid({ totalUsers }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <StatCard
                title="Total Pengguna"
                value={totalUsers}
                color="primary"
                icon={<HiUsers className="w-6 h-6" />}
            />
            {/* Data di bawah ini masih hardcoded, nanti bisa dipass dari props juga */}
            <StatCard
                title="Admin"
                value="12"
                color="green"
                icon={<HiShieldCheck className="w-6 h-6" />}
            />
            <StatCard
                title="Distributor"
                value="186"
                color="blue"
                icon={<HiBriefcase className="w-6 h-6" />}
            />
            <StatCard
                title="Sales"
                value="50"
                color="orange"
                icon={<HiCurrencyDollar className="w-6 h-6" />}
            />
        </div>
    );
}