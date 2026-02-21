import { useState, useEffect, useMemo } from 'react';
import { FaBuildingColumns, FaMoneyBillWave, FaQrcode, FaSpinner } from "react-icons/fa6";
import { FaCheckCircle, FaUniversity, FaExclamationTriangle, FaUser, FaPhone, FaMapMarkerAlt, FaStickyNote } from "react-icons/fa";
import UploadEvidence from './UploadEvidence';
import { IoStorefront } from "react-icons/io5";

const BANKS = [
    { id: 'bca', name: 'BCA', number: '8820-1234-5678', holder: 'PT SALGA MANDIRI', color: 'bg-blue-600' },
    { id: 'bri', name: 'BRI', number: '0341-0100-1234', holder: 'PT SALGA MANDIRI', color: 'bg-blue-800' },
    { id: 'mandiri', name: 'Mandiri', number: '1320-0000-1234', holder: 'PT SALGA MANDIRI', color: 'bg-yellow-600' },
];

export default function PaymentSection({ total, disabled, onProcess, isProcessing, customers, cartLength }) {
    const [method, setMethod] = useState('cash');
    const [cashAmount, setCashAmount] = useState('');
    const [displayCash, setDisplayCash] = useState(''); // State khusus tampilan (ada titiknya)
    const [selectedBank, setSelectedBank] = useState(null);
    const [proof, setProof] = useState(null);
    const [proofFile, setProofFile] = useState(null);

    // --- Customer Data States ---
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [customerData, setCustomerData] = useState(null);
    const [notes, setNotes] = useState('');

    const change = (parseInt(cashAmount) || 0) - total;
    const isSufficient = (parseInt(cashAmount) || 0) >= total;

    // --- 1. LOGIC RESET FORM SETELAH SUKSES ---
    // Kita deteksi jika cart menjadi kosong (panjangnya 0), artinya transaksi sukses
    useEffect(() => {
        if (cartLength === 0) {
            setMethod('cash');
            setCashAmount('');
            setDisplayCash('');
            setSelectedBank(null);
            setProof(null);
            setProofFile(null);
            setSelectedCustomerId('');
            setCustomerData(null);
            setNotes('');
        }
    }, [cartLength]);

    // Reset input pembayaran saat ganti metode
    useEffect(() => {
        setCashAmount('');
        setDisplayCash('');
        setSelectedBank(null);
        setProof(null);
        setProofFile(null);
    }, [method]);

    // --- 2. LOGIC FORMAT RUPIAH (Input Handler) ---
    const handleCashInput = (e) => {
        // Hapus semua karakter non-digit
        const rawValue = e.target.value.replace(/\D/g, '');

        if (rawValue === '') {
            setCashAmount('');
            setDisplayCash('');
            return;
        }

        const numberValue = parseInt(rawValue);
        setCashAmount(numberValue);

        // Format tampilan: 50000 -> 50.000
        setDisplayCash(new Intl.NumberFormat('id-ID').format(numberValue));
    };

    // Handler Ganti Customer
    const handleCustomerChange = (e) => {
        const custId = e.target.value;
        setSelectedCustomerId(custId);
        const cust = customers.find(c => c.id == custId);
        setCustomerData(cust || null);
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) return alert('Ukuran file maksimal 2MB');
            if (!file.type.startsWith('image/')) return alert('Hanya file gambar yang diizinkan');

            setProofFile(file);
            setProof(URL.createObjectURL(file));
        }
    };

    const handlePay = () => {
        if (!customerData) return;

        const orderData = {
            customer_id: customerData.id,
            customer_name: customerData.name,
            customer_phone: customerData.phone,
            customer_address: customerData.address,
            paid_amount: method === 'cash' ? parseInt(cashAmount) : total,
            payment_status: method === 'cash' ? (isSufficient ? 'paid' : 'partial') : 'paid',
            payment_method: method,
            notes: notes,
            bank_name: method === 'transfer' ? selectedBank?.name : null,
        };

        onProcess({
            orderData,
            proofFile: (method === 'transfer' || method === 'qris') ? proofFile : null,
            method
        });
    };

    // Validasi Tombol
    const isReady = useMemo(() => {
        if (disabled || isProcessing) return false;
        if (!selectedCustomerId) return false;

        if (method === 'cash') return isSufficient && cashAmount;
        if (method === 'transfer') return selectedBank && proof;
        if (method === 'qris') return proof;
        return false;
    }, [disabled, isProcessing, method, isSufficient, cashAmount, selectedBank, proof, selectedCustomerId]);

    const formatCurrency = (amount) => new Intl.NumberFormat('id-ID').format(amount);

    return (
        <div className="p-5 bg-white border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-20">

            {/* --- CUSTOMER SELECTION --- */}
            <div className="mb-4 space-y-3">
                <div className="relative">
                    <IoStorefront className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <select
                        value={selectedCustomerId}
                        onChange={handleCustomerChange}
                        className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm bg-white appearance-none cursor-pointer transition-colors ${!selectedCustomerId ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500/20 focus:border-blue-500'
                            }`}
                    >
                        <option value="">-- Pilih Outlet Pelanggan --</option>
                        {customers && customers.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {customerData && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs text-blue-800 space-y-1 animate-fade-in">
                        <p className="font-bold text-sm mb-1 text-blue-900">{customerData.name}</p>
                        <p className="flex items-center gap-2"><FaUser className="opacity-50" /> {customerData.owner_name || '-'}</p>
                        <p className="flex items-center gap-2"><FaPhone className="opacity-50" /> {customerData.phone || '-'}</p>
                        <p className="flex items-center gap-2"><FaMapMarkerAlt className="opacity-50" /> {customerData.address || '-'}</p>
                    </div>
                )}

                <div className="relative">
                    <FaStickyNote className="absolute left-3 top-3 text-gray-400" size={14} />
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                        placeholder="Catatan Transaksi (opsional)"
                        rows={2}
                    />
                </div>
            </div>

            {/* Total Display */}
            <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 font-medium text-sm">Total Tagihan</span>
                <span className="text-2xl font-bold text-gray-900">Rp {formatCurrency(total)}</span>
            </div>

            {/* --- PAYMENT METHOD --- */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                    { id: 'cash', icon: FaMoneyBillWave, label: 'Tunai' },
                    { id: 'transfer', icon: FaUniversity, label: 'Transfer' },
                    { id: 'qris', icon: FaQrcode, label: 'QRIS' }
                ].map((m) => (
                    <button
                        key={m.id}
                        onClick={() => setMethod(m.id)}
                        disabled={isProcessing}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${method === m.id
                                ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm ring-1 ring-blue-600'
                                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <m.icon size={18} className="mb-1" />
                        <span className="text-[10px] font-bold uppercase">{m.label}</span>
                    </button>
                ))}
            </div>

            {/* --- DYNAMIC CONTENT --- */}
            <div className="mb-4 min-h-[100px]">

                {/* Logic CASH dengan Input Terformat */}
                {method === 'cash' && (
                    <div className="animate-fade-in space-y-3">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">Rp</span>
                            <input
                                type="text" // Ubah ke text agar bisa menampilkan titik
                                value={displayCash} // Gunakan state display
                                onChange={handleCashInput}
                                className="w-full pl-10 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-gray-800"
                                placeholder="0"
                                disabled={isProcessing}
                            />
                        </div>
                        {cashAmount && (
                            <div className={`p-2 rounded-lg flex justify-between px-3 text-sm font-bold ${isSufficient ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                <span className="flex items-center gap-1">
                                    {!isSufficient && <FaExclamationTriangle size={12} />}
                                    {isSufficient ? 'Kembalian' : 'Kurang'}
                                </span>
                                <span>Rp {formatCurrency(Math.abs(change))}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Logic TRANSFER */}
                {method === 'transfer' && (
                    <div className="animate-fade-in space-y-4">
                        <div>
                            <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Pilih Bank:</p>
                            <div className="grid grid-cols-3 gap-2">
                                {BANKS.map((bank) => (
                                    <button
                                        key={bank.id}
                                        onClick={() => !isProcessing && setSelectedBank(bank)}
                                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${selectedBank?.id === bank.id
                                                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 text-blue-700'
                                                : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600'
                                            }`}
                                    >
                                        <FaBuildingColumns size={16} />
                                        <span className="text-xs font-bold">{bank.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedBank && (
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 animate-fade-in-up">
                                <p className="text-xs text-gray-500 mb-2 text-center">Silakan transfer ke rekening berikut:</p>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-gray-800 font-mono tracking-wide">{selectedBank.number}</p>
                                    <p className="text-sm font-semibold text-gray-600 mt-1">{selectedBank.holder}</p>
                                    <span className={`inline-block mt-2 text-[10px] text-white px-2 py-0.5 rounded ${selectedBank.color}`}>
                                        Bank {selectedBank.name}
                                    </span>
                                </div>
                            </div>
                        )}

                        {selectedBank && (
                            <UploadEvidence
                                label="Upload Bukti Transfer"
                                preview={proof}
                                onUpload={handleFile}
                                disabled={isProcessing}
                            />
                        )}
                    </div>
                )}

                {/* Logic QRIS */}
                {method === 'qris' && (
                    <div className="animate-fade-in space-y-3">
                        <div className="flex justify-center mb-2">
                            <div className="bg-white p-4 border-2 border-dashed border-gray-300 rounded-lg">
                                <FaQrcode className="text-6xl text-gray-400" />
                            </div>
                        </div>
                        <div className="text-center text-xs text-gray-500 mb-2">
                            Scan QR code di atas untuk pembayaran
                        </div>
                        <UploadEvidence
                            label="Upload Bukti QRIS"
                            preview={proof}
                            onUpload={handleFile}
                            disabled={isProcessing}
                        />
                    </div>
                )}
            </div>

            {/* Process Button */}
            <button
                onClick={handlePay}
                disabled={!isReady}
                className="w-full py-3.5 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
                {isProcessing ? (
                    <><FaSpinner className="animate-spin" /> Memproses...</>
                ) : (
                    <><FaCheckCircle /> {method === 'cash' ? 'Proses Pembayaran' : 'Konfirmasi Pembayaran'}</>
                )}
            </button>
        </div>
    );
}