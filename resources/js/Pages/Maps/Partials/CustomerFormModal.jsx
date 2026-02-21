import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/UI/PrimaryButton';
import InputGroup from '@/Components/UI/InputGroup';
import SelectGroup from '@/Components/UI/SelectGroup';
import FormSection from '@/Components/UI/FormSection';

import {
    HiMapPin, HiUser, HiPhone, HiHome,
    HiCheckCircle, HiXMark, HiPencilSquare, HiPlus, HiTrash
} from "react-icons/hi2";

export default function CustomerFormModal({
    isOpen, onClose, data, setData, processing, errors, mode, onSubmit, onDelete
}) {
    const isEdit = mode === 'edit';
    const Title = isEdit ? 'Edit Data Pelanggan' : 'Tambah Lokasi Baru';
    const Subtitle = isEdit ? 'Perbarui informasi detail pelanggan.' : 'Lengkapi data untuk lokasi yang dipilih.';
    const HeaderIcon = isEdit ? HiPencilSquare : HiPlus;

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <div className="bg-white text-gray-900 overflow-hidden rounded-lg flex flex-col max-h-[90vh]">

                {/* --- HEADER --- */}
                <div className="sticky top-0 z-10 bg-blue-600 px-6 py-5 flex items-center justify-between border-b border-blue-700 shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-white/15 rounded-lg backdrop-blur-sm border border-white/20 shadow-inner text-white">
                            <HeaderIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-wide">{Title}</h3>
                            <p className="text-blue-100 text-xs font-medium opacity-90 mt-0.5">{Subtitle}</p>
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
                <form onSubmit={onSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 md:p-8 bg-white">

                        {/* Koordinat (Read Only) */}
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between text-sm text-blue-900">
                            <div className="flex items-center gap-3">
                                <HiMapPin className="w-5 h-5 text-blue-500" />
                                <span className="font-semibold">Titik Koordinat Terpilih</span>
                            </div>
                            <div className="flex gap-4 font-mono text-xs">
                                <span className="bg-white px-2 py-1 rounded border border-blue-200">
                                    Lat: {data.latitude ? Number(data.latitude).toFixed(6) : '-'}
                                </span>
                                <span className="bg-white px-2 py-1 rounded border border-blue-200">
                                    Lng: {data.longitude ? Number(data.longitude).toFixed(6) : '-'}
                                </span>
                            </div>
                        </div>

                        {/* Input Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup
                                label="Nama Toko / Pelanggan"
                                name="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                icon={HiHome}
                                placeholder="Contoh: Toko Sembako Berkah"
                                error={errors.name}
                                required
                            />
                            <InputGroup
                                label="Nama Pemilik (Owner)"
                                name="owner_name"
                                value={data.owner_name}
                                onChange={e => setData('owner_name', e.target.value)}
                                icon={HiUser}
                                placeholder="Contoh: Bpk. Budi"
                                error={errors.owner_name}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <InputGroup
                                label="Nomor Telepon / WA"
                                name="phone"
                                type="tel"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                icon={HiPhone}
                                placeholder="08xxxxxxxxxx"
                                error={errors.phone}
                            />
                            <SelectGroup
                                label="Status Pelanggan"
                                name="status"
                                value={data.status}
                                onChange={e => setData('status', e.target.value)}
                                icon={HiCheckCircle}
                                error={errors.status}
                            >
                                <option value="active">Aktif (Ditampilkan)</option>
                                <option value="inactive">Nonaktif (Disembunyikan)</option>
                            </SelectGroup>
                        </div>

                        <FormSection title="Alamat Lengkap" />

                        <div className="mb-4 relative">
                            <div className="absolute top-3 left-0 flex items-center pl-3 pointer-events-none">
                                <HiMapPin className="w-5 h-5 text-gray-400" />
                            </div>
                            <textarea
                                name="address"
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                                rows="3"
                                className={`block w-full pl-10 pr-3 py-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border ${errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    } focus:bg-white transition-colors`}
                                placeholder="Masukkan alamat lengkap..."
                                required
                            />
                            {errors.address && <p className="mt-1 text-xs text-red-500 font-medium">{errors.address}</p>}
                        </div>

                        {/* --- FOOTER ACTIONS --- */}
                        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-gray-100">

                            {/* Tombol Hapus (Mode Edit Only) */}
                            {isEdit && (
                                <button
                                    type="button"
                                    onClick={onDelete} // Pemicu Modal Konfirmasi di Index.jsx
                                    className="mr-auto text-red-500 hover:text-red-700 text-sm font-semibold px-3 py-2 hover:bg-red-50 bg-white border border-red-200 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <HiTrash className="w-4 h-4" />
                                    Hapus Lokasi
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={onClose}
                                disabled={processing}
                                className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 bg-white text-sm"
                            >
                                Batal
                            </button>

                            <PrimaryButton
                                type="submit"
                                className="w-full sm:w-auto shadow-lg shadow-blue-500/20 justify-center"
                                processing={processing}
                            >
                                {isEdit ? 'Simpan Perubahan' : 'Simpan Lokasi Baru'}
                            </PrimaryButton>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
}