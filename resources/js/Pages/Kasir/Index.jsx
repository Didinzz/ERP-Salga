import { Head } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Toaster, toast } from 'react-hot-toast'; // Import Toaster

// Partials
import HeaderStats from './Partials/HeaderStats';
import ProductCatalog from './Partials/ProductCatalog';
import TransactionHistory from './Partials/TransactionHistory';
import CartSidebar from './Partials/CartSidebar';

export default function Index({ products, initialTransactions, cashierName, date, auth }) {
    const [cart, setCart] = useState([]);
    const [viewMode, setViewMode] = useState('catalog');

    const addToCart = useCallback((product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);

            if (existing) {
                if (existing.quantity >= parseInt(product.stock)) {
                    toast.error(`Stok maksimal tercapai! (Sisa: ${product.stock})`);
                    return prev;
                }
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }

            if (product.stock <= 0) {
                toast.error('Stok Habis!');
                return prev;
            }

            return [...prev, { ...product, quantity: 1 }];
        });
    }, []);

    const removeFromCart = useCallback((id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    }, []);

    const updateQty = useCallback((id, change) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + change;
                const product = products.find(p => p.id === id);

                if (change > 0 && newQty > product.stock) {
                    toast.error(`Stok tidak mencukupi! Maks: ${product.stock}`);
                    return item;
                }

                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }));
    }, [products]);

    const handleManualQty = useCallback((id, value) => {
        if (value === '' || value < 1) {
            return;
        }

        const newQty = parseInt(value);
        const product = products.find(p => p.id === id);

        if (newQty > product.stock) {
            toast.error(`Jumlah melebihi stok! Maks: ${product.stock}`);
            setCart(prev => prev.map(item =>
                item.id === id ? { ...item, quantity: parseInt(product.stock) } : item
            ));
        } else {
            setCart(prev => prev.map(item =>
                item.id === id ? { ...item, quantity: newQty } : item
            ));
        }
    }, [products]);

    return (
        <AuthenticatedLayout user={auth.user} header={null}>
            <Head title="Kasir POS" />

            {/* Pasang Toaster disini agar notifikasi muncul */}
            <Toaster position="top-right" />

            <div className="min-h-screen w-full font-sans text-gray-900 pb-10 bg-gray-100">
                <div className="max-w-[1920px] mx-auto p-4 lg:p-6">
                    <div className="mb-6">
                        <HeaderStats cashierName={cashierName} date={date} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        <div className="lg:col-span-7 w-full">
                            {viewMode === 'catalog' ? (
                                <ProductCatalog
                                    products={products}
                                    addToCart={addToCart}
                                    onOpenHistory={() => setViewMode('history')}
                                />
                            ) : (
                                <TransactionHistory
                                    transactions={initialTransactions}
                                    onBack={() => setViewMode('catalog')}
                                />
                            )}
                        </div>

                        <div className="lg:col-span-5 w-full lg:sticky lg:top-6">
                            <CartSidebar
                                cart={cart}
                                updateQty={updateQty}
                                handleManualQty={handleManualQty} // Oper fungsi baru
                                removeFromCart={removeFromCart}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}