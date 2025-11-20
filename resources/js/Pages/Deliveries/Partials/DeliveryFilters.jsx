// resources/js/Pages/Deliveries/Partials/DeliveryFilters.jsx

import { useState } from 'react';

export default function DeliveryFilters({ filters, onFilterChange, onClearFilters }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="relative">
            <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter
                {hasActiveFilters && (
                    <span className="ml-2 bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                        {Object.values(filters).filter(Boolean).length}
                    </span>
                )}
            </button>

            {isFilterOpen && (
                <div className="absolute top-12 left-0 z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status Pengiriman
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) => onFilterChange('status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Semua Status</option>
                                <option value="pending">Menunggu</option>
                                <option value="assigned">Ditugaskan</option>
                                <option value="on_delivery">Dalam Perjalanan</option>
                                <option value="delivered">Terkirim</option>
                                <option value="cancelled">Dibatalkan</option>
                                <option value="failed">Gagal</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Dari Tanggal
                            </label>
                            <input
                                type="date"
                                value={filters.date_from}
                                onChange={(e) => onFilterChange('date_from', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sampai Tanggal
                            </label>
                            <input
                                type="date"
                                value={filters.date_to}
                                onChange={(e) => onFilterChange('date_to', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex space-x-2 pt-2">
                            {hasActiveFilters && (
                                <button
                                    onClick={() => {
                                        onClearFilters();
                                        setIsFilterOpen(false);
                                    }}
                                    className="flex-1 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Clear
                                </button>
                            )}
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="flex-1 px-3 py-2 text-sm text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                            >
                                Terapkan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay untuk menutup filter */}
            {isFilterOpen && (
                <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setIsFilterOpen(false)}
                />
            )}
        </div>
    );
}