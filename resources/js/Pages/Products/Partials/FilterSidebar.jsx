// resources/js/Pages/Products/Partials/FilterSidebar.jsx

export default function FilterSidebar({ isOpen, onClose, filters, filterOptions, onFilterChange, onClearFilters }) {
    if (!isOpen) return null;

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                {/* Background overlay */}
                <div 
                    className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                />
                
                {/* Sidebar panel */}
                <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
                    <div className="relative w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl">
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900">Filter Produk</h2>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Filter content */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="p-4 space-y-6">
                                    {/* Brand Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Merek
                                        </label>
                                        <select
                                            value={filters.brand}
                                            onChange={(e) => onFilterChange('brand', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Semua Merek</option>
                                            {filterOptions.brands.map((brand) => (
                                                <option key={brand} value={brand}>
                                                    {brand}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Bottle Type Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Jenis Botol
                                        </label>
                                        <select
                                            value={filters.bottle_type}
                                            onChange={(e) => onFilterChange('bottle_type', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Semua Jenis</option>
                                            {filterOptions.bottle_types.map((type) => (
                                                <option key={type} value={type}>
                                                    {type.replace('_', ' ')}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Water Type Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Jenis Air
                                        </label>
                                        <select
                                            value={filters.water_type}
                                            onChange={(e) => onFilterChange('water_type', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Semua Jenis</option>
                                            {filterOptions.water_types.map((type) => (
                                                <option key={type} value={type}>
                                                    {type.replace('_', ' ')}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Stock Status Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status Stok
                                        </label>
                                        <select
                                            value={filters.stock_status}
                                            onChange={(e) => onFilterChange('stock_status', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Semua Status</option>
                                            <option value="low">Stok Sedikit</option>
                                            <option value="out">Stok Habis</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
                                <div className="flex space-x-3">
                                    {hasActiveFilters && (
                                        <button
                                            onClick={onClearFilters}
                                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            Hapus Semua Filter
                                        </button>
                                    )}
                                    <button
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Terapkan Filter
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}