import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import ReactECharts from 'echarts-for-react';
import { useState } from 'react';
import {
    FaTruck,
    FaBox,
    FaMapMarkerAlt,
    FaCheckCircle,
    FaClock,
    FaRoute,
    FaCalendarDay,
    FaExclamationTriangle,
    FaUser,
    FaCalendarAlt,
    FaChartBar,
    FaChartLine
} from 'react-icons/fa';
import { HiTrendingUp } from 'react-icons/hi';

export default function DriverDashboard({ 
    stats, 
    todayAssignments, 
    deliveryHistory, 
    customerLocations = [],
    charts 
}) {
    const [chartType, setChartType] = useState('monthly');

    const getStatusColor = (status) => {
        switch(status) {
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'shipping': return 'bg-blue-100 text-blue-800';
            case 'assigned': return 'bg-yellow-100 text-yellow-800';
            case 'pending': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'delivered': return FaCheckCircle;
            case 'shipping': return FaRoute;
            case 'assigned': return FaClock;
            default: return FaExclamationTriangle;
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            'pending': 'Menunggu',
            'assigned': 'Ditugaskan',
            'shipping': 'Dalam Pengiriman',
            'delivered': 'Terkirim'
        };
        return statusMap[status] || status;
    };

    // Chart: Monthly Performance (Bulanan)
    const monthlyChartOption = {
        title: {
            text: 'Performansi Pengiriman Bulanan',
            left: 'center',
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal',
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
                return `${params[0].name}<br/>${params[0].marker} ${params[0].seriesName}: ${params[0].value} pengiriman`;
            }
        },
        xAxis: {
            type: 'category',
            data: charts?.monthlyPerformance?.months || [
                'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
                'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
            ],
            axisLabel: {
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
            name: 'Jumlah Pengiriman',
            nameTextStyle: {
                color: '#6B7280'
            },
            axisLabel: {
                color: '#6B7280'
            },
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
            name: 'Pengiriman Selesai',
            type: 'bar',
            data: charts?.monthlyPerformance?.data || Array(12).fill(0),
            itemStyle: {
                color: '#10B981',
                borderRadius: [5, 5, 0, 0],
                shadowColor: 'rgba(16, 185, 129, 0.1)',
                shadowBlur: 4,
                shadowOffsetY: 2
            },
            barWidth: '60%'
        }],
        grid: {
            left: '8%',
            right: '5%',
            bottom: '12%',
            top: '15%',
            backgroundColor: 'transparent'
        },
        backgroundColor: 'transparent'
    };

    // Chart: Yearly Performance (Tahunan)
    const yearlyChartOption = {
        title: {
            text: 'Performansi Pengiriman Tahunan',
            left: 'center',
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal',
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
                return `${params[0].name}<br/>${params[0].marker} ${params[0].seriesName}: ${params[0].value} pengiriman`;
            }
        },
        xAxis: {
            type: 'category',
            data: charts?.yearlyPerformance?.years || ['2022', '2023', '2024'],
            axisLabel: {
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
            name: 'Jumlah Pengiriman',
            nameTextStyle: {
                color: '#6B7280'
            },
            axisLabel: {
                color: '#6B7280'
            },
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
            name: 'Pengiriman Selesai',
            type: 'bar',
            data: charts?.yearlyPerformance?.data || [0, 0, 0],
            itemStyle: {
                color: '#8B5CF6',
                borderRadius: [5, 5, 0, 0],
                shadowColor: 'rgba(139, 92, 246, 0.1)',
                shadowBlur: 4,
                shadowOffsetY: 2
            },
            barWidth: '60%'
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

    // Hitung pengiriman yang belum selesai
    const pendingDeliveriesCount = todayAssignments?.filter(d => 
        d.status !== 'delivered' && d.status !== 'shipped'
    ).length || 0;

    // Format tanggal untuk display
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Format waktu untuk display
    const formatTime = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col space-y-2">
                    <h2 className="text-2xl font-bold leading-tight text-gray-900">
                        Dashboard Driver
                    </h2>
                    <p className="text-sm text-gray-600">
                        {new Date().toLocaleDateString('id-ID', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </p>
                </div>
            }
        >
            <Head title="Dashboard Driver" />

            <div className="py-6 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                            <div className="p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Total Pengiriman
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mt-2">
                                            {stats.myDeliveries || 0}
                                        </p>
                                        <div className="flex items-center mt-2">
                                            <HiTrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                                            <span className="text-sm text-blue-600">
                                                {stats.weeklyDeliveries || 0} minggu ini
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 p-3 bg-blue-500 rounded-lg bg-opacity-10">
                                        <FaTruck className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                            <div className="p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Pengiriman Selesai
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mt-2">
                                            {stats.completedDeliveries || 0}
                                        </p>
                                        <div className="flex items-center mt-2">
                                            <HiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                            <span className="text-sm text-green-600">
                                                {stats.todayDeliveries ? Math.round((stats.completedDeliveries / stats.todayDeliveries) * 100) : 0}% hari ini
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 p-3 bg-green-500 rounded-lg bg-opacity-10">
                                        <FaCheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                            <div className="p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Tugas Hari Ini
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mt-2">
                                            {stats.todayDeliveries || 0}
                                        </p>
                                        <div className="flex items-center mt-2">
                                            <HiTrendingUp className="w-4 h-4 text-yellow-500 mr-1" />
                                            <span className="text-sm text-yellow-600">
                                                {pendingDeliveriesCount} belum selesai
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 p-3 bg-yellow-500 rounded-lg bg-opacity-10">
                                        <FaCalendarDay className="w-6 h-6 text-yellow-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                            <div className="p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Dalam Perjalanan
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mt-2">
                                            {stats.shippingDeliveries || 0}
                                        </p>
                                        <div className="flex items-center mt-2">
                                            <HiTrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                                            <span className="text-sm text-purple-600">
                                                {stats.assignedDeliveries || 0} ditugaskan
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 p-3 bg-purple-500 rounded-lg bg-opacity-10">
                                        <FaRoute className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section - Bulanan/Tahunan */}
                    <div className="mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center mb-4 sm:mb-0">
                                        <div className="p-2 bg-blue-50 rounded-lg mr-3">
                                            <FaChartLine className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Analisis Performansi Pengiriman
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
                                href={route('logistik.map.index')}
                                className="inline-flex items-center px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all duration-300"
                            >
                                <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                                Lihat Peta Pengiriman
                            </Link>
                            <Link
                                href={route('deliveries.index')}
                                className="inline-flex items-center px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-all duration-300"
                            >
                                <FaTruck className="w-4 h-4 mr-2" />
                                Semua Pengiriman
                            </Link>
                        </div>
                    </div>

                    {/* Today's Assignments */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Today's Assignments */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
                                            <FaCalendarDay className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Tugas Pengiriman Hari Ini
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {todayAssignments?.length || 0} pengiriman ditugaskan hari ini
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                            <FaCheckCircle className="w-3 h-3 mr-1" />
                                            {todayAssignments?.filter(d => d.status === 'delivered').length || 0} Selesai
                                        </span>
                                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                            <FaRoute className="w-3 h-3 mr-1" />
                                            {todayAssignments?.filter(d => d.status === 'shipping').length || 0} Dalam Perjalanan
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {todayAssignments && todayAssignments.map((delivery) => {
                                    const StatusIcon = getStatusIcon(delivery.status);
                                    return (
                                        <div key={delivery.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0">
                                            <Link href={route('deliveries.show', delivery.id)} className="block">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start mb-3">
                                                            <div className="flex-shrink-0 mr-3">
                                                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-800">
                                                                    <FaTruck className="w-5 h-5" />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900">
                                                                    #{delivery.do_code}
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    Order: {delivery.order?.order_code}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="ml-11 space-y-2">
                                                            <p className="text-sm text-gray-700">
                                                                <FaUser className="inline w-3 h-3 mr-1" />
                                                                {delivery.order?.customer?.name || delivery.order?.customer_name || 'Tidak ada nama'}
                                                            </p>
                                                            {delivery.recipient_name && (
                                                                <p className="text-xs text-gray-500">
                                                                    Penerima: {delivery.recipient_name}
                                                                </p>
                                                            )}
                                                            {delivery.shipping_address && (
                                                                <p className="text-xs text-gray-500 truncate">
                                                                    <FaMapMarkerAlt className="inline w-3 h-3 mr-1" />
                                                                    {delivery.shipping_address}
                                                                </p>
                                                            )}
                                                            {delivery.order?.items_count > 0 && (
                                                                <p className="text-xs text-gray-500">
                                                                    {delivery.order.items_count} item
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4 flex-shrink-0 text-right">
                                                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(delivery.status)}`}>
                                                            <StatusIcon className="w-3 h-3 mr-1" />
                                                            {getStatusText(delivery.status)}
                                                        </span>
                                                        {delivery.assigned_at && (
                                                            <p className="text-xs text-gray-500 mt-2">
                                                                Ditugaskan: {formatTime(delivery.assigned_at)}
                                                            </p>
                                                        )}
                                                        {delivery.shipped_at && (
                                                            <p className="text-xs text-gray-500">
                                                                Berangkat: {formatTime(delivery.shipped_at)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })}
                                {(!todayAssignments || todayAssignments.length === 0) && (
                                    <div className="px-6 py-8 text-center">
                                        <FaTruck className="mx-auto h-12 w-12 text-gray-300" />
                                        <h3 className="mt-2 text-sm font-semibold text-gray-900">Tidak ada tugas hari ini</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Anda belum memiliki pengiriman yang ditugaskan untuk hari ini.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Delivery History */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
                                            <FaCheckCircle className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Riwayat Pengiriman
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {deliveryHistory?.length || 0} pengiriman terakhir
                                            </p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                        {stats.completedDeliveries || 0} Total Selesai
                                    </span>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {deliveryHistory && deliveryHistory.map((delivery) => (
                                    <div key={delivery.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 mr-3">
                                                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-800">
                                                            <FaCheckCircle className="w-5 h-5" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            #{delivery.do_code}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {delivery.order?.customer?.name || delivery.order?.customer_name || 'Tidak ada nama'}
                                                        </p>
                                                        {delivery.delivered_at && (
                                                            <div className="mt-2">
                                                                <p className="text-xs text-gray-500">
                                                                    Dikirim: {formatDate(delivery.delivered_at)} • {formatTime(delivery.delivered_at)}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    Order: {delivery.order?.order_code}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ml-4 flex-shrink-0">
                                                <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                                                    <FaCheckCircle className="w-3 h-3 mr-1" />
                                                    Selesai
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!deliveryHistory || deliveryHistory.length === 0) && (
                                    <div className="px-6 py-8 text-center">
                                        <FaBox className="mx-auto h-12 w-12 text-gray-300" />
                                        <h3 className="mt-2 text-sm font-semibold text-gray-900">Belum ada riwayat</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Anda belum menyelesaikan pengiriman apapun.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Customer Locations Preview */}
                    {customerLocations && customerLocations.length > 0 && (
                        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-cyan-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
                                            <FaMapMarkerAlt className="w-5 h-5 text-cyan-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Lokasi Pelanggan
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {customerLocations.length} lokasi aktif
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {customerLocations.slice(0, 6).map((customer) => (
                                        <div key={customer.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:border-blue-200 transition-colors duration-300">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-800">
                                                        <FaUser className="w-5 h-5" />
                                                    </div>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="font-semibold text-gray-900">
                                                        {customer.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {customer.owner || customer.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {customer.address}
                                                    </p>
                                                    <div className="mt-1 text-xs">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                            <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                                                            Koordinat: {customer.lat?.toFixed(4)}, {customer.lng?.toFixed(4)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {customerLocations.length > 6 && (
                                    <div className="mt-4 text-center">
                                        <p className="text-sm text-gray-500">
                                            +{customerLocations.length - 6} lokasi lainnya
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}