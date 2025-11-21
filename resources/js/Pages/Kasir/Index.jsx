import { Head } from '@inertiajs/react';
import { useState } from 'react';
import HeaderStats from './Partials/HeaderStats';
import ProductCatalog from './Partials/ProductCatalog';
import CartSidebar from './Partials/CartSidebar';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ products, cashierName, date, auth }) {
    const [cart, setCart] = useState([]);

    // Logic Tambah ke Keranjang
    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) {
                    alert('Stok tidak mencukupi!'); // Bisa diganti toast notification nanti
                    return prev;
                }
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    // Logic Hapus Item
    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    // Logic Update Quantity (+/-)
    const updateQty = (id, change) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + change;
                // Cek stok maksimal
                const product = products.find(p => p.id === id);

                if (change > 0 && newQty > product.stock) {
                    alert('Mencapai batas stok!');
                    return item;
                }

                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="text-2xl font-bold text-dark">Manajemen Pengguna</h2>
                    <p className="text-sm text-gray-500 mt-1">Kelola data pengguna sistem PT Salga Mandiri</p>
                </div>
            }
        >
            <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
                <Head title="Kasir POS - PT Salga Mandiri" />

                <div className="max-w-[1920px] mx-auto p-4 lg:p-6">
                    {/* Bagian Header & Statistik */}
                    <HeaderStats cashierName={cashierName} date={date} />

                    {/* Grid Layout Utama */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
                        {/* Kiri: Katalog Produk */}
                        <ProductCatalog products={products} addToCart={addToCart} />

                        {/* Kanan: Sidebar Keranjang (Sticky) */}
                        <CartSidebar cart={cart} updateQty={updateQty} removeFromCart={removeFromCart} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}