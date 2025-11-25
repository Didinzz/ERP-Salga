import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa6";

export default function CartItem({ item, updateQty, handleManualQty, removeFromCart }) {

    const [localQty, setLocalQty] = useState(item.quantity);

    useEffect(() => {
        if (item.quantity !== parseInt(localQty)) {
            setLocalQty(item.quantity);
        }
    }, [item.quantity]);

    useEffect(() => {
        if (localQty === '' || localQty == item.quantity) return;

        const timer = setTimeout(() => {
            let newValue = parseInt(localQty);

            if (isNaN(newValue) || newValue < 1) {
                newValue = 1;
                setLocalQty(1); // Reset visual
            }

            if (newValue > item.stock) {
                toast.error(`Stok maksimal tercapai! (Sisa: ${item.stock})`);
                newValue = item.stock; // Batasi nilai ke max stok
                setLocalQty(item.stock); // PAKSA Reset tampilan input jadi max stok
            }

            handleManualQty(item.id, newValue);

        }, 600); // Delay 600ms

        return () => clearTimeout(timer);
    }, [localQty, item.id, item.quantity, item.stock, handleManualQty]);

    const handleChange = (e) => {
        setLocalQty(e.target.value);
    };

    return (
        <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm flex gap-3 animate-fade-in-up group transition-all hover:border-blue-300">

            {/* Image Section */}
            <div className="w-14 h-14 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative">
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                {item.quantity >= item.stock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] text-white font-bold text-center leading-none px-1 backdrop-blur-[1px]">
                        Max
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-gray-800 text-xs sm:text-sm line-clamp-1" title={item.name}>
                        {item.name}
                    </h4>
                    <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 p-1"
                        tabIndex="-1"
                    >
                        <FaTrash size={12} />
                    </button>
                </div>

                <div className="flex justify-between items-end mt-1">
                    <p className="font-bold text-blue-600 text-xs">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </p>

                    {/* Qty Control */}
                    <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-200 shadow-sm">
                        <button
                            onClick={() => updateQty(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm hover:text-blue-600 active:scale-95 transition-all border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                            tabIndex="-1"
                        >
                            <FaMinus size={8} />
                        </button>

                        <input
                            type="number"
                            value={localQty}
                            onChange={handleChange}
                            className="w-10 h-7 text-center text-xs font-bold text-gray-800 bg-transparent border-none focus:ring-0 p-0 appearance-none -moz-appearance-textfield"
                            min="1"
                            max={item.stock} // HTML5 constraint (visual helper)
                        />

                        <button
                            onClick={() => updateQty(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 active:scale-95 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                            disabled={item.quantity >= item.stock}
                            tabIndex="-1"
                        >
                            <FaPlus size={8} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}