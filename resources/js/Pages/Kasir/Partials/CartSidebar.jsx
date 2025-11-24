import { useState, useMemo } from 'react';
import { FaCartShopping, FaChevronUp, FaChevronDown, FaTrash } from "react-icons/fa6";
import CartItem from './Cart/CartItem';
import PaymentSection from './Cart/PaymentSection';
import { FaShoppingBasket } from "react-icons/fa";

export default function CartSidebar({ 
    cart, 
    updateQty, 
    handleManualQty, 
    removeFromCart, 
    clearCart, 
    onProcessOrder,
    isProcessing,
    total,
    totalItems 
}) {
    const [isExpanded, setIsExpanded] = useState(true);

    const handleProcess = (paymentData) => {
        // PERBAIKAN: Siapkan data yang sesuai dengan backend
        const processedData = {
            ...paymentData,
            customerName: paymentData.customerName || 'Pelanggan Umum',
            paymentStatus: determinePaymentStatus(paymentData.method, paymentData.paidAmount, total)
        };

        console.log('Data yang dikirim ke process order:', processedData);
        onProcessOrder(processedData);
    };

    // Helper function untuk menentukan payment status
    const determinePaymentStatus = (method, paidAmount, total) => {
        if (method === 'cash') {
            return paidAmount >= total ? 'paid' : 'partial';
        } else {
            return 'paid'; // Untuk transfer dan QRIS dianggap langsung lunas
        }
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden relative">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-5 text-white flex-shrink-0 flex justify-between items-center shadow-md z-10">
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
                    <button 
                        className="lg:hidden p-1.5 hover:bg-blue-800 rounded-lg transition-colors"
                        onClick={() => setIsExpanded(!isExpanded)}
                        disabled={isProcessing}
                    >
                        {isExpanded ? <FaChevronDown /> : <FaChevronUp />}
                    </button>
                </div>
            </div>

            {/* List Items */}
            <div className={`flex-1 overflow-y-auto p-4 bg-gray-50 custom-scrollbar relative min-h-[300px] transition-all duration-300 ${
                !isExpanded ? 'lg:block hidden' : 'block'
            }`}>
                {cart.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                            <FaShoppingBasket className="text-2xl opacity-50" />
                        </div>
                        <p className="text-sm font-medium">Keranjang kosong</p>
                        <p className="text-xs mt-1 opacity-70">Tambahkan produk dari katalog</p>
                    </div>
                ) : (
                    <div className="space-y-3 pb-4">
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

            {/* Payment Section */}
            <div className={!isExpanded ? 'lg:block hidden' : 'block'}>
                <PaymentSection
                    total={total}
                    disabled={cart.length === 0 || isProcessing}
                    onProcess={handleProcess}
                    isProcessing={isProcessing}
                />
            </div>
        </div>
    );
}