import { useState } from 'react';
import { FaMoneyBillWave, FaQrcode, FaTrash, FaMinus, FaPlus, FaCartShopping } from "react-icons/fa6";
import { FaCheckCircle, FaShoppingBasket, FaUniversity } from "react-icons/fa";

export default function CartSidebar({ cart, updateQty, removeFromCart }) {
    const [paymentMethod, setPaymentMethod] = useState('cash');

    // Hitung Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="lg:col-span-5 h-fit sticky top-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col max-h-[calc(100vh-2rem)]">

                {/* Header Keranjang */}
                <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-6 shadow-md z-10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center gap-3">
                            <FaCartShopping /> Keranjang
                        </h2>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-mono">
                            #INV-{Date.now().toString().slice(-6)}
                        </span>
                    </div>
                </div>

                {/* List Items (Scrollable) */}
                <div className="p-4 flex-1 overflow-y-auto bg-gray-50 min-h-[300px]">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                <FaShoppingBasket className="text-3xl text-gray-400" />
                            </div>
                            <p className="font-semibold text-gray-500">Keranjang Kosong</p>
                            <p className="text-sm text-gray-400">Belum ada item dipilih.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cart.map(item => (
                                <div key={item.id} className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm flex gap-3 animate-fade-in-up">
                                    {/* Thumbnail Image */}
                                    <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                    </div>

                                    {/* Detail */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                                            <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                <FaTrash size={12} />
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <p className="font-bold text-blue-600 text-sm">
                                                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                            </p>

                                            {/* Qty Control Compact */}
                                            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                                                <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm hover:text-blue-600">
                                                    <FaMinus size={8} />
                                                </button>
                                                <span className="w-8 text-center text-xs font-bold text-gray-700">{item.quantity}</span>
                                                <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700">
                                                    <FaPlus size={8} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Payment Section */}
                <div className="p-6 bg-white border-t border-gray-200 z-10 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                    {/* Totals */}
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-500 font-medium">Total Tagihan</span>
                        <span className="text-3xl font-bold text-gray-900">Rp {total.toLocaleString('id-ID')}</span>
                    </div>

                    {/* Payment Method Tabs */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {['cash', 'transfer', 'qris'].map(method => (
                            <button
                                key={method}
                                onClick={() => setPaymentMethod(method)}
                                className={`flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all duration-200 ${paymentMethod === method
                                    ? 'bg-blue-50 border-blue-600 text-blue-700'
                                    : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'
                                    }`}
                            >
                                {method === 'cash' && <FaMoneyBillWave size={20} className="mb-1" />}
                                {method === 'transfer' && <FaUniversity size={20} className="mb-1" />}
                                {method === 'qris' && <FaQrcode size={20} className="mb-1" />}
                                <span className="text-[10px] font-bold uppercase tracking-wider">{method}</span>
                            </button>
                        ))}
                    </div>

                    {/* Input Cash (Only visual for now) */}
                    {paymentMethod === 'cash' && (
                        <div className="mb-4 animate-fade-in">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">Rp</span>
                                <input type="number" className="w-full pl-12 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 font-bold text-gray-800 text-lg" placeholder="Masukkan jumlah uang..." />
                            </div>
                        </div>
                    )}

                    {/* Process Button */}
                    <button
                        disabled={cart.length === 0}
                        className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none flex items-center justify-center gap-2"
                    >
                        <FaCheckCircle /> Bayar Sekarang
                    </button>
                </div>

            </div>
        </div>
    );
}