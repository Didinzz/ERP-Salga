import { useState } from 'react';
import { FaTruck, FaUser, FaMapMarkerAlt, FaBox, FaCalendarAlt, FaStickyNote, FaMoneyBillWave, FaCheck, FaTrash } from 'react-icons/fa';
import { FaBoxOpen } from 'react-icons/fa6';

export default function DeliveryTable({
    deliveries,
    drivers,
    onView,
    onAssignDriver,
    onPickup,
    onDeliver,
    onFail,
    onCancel,
    onDelete
}) {
    const [selectedDriver, setSelectedDriver] = useState({});

    const handleAssign = (delivery) => {
        const driverId = selectedDriver[delivery.id];
        if (driverId) onAssignDriver(delivery, driverId);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
            case 'assigned': return 'bg-blue-50 text-blue-700 border border-blue-200';
            case 'shipping': return 'bg-purple-50 text-purple-700 border border-purple-200';
            case 'delivered': return 'bg-green-50 text-green-700 border border-green-200';
            case 'failed': return 'bg-red-50 text-red-700 border border-red-200';
            default: return 'bg-gray-50 text-gray-700 border border-gray-200';
        }
    };

    const getStatusText = (status) => {
        const map = {
            'pending': 'Menunggu Driver',
            'assigned': 'Driver Siap',
            'shipping': 'Sedang Jalan',
            'delivered': 'Selesai',
            'failed': 'Gagal'
        };
        return map[status] || status;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    if (!deliveries.data || deliveries.data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                    <FaBoxOpen  className="text-4xl text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Tidak ada data pengiriman</h3>
                <p className="text-gray-500 mt-1 text-sm max-w-sm">
                    Coba ubah kata kunci pencarian atau filter Anda, atau buat pengiriman baru jika belum ada.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID & Waktu</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Penerima & Alamat</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Driver</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Info Order</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {deliveries.data.map((delivery) => (
                            <tr key={delivery.id} className="hover:bg-blue-50/30 transition-colors group">

                                {/* 1. ID & Waktu */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100">
                                            <FaTruck />
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-bold text-gray-900">{delivery.do_code}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                <FaCalendarAlt size={10} />
                                                {/* Asumsi created_at adalah waktu pembuatan surat jalan */}
                                                {formatDate(delivery.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* 2. Penerima */}
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                        <FaUser className="text-gray-400 text-xs" />
                                        {delivery.customer_name}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1 flex items-start gap-1.5 max-w-[200px]" title={delivery.shipping_address}>
                                        <FaMapMarkerAlt className="text-gray-400 text-xs mt-0.5 flex-shrink-0" />
                                        <span className="truncate">{delivery.shipping_address}</span>
                                    </div>
                                    {delivery.order?.notes && (
                                        <div className="text-[10px] text-orange-600 mt-1 flex items-center gap-1 bg-orange-50 px-1.5 py-0.5 rounded w-fit">
                                            <FaStickyNote /> {delivery.order.notes}
                                        </div>
                                    )}
                                </td>

                                {/* 3. Driver */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {delivery.driver ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs border border-green-200">
                                                {delivery.driver.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{delivery.driver.name}</p>
                                                <p className="text-xs text-gray-500">{delivery.driver.phone || '-'}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2 items-center">
                                            <select
                                                className="text-xs border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 py-1 pl-2 pr-6"
                                                value={selectedDriver[delivery.id] || ''}
                                                onChange={(e) => setSelectedDriver({ ...selectedDriver, [delivery.id]: e.target.value })}
                                            >
                                                <option value="">Pilih Driver...</option>
                                                {drivers.map(d => (
                                                    <option key={d.id} value={d.id}>{d.name}</option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={() => handleAssign(delivery)}
                                                className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={!selectedDriver[delivery.id]}
                                                title="Simpan Driver"
                                            >
                                                <FaCheck size={10} />
                                            </button>
                                        </div>
                                    )}
                                </td>

                                {/* 4. Info Order & Pembayaran */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 flex items-center gap-1">
                                        <FaBox className="text-gray-400" size={10} />
                                        Ref: {delivery.order?.order_code}
                                    </div>
                                    {/* Badge Status Pembayaran (Penting buat driver) */}
                                    {/* Asumsi kita kirim data payment_status dari controller */}
                                    <div className="mt-1">
                                        {delivery.order?.payment_status === 'paid' ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-green-50 text-green-700 border border-green-200">
                                                <FaMoneyBillWave /> Lunas
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-700 border border-red-200">
                                                <FaMoneyBillWave /> Belum Lunas
                                            </span>
                                        )}
                                    </div>
                                </td>

                                {/* 5. Status */}
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(delivery.status)}`}>
                                        {getStatusText(delivery.status)}
                                    </span>
                                    {delivery.shipped_at && (
                                        <p className="text-[10px] text-gray-400 mt-1 italic">
                                            {delivery.status === 'delivered' ? 'Selesai' : 'Berangkat'}: {formatDate(delivery.shipped_at).split(' ')[1]}
                                        </p>
                                    )}
                                </td>

                                {/* 6. Aksi */}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">

                                        {/* Tombol Detail */}
                                        <button onClick={() => onView(delivery)} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-blue-600 text-xs font-medium shadow-sm transition-all">
                                            Detail
                                        </button>

                                        {/* Tombol Workflow Cepat */}
                                        {delivery.status === 'assigned' && (
                                            <button onClick={() => onPickup(delivery)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-bold shadow-sm transition-all">
                                                Jalan
                                            </button>
                                        )}

                                        {delivery.status === 'shipping' && (
                                            <button onClick={() => onDeliver(delivery)} className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-bold shadow-sm transition-all">
                                                Selesai
                                            </button>
                                        )}

                                        {/* Tombol Delete (Hanya jika pending/failed) */}
                                        {['pending', 'failed', 'cancelled'].includes(delivery.status) && (
                                            <button onClick={() => onDelete(delivery)} className="p-1.5 text-red-400 hover:text-red-600 transition-colors" title="Hapus">
                                                <FaTrash size={14} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}