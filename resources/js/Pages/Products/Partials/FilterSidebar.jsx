import { FaTimes } from "react-icons/fa";
import { FaFilter, FaTrash } from "react-icons/fa6";

export default function FilterSidebar({ isOpen, onClose, filters, filterOptions, onFilterChange, onClearFilters }) {
    if (!isOpen) return null;

    // Helper untuk cek filter aktif
    const activeCount = Object.values(filters).filter(Boolean).length;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
                <div className="w-screen max-w-md bg-white shadow-xl flex flex-col h-full transform transition-transform">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2 text-gray-800">
                            <FaFilter className="text-blue-600" />
                            <h2 className="text-lg font-bold">Filter Produk</h2>
                            {activeCount > 0 && (
                                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {activeCount}
                                </span>
                            )}
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">

                        {/* Brand Filter */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Merek</label>
                            <select
                                value={filters.brand || ''}
                                onChange={(e) => onFilterChange('brand', e.target.value)}
                                className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                                <option value="">Semua Merek</option>
                                {filterOptions.brands.map(brand => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>

                        {/* Bottle Type */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Jenis Kemasan</label>
                            <div className="space-y-2">
                                {filterOptions.bottle_types.map(type => (
                                    <label key={type} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all">
                                        <input
                                            type="radio"
                                            name="bottle_type"
                                            checked={filters.bottle_type === type}
                                            onChange={() => onFilterChange('bottle_type', type)}
                                            className="text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <span className="text-sm text-gray-700 capitalize">{type.replace('_', ' ')}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Status Stok */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Status Stok</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => onFilterChange('stock_status', 'low')}
                                    className={`px-3 py-2 rounded-lg text-sm border ${filters.stock_status === 'low' ? 'bg-yellow-50 border-yellow-500 text-yellow-700 font-bold' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                >
                                    Stok Menipis
                                </button>
                                <button
                                    onClick={() => onFilterChange('stock_status', 'out')}
                                    className={`px-3 py-2 rounded-lg text-sm border ${filters.stock_status === 'out' ? 'bg-red-50 border-red-500 text-red-700 font-bold' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                >
                                    Stok Habis
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
                        <button
                            onClick={onClearFilters}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
                        >
                            <FaTrash size={14} /> Reset
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-[2] px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all"
                        >
                            Terapkan Hasil
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}