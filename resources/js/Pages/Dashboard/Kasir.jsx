import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import ReactECharts from 'echarts-for-react';
import {
    FaShoppingCart,
    FaDollarSign,
    FaCreditCard,
    FaClock,
    FaBox,
    FaChartBar,
    FaCalendarDay,
    FaPercentage,
    FaExchangeAlt,
    FaUser,
    FaHistory,
    FaMoneyBillWave,
    FaListAlt,
    FaFileInvoice,
    FaCalendarAlt,
    FaChartLine
} from 'react-icons/fa';
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi';
import { useState } from 'react';

export default function KasirDashboard({ 
    stats, 
    todaySales, 
    date, 
    formattedDate,
    charts 
}) {
    const [chartType, setChartType] = useState('monthly'); // 'monthly' or 'yearly'
    
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    const getChangeIcon = (value) => {
        if (value > 0) {
            return <HiTrendingUp className="w-4 h-4 text-green-500 mr-1" />;
        } else if (value < 0) {
            return <HiTrendingDown className="w-4 h-4 text-red-500 mr-1" />;
        }
        return <FaExchangeAlt className="w-4 h-4 text-gray-500 mr-1" />;
    };

    const getChangeColor = (value) => {
        if (value > 0) return 'text-green-600';
        if (value < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    // Chart 1: Monthly Sales - Data dari backend
    const monthlyChartOption = {
        title: {
            text: 'Penjualan Bulanan',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#1F2937'
            }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#E5E7EB',
            textStyle: {
                color: '#1F2937'
            },
            formatter: function(params) {
                const data = params[0];
                return `<div style="font-weight: bold; margin-bottom: 5px;">${data.name}</div>
                       <div>${data.marker} Penjualan: <b>Rp ${formatNumber(data.value)}</b></div>
                       <div>Transaksi: <b>${monthlyTransactionData[data.dataIndex] || 0}</b></div>`;
            }
        },
        xAxis: {
            type: 'category',
            data: charts?.monthlySales?.months || ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
            axisLabel: {
                rotate: 45,
                fontSize: 12,
                color: '#6B7280'
            },
            axisLine: {
                lineStyle: {
                    color: '#E5E7EB'
                }
            }
        },
        yAxis: {
            type: 'value',
            name: 'Penjualan (Rp)',
            nameTextStyle: {
                color: '#6B7280',
                fontSize: 12
            },
            axisLabel: {
                formatter: 'Rp {value}',
                color: '#6B7280'
            },
            min: 0,
            splitLine: {
                lineStyle: {
                    color: '#F3F4F6',
                    type: 'dashed'
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#E5E7EB'
                }
            }
        },
        series: [{
            name: 'Penjualan',
            type: 'bar',
            data: charts?.monthlySales?.data || Array(12).fill(0),
            itemStyle: {
                color: '#3B82F6',
                borderRadius: [5, 5, 0, 0],
                shadowColor: 'rgba(59, 130, 246, 0.1)',
                shadowBlur: 4,
                shadowOffsetY: 2
            },
            barWidth: '50%'
        }],
        grid: {
            left: '8%',
            right: '5%',
            bottom: '15%',
            top: '15%',
            backgroundColor: 'transparent'
        },
        backgroundColor: 'transparent'
    };

    // Chart 2: Yearly Sales - Data dari backend
    const yearlyChartOption = {
        title: {
            text: 'Penjualan Tahunan',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#1F2937'
            }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#E5E7EB',
            textStyle: {
                color: '#1F2937'
            },
            formatter: function(params) {
                const data = params[0];
                return `<div style="font-weight: bold; margin-bottom: 5px;">${data.name}</div>
                       <div>${data.marker} Penjualan: <b>Rp ${formatNumber(data.value)}</b></div>`;
            }
        },
        xAxis: {
            type: 'category',
            data: charts?.yearlySales?.years || ['2022', '2023', '2024'],
            axisLabel: {
                fontSize: 12,
                color: '#6B7280'
            },
            axisLine: {
                lineStyle: {
                    color: '#E5E7EB'
                }
            }
        },
        yAxis: {
            type: 'value',
            name: 'Penjualan (Rp)',
            nameTextStyle: {
                color: '#6B7280',
                fontSize: 12
            },
            axisLabel: {
                formatter: 'Rp {value}',
                color: '#6B7280'
            },
            min: 0,
            splitLine: {
                lineStyle: {
                    color: '#F3F4F6',
                    type: 'dashed'
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#E5E7EB'
                }
            }
        },
        series: [{
            name: 'Penjualan',
            type: 'bar',
            data: charts?.yearlySales?.data || Array(3).fill(0),
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: '#10B981'
                    }, {
                        offset: 1, color: '#059669'
                    }]
                },
                borderRadius: [8, 8, 0, 0],
                shadowColor: 'rgba(16, 185, 129, 0.2)',
                shadowBlur: 8,
                shadowOffsetY: 2
            },
            barWidth: '40%',
            label: {
                show: true,
                position: 'top',
                formatter: function(params) {
                    return 'Rp ' + formatNumber(params.value);
                },
                fontSize: 11,
                fontWeight: 'bold',
                color: '#374151'
            }
        }],
        grid: {
            left: '8%',
            right: '5%',
            bottom: '10%',
            top: '15%',
            backgroundColor: 'transparent'
        },
        backgroundColor: 'transparent'
    };

    // Hitung total item terjual hari ini
    const totalItemsSold = todaySales?.reduce((total, order) => {
        return total + (order.total_quantity || 0);
    }, 0) || 0;

    // Hitung rata-rata nilai transaksi
    const averageTransactionValue = stats.todayOrders > 0 
        ? stats.todayRevenue / stats.todayOrders 
        : 0;

    // Hitung jumlah transaksi per metode pembayaran
    const cashTransactions = todaySales?.filter(order => order.payment_method === 'cash').length || 0;
    const transferTransactions = todaySales?.filter(order => order.payment_method === 'transfer').length || 0;
    const qrisTransactions = todaySales?.filter(order => order.payment_method === 'qris').length || 0;

    // Format waktu transaksi
    const formatTime = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Hitung total transaksi per status pembayaran
    const paidTransactions = stats.paidPayments || 0;
    const pendingTransactions = stats.pendingPayments || 0;
    const partialTransactions = stats.partialPayments || 0;

    // Data transaksi bulanan untuk tooltip
    const monthlyTransactionData = charts?.monthlySales?.transactions || Array(12).fill(0);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col space-y-2">
                    <h2 className="text-2xl font-bold leading-tight text-gray-900">
                        Dashboard Kasir
                    </h2>
                    <p className="text-sm text-gray-600">
                        {formattedDate || new Date().toLocaleDateString('id-ID', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </p>
                </div>
            }
        >
            <Head title="Dashboard Kasir" />

            <div className="py-6 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                            <div className="p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Pesanan Hari Ini
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mt-2">
                                            {stats.todayOrders || 0}
                                        </p>
                                        <div className="flex items-center mt-2">
                                            {getChangeIcon(stats.orderChange || 0)}
                                            <span className={`text-sm ${getChangeColor(stats.orderChange || 0)}`}>
                                                {stats.orderChange > 0 ? '+' : ''}{stats.orderChange || 0}% dari kemarin
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 p-3 bg-blue-500 rounded-lg bg-opacity-10">
                                        <FaShoppingCart className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Total item: {formatNumber(totalItemsSold)}</span>
                                        <span>Rata2: {formatNumber(stats.todayOrders > 0 ? Math.round(totalItemsSold / stats.todayOrders) : 0)}/transaksi</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                            <div className="p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Pendapatan Hari Ini
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mt-2">
                                            {formatCurrency(stats.todayRevenue || 0)}
                                        </p>
                                        <div className="flex items-center mt-2">
                                            {getChangeIcon(stats.revenueChange || 0)}
                                            <span className={`text-sm ${getChangeColor(stats.revenueChange || 0)}`}>
                                                {stats.revenueChange > 0 ? '+' : ''}{stats.revenueChange || 0}% dari kemarin
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 p-3 bg-green-500 rounded-lg bg-opacity-10">
                                        <FaDollarSign className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="text-xs text-gray-500">
                                        Rata-rata transaksi: {formatCurrency(averageTransactionValue)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                            <div className="p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Pembayaran Pending
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mt-2">
                                            {stats.pendingPayments || 0}
                                        </p>
                                        <div className="flex items-center mt-2">
                                            <FaClock className="w-4 h-4 text-yellow-500 mr-1" />
                                            <span className="text-sm text-yellow-600">
                                                Perlu tindak lanjut
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 p-3 bg-yellow-500 rounded-lg bg-opacity-10">
                                        <FaCreditCard className="w-6 h-6 text-yellow-600" />
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-green-600">
                                            <FaDollarSign className="inline w-3 h-3 mr-1" />
                                            Lunas: {paidTransactions}
                                        </span>
                                        <span className="text-blue-600">
                                            <FaPercentage className="inline w-3 h-3 mr-1" />
                                            Sebagian: {partialTransactions}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                            <div className="p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Metode Pembayaran
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mt-2">
                                            {cashTransactions + transferTransactions + qrisTransactions}
                                        </p>
                                        <div className="flex items-center mt-2">
                                            <FaMoneyBillWave className="w-4 h-4 text-purple-500 mr-1" />
                                            <span className="text-sm text-purple-600">
                                                {cashTransactions} Tunai
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 p-3 bg-purple-500 rounded-lg bg-opacity-10">
                                        <FaListAlt className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Transfer: {transferTransactions}</span>
                                        <span>QRIS: {qrisTransactions}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center mb-4 sm:mb-0">
                                        <div className="p-2 bg-blue-50 rounded-lg mr-3">
                                            <FaChartLine className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Analisis Penjualan
                                        </h3>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setChartType('monthly')}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center ${
                                                chartType === 'monthly'
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            <FaCalendarAlt className="w-4 h-4 mr-2" />
                                            Bulanan
                                        </button>
                                        <button
                                            onClick={() => setChartType('yearly')}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center ${
                                                chartType === 'yearly'
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            <FaChartBar className="w-4 h-4 mr-2" />
                                            Tahunan
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <ReactECharts 
                                    option={chartType === 'monthly' ? monthlyChartOption : yearlyChartOption} 
                                    style={{ height: '400px' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-8">
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href={route('kasir.index')}
                                className="inline-flex items-center px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all duration-300"
                            >
                                <FaShoppingCart className="w-4 h-4 mr-2" />
                                Transaksi Baru
                            </Link>
                            <Link
                                href={route('products.index')}
                                className="inline-flex items-center px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-all duration-300"
                            >
                                <FaBox className="w-4 h-4 mr-2" />
                                Kelola Produk
                            </Link>
                        </div>
                    </div>

                    {/* Today's Sales - Full Width */}
                    <div className="mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center mb-4 sm:mb-0">
                                        <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
                                            <FaChartBar className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Transaksi Hari Ini
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {todaySales?.length || 0} transaksi • {formatNumber(totalItemsSold)} item terjual
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                            <FaDollarSign className="w-3 h-3 mr-1" />
                                            {paidTransactions} Lunas
                                        </span>
                                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                            <FaCreditCard className="w-3 h-3 mr-1" />
                                            {pendingTransactions} Pending
                                        </span>
                                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                            <FaListAlt className="w-3 h-3 mr-1" />
                                            {cashTransactions} Tunai
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-gray-200">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    No. Invoice
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Pelanggan
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Items
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Metode
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Waktu
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Total
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {todaySales && todaySales.map((order) => {
                                                const paymentStatusColor = order.payment_status === 'paid' 
                                                    ? 'bg-green-100 text-green-800'
                                                    : order.payment_status === 'partial'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-yellow-100 text-yellow-800';
                                                
                                                const paymentStatusText = order.payment_status === 'paid' 
                                                    ? 'Lunas'
                                                    : order.payment_status === 'partial'
                                                    ? 'Sebagian'
                                                    : 'Pending';

                                                const paymentMethodText = order.payment_method === 'cash' 
                                                    ? 'Tunai'
                                                    : order.payment_method === 'transfer'
                                                    ? 'Transfer'
                                                    : 'QRIS';

                                                return (
                                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-semibold text-gray-900">
                                                                #{order.order_code}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-800">
                                                                    <FaUser className="w-4 h-4" />
                                                                </div>
                                                                <div className="ml-3">
                                                                    <div className="text-sm font-semibold text-gray-900">
                                                                        {order.customer?.name || order.customer_name || 'Walk-in Customer'}
                                                                    </div>
                                                                    {order.customer?.phone && (
                                                                        <div className="text-xs text-gray-500">
                                                                            {order.customer.phone}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {order.items_count || 0} item
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {order.total_quantity || 0} pcs
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                {paymentMethodText}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentStatusColor}`}>
                                                                {order.payment_status === 'paid' ? (
                                                                    <FaDollarSign className="w-3 h-3 mr-1" />
                                                                ) : (
                                                                    <FaCreditCard className="w-3 h-3 mr-1" />
                                                                )}
                                                                {paymentStatusText}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {order.order_date ? formatTime(order.order_date) : '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                            {formatCurrency(order.total_amount || 0)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex space-x-2">
                                                                <Link
                                                                    href={route('kasir.orders.show', order.id)}
                                                                    className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                                                                    title="Detail Transaksi"
                                                                >
                                                                    <FaListAlt className="w-4 h-4" />
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {(!todaySales || todaySales.length === 0) && (
                                                <tr>
                                                    <td colSpan="8" className="px-6 py-12 text-center">
                                                        <FaShoppingCart className="mx-auto h-12 w-12 text-gray-300" />
                                                        <h3 className="mt-2 text-sm font-semibold text-gray-900">Belum ada transaksi hari ini</h3>
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            Mulai transaksi pertama Anda hari ini.
                                                        </p>
                                                        <div className="mt-4">
                                                            <Link
                                                                href={route('kasir.index')}
                                                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all duration-300"
                                                            >
                                                                <FaShoppingCart className="w-4 h-4 mr-2" />
                                                                Buat Transaksi Baru
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Footer */}
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-2">
                                    <FaShoppingCart className="w-5 h-5 text-blue-500 mr-2" />
                                    <p className="text-sm text-gray-500">Total Transaksi</p>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{stats.todayOrders || 0}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {stats.orderChange > 0 ? '+' : ''}{stats.orderChange || 0}% dari kemarin
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-2">
                                    <FaDollarSign className="w-5 h-5 text-green-500 mr-2" />
                                    <p className="text-sm text-gray-500">Total Pendapatan</p>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.todayRevenue || 0)}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {stats.revenueChange > 0 ? '+' : ''}{stats.revenueChange || 0}% dari kemarin
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-2">
                                    <FaBox className="w-5 h-5 text-purple-500 mr-2" />
                                    <p className="text-sm text-gray-500">Total Item Terjual</p>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{formatNumber(totalItemsSold)}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Rata2: {formatNumber(stats.todayOrders > 0 ? Math.round(totalItemsSold / stats.todayOrders) : 0)}/transaksi
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-2">
                                    <FaChartBar className="w-5 h-5 text-yellow-500 mr-2" />
                                    <p className="text-sm text-gray-500">Rata-rata/Transaksi</p>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageTransactionValue)}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Nilai transaksi rata-rata
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
                                <div className="flex items-center justify-center sm:justify-start">
                                    <FaClock className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-600">
                                        Transaksi terakhir: {
                                            todaySales && todaySales.length > 0 
                                                ? formatTime(todaySales[0].order_date)
                                                : '-'
                                        }
                                    </span>
                                </div>
                                <div className="flex items-center justify-center sm:justify-end">
                                    <FaCreditCard className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-600">
                                        Konversi pembayaran: {stats.todayOrders > 0 
                                            ? Math.round(((paidTransactions + partialTransactions) / stats.todayOrders) * 100)
                                            : 0}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}