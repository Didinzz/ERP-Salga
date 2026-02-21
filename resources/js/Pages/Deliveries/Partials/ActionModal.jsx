import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { FaTruck, FaCheckCircle, FaExclamationTriangle, FaBan, FaCamera, FaStickyNote } from "react-icons/fa";
import { toast } from 'react-hot-toast';

export default function ActionModal({ isOpen, onClose, type, delivery }) {
    // 1. Gunakan useForm untuk manajemen state & submit
    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        driver_notes: '',
        proof_photo: null,
    });

    // 2. Reset form setiap kali modal dibuka/ditutup
    useEffect(() => {
        if (isOpen) {
            reset();
            clearErrors();
        }
    }, [isOpen]);

    // Helper Config
    const config = {
        pickup: {
            title: 'Mulai Pengiriman',
            msg: 'Apakah driver sudah mengambil barang dan siap berangkat?',
            icon: FaTruck,
            color: 'text-blue-600', bg: 'bg-blue-100',
            btn: 'bg-blue-600 hover:bg-blue-700',
            label: 'Ya, Berangkat',
            needsInput: false
        },
        deliver: {
            title: 'Selesaikan Pengiriman',
            msg: 'Pastikan barang sudah diterima. Upload bukti foto wajib.',
            icon: FaCheckCircle,
            color: 'text-green-600', bg: 'bg-green-100',
            btn: 'bg-green-600 hover:bg-green-700',
            label: 'Konfirmasi Selesai',
            needsInput: true
        },
        fail: {
            title: 'Laporkan Gagal Kirim',
            msg: 'Upload bukti kondisi lokasi/alasan kegagalan.',
            icon: FaExclamationTriangle,
            color: 'text-orange-600', bg: 'bg-orange-100',
            btn: 'bg-orange-600 hover:bg-orange-700',
            label: 'Konfirmasi Gagal',
            needsInput: true
        },
        cancel: {
            title: 'Batalkan Pengiriman',
            msg: 'Tindakan ini akan membatalkan surat jalan. Lanjutkan?',
            icon: FaBan,
            color: 'text-red-600', bg: 'bg-red-100',
            btn: 'bg-red-600 hover:bg-red-700',
            label: 'Batalkan Pengiriman',
            needsInput: false
        }
    };

    const current = config[type] || config.pickup;
    const Icon = current.icon;

    // 3. Handler File Upload (set ke 'data')
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validasi manual file size client-side (optional tapi bagus)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Ukuran maksimal 5MB');
                return;
            }
            setData('proof_photo', file);
        }
    };

    // Preview Logic
    const previewUrl = data.proof_photo ? URL.createObjectURL(data.proof_photo) : null;

    // 4. Handler Submit Inertia
    const handleSubmit = (e) => {
        e.preventDefault();

        let routeName = '';
        switch (type) {
            case 'pickup': routeName = 'deliveries.pickup'; break;
            case 'deliver': routeName = 'deliveries.deliver'; break;
            case 'fail': routeName = 'deliveries.fail'; break;
            case 'cancel': routeName = 'deliveries.cancel'; break;
            default: return;
        }

        post(route(routeName, delivery?.id), {
            forceFormData: current.needsInput, // Otomatis multipart jika true
            onSuccess: () => {
                onClose();
                reset();
            },
            onError: () => {
                toast.error('Terjadi kesalahan, periksa inputan.');
            },
            preserveScroll: true
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="md">
            <div className="p-6">
                {/* Icon Header */}
                <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 ${current.bg} ${current.color}`}>
                    <Icon size={32} />
                </div>

                {/* Title & Info */}
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{current.title}</h3>
                    <p className="text-xs font-mono bg-gray-100 inline-block px-2 py-0.5 rounded text-gray-500 mb-2">
                        {delivery?.do_code}
                    </p>
                    <p className="text-sm text-gray-600">{current.msg}</p>
                </div>

                {/* Form Start */}
                <form onSubmit={handleSubmit}>

                    {/* Input Area (Deliver & Fail) */}
                    {current.needsInput && (
                        <div className="space-y-4 mb-6 text-left bg-gray-50 p-4 rounded-xl border border-gray-200">

                            {/* Input Foto */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">
                                    Bukti Foto <span className="text-red-500">*</span>
                                </label>

                                {previewUrl ? (
                                    <div className="relative group">
                                        <img src={previewUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-gray-300" />
                                        <button
                                            type="button"
                                            onClick={() => setData('proof_photo', null)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs hover:bg-red-600"
                                        >
                                            Ganti
                                        </button>
                                    </div>
                                ) : (
                                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${errors.proof_photo ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:bg-gray-100'}`}>
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <FaCamera className={`w-8 h-8 mb-2 ${errors.proof_photo ? 'text-red-400' : 'text-gray-400'}`} />
                                            <p className="text-xs text-gray-500">Klik untuk ambil foto</p>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                )}
                                {errors.proof_photo && <p className="text-xs text-red-600 mt-1">{errors.proof_photo}</p>}
                            </div>

                            {/* Input Catatan */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">
                                    Catatan Driver (Opsional)
                                </label>
                                <div className="relative">
                                    <FaStickyNote className="absolute top-3 left-3 text-gray-400" />
                                    <textarea
                                        value={data.driver_notes}
                                        onChange={(e) => setData('driver_notes', e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Keterangan tambahan..."
                                        rows="2"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={processing}
                            className="flex-1 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className={`flex-1 py-2.5 text-white rounded-xl font-bold shadow-lg transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${current.btn}`}
                        >
                            {processing ? 'Memproses...' : current.label}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}