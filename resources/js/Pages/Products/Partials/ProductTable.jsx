import { Link } from '@inertiajs/react';
import {
    HiPencilSquare,
    HiTrash,
    HiCheckCircle,
    HiXCircle,
    HiPhoto
} from "react-icons/hi2";

export default function ProductTable({ products, onEdit, onDelete, onToggleAvailability, deleteModalOpen }) {

    // Helper format rupiah
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value);
    };

    // Helper warna badge stok
    const getStockBadgeClass = (status) => {
        switch (status) {
            case 'Habis': return 'bg-red-100 text-red-700 border border-red-200';
            case 'Sedikit': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            default: return 'bg-green-100 text-green-700 border border-green-200';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    {/* --- HEADER --- */}
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Produk</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Detail</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Harga</th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Stok</th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>

                    {/* --- BODY --- */}
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.data.length > 0 ? (
                            products.data.map((product) => (
                                <tr key={product.id} className="hover:bg-blue-50/30 transition-colors group">

                                    {/* Kolom 1: Gambar & Nama */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12">
                                                {product.image_url ? (
                                                    <img className="h-12 w-12 rounded-lg object-cover border border-gray-200 shadow-sm" src={product.image_url} alt="" />
                                                ) : (
                                                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                                                        <HiPhoto size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-gray-900">{product.name}</div>
                                                <div className="text-xs text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded inline-block mt-1">
                                                    {product.product_code}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Kolom 2: Detail (Merek, Ukuran) */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 font-medium">{product.brand}</div>
                                        <div className="text-xs text-gray-500 capitalize">
                                            {product.size} • {product.bottle_type.replace('_', ' ')}
                                        </div>
                                    </td>

                                    {/* Kolom 3: Harga */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-gray-900">
                                            {formatCurrency(product.price)}
                                        </div>
                                    </td>

                                    {/* Kolom 4: Stok (Badge) */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex flex-col items-center">
                                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStockBadgeClass(product.stock_status)}`}>
                                                {product.stock_status}
                                            </span>
                                            <span className="text-xs text-gray-500 mt-1">{product.stock} karton</span>
                                        </div>
                                    </td>

                                    {/* Kolom 5: Status (Icon Toggle) */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => onToggleAvailability(product)}
                                            className={`focus:outline-none transition-transform active:scale-95 ${product.is_available ? 'text-green-500 hover:text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                                            title={product.is_available ? "Nonaktifkan Produk" : "Aktifkan Produk"}
                                        >
                                            {product.is_available
                                                ? <HiCheckCircle size={28} />
                                                : <HiXCircle size={28} />
                                            }
                                        </button>
                                    </td>

                                    {/* Kolom 6: Aksi (Icons) */}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => onEdit(product)}
                                                className="p-2 bg-white border border-gray-200 rounded-lg text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm"
                                                title="Edit Produk"
                                            >
                                                <HiPencilSquare size={18} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(product)}
                                                className="p-2 bg-white border border-gray-200 rounded-lg text-red-600 hover:bg-red-50 hover:border-red-300 transition-all shadow-sm"
                                                title="Hapus Produk"
                                            >
                                                <HiTrash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <HiPhoto className="w-12 h-12 mb-3 opacity-20" />
                                        <p className="text-base font-medium text-gray-900">Tidak ada produk ditemukan</p>
                                        <p className="text-sm text-gray-500">Coba ubah filter pencarian Anda atau tambah produk baru.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- PAGINATION --- */}
            {products.links && products.links.length > 3 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                    <div className="text-sm text-gray-500 hidden sm:block">
                        Menampilkan <span className="font-bold">{products.from}</span> sampai <span className="font-bold">{products.to}</span> dari <span className="font-bold">{products.total}</span> data
                    </div>
                    <div className="flex gap-1">
                        {products.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${link.active
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : !link.url
                                            ? 'text-gray-400 cursor-not-allowed bg-transparent'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                    }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}