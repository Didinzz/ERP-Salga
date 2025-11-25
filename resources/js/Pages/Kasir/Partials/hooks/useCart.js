// hooks/useCart.js
import { useState, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';

export function useCart(products) {
    const [cart, setCart] = useState([]);

    // Hitung total secara otomatis
    const totals = useMemo(() => ({
        price: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        items: cart.reduce((sum, item) => sum + item.quantity, 0)
    }), [cart]);

    // Helper untuk cek stok
    const checkStock = (productId, newQty) => {
        const product = products.find(p => p.id === productId);
        if (!product) return false;

        if (newQty > product.stock) {
            toast.error(`Stok maksimal tercapai! (Sisa: ${product.stock})`);
            return false;
        }
        return true;
    };

    const addToCart = useCallback((product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            const nextQty = existing ? existing.quantity + 1 : 1;

            if (!checkStock(product.id, nextQty)) return prev;

            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: nextQty } : item);
            }

            toast.success(`${product.name} masuk keranjang`);
            return [...prev, { ...product, quantity: 1 }];
        });
    }, [products]);

    const updateQty = useCallback((id, change) => {
        setCart(prev => prev.map(item => {
            if (item.id !== id) return item;

            const newQty = item.quantity + change;
            if (newQty < 1) return item; // Jangan hapus otomatis, biarkan user pakai tombol hapus
            if (!checkStock(id, newQty)) return item;

            return { ...item, quantity: newQty };
        }));
    }, [products]);

    const handleManualQty = useCallback((id, value) => {
        const newQty = parseInt(value);
        if (!value || newQty < 1) return;

        setCart(prev => prev.map(item => {
            if (item.id !== id) return item;
            if (!checkStock(id, newQty)) return { ...item, quantity: products.find(p => p.id === id).stock };
            return { ...item, quantity: newQty };
        }));
    }, [products]);

    const removeFromCart = useCallback((id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
        toast.success('Keranjang dibersihkan');
    }, []);

    return { cart, totals, addToCart, updateQty, handleManualQty, removeFromCart, clearCart };
}