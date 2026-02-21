import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    FaArrowLeft,
    FaPrint,
    FaFileInvoice,
    FaUser,
    FaPhone,
    FaCalendar,
    FaCashRegister,
    FaMoneyBillWave,
    
    FaQrcode,
    FaReceipt,
    FaImage,
    FaUpload,
    FaDownload,
    FaBuildingColumns
} from "react-icons/fa6"; // Menggunakan fa6 agar konsisten
import { FaMapMarkerAlt, FaUniversity, FaTimes } from 'react-icons/fa';

export default function OrderDetail({ order, auth }) {
    const [showProofModal, setShowProofModal] = useState(false);
    const [uploading, setUploading] = useState(false);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID').format(amount);
    };

    const getStatusBadge = (status) => {
        const badges = {
            completed: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    const getPaymentStatusBadge = (status) => {
        const badges = {
            paid: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            partial: 'bg-orange-100 text-orange-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    const getPaymentMethodIcon = (method) => {
        const icons = {
            cash: FaMoneyBillWave,
            transfer: FaUniversity,
            qris: FaQrcode
        };
        const IconComponent = icons[method] || FaMoneyBillWave;
        return <IconComponent className="text-gray-500" />;
    };

    const getPaymentMethodText = (method) => {
        const texts = {
            cash: 'Tunai',
            transfer: 'Transfer Bank',
            qris: 'QRIS'
        };
        return texts[method] || method?.toUpperCase() || '-';
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);

        const formData = new FormData();
        formData.append('payment_proof', file);

        try {
            // Pastikan route ini ada di backend Anda jika ingin fitur upload susulan
            const response = await fetch(route('kasir.orders.upload-proof', { order: order.id }), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                router.reload();
            } else {
                alert(result.message || 'Gagal upload bukti pembayaran');
            }
        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan saat upload');
        } finally {
            setUploading(false);
        }
    };


    // Modal untuk preview bukti pembayaran
    const ProofModal = () => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">Bukti Pembayaran</h3>
                    <button
                        onClick={() => setShowProofModal(false)}
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-auto flex justify-center bg-gray-50 flex-1">
                    <img
                        src={order.payment_proof}
                        alt="Bukti Pembayaran"
                        className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm"
                    />
                </div>

                <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-white">
                    <a
                        href={order.payment_proof}
                        download
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-sm"
                    >
                        <FaDownload /> Download
                    </a>
                    <button
                        onClick={() => setShowProofModal(false)}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Detail Order - ${order.order_code}`} />

            {showProofModal && <ProofModal />}

            <div className="py-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header Navigasi */}
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link
                                href={route('kasir.index')}
                                className="p-3 bg-white border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 rounded-xl transition-all shadow-sm"
                            >
                                <FaArrowLeft />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Detail Transaksi</h1>
                                <p className="text-sm text-gray-500 mt-1 font-mono">{order.order_code}</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <a
                                href={route('kasir.orders.invoice', { order: order.id })}
                                target="_blank"
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md font-medium"
                            >
                                <FaPrint /> Cetak Invoice
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* KOLOM KIRI (DETAIL UTAMA) */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Card 1: Informasi Pelanggan */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                        <FaUser className="text-blue-500" />
                                        Data Pelanggan
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Pelanggan</label>
                                            <p className="text-base font-semibold text-gray-900 mt-1">{order.customer_name || 'Pelanggan Umum'}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nomor Telepon</label>
                                            <p className="text-base text-gray-700 mt-1 flex items-center gap-2">
                                                <FaPhone className="text-gray-400 text-xs" />
                                                {order.customer_phone || '-'}
                                            </p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Alamat Pengiriman</label>
                                            <p className="text-base text-gray-700 mt-1 flex items-start gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <FaMapMarkerAlt className="text-gray-400 mt-1 flex-shrink-0" />
                                                {order.customer_address || '-'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Detail Produk (Keranjang) */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                        <FaFileInvoice className="text-blue-500" />
                                        Rincian Pesanan
                                    </h2>
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-bold">
                                        {order.items.length} Item
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                                            <tr>
                                                <th className="px-6 py-3 font-bold">Produk</th>
                                                <th className="px-6 py-3 text-center font-bold">Qty</th>
                                                <th className="px-6 py-3 text-right font-bold">Harga Satuan</th>
                                                <th className="px-6 py-3 text-right font-bold">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {order.items.map((item, index) => (
                                                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{item.product_name}</p>
                                                            <p className="text-xs text-gray-400 font-mono mt-0.5">{item.product_code}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-medium text-gray-700">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-gray-600">
                                                        Rp {formatCurrency(item.unit_price)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-bold text-blue-600">
                                                        Rp {formatCurrency(item.subtotal)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-50 border-t border-gray-200">
                                            <tr>
                                                <td colSpan="3" className="px-6 py-4 text-right text-gray-600 font-bold">Total Tagihan</td>
                                                <td className="px-6 py-4 text-right text-lg font-bold text-gray-900">
                                                    Rp {formatCurrency(order.total_amount)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* Card 3: Catatan */}
                            {order.notes && (
                                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5 flex gap-3 items-start">
                                    <div className="bg-yellow-100 p-2 rounded-full text-yellow-600">
                                        <FaReceipt />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-yellow-800">Catatan Tambahan</h3>
                                        <p className="text-sm text-yellow-700 mt-1">{order.notes}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* KOLOM KANAN (SIDEBAR INFO) */}
                        <div className="space-y-6">

                            {/* Info Pembayaran */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                                    <FaReceipt className="text-green-500" />
                                    Status & Pembayaran
                                </h2>

                                <div className="space-y-4">
                                    {/* Status Badge */}
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                        <span className="text-sm text-gray-500 font-medium">Status Order</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusBadge(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                        <span className="text-sm text-gray-500 font-medium">Pembayaran</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getPaymentStatusBadge(order.payment_status)}`}>
                                            {order.payment_status}
                                        </span>
                                    </div>

                                    {/* Metode Bayar */}
                                    <div className="border-t border-dashed border-gray-200 pt-4">
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-3">Metode Pembayaran</p>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                {getPaymentMethodIcon(order.payment_method)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">
                                                    {getPaymentMethodText(order.payment_method)}
                                                </p>
                                                {/* Tampilkan Nama Bank jika Transfer */}
                                                {order.payment_method === 'transfer' && order.bank_name && (
                                                    <div className="flex items-center gap-1 text-xs text-blue-600 mt-0.5">
                                                        <FaBuildingColumns size={10} />
                                                        <span>Via Bank {order.bank_name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rincian Nominal */}
                                    <div className="border-t border-dashed border-gray-200 pt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Total Tagihan</span>
                                            <span className="font-semibold">Rp {formatCurrency(order.total_amount)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Dibayar</span>
                                            <span className="font-semibold text-green-600">Rp {formatCurrency(order.paid_amount)}</span>
                                        </div>
                                        {/* Hitung Sisa / Kembalian */}
                                        {order.paid_amount >= order.total_amount ? (
                                            <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                                                <span className="font-bold text-gray-700">Kembalian</span>
                                                <span className="font-bold text-blue-600">Rp {formatCurrency(order.paid_amount - order.total_amount)}</span>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                                                <span className="font-bold text-red-500">Kekurangan</span>
                                                <span className="font-bold text-red-600">Rp {formatCurrency(order.total_amount - order.paid_amount)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Bukti Pembayaran (Jika Ada) */}
                            {(order.payment_method === 'transfer' || order.payment_method === 'qris') && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                    <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <FaImage className="text-purple-500" />
                                        Bukti Pembayaran
                                    </h2>

                                    {order.payment_proof ? (
                                        <div className="group relative rounded-xl overflow-hidden border border-gray-200 cursor-pointer" onClick={() => setShowProofModal(true)}>
                                            <img
                                                src={order.payment_proof}
                                                alt="Bukti"
                                                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-white font-bold text-sm flex items-center gap-2">
                                                    <FaImage /> Lihat Detail
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                            <FaUpload className="text-3xl text-gray-300 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500 font-medium">Belum ada bukti upload</p>

                                            {/* Tombol Upload Susulan (Opsional) */}
                                            <label className="mt-3 inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 cursor-pointer hover:bg-gray-50 shadow-sm">
                                                {uploading ? 'Uploading...' : 'Upload Sekarang'}
                                                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                                            </label>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Info Sistem */}
                            <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 space-y-2 border border-gray-200">
                                <div className="flex justify-between">
                                    <span>Tanggal Order</span>
                                    <span className="font-mono font-medium text-gray-700">{order.order_date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Kasir Bertugas</span>
                                    <span className="font-medium text-gray-700">{order.cashier_name}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}