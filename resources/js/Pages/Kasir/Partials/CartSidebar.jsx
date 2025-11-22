import { useState, useMemo } from 'react';
import { FaCartShopping, FaChevronUp, FaChevronDown } from "react-icons/fa6";
import CartItem from './Cart/CartItem';
import PaymentSection from './Cart/PaymentSection';
import { FaShoppingBasket } from "react-icons/fa";


// Terima prop handleManualQty
export default function CartSidebar({ cart, updateQty, handleManualQty, removeFromCart }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const total = useMemo(() =>
        cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        [cart]
    );

    const handleProcess = (paymentData) => {
        console.log("Data Pembayaran:", paymentData, "Cart:", cart);
        alert("Lanjut ke proses simpan transaksi...");
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden relative">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-5 text-white flex-shrink-0 flex justify-between items-center shadow-md z-10">
                <div className="flex items-center gap-3">
                    <FaCartShopping className="text-xl" />
                    <div>
                        <h3 className="font-bold leading-tight">Keranjang</h3>
                        <p className="text-xs text-blue-100 opacity-90">Item: {cart.length}</p>
                    </div>
                </div>
                <button className="lg:hidden" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? <FaChevronDown /> : <FaChevronUp />}
                </button>
            </div>

            {/* List Items */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 custom-scrollbar relative min-h-[300px]">
                {cart.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                            <FaShoppingBasket className="text-2xl opacity-50" />
                        </div>
                        <p className="text-sm font-medium">Keranjang kosong</p>
                    </div>
                ) : (
                    <div className="space-y-3 pb-4">
                        {cart.map(item => (
                            <CartItem
                                key={item.id}
                                item={item}
                                updateQty={updateQty}
                                handleManualQty={handleManualQty} // Oper ke item
                                removeFromCart={removeFromCart}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Payment Section */}
            <PaymentSection
                total={total}
                disabled={cart.length === 0}
                onProcess={handleProcess}
            />
        </div>
    );
}