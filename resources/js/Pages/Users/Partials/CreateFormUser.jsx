import { useForm } from '@inertiajs/react';
import Modal from '@/Components/UI/Modal';

export default function CreateUserForm({ isOpen, onClose }) {
    // Menggunakan useForm Inertia untuk manajemen state form yang lebih baik
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        email: '',
        role: 'Distributor',
        status: 'Aktif',
        phone: '',
        password: 'password123' // Default password sementara
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('users.store'), {
            onSuccess: () => {
                reset();
                onClose(); // Tutup modal jika sukses
            },
            // onError: (err) => console.log(err) // Bisa tambah logika error
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Tambah Pengguna Baru">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nama */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Masukkan nama lengkap"
                        required
                    />
                    {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="contoh@email.com"
                        required
                    />
                    {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                </div>

                {/* Telepon */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Telepon</label>
                    <input
                        type="text"
                        value={data.phone}
                        onChange={e => setData('phone', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="08123456789"
                    />
                </div>

                {/* Role */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                    <select
                        value={data.role}
                        onChange={e => setData('role', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                    >
                        <option value="Admin">Admin</option>
                        <option value="Distributor">Distributor</option>
                        <option value="Sales">Sales</option>
                    </select>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={processing}
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition-colors shadow-lg flex justify-center items-center"
                        disabled={processing}
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Pengguna'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}