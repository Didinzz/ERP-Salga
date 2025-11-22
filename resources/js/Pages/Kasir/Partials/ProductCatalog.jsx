import { useState, useMemo } from 'react';
import { FaBoxOpen, FaSearchengin } from "react-icons/fa6";
import { MdHistory } from "react-icons/md";
import ProductCard from './ProductCard';

export default function ProductCatalog({ products, addToCart, onOpenHistory }) {
    const [search, setSearch] = useState('');

    const filteredProducts = useMemo(() => {
        return products.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.code && p.code.toLowerCase().includes(search.toLowerCase()))
        );
    }, [products, search]);

    return (
        <div className="bg-white rounded-2xl shadow-lg flex flex-col border border-gray-200 w-full h-auto lg:h-[calc(100vh)] min-h-[500px]">

            {/* Header (Search & Title) - Tetap diam di atas box */}
            <div className="p-6 border-b border-gray-100 flex-shrink-0 bg-white rounded-t-2xl z-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                        <FaBoxOpen className="text-blue-600" /> Katalog Produk
                    </h2>
                    <button
                        onClick={onOpenHistory}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-semibold hover:bg-blue-100 transition-all flex items-center gap-2 text-sm"
                    >
                        <MdHistory className="text-lg" /> Riwayat
                    </button>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Cari nama produk atau kode..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-gray-50 focus:bg-white"
                    />
                    <FaSearchengin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* Grid Area - Scrollbar hanya muncul di sini pada Desktop */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-gray-50/30 rounded-b-2xl">
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-4 pb-4">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAdd={addToCart}
                            />
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
    );
}