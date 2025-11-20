// resources/js/Pages/Deliveries/Partials/DeliveryTable.jsx

import { Link } from '@inertiajs/react';
import { useState } from 'react';

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
    const [deliveryNotes, setDeliveryNotes] = useState({});

    const handleAssignDriver = (delivery) => {
        const driverId = selectedDriver[delivery.id];
        if (driverId) {
            onAssignDriver(delivery, driverId);
            setSelectedDriver(prev => ({ ...prev, [delivery.id]: '' }));
        }
    };

    const handleDeliver = (delivery) => {
        const notes = deliveryNotes[delivery.id] || '';
        onDeliver(delivery, notes);
        setDeliveryNotes(prev => ({ ...prev, [delivery.id]: '' }));
    };

    const handleFail = (delivery) => {
        const notes = deliveryNotes[delivery.id] || '';
        if (notes) {
            onFail(delivery, notes);
            setDeliveryNotes(prev => ({ ...prev, [delivery.id]: '' }));
        } else {
            alert('Harap masukkan alasan kegagalan');
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            'pending': 'Menunggu',
            'assigned': 'Ditugaskan',
            'on_delivery': 'Dalam Pengiriman',
            'delivered': 'Terkirim',
            'cancelled': 'Dibatalkan',
            'failed': 'Gagal'
        };
        return statusMap[status] || status;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Pengiriman
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Penerima
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Driver
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Jadwal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Biaya
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {deliveries.data.map((delivery) => (
                        <tr key={delivery.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {delivery.delivery_code}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Dibuat: {formatDate(delivery.created_at)}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">
                                    {delivery.recipient_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {delivery.recipient_phone}
                                </div>
                                <div className="text-xs text-gray-400 max-w-xs truncate">
                                    {delivery.delivery_address}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {delivery.order?.order_code}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {delivery.order?.items?.length || 0} items
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {delivery.driver ? (
                                    <div className="text-sm text-gray-900">
                                        {delivery.driver.name}
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <select
                                            value={selectedDriver[delivery.id] || ''}
                                            onChange={(e) => setSelectedDriver(prev => ({
                                                ...prev,
                                                [delivery.id]: e.target.value
                                            }))}
                                            className="text-sm border border-gray-300 rounded px-2 py-1"
                                        >
                                            <option value="">Pilih Driver</option>
                                            {drivers.map(driver => (
                                                <option key={driver.id} value={driver.id}>
                                                    {driver.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => handleAssignDriver(delivery)}
                                            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                        >
                                            Assign
                                        </button>
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {formatDate(delivery.scheduled_date)}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                    {delivery.formatted_delivery_cost}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex text-xs px-2 py-1 rounded-full ${delivery.status_badge}`}>
                                    {getStatusText(delivery.status)}
                                </span>
                                {delivery.delivered_at && (
                                    <div className="text-xs text-gray-500 mt-1">
                                        {formatDate(delivery.delivered_at)}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex flex-col space-y-1">
                                    <button
                                        onClick={() => onView(delivery)}
                                        className="text-blue-600 hover:text-blue-900 text-xs text-left"
                                    >
                                        Detail
                                    </button>
                                    
                                    {delivery.status === 'assigned' && (
                                        <button
                                            onClick={() => onPickup(delivery)}
                                            className="text-green-600 hover:text-green-900 text-xs text-left"
                                        >
                                            Pickup
                                        </button>
                                    )}
                                    
                                    {(delivery.status === 'assigned' || delivery.status === 'on_delivery') && (
                                        <div className="space-y-1">
                                            <input
                                                type="text"
                                                value={deliveryNotes[delivery.id] || ''}
                                                onChange={(e) => setDeliveryNotes(prev => ({
                                                    ...prev,
                                                    [delivery.id]: e.target.value
                                                }))}
                                                placeholder="Catatan"
                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                            />
                                            <div className="flex space-x-1">
                                                <button
                                                    onClick={() => handleDeliver(delivery)}
                                                    className="flex-1 text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                                >
                                                    Terkirim
                                                </button>
                                                <button
                                                    onClick={() => handleFail(delivery)}
                                                    className="flex-1 text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                                >
                                                    Gagal
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {!['delivered', 'cancelled', 'failed'].includes(delivery.status) && (
                                        <button
                                            onClick={() => onCancel(delivery)}
                                            className="text-yellow-600 hover:text-yellow-900 text-xs text-left"
                                        >
                                            Batal
                                        </button>
                                    )}
                                    
                                    {['pending', 'cancelled'].includes(delivery.status) && (
                                        <button
                                            onClick={() => onDelete(delivery)}
                                            className="text-red-600 hover:text-red-900 text-xs text-left"
                                        >
                                            Hapus
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            {deliveries.links && deliveries.links.length > 3 && (
                <div className="px-6 py-4 border-t border-gray-200">
                    <nav className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Menampilkan {deliveries.from} sampai {deliveries.to} dari {deliveries.total} hasil
                        </div>
                        <div className="flex space-x-2">
                            {deliveries.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 text-sm rounded-md ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </nav>
                </div>
            )}

            {/* Empty State */}
            {deliveries.data.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🚚</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada pengiriman</h3>
                    <p className="text-gray-500 mb-4">Belum ada pengiriman yang dibuat.</p>
                    <Link
                        href={route('deliveries.create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700"
                    >
                        Buat Pengiriman Pertama
                    </Link>
                </div>
            )}
        </div>
    );
}