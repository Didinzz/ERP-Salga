export default function StatCard({ title, value, icon, color = 'primary' }) {
    // Mapping warna agar dinamis sesuai props 'color'
    const styles = {
        primary: {
            border: 'border-primary',
            iconBg: 'bg-primary/10',
            iconText: 'text-primary'
        },
        green: {
            border: 'border-green-500',
            iconBg: 'bg-green-100',
            iconText: 'text-green-600'
        },
        blue: {
            border: 'border-blue-500',
            iconBg: 'bg-blue-100',
            iconText: 'text-blue-600'
        },
        orange: {
            border: 'border-orange-500',
            iconBg: 'bg-orange-100',
            iconText: 'text-orange-600'
        },
        red: {
            border: 'border-red-500',
            iconBg: 'bg-red-100',
            iconText: 'text-red-600'
        },
    };

    // Fallback ke primary jika warna tidak ditemukan
    const theme = styles[color] || styles.primary;

    return (
        <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${theme.border} transition-transform hover:-translate-y-1 duration-300`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{title}</p>
                    <p className="text-3xl font-bold text-dark mt-2">{value}</p>
                </div>
                <div className={`w-12 h-12 ${theme.iconBg} rounded-full flex items-center justify-center`}>
                    <div className={`w-6 h-6 ${theme.iconText}`}>
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
}