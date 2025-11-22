import { useState, useEffect, useMemo } from 'react';
import { FaMoneyBillWave, FaQrcode, FaSpinner } from "react-icons/fa6";
import { FaCheckCircle, FaUniversity, FaExclamationTriangle, FaUser, FaPhone, FaMapMarkerAlt, FaStickyNote } from "react-icons/fa";
import UploadEvidence from './UploadEvidence';

const BANKS = [
    { id: 'bca', name: 'BCA', number: '8820-1234-5678' },
    { id: 'bri', name: 'BRI', number: '0341-0100-1234' },
    { id: 'mandiri', name: 'Mandiri', number: '1320-0000-1234' },
];

export default function PaymentSection({ total, disabled, onProcess, isProcessing }) {
    const [method, setMethod] = useState('cash');
    const [cashAmount, setCashAmount] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [proof, setProof] = useState(null);
    const [proofFile, setProofFile] = useState(null);
    
    // Field customer information
    const [customerName, setCustomerName] = useState('Pelanggan Umum');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [notes, setNotes] = useState('');

    const change = (parseInt(cashAmount) || 0) - total;
    const isSufficient = (parseInt(cashAmount) || 0) >= total;

    // Reset saat ganti metode
    useEffect(() => {
        setCashAmount('');
        setSelectedBank('');
        setProof(null);
        setProofFile(null);
    }, [method]);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validasi ukuran file (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('Ukuran file maksimal 2MB');
                return;
            }
            
            // Validasi tipe file
            if (!file.type.startsWith('image/')) {
                alert('Hanya file gambar yang diizinkan');
                return;
            }

            setProofFile(file);
            setProof(URL.createObjectURL(file));
        }
    };

    const handlePay = () => {
        // Siapkan data untuk Inertia
        const orderData = {
            customer_name: customerName,
            customer_phone: customerPhone,
            customer_address: customerAddress,
            paid_amount: method === 'cash' ? parseInt(cashAmount) : total,
            payment_status: method === 'cash' ? (isSufficient ? 'paid' : 'partial') : 'paid',
            payment_method: method,
            notes: notes,
            selected_bank: method === 'transfer' ? selectedBank : null,
        };

        console.log('Payment Data:', orderData);

        onProcess({
            orderData,
            proofFile: (method === 'transfer' || method === 'qris') ? proofFile : null,
            method
        });
    };

    // Validasi Tombol
    const isReady = useMemo(() => {
        if (disabled || isProcessing) return false;
        if (!customerName.trim()) return false;
        
        if (method === 'cash') return isSufficient && cashAmount;
        if (method === 'transfer') return selectedBank && proof;
        if (method === 'qris') return proof;
        return false;
    }, [disabled, isProcessing, method, isSufficient, cashAmount, selectedBank, proof, customerName]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID').format(amount);
    };

    return (
        <div className="p-5 bg-white border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-20">
            {/* Customer Information */}
            <div className="mb-4 space-y-3">
                <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                        placeholder="Nama Pelanggan"
                        required
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                        <input
                            type="tel"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                            placeholder="Telepon"
                        />
                    </div>
                    
                    <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                        <input
                            type="text"
                            value={customerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                            placeholder="Alamat"
                        />
                    </div>
                </div>
                
                <div className="relative">
                    <FaStickyNote className="absolute left-3 top-3 text-gray-400" size={14} />
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                        placeholder="Catatan (opsional)"
                        rows={2}
                    />
                </div>
            </div>

            {/* Total Display */}
            <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 font-medium text-sm">Total Tagihan</span>
                <span className="text-2xl font-bold text-gray-900">Rp {formatCurrency(total)}</span>
            </div>

            {/* Tabs */}
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
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                            method === m.id
                                ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <m.icon size={18} className="mb-1" />
                        <span className="text-[10px] font-bold uppercase">{m.label}</span>
                    </button>
                ))}
            </div>

            {/* Konten Dinamis */}
            <div className="mb-4 min-h-[120px]">
                {method === 'cash' && (
                    <div className="animate-fade-in space-y-3">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">Rp</span>
                            <input
                                type="number"
                                value={cashAmount}
                                onChange={(e) => setCashAmount(e.target.value.replace(/\D/g, ''))}
                                className="w-full pl-10 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-gray-800"
                                placeholder="0"
                                min={total}
                                disabled={isProcessing}
                            />
                        </div>
                        {cashAmount && (
                            <div className={`p-2 rounded-lg flex justify-between px-3 text-sm font-bold ${
                                isSufficient 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'
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

                {method === 'transfer' && (
                    <div className="animate-fade-in space-y-3">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                            <h3 className="font-semibold text-blue-900 mb-2 text-sm">Informasi Transfer</h3>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Bank:</span>
                                    <span className="font-mono font-bold">BCA</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">No. Rekening:</span>
                                    <span className="font-mono font-bold">8820-1234-5678</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Atas Nama:</span>
                                    <span className="font-bold">PT SALGA MANDIRI</span>
                                </div>
                            </div>
                        </div>

                        <select
                            className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            disabled={isProcessing}
                        >
                            <option value="">Pilih Bank Pengirim</option>
                            {BANKS.map(b => (
                                <option key={b.id} value={b.id}>
                                    {b.name}
                                </option>
                            ))}
                        </select>
                        
                        <UploadEvidence 
                            label="Upload Bukti Transfer" 
                            preview={proof} 
                            onUpload={handleFile}
                            disabled={isProcessing}
                        />
                        {proof && (
                            <p className="text-xs text-green-600 text-center">
                                ✓ Bukti transfer sudah diupload
                            </p>
                        )}
                    </div>
                )}

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
                        {proof && (
                            <p className="text-xs text-green-600 text-center">
                                ✓ Bukti QRIS sudah diupload
                            </p>
                        )}
                    </div>
                )}
            </div>

            <button
                onClick={handlePay}
                disabled={!isReady}
                className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
                {isProcessing ? (
                    <>
                        <FaSpinner className="animate-spin" />
                        Memproses...
                    </>
                ) : (
                    <>
                        <FaCheckCircle /> 
                        {method === 'cash' ? 'Proses Pembayaran' : 'Konfirmasi Pembayaran'}
                    </>
                )}
            </button>

            {/* Informasi Penting */}
            {(method === 'transfer' || method === 'qris') && !proof && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-700 text-center">
                        Pastikan untuk upload bukti pembayaran {method === 'transfer' ? 'transfer' : 'QRIS'}
                    </p>
                </div>
            )}
        </div>
    );
}