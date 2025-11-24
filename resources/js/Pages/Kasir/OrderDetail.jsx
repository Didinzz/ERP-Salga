import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    FaArrowLeft, 
    FaPrint, 
    FaFileInvoice, 
    FaUser, 
    FaPhone, 
    FaMapMarkerAlt, 
    FaCalendar, 
    FaCashRegister, 
    FaCheckCircle,
    FaMoneyBillWave,
    FaUniversity,
    FaQrcode,
    FaReceipt,
    FaImage,
    FaUpload,
    FaDownload,
    FaTimes
} from "react-icons/fa";

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
        return texts[method] || method.toUpperCase();
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        
        const formData = new FormData();
        formData.append('payment_proof', file);

        try {
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
            alert('Terjadi kesalahan saat upload');
        } finally {
            setUploading(false);
        }
    };

    // Modal untuk preview bukti pembayaran
    const ProofModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold">Bukti Pembayaran</h3>
                    <button 
                        onClick={() => setShowProofModal(false)}
                        className="text-gray-500 hover:text-gray-700 p-1"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>
                <div className="p-4 overflow-auto flex justify-center">
                    <img 
                        src={order.payment_proof} 
                        alt="Bukti Pembayaran" 
                        className="max-w-full max-h-[70vh] object-contain rounded-lg"
                    />
                </div>
                <div className="p-4 border-t flex justify-end gap-2">
                    <a 
                        href={order.payment_proof} 
                        download 
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <FaDownload /> Download
                    </a>
                    <button 
                        onClick={() => setShowProofModal(false)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
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

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Link 
                                    href={route('kasir.index')}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <FaArrowLeft className="text-gray-600" />
                                </Link>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Detail Order</h1>
                                    <p className="text-gray-600">Invoice: {order.order_code}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <a
                                    href={route('kasir.orders.invoice', { order: order.id })}
                                    target="_blank"
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <FaPrint /> Cetak Invoice
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Informasi Utama */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Informasi Pelanggan */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaUser className="text-blue-600" />
                                    Informasi Pelanggan
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Nama Pelanggan</label>
                                        <p className="text-gray-900 font-semibold">{order.customer_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Telepon</label>
                                        <p className="text-gray-900 flex items-center gap-2">
                                            <FaPhone className="text-gray-400" size={12} />
                                            {order.customer_phone || '-'}
                                        </p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium text-gray-500">Alamat</label>
                                        <p className="text-gray-900 flex items-start gap-2">
                                            <FaMapMarkerAlt className="text-gray-400 mt-0.5" size={12} />
                                            {order.customer_address || '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Detail Produk */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaFileInvoice className="text-blue-600" />
                                    Detail Produk
                                </h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Produk</th>
                                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Qty</th>
                                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Harga</th>
                                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items.map((item, index) => (
                                                <tr key={index} className="border-b border-gray-100">
                                                    <td className="py-3 px-4">
                                                        <div>
                                                            <p className="font-medium text-gray-900">{item.product_name}</p>
                                                            <p className="text-sm text-gray-500">{item.product_code}</p>
                                                        </div>
                                                    </td>
                                                    <td className="text-center py-3 px-4 text-gray-900">{item.quantity}</td>
                                                    <td className="text-right py-3 px-4 text-gray-900">
                                                        Rp {formatCurrency(item.unit_price)}
                                                    </td>
                                                    <td className="text-right py-3 px-4 font-semibold text-gray-900">
                                                        Rp {formatCurrency(item.subtotal)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="bg-gray-50">
                                                <td colSpan="3" className="py-3 px-4 text-right font-semibold text-gray-900">
                                                    Total:
                                                </td>
                                                <td className="py-3 px-4 text-right font-bold text-blue-600 text-lg">
                                                    Rp {formatCurrency(order.total_amount)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* Catatan */}
                            {order.notes && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Catatan</h2>
                                    <p className="text-gray-700">{order.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Sidebar Informasi */}
                        <div className="space-y-6">
                            {/* Informasi Pembayaran */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaReceipt className="text-blue-600" />
                                    Informasi Pembayaran
                                </h2>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            {getPaymentMethodIcon(order.payment_method)}
                                            <div>
                                                <p className="font-medium text-gray-900">{getPaymentMethodText(order.payment_method)}</p>
                                                <p className="text-sm text-gray-500">Metode Pembayaran</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bukti Pembayaran Section */}
                                    <div className="border-t pt-4">
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <FaImage className="text-gray-600" />
                                            Bukti Pembayaran
                                        </h3>
                                        
                                        {order.payment_method === 'cash' ? (
                                            <div className="text-center py-6 bg-gray-50 rounded-lg">
                                                <FaMoneyBillWave className="text-4xl text-gray-400 mx-auto mb-3" />
                                                <p className="text-gray-600 font-medium">Pembayaran Tunai</p>
                                                <p className="text-sm text-gray-500 mt-1">Tidak ada bukti pembayaran digital</p>
                                            </div>
                                        ) : order.payment_proof ? (
                                            <div className="space-y-3">
                                                <div 
                                                    className="border-2 border-dashed border-gray-300 rounded-lg cursor-pointer overflow-hidden"
                                                    onClick={() => setShowProofModal(true)}
                                                >
                                                    <img 
                                                        src={order.payment_proof} 
                                                        alt="Bukti Pembayaran" 
                                                        className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setShowProofModal(true)}
                                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                    >
                                                        <FaImage /> Lihat
                                                    </button>
                                                    <a 
                                                        href={order.payment_proof} 
                                                        download
                                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                                    >
                                                        <FaDownload /> Download
                                                    </a>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                                                <FaUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                                                <p className="text-gray-600 font-medium">Belum ada bukti pembayaran</p>
                                                <p className="text-sm text-gray-500 mb-3">Upload bukti pembayaran transfer/QRIS</p>
                                                <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                                                    <FaUpload className="inline mr-2" />
                                                    {uploading ? 'Uploading...' : 'Upload Bukti'}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleFileUpload}
                                                        disabled={uploading}
                                                    />
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Ringkasan Order */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Order</h2>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status Order</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status Pembayaran</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(order.payment_status)}`}>
                                            {order.payment_status.toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Tanggal Order</span>
                                        <span className="text-sm text-gray-900 flex items-center gap-1">
                                            <FaCalendar size={12} />
                                            {order.order_date}
                                        </span>
                                    </div>

                                    {order.completed_date && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Selesai</span>
                                            <span className="text-sm text-gray-900 flex items-center gap-1">
                                                <FaCheckCircle size={12} />
                                                {order.completed_date}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Kasir</span>
                                        <span className="text-sm text-gray-900 flex items-center gap-1">
                                            <FaCashRegister size={12} />
                                            {order.cashier_name}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                                    <div className="flex justify-between text-lg">
                                        <span className="font-semibold text-gray-900">Total Tagihan</span>
                                        <span className="font-bold text-gray-900">Rp {formatCurrency(order.total_amount)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Dibayar</span>
                                        <span className="text-gray-900">Rp {formatCurrency(order.paid_amount)}</span>
                                    </div>

                                    {order.payment_status === 'partial' && (
                                        <div className="flex justify-between text-sm text-orange-600 font-semibold">
                                            <span>Kekurangan</span>
                                            <span>Rp {formatCurrency(order.total_amount - order.paid_amount)}</span>
                                        </div>
                                    )}

                                    {order.payment_status === 'paid' && order.paid_amount > order.total_amount && (
                                        <div className="flex justify-between text-sm text-green-600 font-semibold">
                                            <span>Kembalian</span>
                                            <span>Rp {formatCurrency(order.paid_amount - order.total_amount)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
                                <div className="space-y-2">
                                    <a
                                        href={route('kasir.orders.invoice', { order: order.id })}
                                        target="_blank"
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <FaPrint /> Cetak Invoice
                                    </a>
                                    <button
                                        onClick={() => window.print()}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        <FaFileInvoice /> Print Halaman
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}