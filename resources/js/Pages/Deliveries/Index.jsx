import { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Toaster, toast } from 'react-hot-toast';

// Import Icons
import { FaFilter, FaPlus, FaSearch } from "react-icons/fa";

// Import Partials
import DeliveryStats from './Partials/DeliveryStats';
import DeliveryTable from './Partials/DeliveryTable';
import DeliveryFilters from './Partials/DeliveryFilters';

export default function DeliveryIndex({ auth, deliveries, filters, stats, drivers }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // --- 1. GABUNGKAN STATE (PENTING) ---
    // Gabungkan search dan filter jadi satu state objek agar bisa didebounce bersamaan
    const [queryParams, setQueryParams] = useState({
        search: filters.search || '',
        status: filters.status || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    const isFirstRun = useRef(true);

    // --- 2. SINGLE DEBOUNCE EFFECT (AUTO FILTER) ---
    useEffect(() => {
        // Skip render pertama (initial load)
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        // Tunggu 500ms setelah ada perubahan di queryParams (search ATAU filter)
        const delayDebounceFn = setTimeout(() => {
            router.get(route('deliveries.index'), queryParams, {
                preserveState: true,
                preserveScroll: true,
                replace: true
            });
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [queryParams]); // Dependency: Jalankan setiap kali queryParams berubah

    // --- Handlers Update State ---

    const handleSearch = (e) => {
        setQueryParams(prev => ({ ...prev, search: e.target.value }));
    };

    const handleFilterChange = (filterType, value) => {
        setQueryParams(prev => ({ ...prev, [filterType]: value }));
        // Tidak perlu panggil router.get manual disini, useEffect akan mengurusnya
    };

    const clearFilters = () => {
        setQueryParams(prev => ({
            ...prev,
            status: '',
            date_from: '',
            date_to: ''
        }));
    };

    // --- Handlers Aksi Tabel ---
    const handleView = (delivery) => toast("Fitur detail belum diimplementasi");

    const handleAssignDriver = (delivery, driverId) => {
        router.post(route('deliveries.assign-driver', delivery.id), { driver_id: driverId });
    };

    const handlePickup = (delivery) => {
        if (confirm(`Konfirmasi pengiriman ${delivery.do_code} berangkat?`)) {
            router.post(route('deliveries.pickup', delivery.id), {}, { onError: () => toast.error('Status: Belum Berangkat') });
        }
    };

    const handleDeliver = (delivery, notes = '') => {
        if (confirm(`Selesaikan pengiriman ${delivery.do_code}?`)) {
            router.post(route('deliveries.deliver', delivery.id), { delivery_notes: notes }, { onSuccess: () => toast.success('Pengiriman Selesai!') });
        }
    };

    const handleFail = (delivery, notes = '') => {
        if (confirm(`Tandai pengiriman ${delivery.do_code} sebagai GAGAL?`)) {
            router.post(route('deliveries.fail', delivery.id), { delivery_notes: notes }, { onSuccess: () => toast.error('Status: Gagal Kirim') });
        }
    };

    const handleCancel = (delivery) => {
        if (confirm(`Batalkan pengiriman ${delivery.do_code}?`)) {
            router.post(route('deliveries.cancel', delivery.id), {}, { onSuccess: () => toast('Dibatalkan') });
        }
    };

    const handleDelete = (delivery) => {
        if (confirm(`Hapus data pengiriman ${delivery.do_code}?`)) {
            router.delete(route('deliveries.destroy', delivery.id), { onSuccess: () => toast.success('Data dihapus') });
        }
    };

    // Hitung jumlah filter aktif (selain search)
    const activeFilterCount = [queryParams.status, queryParams.date_from, queryParams.date_to].filter(Boolean).length;

    return (
        <AuthenticatedLayout user={auth.user} header={null}>
            <Head title="Logistik - Pengiriman" />
            <Toaster position="top-right" />

            <div className="py-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* 1. STATS */}
                    <DeliveryStats stats={stats} />

                    <div className="mt-6 bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
                        <div className="p-6">

                            {/* 2. TOOLBAR */}
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                                <div className="flex flex-col sm:flex-row gap-3 flex-1">

                                    {/* Search Input */}
                                    <div className="relative flex-1 max-w-md">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaSearch className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={queryParams.search}
                                            onChange={handleSearch} // Hanya update state
                                            placeholder="Cari No. Surat Jalan, Nama Penerima..."
                                            className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm shadow-sm transition-all"
                                        />
                                    </div>

                                    {/* Filter Button */}
                                    <button
                                        onClick={() => setIsFilterOpen(true)}
                                        className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-colors"
                                    >
                                        <FaFilter className="mr-2 text-gray-400" /> Filter
                                        {activeFilterCount > 0 && (
                                            <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">{activeFilterCount}</span>
                                        )}
                                    </button>

                                    {/* Reset Button */}
                                    {activeFilterCount > 0 && (
                                        <button onClick={clearFilters} className="text-sm text-red-600 hover:underline">Reset</button>
                                    )}
                                </div>

                                {/* Tombol Tambah Manual */}
                                {/* <div className="flex-shrink-0">
                                    <button
                                        onClick={() => router.get(route('deliveries.create'))}
                                        className="inline-flex items-center px-4 py-2.5 bg-blue-600 border border-transparent rounded-xl font-semibold text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all shadow-md"
                                    >
                                        <FaPlus className="mr-2" />
                                        Buat Pengiriman Manual
                                    </button>
                                </div> */}
                            </div>

                            {/* 3. TABLE */}
                            <DeliveryTable
                                deliveries={deliveries}
                                drivers={drivers}
                                onAssignDriver={handleAssignDriver}
                                onPickup={handlePickup}
                                onDeliver={handleDeliver}
                                onFail={handleFail}
                                onCancel={handleCancel}
                                onDelete={handleDelete}
                                onView={handleView}
                            />

                        </div>
                    </div>
                </div>
            </div>

            {/* 4. SIDEBAR FILTER */}
            {/* Kita hapus onApply karena sekarang otomatis */}
            <DeliveryFilters
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={queryParams} // Pass queryParams yang baru
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
            />

        </AuthenticatedLayout>
    );
}