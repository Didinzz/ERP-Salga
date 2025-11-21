import { useState } from 'react';
import { FaBoxOpen, FaSearchengin } from "react-icons/fa6";
import ProductCard from './ProductCard';
import { MdHistory } from "react-icons/md";

export default function ProductCatalog({ products, addToCart }) {
    const [search, setSearch] = useState('');

    // Filter produk berdasarkan pencarian
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.code && p.code.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="lg:col-span-7 h-full flex flex-col">
            <div className="bg-white rounded-2xl shadow-lg p-6 flex-1 flex flex-col h-[calc(100vh-140px)]">
                {/* Header Katalog */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <FaBoxOpen className="text-blue-600" /> Katalog Produk
                    </h2>
                    <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-semibold hover:bg-blue-100 transition-all flex items-center gap-2 text-sm">
                        <MdHistory /> Riwayat
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-6 relative">
                    <input
                        type="text"
                        placeholder="Cari nama produk atau kode..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-gray-50 focus:bg-white"
                    />
                    <FaSearchengin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                {/* Grid Produk Scrollable */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} onAdd={addToCart} />
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
                                <FaBoxOpen className="text-6xl mb-4 opacity-20" />
                                <p>Produk tidak ditemukan.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}   