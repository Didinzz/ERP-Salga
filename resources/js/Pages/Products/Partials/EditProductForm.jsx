// resources/js/Pages/Products/Partials/EditProductForm.jsx

import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function EditProductForm({ isOpen, onClose, product }) {
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        description: '',
        price: '',
        stock: '',
        size: '',
        bottle_type: 'botol_plastik',
        water_type: 'mineral',
        origin: '',
        image: '',
        manufactured_date: '',
        expired_date: '',
    });

    // Update form data when product prop changes
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                brand: product.brand || '',
                description: product.description || '',
                price: product.price || '',
                stock: product.stock || '',
                size: product.size || '',
                bottle_type: product.bottle_type || 'botol_plastik',
                water_type: product.water_type || 'mineral',
                origin: product.origin || '',
                image: product.image || '',
                manufactured_date: product.manufactured_date ? product.manufactured_date.split(' ')[0] : '',
                expired_date: product.expired_date ? product.expired_date.split(' ')[0] : '',
            });
        }
    }, [product]);

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(route('products.update', product.id), formData, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Edit Produk</h3>
                        <p className="text-sm text-gray-500 mt-1">Kode: {product.product_code}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Produk *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Contoh: Aqua Botol 600ml"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Merek *
                            </label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Contoh: Aqua"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Harga *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Stok *
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ukuran *
                            </label>
                            <input
                                type="text"
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Contoh: 600ml, 1.5L, 19L"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Jenis Botol *
                            </label>
                            <select
                                name="bottle_type"
                                value={formData.bottle_type}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="botol_plastik">Botol Plastik</option>
                                <option value="botol_kaca">Botol Kaca</option>
                                <option value="galon">Galon</option>
                                <option value="cup">Cup</option>
                                <option value="pouch">Pouch</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Jenis Air *
                            </label>
                            <select
                                name="water_type"
                                value={formData.water_type}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="mineral">Mineral</option>
                                <option value="reverse_osmosis">Reverse Osmosis</option>
                                <option value="spring_water">Spring Water</option>
                                <option value="demineralized">Demineralized</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Asal
                            </label>
                            <input
                                type="text"
                                name="origin"
                                value={formData.origin}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Contoh: Indonesia"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Deskripsi
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Deskripsi produk..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tanggal Produksi
                            </label>
                            <input
                                type="date"
                                name="manufactured_date"
                                value={formData.manufactured_date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tanggal Kadaluarsa
                            </label>
                            <input
                                type="date"
                                name="expired_date"
                                value={formData.expired_date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Status Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Informasi Status</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Status Stok:</span>
                                <span className={`ml-2 font-medium ${
                                    product.stock_status === 'Habis' ? 'text-red-600' :
                                    product.stock_status === 'Sedikit' ? 'text-yellow-600' :
                                    'text-green-600'
                                }`}>
                                    {product.stock_status}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500">Ketersediaan:</span>
                                <span className={`ml-2 font-medium ${
                                    product.is_available ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {product.is_available ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Update Produk
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}