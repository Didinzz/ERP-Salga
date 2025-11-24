import { Head } from '@inertiajs/react';
import { useState, useCallback, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Toaster, toast } from 'react-hot-toast';
import { router } from '@inertiajs/react';

// Partials
import HeaderStats from './Partials/HeaderStats';
import ProductCatalog from './Partials/ProductCatalog';
import TransactionHistory from './Partials/TransactionHistory';
import CartSidebar from './Partials/CartSidebar';

export default function Index({ products, initialTransactions, cashierName, date, auth }) {
    const [cart, setCart] = useState([]);
    const [viewMode, setViewMode] = useState('catalog');
    const [currentProducts, setCurrentProducts] = useState(products);
    const [isProcessing, setIsProcessing] = useState(false);

    // Update products stock based on cart
    useEffect(() => {
        const updatedProducts = products.map(product => {
            const cartItem = cart.find(item => item.id === product.id);
            if (cartItem) {
                return {
                    ...product,
                    availableStock: product.stock - cartItem.quantity
                };
            }
            return { ...product, availableStock: product.stock };
        });
        setCurrentProducts(updatedProducts);
    }, [cart, products]);

    const addToCart = useCallback((product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            const availableStock = product.availableStock || product.stock;

            if (existing) {
                if (existing.quantity >= availableStock) {
                    toast.error(`Stok maksimal tercapai! (Sisa: ${availableStock})`);
                    return prev;
                }
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }

            if (availableStock <= 0) {
                toast.error('Stok Habis!');
                return prev;
            }

            toast.success(`${product.name} ditambahkan ke keranjang`);
            return [...prev, { 
                ...product, 
                quantity: 1,
                maxStock: availableStock 
            }];
        });
    }, []);

    const removeFromCart = useCallback((id) => {
        setCart(prev => {
            const item = prev.find(item => item.id === id);
            if (item) {
                toast.success(`${item.name} dihapus dari keranjang`);
            }
            return prev.filter(item => item.id !== id);
        });
    }, []);

    const updateQty = useCallback((id, change) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + change;
                const maxStock = item.maxStock || item.stock;

                if (change > 0 && newQty > maxStock) {
                    toast.error(`Stok tidak mencukupi! Maks: ${maxStock}`);
                    return item;
                }

                if (newQty < 1) {
                    removeFromCart(id);
                    return item;
                }

                return { ...item, quantity: newQty };
            }
            return item;
        }));
    }, [removeFromCart]);

    const handleManualQty = useCallback((id, value) => {
        if (value === '' || value < 1) {
            return;
        }

        const newQty = parseInt(value);
        const cartItem = cart.find(item => item.id === id);
        
        if (!cartItem) return;

        const maxStock = cartItem.maxStock || cartItem.stock;

        if (newQty > maxStock) {
            toast.error(`Jumlah melebihi stok! Maks: ${maxStock}`);
            setCart(prev => prev.map(item =>
                item.id === id ? { ...item, quantity: maxStock } : item
            ));
        } else {
            setCart(prev => prev.map(item =>
                item.id === id ? { ...item, quantity: newQty } : item
            ));
        }
    }, [cart]);

    const clearCart = useCallback(() => {
        setCart([]);
        toast.success('Keranjang dikosongkan');
    }, []);

    // SOLUSI: Gunakan Inertia router langsung
    // Di dalam handleProcessOrder function, perbaiki mapping data:
const handleProcessOrder = (paymentData) => {
    if (cart.length === 0) {
        toast.error('Keranjang kosong!');
        return;
    }

    // Siapkan data order
    const orderData = {
        ...paymentData.orderData,
        items: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity
        }))
    };

    console.log('Data yang dikirim ke backend:', orderData);

    // Jika ada bukti pembayaran (transfer/QRIS), gunakan FormData
    if (paymentData.proofFile) {
        const formData = new FormData();
        
        // Append semua data order ke FormData
        Object.keys(orderData).forEach(key => {
            if (key === 'items') {
                // Handle array items
                orderData.items.forEach((item, index) => {
                    formData.append(`items[${index}][product_id]`, item.product_id);
                    formData.append(`items[${index}][quantity]`, item.quantity);
                });
            } else {
                formData.append(key, orderData[key]);
            }
        });

        // Append bukti pembayaran
        formData.append('payment_proof', paymentData.proofFile);

        // Gunakan Inertia dengan FormData
        router.post(route('kasir.process-order'), formData, {
            onStart: () => {
                setIsProcessing(true);
                console.log('Memulai proses order dengan bukti pembayaran...');
            },
            onSuccess: (page) => {
                console.log('Success response:', page);
                
                if (page.props.flash?.success) {
                    toast.success(page.props.flash.success);
                } else {
                    toast.success('Pesanan berhasil diproses!');
                }
                
                setCart([]);
                router.reload({ 
                    only: ['products', 'initialTransactions'],
                    preserveScroll: true 
                });
            },
            onError: (errors) => {
                console.error('Error response:', errors);
                handleErrors(errors);
            },
            onFinish: () => {
                setIsProcessing(false);
            },
        });
    } else {
        // Untuk cash, gunakan JSON biasa
        router.post(route('kasir.process-order'), orderData, {
            onStart: () => {
                setIsProcessing(true);
                console.log('Memulai proses order...');
            },
            onSuccess: (page) => {
                console.log('Success response:', page);
                
                if (page.props.flash?.success) {
                    toast.success(page.props.flash.success);
                } else {
                    toast.success('Pesanan berhasil diproses!');
                }
                
                setCart([]);
                router.reload({ 
                    only: ['products', 'initialTransactions'],
                    preserveScroll: true 
                });
            },
            onError: (errors) => {
                console.error('Error response:', errors);
                handleErrors(errors);
            },
            onFinish: () => {
                setIsProcessing(false);
            },
        });
    }
};

// Helper function untuk handle errors
const handleErrors = (errors) => {
    if (errors.payment_method) {
        toast.error(`Metode pembayaran: ${errors.payment_method}`);
    } else if (errors.payment_proof) {
        toast.error(`Bukti pembayaran: ${errors.payment_proof}`);
    } else if (errors.message) {
        toast.error(errors.message);
    } else if (typeof errors === 'string') {
        toast.error(errors);
    } else if (Object.keys(errors).length > 0) {
        const errorMessage = Object.values(errors).join(', ');
        toast.error(errorMessage);
    } else {
        toast.error('Terjadi kesalahan saat memproses pesanan');
    }
};

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <AuthenticatedLayout user={auth.user} header={null}>
            <Head title="Kasir POS" />

            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 5000,
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />

            <div className="min-h-screen w-full font-sans text-gray-900 pb-10 bg-gray-100">
                <div className="max-w-[1920px] mx-auto p-4 lg:p-6">
                    <div className="mb-6">
                        <HeaderStats 
                            cashierName={cashierName} 
                            date={date} 
                            cartItemsCount={cart.length}
                            cartTotal={total}
                            initialTransactions={initialTransactions}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        <div className="lg:col-span-7 w-full">
                            {viewMode === 'catalog' ? (
                                <ProductCatalog
                                    products={currentProducts}
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
                                handleManualQty={handleManualQty}
                                removeFromCart={removeFromCart}
                                clearCart={clearCart}
                                onProcessOrder={handleProcessOrder}
                                isProcessing={isProcessing}
                                total={total}
                                totalItems={totalItems}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}