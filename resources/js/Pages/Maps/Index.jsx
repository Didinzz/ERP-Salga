import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import { FaLocationDot, FaHand, FaEye } from "react-icons/fa6";
import CustomerList from './Partials/CustomerList';
import CustomerMap from './Partials/CustomerMap';
import MapControls from './Partials/MapControls';
import CustomerFormModal from './Partials/CustomerFormModal';
import MapLayerControl from './Partials/MapLayerControl';
import toast, { Toaster } from 'react-hot-toast';
import DeleteConfirmationModal from './Partials/DeleteConfirmationModal';

export default function MapIndex({ auth, customers }) {
    const DEFAULT_CENTER = [0.5721522928822436, 123.13714632225471]; // Gorontalo Area

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
    const [mode, setMode] = useState('view'); // 'view' | 'add' | 'edit'
    const [mapLayer, setMapLayer] = useState('street');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        id: '',
        name: '',
        owner_name: '',
        phone: '',
        address: '',
        latitude: '',
        longitude: '',
        status: '',
    });


    const changeMode = (newMode) => {
        setMode(newMode);
        setSelectedCustomer(null);
        if (newMode === 'add') toast('Mode Tambah Aktif: Klik peta untuk data baru', { icon: <FaLocationDot className="text-green-600 text-xl" /> });
        else if (newMode === 'edit') toast('Mode Geser Aktif: Drag marker untuk pindah lokasi', { icon: <FaHand className="text-orange-500 text-xl" /> });
        else toast('Mode Lihat Aktif', { icon: <FaEye className="text-blue-500 text-xl" /> });
    };

    const handleViewLocation = (customer) => {
        if (mode === 'add') return;
        setSelectedCustomer(customer);
        setMapCenter([customer.lat, customer.lng]);
    };

    const handleEditData = (customer) => {
        if (mode === 'add') return;

        setModalMode('edit');
        setData({
            id: customer.id,
            name: customer.name,
            owner_name: customer.owner || '',
            phone: customer.phone || '',
            address: customer.address,
            latitude: customer.lat,
            longitude: customer.lng,
            status: customer.status || 'active',
        });

        setIsModalOpen(true);
    };

    const handleMapClick = (latlng) => {
        if (mode !== 'add') return;

        reset();
        clearErrors();
        setData({
            id: '',
            name: '',
            owner_name: '',
            phone: '',
            address: '',
            status: 'active',
            latitude: latlng.lat,
            longitude: latlng.lng
        });

        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleDragEnd = (customer, newLatLng) => {
        const loadingToast = toast.loading('Memperbarui posisi...');

        router.put(route('logistik.map.update', customer.id), {
            name: customer.name,
            owner_name: customer.owner,
            phone: customer.phone,
            address: customer.address,
            status: customer.status || 'active',

            latitude: newLatLng.lat,
            longitude: newLatLng.lng,
        }, {
            onSuccess: () => {
                toast.dismiss(loadingToast);
            },
            onError: (err) => {
                toast.dismiss(loadingToast);
                console.error(err);
                toast.error('Gagal update posisi.');
            },
            preserveScroll: true
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const action = modalMode === 'create' ? post : put;
        const url = modalMode === 'create' ? route('logistik.map.store') : route('logistik.map.update', data.id);

        action(url, {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const confirmDelete = (customerId) => {
        const target = customers.find(c => c.id === customerId) || { id: customerId, name: 'Data Pelanggan' };
        setCustomerToDelete(target);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = () => {
        if (!customerToDelete) return;

        destroy(route('logistik.map.destroy', customerToDelete.id), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setIsModalOpen(false); // Tutup modal edit juga jika terbuka (kasus hapus dari dalam modal edit)
                setCustomerToDelete(null);
            },
            onError: () => {
                toast.error('Gagal menghapus data.');
                setIsDeleteModalOpen(false);
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={null}>
            <Head title="Peta Pelanggan" />
            <Toaster position="top-right" />

            <div className="relative flex flex-col-reverse md:flex-row h-[calc(100dvh-65px)] w-full overflow-hidden bg-gray-100">

                {/* --- KIRI: LIST SIDEBAR --- */}
                <div className="w-full md:w-1/3 h-[40%] md:h-full bg-white shadow-xl z-10 relative flex flex-col border-t md:border-t-0 md:border-r border-gray-200">
                    <CustomerList
                        customers={customers}
                        selectedId={selectedCustomer?.id}
                        currentUser={auth.user}
                        onSelect={handleViewLocation} // Klik List -> Cuma geser kamera
                        onEdit={handleEditData}       // Klik Icon Pensil -> Buka Modal Edit
                        onDelete={confirmDelete}      // Klik Icon Sampah -> Buka Modal Konfirmasi
                    />
                </div>

                {/* --- KANAN: MAP AREA --- */}
                <div className="flex-1 relative h-[60%] md:h-full w-full z-0">

                    {/* Kontrol Mode (Hamburger) */}
                    <MapControls mode={mode} onChangeMode={changeMode} />

                    {/* Kontrol Layer (Satelit/Jalan) */}
                    <MapLayerControl currentLayer={mapLayer} onChangeLayer={setMapLayer} />

                    <CustomerMap
                        customers={customers}
                        center={mapCenter}
                        mode={mode}
                        currentLayer={mapLayer}      // Pass state layer ke map
                        onEditClick={handleEditData} // Tombol di Popup -> Buka Modal Edit
                        onMapClick={handleMapClick}  // Klik Peta Kosong -> Modal Create
                        onDragEnd={handleDragEnd}    // Drag Marker -> Instant Save
                    />
                </div>

                {/* --- MODAL FORM (CREATE / EDIT) --- */}
                <CustomerFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    data={data}
                    setData={setData}
                    processing={processing}
                    errors={errors}
                    mode={modalMode}
                    onSubmit={handleSubmit}
                    onDelete={() => confirmDelete(data.id)} // Tombol Hapus di dalam Modal Edit
                />

                {/* --- MODAL KONFIRMASI HAPUS (DANGER) --- */}
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={executeDelete}
                    processing={processing}
                    title="Hapus Lokasi Pelanggan"
                    message="Lokasi yang dihapus tidak dapat dikembalikan lagi. Marker akan hilang dari peta."
                    itemName={customerToDelete?.name} // Menampilkan nama toko yang akan dihapus
                />
            </div>
        </AuthenticatedLayout>
    );
}