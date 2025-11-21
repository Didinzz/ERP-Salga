import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
// Kita tidak perlu PrimaryButton untuk tombol batal, cukup button biasa agar visual hierarchy jelas

// Icons
import {
    HiExclamationTriangle,
    HiUser,
    HiXMark,
    HiTrash
} from "react-icons/hi2";
import Spinner from '@/Components/UI/Spinner';

export default function DeleteUserConfirmation({ isOpen, onClose, user }) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        if (!user) return;

        destroy(route('users.destroy', user.id), {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="xl">
            {/* Wrapper utama dengan background putih & rounded rapi */}
            <div className="bg-white text-gray-900 overflow-hidden rounded-lg shadow-xl transform transition-all">

                {/* --- HEADER (Merah untuk Danger) --- */}
                <div className="bg-primary px-6 py-4 flex items-center justify-between border-b border-blue-700">
                    <div className="flex items-center gap-4">
                        {/* Icon Wrapper Glassmorphism */}
                        <div className="p-2 bg-white/15 rounded-lg backdrop-blur-sm border border-white/20 shadow-inner text-white">
                            <HiTrash className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-wide leading-tight">
                                Hapus Pengguna
                            </h3>
                            <p className="text-red-100 text-xs font-medium opacity-90 mt-0.5">
                                Konfirmasi tindakan penghapusan.
                            </p>
                        </div>
                    </div>

                    {/* Tombol Close Header */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
                    >
                        <HiXMark className="w-5 h-5" />
                    </button>
                </div>

                {/* --- BODY CONTENT --- */}
                <div className="p-6">

                    {/* 1. Pesan Peringatan */}
                    <div className="text-center sm:text-left mb-6">
                        <h4 className="text-lg font-semibold text-gray-900">
                            Apakah Anda yakin?
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                            Data yang dihapus tidak dapat dikembalikan. Akun ini akan hilang dari sistem beserta riwayat aksesnya.
                        </p>
                    </div>

                    {/* 2. Card Info User yang akan dihapus (Context) */}
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-start gap-4">
                        <div className="flex-shrink-0 p-2 bg-white rounded-full border border-red-100 text-red-500">
                            <HiUser className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-0.5">
                                Target Penghapusan
                            </p>
                            {/* Gunakan Optional Chaining (?.name) untuk mencegah error saat animasi close */}
                            <h5 className="text-base font-bold text-gray-900 truncate">
                                {user?.name || '...'}
                            </h5>
                            <p className="text-sm text-gray-600 truncate">
                                {user?.email || '...'}
                            </p>
                            <div className="mt-2 flex gap-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white border border-red-200 text-gray-800">
                                    {user?.role || '-'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* --- FOOTER ACTIONS --- */}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={processing}
                            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all disabled:opacity-50"
                        >
                            Batal
                        </button>

                        <DangerButton
                            type="button"
                            onClick={handleDelete}
                            disabled={processing}
                            className="w-full sm:w-auto justify-center shadow-lg shadow-red-500/30"
                        >
                            {processing ? <Spinner text='menghapus...' /> : 'Ya, Hapus'}

                        </DangerButton>
                    </div>
                </div>
            </div>
        </Modal>
    );
}