import { Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Toaster } from 'react-hot-toast';

// Hooks
import { useCart } from './Partials/hooks/useCart'; // Sesuaikan path import
import { useOrderProcessing } from './Partials/hooks/useOrderProcessing'; // Sesuaikan path import

// Partials
import HeaderStats from './Partials/HeaderStats';
import ProductCatalog from './Partials/ProductCatalog';
import TransactionHistory from './Partials/TransactionHistory';
import CartSidebar from './Partials/CartSidebar';

export default function Index({ products, initialTransactions, cashierName, date, auth, customer }) {
    const [viewMode, setViewMode] = useState('catalog');

    // Panggil Custom Hooks
    const { cart, totals, addToCart, updateQty, handleManualQty, removeFromCart, clearCart } = useCart(products);
    const { isProcessing, processOrder } = useOrderProcessing(clearCart);

    const displayedProducts = useMemo(() => {
        return products.map(p => {
            const inCart = cart.find(c => c.id === p.id);
            return {
                ...p,
                availableStock: p.stock - (inCart ? inCart.quantity : 0)
            };
        });
    }, [products, cart]);

    return (
        <AuthenticatedLayout user={auth.user}
            header={
                <div>
                    <h2 className="text-2xl font-bold text-dark">Manajemen Kasir</h2>
                    <p className="text-sm text-gray-500 mt-1">Kelola data kasir CV Salga Mandiri</p>
                </div>
            }
        >
            <Head title="Kasir POS" />
            <Toaster position="top-right" />

            <div className="min-h-screen w-full font-sans text-gray-900 pb-10 bg-gray-100">
                <div className="max-w-[1920px] mx-auto p-4 lg:p-6">

                    {/* Header */}
                    <div className="mb-6">
                        <HeaderStats
                            cashierName={cashierName}
                            date={date}
                            cartItemsCount={totals.items}
                            cartTotal={totals.price}
                            initialTransactions={initialTransactions}
                        />
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                        {/* Left Column: Catalog / History */}
                        <div className="lg:col-span-7 w-full">
                            {viewMode === 'catalog' ? (
                                <ProductCatalog
                                    products={displayedProducts} // Pass produk dengan stok yang sudah dikurangi
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

                        {/* Right Column: Cart */}
                        <div className="lg:col-span-5 w-full lg:sticky lg:top-6">
                            <CartSidebar
                                cart={cart}
                                total={totals.price}
                                totalItems={totals.items}
                                updateQty={updateQty}
                                handleManualQty={handleManualQty}
                                removeFromCart={removeFromCart}
                                clearCart={clearCart}
                                isProcessing={isProcessing}
                                onProcessOrder={(data) => processOrder(data, cart)}
                                customer={customer}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}