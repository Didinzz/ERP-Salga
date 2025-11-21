// EditFormUser.jsx
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/UI/PrimaryButton';
import InputGroup from '@/Components/UI/InputGroup';
import SelectGroup from '@/Components/UI/SelectGroup';
import FormSection from '@/Components/UI/FormSection';
import PasswordConfirmation from '@/Components/UI/PasswordConfirmation';

// Icons
import {
    HiUser, HiEnvelope, HiPhone, HiBriefcase,
    HiPencil, HiXMark
} from "react-icons/hi2";
import Spinner from '@/Components/UI/Spinner';

export default function EditFormUser({ isOpen, onClose, user }) {
    const { data, setData, put, processing, reset, errors } = useForm({
        name: '',
        email: '',
        kontak: '',
        role: '',
        status: 'Aktif',
        password: '',
        password_confirmation: ''
    });

    // Saat user berubah / modal dibuka -> isi form
    useEffect(() => {
        if (isOpen && user) {
            setData({
                name: user.name ?? '',
                email: user.email ?? '',
                kontak: user.kontak ?? '', // Pastikan field di DB 'kontak' atau sesuaikan
                role: user.role ?? '',
                status: user.status ?? '',
                password: '',
                password_confirmation: ''
            });
        }
    }, [user, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user) return; // Safety check saat submit

        if (data.password && data.password !== data.password_confirmation) {
            return;
        }

        put(route('users.update', user.id), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const isFormValid = () => {
        const baseValid = data.name && data.email;
        if (data.password) {
            return baseValid && data.password === data.password_confirmation;
        }
        return baseValid;
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <div className="bg-white text-gray-900 overflow-hidden rounded-lg flex flex-col max-h-[90vh]">

                {/* --- HEADER STICKY --- */}
                <div className="sticky top-0 z-10 bg-primary px-6 py-5 flex items-center justify-between border-b border-blue-600">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-white/15 rounded-lg backdrop-blur-sm border border-white/20 shadow-inner text-white">
                            <HiPencil className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-wide">Edit Pengguna</h3>
                            <p className="text-orange-100 text-xs font-medium opacity-90 mt-0.5">
                                {/* Gunakan Optional Chaining (?.name) agar tidak error saat user sesaat null */}
                                Edit data anggota {user?.name || '...'} dalam sistem.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
                    >
                        <HiXMark className="w-6 h-6" />
                    </button>
                </div>

                {/* --- BODY FORM --- */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 md:p-8 bg-white">
                        {/* 1. Informasi Akun */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup
                                label="Nama Lengkap"
                                name="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                icon={HiUser}
                                placeholder="Contoh: Budi Santoso"
                                error={errors.name}
                                required
                            />

                            <InputGroup
                                label="Alamat Email"
                                name="email"
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                icon={HiEnvelope}
                                placeholder="nama@perusahaan.com"
                                error={errors.email}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <InputGroup
                                label="Nomor Telepon"
                                name="kontak"
                                type="tel"
                                value={data.kontak}
                                onChange={e => setData('kontak', e.target.value)}
                                icon={HiPhone}
                                placeholder="08xxxxxxxxxx"
                                error={errors.kontak}
                            />

                            <SelectGroup
                                label="Role Pengguna"
                                name="role"
                                value={data.role}
                                onChange={e => setData('role', e.target.value)}
                                icon={HiBriefcase}
                                error={errors.role}
                            >
                                <option value="staff">Staff</option>
                                <option value="kasir">Kasir</option>
                                <option value="driver">Driver</option>
                                <option value="admin">Admin</option>
                            </SelectGroup>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
                            <SelectGroup
                                label="Status"
                                name="status"
                                value={data.status}
                                onChange={e => setData('status', e.target.value)}
                                icon={HiUser}
                                error={errors.status}
                            >
                                <option value="aktif">Aktif</option>
                                <option value="nonaktif">Nonaktif</option>
                            </SelectGroup>
                        </div>

                        <FormSection title="Ubah Password (Opsional)" />

                        {/* 2. Area Password */}
                        <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="mb-4">
                                <p className="text-sm text-gray-600">
                                    Kosongkan password jika tidak ingin mengubah password pengguna.
                                </p>
                            </div>
                            <PasswordConfirmation
                                password={data.password}
                                passwordConfirmation={data.password_confirmation}
                                onPasswordChange={e => setData('password', e.target.value)}
                                onConfirmationChange={e => setData('password_confirmation', e.target.value)}
                                passwordError={errors.password}
                                confirmationError={errors.password_confirmation}
                            />
                        </div>

                        {/* --- FOOTER ACTIONS --- */}
                        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={processing}
                                className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 transition-all disabled:opacity-50 text-sm bg-white"
                            >
                                Batal
                            </button>

                            <PrimaryButton
                                type="submit"
                                className="w-full sm:w-auto shadow-lg shadow-orange-500/20 justify-center"
                                processing={processing}
                                disabled={processing || !isFormValid()}>
                                {processing ? <Spinner text='menyimpan...' /> : 'Update pengguna'}
                            </PrimaryButton>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
}