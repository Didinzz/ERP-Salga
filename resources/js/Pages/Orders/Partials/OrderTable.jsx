// resources/js/Pages/Orders/Partials/OrderTable.jsx

import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function OrderTable({ 
    orders, 
    onView, 
    onEdit, 
    onDelete, 
    onUpdatePayment, 
    onComplete, 
    onCancel 
}) {
    const [paymentInputs, setPaymentInputs] = useState({});

    const handlePaymentUpdate = (order) => {
        const amount = paymentInputs[order.id] || order.paid_amount;
        onUpdatePayment(order, parseFloat(amount));
        setPaymentInputs(prev => ({ ...prev, [order.id]: '' }));
    };

    const getStatusText = (status) => {
        const statusMap = {
            'pending': 'Pending',
            'confirmed': 'Dikonfirmasi',
            'processing': 'Diproses',
            'completed': 'Selesai',
            'cancelled': 'Dibatalkan'
        };
        return statusMap[status] || status;
    };

    const getPaymentStatusText = (status) => {
        const statusMap = {
            'pending': 'Belum Bayar',
            'partial': 'Bayar Sebagian',
            'paid': 'Lunas',
            'cancelled': 'Dibatalkan'
        };
        return statusMap[status] || status;
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Items
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Pembayaran
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {orders.data.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {order.order_code}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(order.order_date).toLocaleDateString('id-ID')}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                    {order.customer_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {order.customer_phone}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                    {order.items?.length || 0} items
                                </div>
                                <div className="text-xs text-gray-500 max-w-xs truncate">
                                    {order.items?.map(item => item.product?.name).join(', ')}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                    {order.formatted_total}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Paid: {order.formatted_paid}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex text-xs px-2 py-1 rounded-full ${order.status_badge}`}>
                                    {getStatusText(order.status)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                    <span className={`inline-flex text-xs px-2 py-1 rounded-full ${order.payment_status_badge}`}>
                                        {getPaymentStatusText(order.payment_status)}
                                    </span>
                                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                                        <div className="flex items-center space-x-1">
                                            <input
                                                type="number"
                                                value={paymentInputs[order.id] ?? ''}
                                                onChange={(e) => setPaymentInputs(prev => ({
                                                    ...prev,
                                                    [order.id]: e.target.value
                                                }))}
                                                placeholder="Amount"
                                                className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                            <button
                                                onClick={() => handlePaymentUpdate(order)}
                                                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                            >
                                                Bayar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onView(order)}
                                        className="text-blue-600 hover:text-blue-900 text-xs"
                                    >
                                        Detail
                                    </button>
                                    
                                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                                        <>
                                            <button
                                                onClick={() => onEdit(order)}
                                                className="text-green-600 hover:text-green-900 text-xs"
                                            >
                                                Edit
                                            </button>
                                            
                                            {order.can_be_completed && (
                                                <button
                                                    onClick={() => onComplete(order)}
                                                    className="text-purple-600 hover:text-purple-900 text-xs"
                                                >
                                                    Selesai
                                                </button>
                                            )}
                                            
                                            <button
                                                onClick={() => onCancel(order)}
                                                className="text-yellow-600 hover:text-yellow-900 text-xs"
                                            >
                                                Batal
                                            </button>
                                        </>
                                    )}
                                    
                                    {order.status !== 'completed' && (
                                        <button
                                            onClick={() => onDelete(order)}
                                            className="text-red-600 hover:text-red-900 text-xs"
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
            {orders.links && orders.links.length > 3 && (
                <div className="px-6 py-4 border-t border-gray-200">
                    <nav className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Menampilkan {orders.from} sampai {orders.to} dari {orders.total} hasil
                        </div>
                        <div className="flex space-x-2">
                            {orders.links.map((link, index) => (
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
            {orders.data.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📦</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada pemesanan</h3>
                    <p className="text-gray-500 mb-4">Belum ada pemesanan yang dibuat.</p>
                    <Link
                        href={route('orders.create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700"
                    >
                        Buat Pemesanan Pertama
                    </Link>
                </div>
            )}
        </div>
    );
}