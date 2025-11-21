import { FaPlus, FaCube } from "react-icons/fa6";

export default function ProductCard({ product, onAdd }) {
    return (
        <div
            onClick={() => onAdd(product)}
            className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl group flex flex-col h-full"
        >
            {/* Image Section (Cover) */}
            <div className="relative w-full h-40 bg-gray-100 overflow-hidden">
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                />
                {/* Badge Ukuran di atas gambar */}
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-lg">
                    {product.size}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                    <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1 line-clamp-2">
                        {product.name}
                    </h3>
                    <p className="text-xs text-gray-400 mb-3 font-mono">
                        {product.code || '#NO-CODE'}
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-xl font-bold text-blue-600">
                            Rp {product.price.toLocaleString('id-ID')}
                        </p>

                        {/* Stock Badge */}
                        <span className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 
                            ${product.stock > 50 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            <FaCube size={10} /> {product.stock}
                        </span>
                    </div>

                    <button
                        className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-blue-800 transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
                    >
                        <FaPlus /> Tambah
                    </button>
                </div>
            </div>
        </div>
    );
}