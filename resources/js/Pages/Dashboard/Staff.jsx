import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    FaBox,
    FaExclamationTriangle,
    FaCheckCircle,
    FaClock,
    FaChartLine,
    FaChartBar,
    FaPercentage
} from 'react-icons/fa';

export default function Staff({ 
    user,
    stats = {}, 
    lowStockProducts = [], 
    expiringProducts = [], 
    bestSellingProducts = [], 
    charts = {} 
}) {
    
    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col space-y-2">
                    <h2 className="text-2xl font-bold leading-tight text-gray-900">
                        Dashboard Staff - Manajemen Produk
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
            <Head title="Dashboard Staff" />

            <div className="py-6 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Total Products */}
                        <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                            <div className="p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Total Produk
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mt-2">
                                            {stats?.totalProducts || 0}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {stats?.totalBrands || 0} merek
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 p-3 bg-blue-500 rounded-lg bg-opacity-10">
                                        <FaBox className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Available Products */}
                        <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                            <div className="p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Produk Tersedia
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mt-2">
                                            {stats?.availableProducts || 0}
                                        </p>
                                        <p className="text-sm text-green-600 mt-1">
                                            {stats?.availableProducts || 0} / {stats?.totalProducts || 0}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 p-3 bg-green-500 rounded-lg bg-opacity-10">
                                        <FaCheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Low Stock Products */}
                        <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                            <div className="p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Stok Rendah
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mt-2">
                                            {stats?.lowStockProducts || 0}
                                        </p>
                                        <p className="text-sm text-yellow-600 mt-1">
                                            ≤ 10 stok tersisa
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 p-3 bg-yellow-500 rounded-lg bg-opacity-10">
                                        <FaExclamationTriangle className="w-6 h-6 text-yellow-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stock Value */}
                        <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                            <div className="p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Nilai Stok
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mt-2">
                                            {formatCurrency(stats?.totalStockValue || 0)}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Rata-rata: {stats?.averageStock || 0}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 p-3 bg-purple-500 rounded-lg bg-opacity-10">
                                        <FaPercentage className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Lists Grid */}
                    <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
                        {/* Low Stock Products */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-yellow-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
                                            <FaExclamationTriangle className="w-5 h-5 text-yellow-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Stok Rendah
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {lowStockProducts?.length || 0} produk perlu restock
                                            </p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                        ≤ 10 stok
                                    </span>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {lowStockProducts && lowStockProducts.length > 0 ? (
                                    lowStockProducts.map((product, index) => (
                                        <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0">
                                            <div className="block">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-gray-900 mb-1">
                                                            {product.name}
                                                        </p>
                                                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                                                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                                                {product.brand}
                                                            </span>
                                                            <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                                                                {product.water_type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4 flex-shrink-0">
                                                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded ${
                                                            product.stock <= 5 
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            <FaBox className="w-3 h-3 mr-1" />
                                                            {product.stock} stok
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-6 py-8 text-center">
                                        <FaCheckCircle className="mx-auto h-12 w-12 text-green-400" />
                                        <h3 className="mt-2 text-sm font-semibold text-gray-900">Tidak ada stok rendah</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Semua produk memiliki stok yang cukup.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Expiring Products */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
                                            <FaClock className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Akan Kadaluarsa
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {expiringProducts?.length || 0} produk dalam 30 hari
                                            </p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                                        30 hari
                                    </span>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {expiringProducts && expiringProducts.length > 0 ? (
                                    expiringProducts.map((product, index) => (
                                        <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0">
                                            <div className="block">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-gray-900 mb-1">
                                                            {product.name}
                                                        </p>
                                                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                                                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                                                {product.brand}
                                                            </span>
                                                            <span>
                                                                {product.expired_date || 'Tidak ada tanggal'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4 flex-shrink-0">
                                                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded ${
                                                            product.days_until_expiration <= 7 
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-orange-100 text-orange-800'
                                                        }`}>
                                                            <FaClock className="w-3 h-3 mr-1" />
                                                            {product.days_until_expiration || '?'} hari
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-6 py-8 text-center">
                                        <FaCheckCircle className="mx-auto h-12 w-12 text-green-400" />
                                        <h3 className="mt-2 text-sm font-semibold text-gray-900">Tidak ada kadaluarsa</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Tidak ada produk yang akan kadaluarsa.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Best Selling Products */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
                                            <FaChartLine className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Produk Populer
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {bestSellingProducts?.length || 0} produk dengan stok sedikit
                                            </p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                        Popular
                                    </span>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {bestSellingProducts && bestSellingProducts.length > 0 ? (
                                    bestSellingProducts.map((product, index) => (
                                        <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0">
                                            <div className="block">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-gray-900 mb-1">
                                                            {product.name}
                                                        </p>
                                                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                                                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                                                {product.brand}
                                                            </span>
                                                            <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                                                                {product.size}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4 flex-shrink-0 text-right">
                                                        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">
                                                            <FaBox className="w-3 h-3 mr-1" />
                                                            {product.stock} stok
                                                        </span>
                                                        <p className="text-xs font-bold text-gray-900 mt-2">
                                                            {product.formatted_price}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-6 py-8 text-center">
                                        <FaBox className="mx-auto h-12 w-12 text-gray-300" />
                                        <h3 className="mt-2 text-sm font-semibold text-gray-900">Tidak ada data</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Belum ada data produk.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
                        {/* Product Status */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
                                            <FaChartBar className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Status Stok Produk
                                        </h3>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <ul className="space-y-4">
                                        {charts?.productStatus?.map((item, index) => (
                                            <li key={index} className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div 
                                                        className="w-3 h-3 rounded-full mr-3" 
                                                        style={{ backgroundColor: item.color || '#ccc' }}
                                                    ></div>
                                                    <span className="text-gray-700">{item.name}</span>
                                                </div>
                                                <span className="font-bold text-gray-900">{item.value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Expiration Status */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-red-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
                                            <FaChartBar className="w-5 h-5 text-red-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Status Kadaluarsa
                                        </h3>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <ul className="space-y-4">
                                        {charts?.expirationStatus?.map((item, index) => (
                                            <li key={index} className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div 
                                                        className="w-3 h-3 rounded-full mr-3" 
                                                        style={{ backgroundColor: item.color || '#ccc' }}
                                                    ></div>
                                                    <span className="text-gray-700">{item.name}</span>
                                                </div>
                                                <span className="font-bold text-gray-900">{item.value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-4 mb-8">
                        <Link
                            href={route('products.index')}
                            className="inline-flex items-center px-4 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-sm transition-all duration-300"
                        >
                            <FaBox className="w-4 h-4 mr-2" />
                            Lihat Semua Produk
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}