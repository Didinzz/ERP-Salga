export default function Spinner({ className = 'w-3 h-3 border-2', text = 'Memuat...' }) {
    return (
        <>
            <div
                // Kelas dasar untuk animasi + kelas kustom (untuk ukuran/ketebalan)
                className={`animate-spin rounded-full border-current border-t-transparent ${className}`}
                role="status"
            >
            </div>
            <span className="ml-2">{text}</span>
        </>
    );
}