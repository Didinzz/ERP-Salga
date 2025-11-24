import Modal from '@/Components/Modal';
import { HiExclamationTriangle, HiTrash, HiXMark } from "react-icons/hi2";

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    processing,
    title = "Hapus Data",
    message = "Apakah Anda yakin ingin menghapus data ini secara permanen? Tindakan ini tidak dapat dibatalkan.",
    itemName = null
}) {
    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="md">
            <div className="bg-white text-gray-900 overflow-hidden rounded-2xl flex flex-col shadow-2xl transform transition-all">

                {/* --- HEADER MERAH --- */}
                <div className="bg-red-600 px-6 py-4 flex items-center justify-between border-b border-red-700 shadow-md z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm border border-white/10 shadow-inner text-white">
                            <HiExclamationTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-wide leading-tight">
                                {title}
                            </h3>
                            <p className="text-red-100 text-xs font-medium opacity-90">
                                Konfirmasi tindakan berbahaya.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
                    >
                        <HiXMark className="w-5 h-5" />
                    </button>
                </div>

                {/* --- BODY --- */}
                <div className="p-6">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center border-4 border-red-100 animate-pulse">
                            <HiTrash className="w-10 h-10 text-red-500 opacity-80" />
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                            Anda Yakin?
                        </h4>
                        <p className="text-sm text-gray-500 leading-relaxed px-4">
                            {message}
                        </p>
                    </div>

                    {/* Info Item yang dihapus */}
                    {itemName && (
                        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex flex-col items-center justify-center text-center">
                            <span className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
                                Target Penghapusan
                            </span>
                            <span className="text-base font-bold text-gray-800 line-clamp-2">
                                "{itemName}"
                            </span>
                        </div>
                    )}

                    {/* --- FOOTER --- */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={processing}
                            className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all disabled:opacity-50"
                        >
                            Batal
                        </button>

                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={processing}
                            className="w-full py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-500/30 hover:bg-red-700 hover:shadow-red-600/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {processing ? 'Menghapus...' : (
                                <>
                                    <HiTrash className="w-5 h-5" />
                                    Ya, Hapus
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}