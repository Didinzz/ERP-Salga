// hooks/useOrderProcessing.js
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'react-hot-toast';

export function useOrderProcessing(clearCart) {
    const [isProcessing, setIsProcessing] = useState(false);

    const processOrder = (paymentData, cartItems) => {
        if (cartItems.length === 0) return toast.error('Keranjang kosong!');

        const formData = new FormData();

        // Append Info Order
        Object.keys(paymentData.orderData).forEach(key => {
            formData.append(key, paymentData.orderData[key]);
        });

        // Append Items (Array Mapping)
        cartItems.forEach((item, index) => {
            formData.append(`items[${index}][product_id]`, item.id);
            formData.append(`items[${index}][product_name]`, item.name);
            formData.append(`items[${index}][quantity]`, item.quantity);
        });

        // Append Bukti (Jika ada)
        if (paymentData.proofFile) {
            formData.append('payment_proof', paymentData.proofFile);
        }

        router.post(route('kasir.process-order'), formData, {
            forceFormData: true, // Inertia otomatis handle JSON vs FormData
            onStart: () => setIsProcessing(true),
            onSuccess: (page) => {
                clearCart();
                router.reload({ only: ['products', 'initialTransactions'] });
            },
            onError: (errors) => {
                console.error(errors);
                const msg = Object.values(errors)[0]; // Ambil error pertama saja biar rapi
                toast.error(msg || 'Gagal memproses pesanan');
            },
            onFinish: () => setIsProcessing(false),
        });
    };

    return { isProcessing, processOrder };
}