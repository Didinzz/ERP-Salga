import Modal from '@/Components/Modal';
import { HiTrash, HiExclamationTriangle } from "react-icons/hi2";

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, processing, itemName }) {
    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="sm">
            <div className="p-6 text-center">

                {/* Icon Danger */}
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-4 animate-bounce-small">
                    <HiExclamationTriangle className="h-8 w-8 text-red-600" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Hapus Produk Ini?
                </h3>

                <p className="text-sm text-gray-500 mb-6">
                    Apakah Anda yakin ingin menghapus
                    <span className="font-bold text-gray-800 mx-1">"{itemName}"</span>?
                    <br />
                    Data yang dihapus tidak dapat dikembalikan.
                </p>

                <div className="flex justify-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-lg shadow-red-500/30 flex items-center gap-2 transition-all active:scale-95"
                    >
                        {processing ? (
                            <span className="animate-pulse">Menghapus...</span>
                        ) : (
                            <>
                                <HiTrash className="w-4 h-4" /> Ya, Hapus
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}