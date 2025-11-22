import { useState, useEffect, useMemo } from 'react';
import { FaMoneyBillWave, FaQrcode } from "react-icons/fa6";
import { FaCheckCircle, FaUniversity } from "react-icons/fa";

import UploadEvidence from './UploadEvidence';

// Dummy Data Bank
const BANKS = [
    { id: 'bca', name: 'BCA', number: '8820-1234-5678' },
    { id: 'bri', name: 'BRI', number: '0341-0100-1234' },
    { id: 'mandiri', name: 'Mandiri', number: '1320-0000-1234' },
];

export default function PaymentSection({ total, disabled, onProcess }) {
    const [method, setMethod] = useState('cash');
    const [cashAmount, setCashAmount] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [proof, setProof] = useState(null); // Menyimpan base64 preview

    const change = (parseInt(cashAmount) || 0) - total;
    const isSufficient = (parseInt(cashAmount) || 0) >= total;

    // Reset saat ganti metode
    useEffect(() => {
        setCashAmount('');
        setSelectedBank('');
        setProof(null);
    }, [method]);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProof(URL.createObjectURL(file));
        }
    };

    const handlePay = () => {
        // Kirim data ke parent untuk diproses
        onProcess({ method, cashAmount, selectedBank, proof });
    };

    // Validasi Tombol
    const isReady = () => {
        if (disabled) return false;
        if (method === 'cash') return isSufficient;
        if (method === 'transfer') return selectedBank && proof;
        if (method === 'qris') return proof;
        return false;
    };

    return (
        <div className="p-5 bg-white border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-20">
            {/* Total Display */}
            <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 font-medium text-sm">Total Tagihan</span>
                <span className="text-2xl font-bold text-gray-900">Rp {total.toLocaleString('id-ID')}</span>
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
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${method === m.id
                            ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                            }`}
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
                                onChange={(e) => setCashAmount(e.target.value)}
                                className="w-full pl-10 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-gray-800"
                                placeholder="0"
                            />
                        </div>
                        {cashAmount && (
                            <div className={`p-2 rounded-lg flex justify-between px-3 text-sm font-bold ${isSufficient ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                <span>{isSufficient ? 'Kembalian' : 'Kurang'}</span>
                                <span>Rp {Math.abs(change).toLocaleString('id-ID')}</span>
                            </div>
                        )}
                    </div>
                )}

                {method === 'transfer' && (
                    <div className="animate-fade-in space-y-3">
                        <select
                            className="w-full p-2.5 rounded-xl border border-gray-300 text-sm"
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                        >
                            <option value="">Pilih Bank Tujuan</option>
                            {BANKS.map(b => <option key={b.id} value={b.id}>{b.name} - {b.number}</option>)}
                        </select>
                        {selectedBank && (
                            <div className="bg-gray-100 p-2 rounded text-xs text-center font-mono text-gray-600">
                                {BANKS.find(b => b.id === selectedBank)?.number} (PT Salga Mandiri)
                            </div>
                        )}
                        <UploadEvidence label="Upload Bukti Transfer" preview={proof} onUpload={handleFile} />
                    </div>
                )}

                {method === 'qris' && (
                    <div className="animate-fade-in space-y-3">
                        <div className="flex justify-center mb-2">
                            <div className="bg-white p-2 border rounded-lg shadow-sm">
                                <FaQrcode className="text-6xl text-gray-800" />
                            </div>
                        </div>
                        <UploadEvidence label="Upload Bukti QRIS" preview={proof} onUpload={handleFile} />
                    </div>
                )}
            </div>

            <button
                onClick={handlePay}
                disabled={!isReady()}
                className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
                <FaCheckCircle /> Proses Pembayaran
            </button>
        </div>
    );
}