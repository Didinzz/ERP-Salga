import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast'; // Import Toast
import Sidebar from '@/Components/Admin/Sidebar';
import { HiBars3 } from "react-icons/hi2";

export default function AuthenticatedLayout({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // Ambil props flash dari backend
    const { flash, auth } = usePage().props;

    // Efek untuk memunculkan Toast otomatis saat ada flash message
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
        if (flash.warning) {
            toast(flash.warning, { icon: '⚠️' });
        }
    }, [flash]);


    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* 1. Pasang Toaster disini (Global) */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: { background: '#333', color: '#fff' },
                    success: { style: { background: '#10B981', color: '#fff' } }, // Tailwind Green-500
                    error: { style: { background: '#EF4444', color: '#fff' } },   // Tailwind Red-500
                }}
            />

            {/* 2. Sidebar Component */}
            <Sidebar />

            {/* 3. Main Content Wrapper */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white shadow-sm sticky top-0 z-10 h-16 flex items-center justify-between px-6">
                    {/* Header Content / Breadcrumbs */}
                    <div className="flex-1">
                        {header}
                    </div>

                    {/* Right Side (Profile) - Simplifikasi */}
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-700">{auth.user.name}</p>
                            <p className="text-xs text-gray-500">{auth.user.email}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                            {auth.user.name.charAt(0)}
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                            className="md:hidden text-gray-600 hover:text-primary"
                        >
                            <HiBars3 className="w-6 h-6" />
                        </button>
                    </div>
                </header>

                {/* Main Content Scrollable */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}