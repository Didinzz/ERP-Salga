import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal'; // Modal bawaan
import PrimaryButton from '@/Components/UI/PrimaryButton';
import InputGroup from '@/Components/UI/InputGroup';


// Icons
import {
    HiUser, HiEnvelope, HiPhone, HiBriefcase,
    HiShieldCheck, HiLockClosed, HiUserPlus,
    HiXMark
} from "react-icons/hi2";
import SelectGroup from '@/Components/UI/SelectGroup ';

// Komponen Helper Kecil untuk Pembatas Section
const FormSection = ({ title }) => (
    <div className="flex items-center gap-4 my-6">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
            {title}
        </span>
        <div className="h-px bg-gray-200 w-full"></div>
    </div>
);

export default function CreateUserForm({ isOpen, onClose }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        role: 'Distributor',
        status: 'Aktif',
        password: '',
        password_confirmation: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('users.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const isFormValid = () => {
        return data.name && data.email && data.password && data.password_confirmation;
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            {/* WRAPPER UTAMA: 
                Kita bungkus semua konten dalam div bg-white dan overflow-hidden
                agar sudut rounded modal tetap rapi dan background pasti putih.
            */}
            <div className="bg-white text-gray-900 overflow-hidden rounded-lg">

                {/* --- HEADER --- */}
                <div className="bg-primary px-6 py-5 flex items-center justify-between border-b border-blue-600">
                    <div className="flex items-center gap-4">
                        {/* Icon Wrapper */}
                        <div className="p-2.5 bg-white/15 rounded-lg backdrop-blur-sm border border-white/20 shadow-inner text-white">
                            <HiUserPlus className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-wide">Tambah Pengguna</h3>
                            <p className="text-blue-100 text-xs font-medium opacity-90 mt-0.5">
                                Input data anggota baru ke dalam sistem.
                            </p>
                        </div>
                    </div>

                    {/* Tombol Close */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
                    >
                        <HiXMark className="w-6 h-6" />
                    </button>
                </div>

                {/* --- BODY FORM --- */}
                {/* Menambahkan 'bg-white' di sini juga untuk keamanan ganda */}
                <form onSubmit={handleSubmit} className="p-6 md:p-8 bg-white">

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
                            name="phone"
                            type="tel"
                            value={data.phone}
                            onChange={e => setData('phone', e.target.value)}
                            icon={HiPhone}
                            placeholder="08xxxxxxxxxx"
                            error={errors.phone}
                        />

                        <SelectGroup
                            label="Role Pengguna"
                            name="role"
                            value={data.role}
                            onChange={e => setData('role', e.target.value)}
                            icon={HiBriefcase}
                            error={errors.role}
                        >
                            <option value="Admin">Admin</option>
                            <option value="Distributor">Distributor</option>
                            <option value="Sales">Sales</option>
                        </SelectGroup>
                    </div>

                    {/* Divider Section */}
                    <FormSection title="Keamanan & Password" />

                    {/* 2. Area Password */}
                    {/* Menggunakan bg-gray-50 (abu sangat muda) agar kontras dengan bg-white utama */}
                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup
                                label="Kata Sandi"
                                name="password"
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                icon={HiLockClosed}
                                placeholder="Min 8 karakter"
                                error={errors.password}
                                required
                            />

                            <InputGroup
                                label="Konfirmasi Sandi"
                                name="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                                icon={HiShieldCheck}
                                placeholder="Ketik ulang sandi"
                                error={errors.password_confirmation}
                                required
                            />
                        </div>
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
                            className="w-full sm:w-auto shadow-lg shadow-blue-500/20 justify-center"
                            processing={processing}
                            disabled={processing || !isFormValid()}
                        >
                            Simpan Pengguna
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}