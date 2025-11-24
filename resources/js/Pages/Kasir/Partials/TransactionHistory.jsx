import { useState, useEffect } from "react";
import { Link } from '@inertiajs/react';
import { FaCalendarAlt, FaSearch, FaEye, FaPrint, FaUser, FaMoneyBillWave, FaQrcode, FaUniversity, FaExclamationTriangle } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa6";
import { MdHistory } from "react-icons/md";

export default function TransactionHistory({ transactions, onBack }) {
    const [dateFilter, setDateFilter] = useState('');
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    // Filter logic dengan useEffect
    useEffect(() => {
        let result = transactions;

        // Filter berdasarkan pencarian
        if (search) {
            result = result.filter(order =>
                order.order_code.toLowerCase().includes(search.toLowerCase()) ||
                order.customer_name.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Filter berdasarkan tanggal
        if (dateFilter) {
            result = result.filter(order => {
                const orderDate = new Date(order.order_date.split('/').reverse().join('-'));
                const filterDate = new Date(dateFilter);
                return orderDate.toDateString() === filterDate.toDateString();
            });
        }

        setFilteredData(result);
    }, [transactions, search, dateFilter]);

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
        return <IconComponent className="text-gray-500" size={14} />;
    };

    const clearFilters = () => {
        setSearch('');
        setDateFilter('');
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg flex flex-col h-full overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <MdHistory className="text-blue-600" /> Riwayat Transaksi
                    </h2>
                    <button 
                        onClick={onBack} 
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-semibold hover:bg-blue-100 transition-all flex items-center gap-2 text-sm"
                    >
                        <FaBoxOpen className="text-lg" /> Katalog Produk
                    </button>
                </div>

                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Cari No. Invoice atau Nama Pelanggan..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-xl bg-gray-50 text-sm focus:outline-none focus:border-blue-500"
                        />
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <div className="relative">
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={e => setDateFilter(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-xl bg-gray-50 text-sm focus:outline-none focus:border-blue-500"
                        />
                        <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    {(search || dateFilter) && (
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-sm"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-6 py-3">Invoice</th>
                            <th className="px-6 py-3">Pelanggan</th>
                            <th className="px-6 py-3">Tanggal</th>
                            <th className="px-6 py-3">Metode</th>
                            <th className="px-6 py-3 text-right">Total</th>
                            <th className="px-6 py-3 text-center">Status</th>
                            <th className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((order) => (
                                <tr key={order.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{order.order_code}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {order.items?.length || 0} item
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-900">{order.customer_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{order.order_date}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 capitalize">
                                            {getPaymentMethodIcon(order.payment_method)}
                                            <span>{order.payment_method}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="font-bold text-blue-600">
                                            Rp {formatCurrency(order.total_amount)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-xs font-medium px-2.5 py-0.5 rounded text-center ${getPaymentStatusBadge(order.payment_status)}`}>
                                                {order.payment_status.toUpperCase()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                href={route('kasir.orders.show', { order: order.id })}
                                                className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                                title="Lihat Detail"
                                            >
                                                <FaEye size={14} />
                                            </Link>
                                            <a
                                                href={route('kasir.orders.invoice', { order: order.id })}
                                                target="_blank"
                                                className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                                title="Cetak Invoice"
                                            >
                                                <FaPrint size={14} />
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-10 text-center text-gray-400">
                                    <div className="flex flex-col items-center justify-center">
                                        <MdHistory className="text-4xl mb-2 opacity-50" />
                                        <p>Tidak ada data transaksi</p>
                                        <p className="text-sm mt-1">
                                            {transactions.length === 0 
                                                ? "Belum ada transaksi yang tercatat" 
                                                : "Tidak ada transaksi yang sesuai dengan filter"
                                            }
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer Summary */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                        Menampilkan {filteredData.length} dari {transactions.length} transaksi
                    </span>
                    <div className="text-right">
                        <div className="font-semibold text-gray-900">
                            Total: Rp {formatCurrency(filteredData.reduce((sum, order) => sum + order.total_amount, 0))}
                        </div>
                        <div className="text-xs text-gray-500">
                            {filteredData.length} transaksi
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}