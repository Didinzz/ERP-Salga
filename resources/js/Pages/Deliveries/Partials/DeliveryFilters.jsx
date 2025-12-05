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
                <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-transform animate-slide-in-right">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
                        <div className="flex items-center gap-2 text-gray-800">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <FaFilter />
                            </div>
                            <h2 className="text-lg font-bold">Filter Pengiriman</h2>
                            {activeCount > 0 && (
                                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                    {activeCount}
                                </span>
                            )}
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-50 transition-colors">
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white">

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Status Pengiriman</label>
                            <div className="relative">
                                <select
                                    value={filters.status}
                                    onChange={(e) => onFilterChange('status', e.target.value)}
                                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white appearance-none cursor-pointer transition-all hover:border-blue-400"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="pending">Menunggu Driver</option>
                                    <option value="assigned">Driver Ditugaskan</option>
                                    <option value="shipping">Sedang Diantar</option>
                                    <option value="delivered">Selesai (Diterima)</option>
                                    <option value="failed">Gagal Kirim / Dibatalkan</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Date Filter */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">Jadwal Pengiriman</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Dari Tanggal</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={filters.date_from}
                                            onChange={(e) => onFilterChange('date_from', e.target.value)}
                                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all hover:border-blue-400"
                                        />
                                        <FaCalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Sampai Tanggal</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={filters.date_to}
                                            onChange={(e) => onFilterChange('date_to', e.target.value)}
                                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all hover:border-blue-400"
                                        />
                                        <FaCalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                        <button
                            onClick={onClearFilters}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-white border border-gray-300 text-gray-700 font-bold text-sm rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
                        >
                            <FaTrash size={12} /> Reset Filter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}