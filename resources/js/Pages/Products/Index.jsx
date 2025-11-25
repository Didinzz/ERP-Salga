// resources/js/Pages/Products/Index.jsx (Updated)

import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Import Partials
import StatsGrid from './Partials/StatsGrid';
import ProductTable from './Partials/ProductTable';
import CreateProductForm from './Partials/CreateProductForm';
import EditProductForm from './Partials/EditProductForm'; // Import form edit
import FilterSidebar from './Partials/FilterSidebar';
import DeleteConfirmationModal from './Partials/DeleteConfirmationModal';

export default function ProductIndex({ auth, products, filters, stats, filterOptions }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedFilters, setSelectedFilters] = useState({
        brand: filters.brand || '',
        bottle_type: filters.bottle_type || '',
        water_type: filters.water_type || '',
        stock_status: filters.stock_status || '',
    });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    console.log({isDeleteModalOpen})

    const openDeleteModal = (product) => {
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    // Handle Search
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        router.get(route('products.index'), {
            search: value,
            ...selectedFilters
        }, {
            preserveState: true,
            replace: true,
        });
    };

    // Handle Filter Change
    const handleFilterChange = (filterType, value) => {
        const newFilters = {
            ...selectedFilters,
            [filterType]: value
        };

        setSelectedFilters(newFilters);

        router.get(route('products.index'), {
            search: searchTerm,
            ...newFilters
        }, {
            preserveState: true,
            replace: true,
        });
    };

    // Clear All Filters
    const clearFilters = () => {
        setSelectedFilters({
            brand: '',
            bottle_type: '',
            water_type: '',
            stock_status: '',
        });
        setSearchTerm('');

        router.get(route('products.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    // Handle Edit Product
    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    // Handle Close Edit Modal
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedProduct(null);
    };

    // Handle Delete Product
    const handleDelete = () => {
        if (!productToDelete) return;
        setIsDeleting(true);

        router.delete(route('products.destroy', productToDelete.id), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setProductToDelete(null);
            },
            onError: (errors) => {
                setIsDeleteModalOpen(false);
            },
            onFinish: () => {
                setIsDeleting(false);
                setIsDeleteModalOpen(false);
            }
        });
    };

    // Handle Toggle Availability
    const handleToggleAvailability = (product) => {
        const action = product.is_available ? 'menonaktifkan' : 'mengaktifkan';
        if (confirm(`Apakah Anda yakin ingin ${action} produk "${product.name}"?`)) {
            router.post(route('products.toggle-availability', product.id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Manajemen Produk Air Mineral</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Kelola data produk air mineral CV Salga Mandiri
                    </p>
                </div>
            }
        >
            <Head title="Manajemen Produk" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* 1. Bagian Statistik */}
                    <StatsGrid stats={stats} />

                    <div className="mt-6 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">

                            {/* 2. Toolbar dengan Search dan Filter */}
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {/* Search Input */}
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={handleSearch}
                                            placeholder="Cari produk..."
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                                        />
                                    </div>

                                    {/* Filter Button */}
                                    <button
                                        onClick={() => setIsFilterOpen(true)}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                        </svg>
                                        Filter
                                        {Object.values(selectedFilters).filter(Boolean).length > 0 && (
                                            <span className="ml-2 bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                                                {Object.values(selectedFilters).filter(Boolean).length}
                                            </span>
                                        )}
                                    </button>

                                    {/* Clear Filters */}
                                    {Object.values(selectedFilters).filter(Boolean).length > 0 && (
                                        <button
                                            onClick={clearFilters}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            Clear Filters
                                        </button>
                                    )}
                                </div>

                                {/* Add Product Button */}
                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Tambah Produk
                                </button>
                            </div>

                            {/* 3. Tabel Produk */}
                            <ProductTable
                                products={products}
                                onEdit={handleEdit}
                                onDelete={openDeleteModal}
                                onUpdateStock={() => { }} // Optional: bisa diimplementasi nanti
                                onToggleAvailability={handleToggleAvailability}
                            />

                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Modal Tambah Produk */}
            <CreateProductForm
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            {/* 5. Modal Edit Produk */}
            <EditProductForm
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                product={selectedProduct}
            />

            {/* 6. Sidebar Filter */}
            <FilterSidebar
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={selectedFilters}
                filterOptions={filterOptions}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                processing={isDeleting}
                itemName={productToDelete?.name}
            />

        </AuthenticatedLayout>
    );
}