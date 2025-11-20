export default function Badge({ label }) {
    // Normalisasi label ke string agar aman
    const text = label ? label.toString() : '';

    // Logika penentuan warna berdasarkan teks
    let className = 'bg-gray-100 text-gray-800'; // Default

    switch (text) {
        // Roles
        case 'Admin':
            className = 'bg-purple-100 text-purple-700';
            break;
        case 'Distributor':
            className = 'bg-blue-100 text-blue-700';
            break;
        case 'Sales':
            className = 'bg-orange-100 text-orange-700';
            break;

        // Status
        case 'Aktif':
            className = 'bg-green-100 text-green-700';
            break;
        case 'Nonaktif':
            className = 'bg-red-100 text-red-700';
            break;

        // Lainnya (Pending, dll)
        case 'Pending':
            className = 'bg-yellow-100 text-yellow-700';
            break;
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${className}`}>
            {text}
        </span>
    );
}