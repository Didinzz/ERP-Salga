import { useState } from 'react';
import { FaCartShopping, FaChevronUp, FaChevronDown, FaTrash } from "react-icons/fa6";
import CartItem from './Cart/CartItem';
import PaymentSection from './Cart/PaymentSection';
import { FaShoppingBasket } from 'react-icons/fa';

export default function CartSidebar({
    cart,
    updateQty,
    handleManualQty,
    removeFromCart,
    clearCart,
    onProcessOrder,
    isProcessing,
    total,
    totalItems,
    customer
}) {
    const [isExpanded, setIsExpanded] = useState(true);

    const handleProcess = (paymentData) => {
        const processedData = {
            ...paymentData,
            customerName: paymentData.customerName || 'Pelanggan Umum',
            paymentStatus: determinePaymentStatus(paymentData.method, paymentData.paidAmount, total)
        };
        onProcessOrder(processedData);
    };

    const determinePaymentStatus = (method, paidAmount, total) => {
        if (method === 'cash') {
            return paidAmount >= total ? 'paid' : 'partial';
        } else {
            return 'paid';
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col w-full">

            {/* 1. Header (Selalu Muncul) */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-5 text-white flex justify-between items-center shadow-md z-10">
                <div className="flex items-center gap-3">
                    <FaCartShopping className="text-xl" />
                    <div>
                        <h3 className="font-bold leading-tight">Keranjang</h3>
                        <p className="text-xs text-blue-100 opacity-90">
                            {totalItems} item{totalItems !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {cart.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="p-1.5 hover:bg-blue-800 rounded-lg transition-colors"
                            title="Kosongkan Keranjang"
                            disabled={isProcessing}
                        >
                            <FaTrash size={14} />
                        </button>
                    )}
                    {/* Tombol Toggle untuk Mobile */}
                    <button
                        className="lg:hidden p-1.5 hover:bg-blue-800 rounded-lg transition-colors"
                        onClick={() => setIsExpanded(!isExpanded)}
                        disabled={isProcessing}
                    >
                        {isExpanded ? <FaChevronDown /> : <FaChevronUp />}
                    </button>
                </div>
            </div>

            {/* Wrapper Konten (Bisa dicollapse di Mobile) */}
            <div className={`${!isExpanded ? 'hidden lg:block' : 'block'}`}>

                {/* 2. List Items (Scrollable Area dengan Batas Tinggi) */}
                {/* max-h-[50vh] artinya maksimal tinggi list = setengah layar. Selebihnya scroll. */}
                <div className="overflow-y-auto custom-scrollbar bg-gray-50 p-4" style={{ maxHeight: '50vh', minHeight: '200px' }}>

                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                                <FaShoppingBasket className="text-2xl opacity-50" />
                            </div>
                            <p className="text-sm font-medium">Keranjang kosong</p>
                            <p className="text-xs mt-1 opacity-70">Tambahkan produk dari katalog</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cart.map(item => (
                                <CartItem
                                    key={`${item.id}-${item.quantity}`}
                                    item={item}
                                    updateQty={updateQty}
                                    handleManualQty={handleManualQty}
                                    removeFromCart={removeFromCart}
                                    disabled={isProcessing}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. Payment Section (Fixed di Bawah List) */}
                {/* Bagian ini tidak akan ikut terscroll, dia nempel di bawah list */}
                <PaymentSection
                    total={total}
                    disabled={cart.length === 0 || isProcessing}
                    onProcess={handleProcess}
                    isProcessing={isProcessing}
                    customers={customer}
                    cartLength={cart.length}
                />
            </div>
        </div>
    );
}