import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/UI/PrimaryButton';
import InputGroup from '@/Components/UI/InputGroup';
import SelectGroup from '@/Components/UI/SelectGroup';
import FormSection from '@/Components/UI/FormSection';
import UploadEvidence from '@/Pages/Kasir/Partials/Cart/UploadEvidence';
import { HiCube, HiXMark, HiTag, HiCurrencyDollar, HiArchiveBox, HiBeaker, HiGlobeAlt, HiCalendar, HiPencilSquare } from "react-icons/hi2";
import Spinner from '@/Components/UI/Spinner';

export default function EditProductForm({ isOpen, onClose, product }) {
    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        _method: 'PUT',
        name: '',
        brand: '',
        description: '',
        price: '',
        stock: '',
        size: '',
        bottle_type: '',
        water_type: '',
        origin: '',
        image: null,
        manufactured_date: '',
        expired_date: '',
    });

    useEffect(() => {
        if (product && isOpen) {
            clearErrors();
            setData({
                _method: 'PUT', 
                name: product.name || '',
                brand: product.brand || '',
                description: product.description || '',
                price: product.price || '',
                stock: product.stock || '',
                size: product.size || '',
                bottle_type: product.bottle_type || 'botol_plastik',
                water_type: product.water_type || 'mineral',
                origin: product.origin || '',
                image: null,
                manufactured_date: product.manufactured_date ? product.manufactured_date.split('T')[0] : '',
                expired_date: product.expired_date ? product.expired_date.split('T')[0] : '',
            });
        }
    }, [product, isOpen]);

    const isFormValid = () => {
        return data.name && data.brand && data.price && data.stock && data.size;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('products.update', product.id), {
            onSuccess: () => {
                onClose();
                reset();
            },
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) setData('image', file);
    };

    const imagePreview = data.image
        ? URL.createObjectURL(data.image)
        : (product?.image_url || null);

    // HAPUS BARIS: if (!product) return null; 
    // Agar animasi modal tetap jalan

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            {/* Cek product di sini untuk render content, bukan return null di luar */}
            {product && (
                <div className="bg-white text-gray-900 overflow-hidden rounded-lg flex flex-col max-h-[90vh]">

                    {/* --- HEADER STICKY (Sama persis dengan Create - Biru) --- */}
                    <div className="sticky top-0 z-10 bg-blue-600 px-6 py-5 flex items-center justify-between border-b border-blue-700 shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-white/15 rounded-lg backdrop-blur-sm border border-white/20 shadow-inner text-white">
                                {/* Icon Pencil untuk pembeda visual konten */}
                                <HiPencilSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white tracking-wide">Edit Produk</h3>
                                <p className="text-blue-100 text-xs font-medium opacity-90 mt-0.5">
                                    Perbarui data produk <span className="font-mono font-bold ml-1">{product.product_code}</span>
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors focus:outline-none"
                        >
                            <HiXMark className="w-6 h-6" />
                        </button>
                    </div>

                    {/* --- BODY FORM --- */}
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                        <div className="p-6 md:p-8 bg-white space-y-6">

                            {/* Upload Gambar */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Foto Produk</label>
                                <UploadEvidence
                                    label="Ganti Gambar Produk"
                                    preview={imagePreview}
                                    onUpload={handleImageUpload}
                                />
                                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                            </div>

                            {/* Informasi Utama */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputGroup
                                    label="Nama Produk"
                                    name="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    icon={HiTag}
                                    error={errors.name}
                                    required
                                />
                                <InputGroup
                                    label="Merek"
                                    name="brand"
                                    value={data.brand}
                                    onChange={e => setData('brand', e.target.value)}
                                    icon={HiTag}
                                    error={errors.brand}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <InputGroup
                                    label="Harga (Rp)"
                                    name="price"
                                    type="number"
                                    value={data.price}
                                    onChange={e => setData('price', e.target.value)}
                                    icon={HiCurrencyDollar}
                                    error={errors.price}
                                    required
                                />
                                <InputGroup
                                    label="Stok Saat Ini"
                                    name="stock"
                                    type="number"
                                    value={data.stock}
                                    onChange={e => setData('stock', e.target.value)}
                                    icon={HiArchiveBox}
                                    error={errors.stock}
                                    required
                                />
                                <InputGroup
                                    label="Ukuran"
                                    name="size"
                                    value={data.size}
                                    onChange={e => setData('size', e.target.value)}
                                    icon={HiBeaker}
                                    error={errors.size}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SelectGroup
                                    label="Jenis Kemasan"
                                    name="bottle_type"
                                    value={data.bottle_type}
                                    onChange={e => setData('bottle_type', e.target.value)}
                                    icon={HiArchiveBox}
                                    error={errors.bottle_type}
                                    required
                                >
                                    <option value="botol_plastik">Botol Plastik</option>
                                    <option value="botol_kaca">Botol Kaca</option>
                                    <option value="galon">Galon</option>
                                    <option value="cup">Cup (Gelas)</option>
                                    <option value="pouch">Pouch</option>
                                    
                                </SelectGroup>

                                <SelectGroup
                                    label="Jenis Air"
                                    name="water_type"
                                    value={data.water_type}
                                    onChange={e => setData('water_type', e.target.value)}
                                    icon={HiBeaker}
                                    error={errors.water_type}
                                    required
                                >
                                    <option value="mineral">Mineral</option>
                                    <option value="reverse_osmosis">Reverse Osmosis</option>
                                    <option value="spring_water">Spring Water</option>
                                    <option value="demineralized">Demineralized</option>
                                </SelectGroup>
                            </div>

                            <FormSection title="Detail Tambahan" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputGroup
                                    label="Asal Produksi"
                                    name="origin"
                                    value={data.origin}
                                    onChange={e => setData('origin', e.target.value)}
                                    icon={HiGlobeAlt}
                                    placeholder="Indonesia"
                                    error={errors.origin}
                                    required
                                />
                                <InputGroup
                                    label="Tanggal Produksi"
                                    name="manufactured_date"
                                    type="date"
                                    value={data.manufactured_date}
                                    onChange={e => setData('manufactured_date', e.target.value)}
                                    icon={HiCalendar}
                                    error={errors.manufactured_date}
                                    required
                                />
                                <InputGroup
                                    label="Tanggal Kadaluarsa"
                                    name="expired_date"
                                    type="date"
                                    value={data.expired_date}
                                    onChange={e => setData('expired_date', e.target.value)}
                                    icon={HiCalendar}
                                    error={errors.expired_date}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                <textarea
                                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                    rows="3"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder="Tambahkan catatan atau deskripsi produk..."
                                ></textarea>
                            </div>
                        </div>

                        {/* --- FOOTER ACTIONS --- */}
                        <div className="p-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={processing}
                                className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
                            >
                                Batal
                            </button>
                            <PrimaryButton
                                type="submit"
                                processing={processing}
                                disabled={!isFormValid() || processing}
                                className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 shadow-lg shadow-blue-500/30"
                            >
                                {processing ? <Spinner text="menyimpan..." /> : 'Simpan Perubahan'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            )}
        </Modal>
    );
}