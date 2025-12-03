import { FaTimes } from "react-icons/fa";
import { FaFilter, FaTrash, FaCalendarDays } from "react-icons/fa6";

export default function DeliveryFilters({ isOpen, onClose, filters, onFilterChange, onClearFilters }) {
    if (!isOpen) return null;

    // Cek filter aktif (selain search)
    const activeCount = [filters.status, filters.date_from, filters.date_to].filter(Boolean).length;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
                <div className="w-screen max-w-md bg-white shadow-xl flex flex-col h-full transform transition-transform animate-slide-in-right">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gray-50">
                        {/* ... (Header sama) ... */}
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => onFilterChange('status', e.target.value)}
                                className="w-full rounded-lg border-gray-300 text-sm"
                            >
                                <option value="">Semua Status</option>
                                <option value="pending">Menunggu Driver</option>
                                <option value="assigned">Ditugaskan</option>
                                <option value="shipping">Sedang Diantar</option>
                                <option value="delivered">Selesai</option>
                                <option value="failed">Gagal</option>
                            </select>
                        </div>

                        {/* Date Filter */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal</label>
                            <div className="grid grid-cols-2 gap-3">
                                <input type="date" value={filters.date_from} onChange={(e) => onFilterChange('date_from', e.target.value)} className="w-full rounded-lg border-gray-300 text-sm" />
                                <input type="date" value={filters.date_to} onChange={(e) => onFilterChange('date_to', e.target.value)} className="w-full rounded-lg border-gray-300 text-sm" />
                            </div>
                        </div>

                    </div>

                    {/* Footer (Hanya tombol Reset dan Tutup) */}
                    <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
                        <button
                            onClick={onClearFilters}
                            className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2"
                        >
                            <FaTrash size={14} /> Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}