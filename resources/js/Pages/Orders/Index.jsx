// resources/js/Pages/Orders/Index.jsx

import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Import Partials
import OrderStats from './Partials/OrderStats';
import OrderTable from './Partials/OrderTable';
import OrderFilters from './Partials/OrderFilters';

export default function OrderIndex({ auth, orders, filters, stats }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedFilters, setSelectedFilters] = useState({
        status: filters.status || '',
        payment_status: filters.payment_status || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    // Handle Search
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        router.get(route('orders.index'), { 
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

        router.get(route('orders.index'), { 
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
            status: '',
            payment_status: '',
            date_from: '',
            date_to: '',
        });
        setSearchTerm('');

        router.get(route('orders.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    // Handle Actions
    const handleView = (order) => {
        router.get(route('orders.show', order.id));
    };

    const handleEdit = (order) => {
        router.get(route('orders.edit', order.id));
    };

    const handleDelete = (order) => {
        if (confirm(`Apakah Anda yakin ingin menghapus order ${order.order_code}?`)) {
            router.delete(route('orders.destroy', order.id));
        }
    };

    const handleUpdatePayment = (order, amount) => {
        router.post(route('orders.update-payment', order.id), {
            paid_amount: amount
        });
    };

    const handleComplete = (order) => {
        if (confirm(`Selesaikan order ${order.order_code}?`)) {
            router.post(route('orders.complete', order.id));
        }
    };

    const handleCancel = (order) => {
        if (confirm(`Batalkan order ${order.order_code}?`)) {
            router.post(route('orders.cancel', order.id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Manajemen Pemesanan</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Kelola pemesanan produk air mineral PT Salga Mandiri
                    </p>
                </div>
            }
        >
            <Head title="Manajemen Pemesanan" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* 1. Bagian Statistik */}
                    <OrderStats stats={stats} />

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
                                            placeholder="Cari order, customer..."
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                                        />
                                    </div>

                                    {/* Filter Button */}
                                    <OrderFilters
                                        filters={selectedFilters}
                                        onFilterChange={handleFilterChange}
                                        onClearFilters={clearFilters}
                                    />
                                </div>

                                {/* Add Order Button */}
                                <button
                                    onClick={() => router.get(route('orders.create'))}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Buat Pemesanan
                                </button>
                            </div>

                            {/* 3. Tabel Order */}
                            <OrderTable
                                orders={orders}
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onUpdatePayment={handleUpdatePayment}
                                onComplete={handleComplete}
                                onCancel={handleCancel}
                            />

                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}