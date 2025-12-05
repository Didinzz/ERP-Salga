import Modal from '@/Components/Modal';
import {
    FaUser, FaPhone,  FaBox, FaTruck,
    FaCheck,  FaClock, FaClipboardList, FaImage,  FaXmark
} from "react-icons/fa6";

import { FaCalendarAlt, FaTimes, FaMapMarkerAlt, } from 'react-icons/fa';

export default function ViewDeliveryModal({ isOpen, onClose, delivery }) {
    if (!delivery) return null;

    // --- LOGIC PIPELINE ---
    const steps = [
        { id: 'pending', label: 'Pesanan Masuk', icon: FaBox, date: delivery.created_at },
        { id: 'assigned', label: 'Driver Dipilih', icon: FaUser, date: delivery.assigned_at },
        { id: 'shipping', label: 'Dalam Perjalanan', icon: FaTruck, date: delivery.shipped_at },
        { id: 'delivered', label: 'Diterima', icon: FaCheck, date: delivery.delivered_at },
    ];

    // Tentukan index status saat ini
    const statusOrder = ['pending', 'assigned', 'shipping', 'delivered'];
    let currentStepIndex = statusOrder.indexOf(delivery.status);

    const isFailed = delivery.status === 'failed';
    const isCancelled = delivery.status === 'cancelled';

    // Jika gagal/batal, anggap proses berhenti (visual merah)
    if (isFailed || isCancelled) currentStepIndex = -1;

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <div className="bg-white text-gray-900 overflow-hidden rounded-2xl flex flex-col max-h-[90vh] shadow-2xl">

                {/* --- HEADER (Clean Style) --- */}
                <div className="sticky top-0 z-10 bg-white px-6 py-5 flex items-center justify-between border-b border-gray-100 shadow-sm">
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                                {delivery.do_code}
                            </h3>
                            {/* Badge Status Header */}
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${isFailed || isCancelled
                                ? 'bg-red-50 text-red-600 border-red-200'
                                : delivery.status === 'delivered'
                                    ? 'bg-green-50 text-green-600 border-green-200'
                                    : 'bg-blue-50 text-blue-600 border-blue-200'
                                }`}>
                                {delivery.status === 'failed' ? 'GAGAL' : delivery.status === 'cancelled' ? 'BATAL' : delivery.status}
                            </span>
                        </div>
                        <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                            <FaCalendarAlt /> Dibuat pada: {formatDate(delivery.created_at) || '-'}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <FaXmark size={20} />
                    </button>
                </div>

                {/* --- BODY --- */}
                <div className="overflow-y-auto flex-1 bg-gray-50/30 p-6 space-y-8">

                    {/* 1. VISUAL PIPELINE (TRACKING) */}
                    {!isFailed && !isCancelled && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="relative flex items-center justify-between w-full px-2">
                                {/* Garis Abu-abu (Background) */}
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full z-0"></div>

                                {/* Garis Biru (Progress) */}
                                <div
                                    className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 rounded-full z-0 transition-all duration-700"
                                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                                ></div>

                                {/* Steps */}
                                {steps.map((step, index) => {
                                    const isActive = index <= currentStepIndex;

                                    return (
                                        <div key={step.id} className="relative z-10 flex flex-col items-center group">
                                            {/* Lingkaran Icon */}
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isActive
                                                ? 'bg-blue-600 border-white text-white shadow-lg shadow-blue-200'
                                                : 'bg-white border-gray-200 text-gray-300'
                                                }`}>
                                                <step.icon size={14} />
                                            </div>

                                            {/* Label & Tanggal */}
                                            <div className="absolute top-12 w-24 text-center flex flex-col items-center">
                                                <span className={`text-[10px] font-bold uppercase tracking-wide ${isActive ? 'text-gray-800' : 'text-gray-400'
                                                    }`}>
                                                    {step.label}
                                                </span>
                                                {step.date && (
                                                    <span className="text-[9px] text-gray-500 font-mono mt-0.5">
                                                        {formatDate(step.date)?.split(', ')[1] || ''}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* Spacer agar label tidak terpotong */}
                            <div className="h-10"></div>
                        </div>
                    )}

                    {/* 2. GRID INFORMASI UTAMA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Card Penerima */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
                                <FaUser className="text-blue-500" /> Detail Penerima
                            </h4>

                            <div className="space-y-3 flex-1">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{delivery.customer_name}</p>
                                    <p className="text-xs text-gray-500">{delivery.customer_phone || '-'}</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                    <p className="text-xs text-gray-700 leading-relaxed flex gap-2">
                                        <FaMapMarkerAlt className="text-blue-400 mt-0.5 flex-shrink-0" />
                                        {delivery.shipping_address}
                                    </p>
                                </div>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(delivery.shipping_address)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block text-center text-xs font-bold text-blue-600 hover:underline border border-blue-100 rounded py-2 hover:bg-blue-50 transition"
                                >
                                    Buka di Google Maps
                                </a>
                            </div>
                        </div>

                        {/* Card Driver & Order */}
                        <div className="flex flex-col gap-4">

                            {/* Driver Info */}
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                                {delivery.driver ? (
                                    <>
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black text-white flex items-center justify-center font-bold text-sm shadow-md">
                                            {delivery.driver.name.substring(0, 1).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-400 uppercase font-bold">Driver</p>
                                            <p className="text-sm font-bold text-gray-900">{delivery.driver.name}</p>
                                        </div>
                                        <a href={`tel:${delivery.driver.phone}`} className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 border border-green-100 transition">
                                            <FaPhone size={12} />
                                        </a>
                                    </>
                                ) : (
                                    <div className="w-full text-center text-xs text-orange-500 font-medium py-2 bg-orange-50 rounded-lg border border-orange-100">
                                        Belum ada driver yang ditugaskan
                                    </div>
                                )}
                            </div>

                            {/* Order Note */}
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex-1">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
                                        <FaClipboardList /> Ref. Order
                                    </span>
                                    <span className="text-xs font-mono font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                        {delivery.order?.order_code}
                                    </span>
                                </div>
                                {delivery.order?.notes ? (
                                    <div className="bg-yellow-50 p-2 rounded border border-yellow-100">
                                        <p className="text-xs text-gray-600 italic">"{delivery.order.notes}"</p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 italic text-center py-2">Tidak ada catatan khusus.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 3. BUKTI & LAPORAN (Hanya jika selesai/gagal) */}
                    {(delivery.status === 'delivered' || delivery.status === 'failed') && (
                        <div className="border-t border-gray-200 pt-6">
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                                <FaImage /> Bukti & Laporan Akhir
                            </h4>

                            {/* Container Simetris */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4">

                                {/* Foto Bukti (Fix Height h-40) */}
                                <div className="w-full sm:w-1/3 h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-300 relative group flex-shrink-0">
                                    {delivery.proof_photo ? (
                                        <>
                                            <img src={delivery.proof_photo} alt="Bukti" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <a
                                                href={delivery.proof_photo}
                                                target="_blank"
                                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold cursor-pointer"
                                            >
                                                <FaImage className="mr-1" /> Lihat Full
                                            </a>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                            <FaImage size={24} className="mb-1 opacity-50" />
                                            <span className="text-[10px]">Tidak ada foto</span>
                                        </div>
                                    )}
                                </div>

                                {/* Catatan Driver (Fix Height h-40 agar sejajar) */}
                                <div className="flex-1 flex flex-col h-40">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block flex-shrink-0">
                                        Catatan Lapangan
                                    </label>
                                    <div className={`flex-1 p-3 rounded-lg border text-sm overflow-y-auto custom-scrollbar ${delivery.status === 'failed' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-gray-50 border-gray-200 text-gray-700'
                                        }`}>
                                        {delivery.driver_notes || (
                                            <span className="italic opacity-50">Driver tidak meninggalkan catatan tambahan.</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </Modal>
    );
}