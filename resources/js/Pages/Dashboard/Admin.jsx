import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ReactECharts from 'echarts-for-react';
import { useState } from 'react';
import {
    FaShoppingCart, FaUsers, FaDollarSign, FaExclamationTriangle, FaBoxOpen,
    FaCalendarTimes, FaBox, FaCalendarAlt, FaWarehouse, FaCalendarDay,
    FaCashRegister, FaBoxes, FaClock, FaCheckCircle, FaPercentage, 
    FaTruck, FaShippingFast, FaRoad, FaMapMarkerAlt, FaTruckLoading,
    FaChartLine, FaChartBar
} from 'react-icons/fa';
import { MdArrowUpward, MdArrowDownward, MdDriveEta } from 'react-icons/md';

export default function AdminDashboard({ 
    stats, 
    recentOrders, 
    recentUsers, 
    formattedDate,
    todayDeliveryAssignments,
    charts 
}) {
    const [salesChartType, setSalesChartType] = useState('monthly');
    const [deliveryChartType, setDeliveryChartType] = useState('monthly');

    // Helper functions
    const formatCurrency = (amount) => 
        new Intl.NumberFormat('id-ID', { 
            style: 'currency', 
            currency: 'IDR', 
            minimumFractionDigits: 0 
        }).format(amount);

    const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(num);

    // Fungsi format number untuk chart
    const formatChartNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'Jt';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K';
        }
        return num.toLocaleString('id-ID');
    };

    const getChangeIcon = (changeType) => 
        changeType === 'up' 
            ? <MdArrowUpward className="w-4 h-4 text-green-500 mr-1" />
            : <MdArrowDownward className="w-4 h-4 text-red-500 mr-1" />;

    const getChangeColor = (changeType) => 
        changeType === 'up' ? 'text-green-600' : 'text-red-600';

    const getStatusColor = (status) => {
        const colors = {
            completed: 'bg-green-100 text-green-800',
            processing: 'bg-yellow-100 text-yellow-800',
            pending: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-red-100 text-red-800',
            delivered: 'bg-green-100 text-green-800',
            shipping: 'bg-blue-100 text-blue-800',
            assigned: 'bg-yellow-100 text-yellow-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getRoleColor = (role) => {
        const colors = {
            admin: 'bg-purple-100 text-purple-800',
            staff: 'bg-blue-100 text-blue-800',
            kasir: 'bg-green-100 text-green-800',
            driver: 'bg-amber-100 text-amber-800',
        };
        return colors[role] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status) => {
        const icons = {
            completed: '✓',
            delivered: '✓',
            shipping: <FaTruck className='mr-1' />,
            assigned: <MdDriveEta className='mr-1' />,
            pending: <FaClock className='mr-1'  />,
            processing: <FaClock className='mr-1'  />,
        };
        return icons[status] || '❓';
    };

    // Chart Options dengan warna lebih cerah
    // Chart Penjualan Bulanan
    const monthlySalesChartOption = {
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
                       <div>${data.marker} Penjualan: <b>Rp ${formatChartNumber(data.value)}</b></div>
                       <div>Transaksi: <b>${charts?.monthlySales?.transactions?.[data.dataIndex] || 0}</b></div>`;
            }
        },
        xAxis: {
            type: 'category',
            data: charts?.monthlySales?.months || Array(12).fill('M'),
            axisLabel: {
                fontSize: 12,
                rotate: 45,
                color: '#6B7280'
            },
            axisLine: {
                lineStyle: {
                    color: '#E5E7EB'
                }
            },
            axisTick: {
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
                formatter: function(value) {
                    return 'Rp ' + formatChartNumber(value);
                },
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
                color: function(params) {
                    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#F59E0B', '#EF4444'];
                    return colors[params.dataIndex % colors.length];
                },
                borderRadius: [6, 6, 0, 0],
                shadowColor: 'rgba(0, 0, 0, 0.08)',
                shadowBlur: 8,
                shadowOffsetY: 2
            },
            barWidth: '70%',
            label: {
                show: true,
                position: 'top',
                formatter: function(params) {
                    return 'Rp ' + formatChartNumber(params.value);
                },
                fontSize: 10,
                fontWeight: 'bold',
                color: '#374151'
            }
        }],
        grid: {
            left: '8%',
            right: '5%',
            bottom: '15%',
            top: '15%',
            backgroundColor: 'transparent',
            borderColor: 'transparent'
        },
        backgroundColor: 'transparent'
    };

    // Chart Penjualan Tahunan
    const yearlySalesChartOption = {
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
                       <div>${data.marker} Penjualan: <b>Rp ${formatChartNumber(data.value)}</b></div>`;
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
            },
            axisTick: {
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
                formatter: function(value) {
                    return 'Rp ' + formatChartNumber(value);
                },
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
                color: function(params) {
                    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#EC4899'];
                    return colors[params.dataIndex % colors.length];
                },
                borderRadius: [8, 8, 0, 0],
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 8,
                shadowOffsetY: 2
            },
            barWidth: '50%',
            label: {
                show: true,
                position: 'top',
                formatter: function(params) {
                    return 'Rp ' + formatChartNumber(params.value);
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
            backgroundColor: 'transparent',
            borderColor: 'transparent'
        },
        backgroundColor: 'transparent'
    };

    // Chart Pengiriman Bulanan
    const monthlyDeliveryChartOption = {
        title: {
            text: 'Pengiriman Bulanan',
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
                       <div>${data.marker} Pengiriman: <b>${data.value} pengiriman</b></div>`;
            }
        },
        xAxis: {
            type: 'category',
            data: charts?.monthlyDeliveries?.months || Array(12).fill('M'),
            axisLabel: {
                fontSize: 12,
                rotate: 45,
                color: '#6B7280'
            },
            axisLine: {
                lineStyle: {
                    color: '#E5E7EB'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#E5E7EB'
                }
            }
        },
        yAxis: {
            type: 'value',
            name: 'Jumlah Pengiriman',
            nameTextStyle: {
                color: '#6B7280',
                fontSize: 12
            },
            min: 0,
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
            name: 'Pengiriman',
            type: 'line',
            data: charts?.monthlyDeliveries?.data || Array(12).fill(0),
            smooth: true,
            lineStyle: {
                width: 3,
                color: '#3B82F6'
            },
            itemStyle: {
                color: '#3B82F6',
                borderColor: '#ffffff',
                borderWidth: 2
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(59, 130, 246, 0.2)'
                    }, {
                        offset: 1, color: 'rgba(59, 130, 246, 0.05)'
                    }]
                }
            },
            symbol: 'circle',
            symbolSize: 8
        }],
        grid: {
            left: '8%',
            right: '5%',
            bottom: '15%',
            top: '15%',
            backgroundColor: 'transparent',
            borderColor: 'transparent'
        },
        backgroundColor: 'transparent'
    };

    // Chart Pengiriman Tahunan
    const yearlyDeliveryChartOption = {
        title: {
            text: 'Pengiriman Tahunan',
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
                       <div>${data.marker} Pengiriman: <b>${data.value} pengiriman</b></div>`;
            }
        },
        xAxis: {
            type: 'category',
            data: charts?.yearlyDeliveries?.years || ['2022', '2023', '2024'],
            axisLabel: {
                fontSize: 12,
                color: '#6B7280'
            },
            axisLine: {
                lineStyle: {
                    color: '#E5E7EB'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#E5E7EB'
                }
            }
        },
        yAxis: {
            type: 'value',
            name: 'Jumlah Pengiriman',
            nameTextStyle: {
                color: '#6B7280',
                fontSize: 12
            },
            min: 0,
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
            name: 'Pengiriman',
            type: 'line',
            data: charts?.yearlyDeliveries?.data || Array(4).fill(0),
            smooth: true,
            lineStyle: {
                width: 3,
                color: '#3B82F6'
            },
            itemStyle: {
                color: '#3B82F6',
                borderColor: '#ffffff',
                borderWidth: 2
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(59, 130, 246, 0.2)'
                    }, {
                        offset: 1, color: 'rgba(59, 130, 246, 0.05)'
                    }]
                }
            },
            symbol: 'circle',
            symbolSize: 8
        }],
        grid: {
            left: '8%',
            right: '5%',
            bottom: '10%',
            top: '15%',
            backgroundColor: 'transparent',
            borderColor: 'transparent'
        },
        backgroundColor: 'transparent'
    };

    // Reusable Card Component dengan desain modern
    const StatCard = ({ title, value, icon: Icon, color, change, changeType, description, suffix = '' }) => (
        <div className="overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
            <div className="p-5">
                <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                            {typeof value === 'number' && !title.includes('Rp') ? formatNumber(value) : value}{suffix}
                        </p>
                        <div className="flex items-center flex-wrap gap-1 mt-2">
                            {change && (
                                <>
                                    <span className="flex items-center text-xs">
                                        {getChangeIcon(changeType)}
                                        <span className={`font-medium ${getChangeColor(changeType)}`}>
                                            {change}
                                        </span>
                                    </span>
                                    <span className="text-xs text-gray-400">•</span>
                                </>
                            )}
                            <span className="text-xs text-gray-400 truncate">{description}</span>
                        </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
                            <Icon className="w-6 h-6" style={{ 
                                color: color.replace('bg-', '').replace('-500', '').replace('-600', '')
                            }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Data cards configurations dengan warna yang lebih menarik
    const cardGroups = {
        topStats: [
            { 
                title: 'Pesanan Hari Ini', 
                value: stats?.todayOrders || 0, 
                icon: FaCalendarDay, 
                color: 'bg-blue-500',
                change: stats?.orderChange >= 0 ? `+${stats.orderChange}%` : `${stats?.orderChange || 0}%`, 
                changeType: stats?.orderChange >= 0 ? 'up' : 'down', 
                description: `vs kemarin`, 
                suffix: ' pesanan' 
            },
            { 
                title: 'Pendapatan Hari Ini', 
                value: formatCurrency(stats?.todayRevenue || 0), 
                icon: FaCashRegister, 
                color: 'bg-green-500',
                change: stats?.revenueChange >= 0 ? `+${stats.revenueChange}%` : `${stats?.revenueChange || 0}%`, 
                changeType: stats?.revenueChange >= 0 ? 'up' : 'down', 
                description: `vs kemarin` 
            },
            { 
                title: 'Pengiriman Hari Ini', 
                value: stats?.todayDeliveries || 0, 
                icon: FaShippingFast, 
                color: 'bg-cyan-500',
                description: 'Total hari ini', 
                suffix: ' pengiriman' 
            },
            { 
                title: 'Total Pelanggan', 
                value: stats?.totalCustomers || 0, 
                icon: FaUsers, 
                color: 'bg-purple-500',
                description: 'Pelanggan aktif', 
                suffix: ' pelanggan' 
            },
            { 
                title: 'Pengiriman Selesai', 
                value: stats?.completedDeliveries || 0, 
                icon: FaCheckCircle, 
                color: 'bg-emerald-500',
                description: 'Pengiriman terkirim', 
                suffix: ' pengiriman' 
            },
            { 
                title: 'Dalam Perjalanan', 
                value: stats?.shippingDeliveries || 0, 
                icon: FaRoad, 
                color: 'bg-indigo-500',
                description: 'Sedang dikirim', 
                suffix: ' pengiriman' 
            },
            { 
                title: 'Item Terjual', 
                value: formatNumber(stats?.totalItemsSold || 0), 
                icon: FaBoxes, 
                color: 'bg-orange-500',
                description: 'Total item terjual', 
                suffix: ' item' 
            },
            { 
                title: 'Produk Tersedia', 
                value: stats?.availableProducts || 0, 
                icon: FaBoxOpen, 
                color: 'bg-green-500',
                description: `dari ${stats?.totalProducts || 0} total`, 
                suffix: ' produk' 
            },
        ],
    };

    // Reusable List Item Component
    const ListItem = ({ children, hover = true }) => (
        <li className={`px-6 py-4 ${hover ? 'hover:bg-gray-50 transition-colors duration-150' : ''} border-b border-gray-100 last:border-b-0`}>
            {children}
        </li>
    );

    // Section Component
    const Section = ({ title, children, className = '' }) => (
        <div className={`mb-8 ${className}`}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            {children}
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col space-y-2">
                    <h2 className="text-2xl font-bold leading-tight text-gray-900">
                        Dashboard Admin
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
            <Head title="Dashboard Admin" />

            <div className="py-6 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Main Stats - 8 kartu utama */}
                    <Section title="Ringkasan Utama">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {cardGroups.topStats.map((card, index) => (
                                <StatCard key={index} {...card} />
                            ))}
                        </div>
                    </Section>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Sales Chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center mb-4 sm:mb-0">
                                        <div className="p-2 bg-blue-50 rounded-lg mr-3">
                                            <FaDollarSign className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Analisis Penjualan
                                        </h3>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setSalesChartType('monthly')}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center ${
                                                salesChartType === 'monthly'
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            <FaCalendarAlt className="w-4 h-4 mr-2" />
                                            Bulanan
                                        </button>
                                        <button
                                            onClick={() => setSalesChartType('yearly')}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center ${
                                                salesChartType === 'yearly'
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
                                    option={salesChartType === 'monthly' ? monthlySalesChartOption : yearlySalesChartOption} 
                                    style={{ height: '400px' }}
                                />
                            </div>
                        </div>

                        {/* Delivery Chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center mb-4 sm:mb-0">
                                        <div className="p-2 bg-cyan-50 rounded-lg mr-3">
                                            <FaTruck className="w-5 h-5 text-cyan-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Analisis Pengiriman
                                        </h3>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setDeliveryChartType('monthly')}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center ${
                                                deliveryChartType === 'monthly'
                                                    ? 'bg-cyan-600 text-white shadow-sm'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            <FaCalendarAlt className="w-4 h-4 mr-2" />
                                            Bulanan
                                        </button>
                                        <button
                                            onClick={() => setDeliveryChartType('yearly')}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center ${
                                                deliveryChartType === 'yearly'
                                                    ? 'bg-cyan-600 text-white shadow-sm'
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
                                    option={deliveryChartType === 'monthly' ? monthlyDeliveryChartOption : yearlyDeliveryChartOption} 
                                    style={{ height: '400px' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Recent Data Section */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Recent Orders */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
                                            <FaShoppingCart className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Pesanan Terbaru</h3>
                                            <p className="text-sm text-gray-600 mt-1">5 pesanan terakhir yang masuk</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                                        Total: {stats?.totalOrders || 0}
                                    </span>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {recentOrders?.length > 0 ? recentOrders.map((order) => (
                                    <ListItem key={order.id}>
                                        <div className="flex items-center justify-between">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                                                        <span className="text-blue-600 font-bold">#</span>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-semibold text-gray-900 truncate">
                                                            {order.order_code || order.order_number}
                                                        </p>
                                                        <p className="text-sm text-gray-600 truncate">
                                                            {order.customer?.name || order.customer_name || 'Pelanggan'}
                                                        </p>
                                                        <div className="flex items-center mt-1">
                                                            <span className="text-xs text-gray-500">
                                                                {new Date(order.order_date || order.created_at).toLocaleDateString('id-ID')}
                                                            </span>
                                                            {order.items_count > 0 && (
                                                                <span className="ml-2 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                                                    {order.items_count} item
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ml-4 text-right flex flex-col items-end">
                                                <p className="font-bold text-gray-900">
                                                    Rp {order.total_amount?.toLocaleString('id-ID') || '0'}
                                                </p>
                                                <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full mt-2 ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)} {order.status || 'pending'}
                                                </span>
                                            </div>
                                        </div>
                                    </ListItem>
                                )) : (
                                    <ListItem hover={false}>
                                        <div className="text-center py-8">
                                            <FaCalendarTimes className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500">Tidak ada pesanan terbaru</p>
                                        </div>
                                    </ListItem>
                                )}
                            </div>
                        </div>

                        {/* Today's Deliveries */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-cyan-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
                                            <FaShippingFast className="w-5 h-5 text-cyan-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Pengiriman Hari Ini</h3>
                                            <p className="text-sm text-gray-600 mt-1">5 pengiriman terbaru hari ini</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 text-sm font-medium bg-cyan-100 text-cyan-800 rounded-full">
                                        Total: {stats?.todayDeliveries || 0}
                                    </span>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {todayDeliveryAssignments?.length > 0 ? todayDeliveryAssignments.map((delivery) => (
                                    <ListItem key={delivery.id}>
                                        <div className="flex items-center justify-between">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center mr-3">
                                                        <FaTruckLoading className="w-5 h-5 text-cyan-600" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-semibold text-gray-900 truncate">{delivery.do_code}</p>
                                                        <p className="text-sm text-gray-600 truncate">
                                                            {delivery.order?.customer?.name || delivery.order?.customer_name || 'Pelanggan'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1 truncate">
                                                            <FaMapMarkerAlt className="inline w-3 h-3 mr-1" />
                                                            {delivery.driver?.name || 'Belum ada driver'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ml-4 ${getStatusColor(delivery.status)}`}>
                                                {getStatusIcon(delivery.status)} {delivery.status}
                                            </span>
                                        </div>
                                    </ListItem>
                                )) : (
                                    <ListItem hover={false}>
                                        <div className="text-center py-8">
                                            <FaTruck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500">Tidak ada pengiriman hari ini</p>
                                        </div>
                                    </ListItem>
                                )}
                            </div>
                        </div>

                        {/* Recent Users - TETAP SAYA SIMPAN KARENA ADA DI PROPS */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
                                            <FaUsers className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Pengguna Terbaru</h3>
                                            <p className="text-sm text-gray-600 mt-1">5 pengguna terakhir yang bergabung</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded-full">
                                        Total: {stats?.totalUsers || 0}
                                    </span>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {recentUsers?.length > 0 ? recentUsers.map((user) => (
                                    <ListItem key={user.id}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center min-w-0">
                                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                                                    {user.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div className="ml-4 min-w-0 flex-1">
                                                    <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                                                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Bergabung: {new Date(user.created_at).toLocaleDateString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ml-4 ${getRoleColor(user.role)}`}>
                                                {user.role || 'user'}
                                            </span>
                                        </div>
                                    </ListItem>
                                )) : (
                                    <ListItem hover={false}>
                                        <div className="text-center py-8">
                                            <FaUsers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500">Tidak ada pengguna terbaru</p>
                                        </div>
                                    </ListItem>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}