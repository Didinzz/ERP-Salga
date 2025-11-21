// resources/js/Pages/Products/Partials/ProductTable.jsx

import { Link } from '@inertiajs/react';

export default function ProductTable({ products, onEdit, onDelete, onUpdateStock, onToggleAvailability }) {
    const getStockBadgeColor = (stockStatus) => {
        switch (stockStatus) {
            case 'Habis': return 'bg-red-100 text-red-800';
            case 'Sedikit': return 'bg-yellow-100 text-yellow-800';
            case 'Tersedia': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getAvailabilityBadge = (isAvailable) => {
        return isAvailable 
            ? 'bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full'
            : 'bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full';
    };

    console.log(products.data)

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Produk
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Merek & Ukuran
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Harga
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stok
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
                    {products.data.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500 text-sm">💧</span>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {product.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {product.product_code}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{product.brand}</div>
                                <div className="text-sm text-gray-500">{product.size}</div>
                                <div className="text-xs text-gray-400 capitalize">
                                    {product.bottle_type.replace('_', ' ')} • {product.water_type.replace('_', ' ')}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                    {product.stock} pcs
                                </div>
                                <span className={`inline-flex text-xs px-2 py-1 rounded-full ${getStockBadgeColor(product.stock_status)}`}>
                                    {product.stock_status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={getAvailabilityBadge(product.is_available)}>
                                    {product.is_available ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onEdit(product)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onToggleAvailability(product)}
                                        className={`${
                                            product.is_available 
                                                ? 'text-yellow-600 hover:text-yellow-900' 
                                                : 'text-green-600 hover:text-green-900'
                                        }`}
                                    >
                                        {product.is_available ? 'Nonaktifkan' : 'Aktifkan'}
                                    </button>
                                    <button
                                        onClick={() => onDelete(product)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            {products.links && products.links.length > 3 && (
                <div className="px-6 py-4 border-t border-gray-200">
                    <nav className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Menampilkan {products.from} sampai {products.to} dari {products.total} hasil
                        </div>
                        <div className="flex space-x-2">
                            {products.links.map((link, index) => (
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
            {products.data.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">💧</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada produk</h3>
                    <p className="text-gray-500 mb-4">Belum ada produk air mineral yang ditambahkan.</p>
                </div>
            )}
        </div>
    );
}