import { FaTrash, FaMinus, FaPlus } from "react-icons/fa6";

export default function CartItem({ item, updateQty, removeFromCart, handleManualQty }) {
    const handleChange = (e) => {
        const val = e.target.value;
        // Hanya angka yang diizinkan
        if (/^\d*$/.test(val)) {
            handleManualQty(item.id, val === '' ? '' : parseInt(val));
        }
    };

    const handleBlur = (e) => {
        const value = e.target.value;
        if (value === '' || parseInt(value) < 1) {
            handleManualQty(item.id, 1);
        }
    };

    const handleKeyPress = (e) => {
        // Prevent non-numeric characters
        if (!/\d/.test(e.key)) {
            e.preventDefault();
        }
    };

    const maxStock = item.maxStock || item.stock;
    const isMaxStock = item.quantity >= maxStock;

    return (
        <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm flex gap-3 animate-fade-in-up group hover:shadow-md transition-shadow">
            {/* Thumbnail Image */}
            <div className="w-14 h-14 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative">
                <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = 'https://placehold.co/300x300/e2e8f0/1e40af?text=No+Image';
                    }}
                />
                {isMaxStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-[10px] text-white font-bold text-center leading-none px-1">
                        Max Stock
                    </div>
                )}
            </div>

            {/* Detail */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                        <h4 className="font-bold text-gray-800 text-xs sm:text-sm line-clamp-1" title={item.name}>
                            {item.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Rp {item.price.toLocaleString('id-ID')} / item
                        </p>
                    </div>
                    <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 p-1"
                    >
                        <FaTrash size={12} />
                    </button>
                </div>

                <div className="flex justify-between items-end mt-2">
                    <p className="font-bold text-blue-600 text-sm">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </p>

                    {/* Qty Control dengan Input Manual */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
                        <button
                            onClick={() => updateQty(item.id, -1)}
                            className="w-6 h-7 flex items-center justify-center bg-white rounded-l-md shadow-sm hover:text-blue-600 active:bg-gray-100 border-r border-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                        >
                            <FaMinus size={8} />
                        </button>

                        <input
                            type="text"
                            value={item.quantity}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onKeyPress={handleKeyPress}
                            className="w-10 h-7 text-center text-xs font-bold text-gray-700 bg-transparent border-none focus:ring-0 p-0 appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            min="1"
                            max={maxStock}
                        />

                        <button
                            onClick={() => updateQty(item.id, 1)}
                            className="w-6 h-7 flex items-center justify-center bg-blue-600 text-white rounded-r-md shadow-sm hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={isMaxStock}
                        >
                            <FaPlus size={8} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}