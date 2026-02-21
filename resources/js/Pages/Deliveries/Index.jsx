import { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Toaster, toast } from 'react-hot-toast';

// Icons
import { FaFilter, FaPlus, FaSearch } from "react-icons/fa";

// Partials
import DeliveryStats from './Partials/DeliveryStats';
import DeliveryTable from './Partials/DeliveryTable';
import DeliveryFilters from './Partials/DeliveryFilters';
import ViewDeliveryModal from './Partials/ViewDeliveryModal';
import ActionModal from './Partials/ActionModal';

export default function DeliveryIndex({ auth, deliveries, filters, stats, drivers }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Modal States
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState(null);

    const [actionModalOpen, setActionModalOpen] = useState(false);
    const [actionType, setActionType] = useState(''); // 'pickup', 'deliver', 'fail', 'cancel'
    const [targetDelivery, setTargetDelivery] = useState(null);

    // State Filter & Debounce
    const [queryParams, setQueryParams] = useState({
        search: filters.search || '',
        status: filters.status || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    const isFirstRun = useRef(true);

    // Debounce Effect
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        const timer = setTimeout(() => {
            router.get(route('deliveries.index'), queryParams, {
                preserveState: true,
                preserveScroll: true,
                replace: true
            });
        }, 500);
        return () => clearTimeout(timer);
    }, [queryParams]);

    // Handlers State Update
    const handleSearch = (e) => setQueryParams(prev => ({ ...prev, search: e.target.value }));
    const handleFilterChange = (key, value) => setQueryParams(prev => ({ ...prev, [key]: value }));
    const clearFilters = () => setQueryParams(prev => ({ ...prev, status: '', date_from: '', date_to: '' }));

    // --- HANDLERS ---

    // Handler View Detail
    const handleView = (delivery) => {
        setSelectedDelivery(delivery);
        setViewModalOpen(true);
    };

    // Handler Buka Action Modal
    const openActionModal = (type, delivery) => {
        setActionType(type);
        setTargetDelivery(delivery);
        setActionModalOpen(true);
    };

    // Handler Assign Driver (Langsung di sini karena simpel tidak butuh modal khusus)
    const handleAssignDriver = (delivery, driverId) => {
        router.post(route('deliveries.assign-driver', delivery.id), { driver_id: driverId }, {
            onSuccess: () => toast.success('Driver berhasil ditugaskan!')
        });
    };

    // Hitung filter aktif
    const activeFilterCount = [queryParams.status, queryParams.date_from, queryParams.date_to].filter(Boolean).length;

    return (
        <AuthenticatedLayout user={auth.user} header={null}>
            <Head title="Logistik - Pengiriman" />
            <Toaster position="top-right" />

            <div className="py-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <DeliveryStats stats={stats} />

                    <div className="mt-6 bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
                        <div className="p-6">

                            {/* Toolbar */}
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                                <div className="flex flex-col sm:flex-row gap-3 flex-1">

                                    {/* Search */}
                                    <div className="relative flex-1 max-w-md">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaSearch className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={queryParams.search}
                                            onChange={handleSearch}
                                            placeholder="Cari surat jalan..."
                                            className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm shadow-sm transition-all"
                                        />
                                    </div>

                                    {/* Filter Button */}
                                    <button
                                        onClick={() => setIsFilterOpen(true)}
                                        className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                                    >
                                        <FaFilter className="mr-2 text-gray-400" /> Filter
                                        {activeFilterCount > 0 && (
                                            <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">{activeFilterCount}</span>
                                        )}
                                    </button>

                                    {activeFilterCount > 0 && (
                                        <button onClick={clearFilters} className="text-sm text-red-600 hover:underline">Reset</button>
                                    )}
                                </div>

                            </div>

                            {/* Table */}
                            <DeliveryTable
                                deliveries={deliveries}
                                drivers={drivers}
                                onView={handleView}
                                onAssignDriver={handleAssignDriver}
                                // Semua action (Pickup, Deliver, Fail, Cancel, Delete) buka modal yang sama
                                onPickup={(d) => openActionModal('pickup', d)}
                                onDeliver={(d) => openActionModal('deliver', d)}
                                onFail={(d) => openActionModal('fail', d)}
                                onCancel={(d) => openActionModal('cancel', d)}
                                onDelete={(d) => openActionModal('cancel', d)} // Delete kita anggap cancel
                            />

                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Sidebar */}
            <DeliveryFilters
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={queryParams}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
            />

            {/* Modal Detail */}
            <ViewDeliveryModal
                isOpen={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
                delivery={selectedDelivery}
            />

            {/* Modal Action (Form handled inside) */}
            <ActionModal
                isOpen={actionModalOpen}
                onClose={() => setActionModalOpen(false)}
                type={actionType}
                delivery={targetDelivery} // Kirim object delivery, bukan cuma codenya
            />

        </AuthenticatedLayout>
    );
}