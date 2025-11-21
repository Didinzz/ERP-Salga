import { useState, useEffect } from 'react';
import { usePage, Link } from '@inertiajs/react'; // Import Link untuk logout
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from '@/Components/Admin/Sidebar';
// Import Icons
import { HiBars3, HiChevronDown, HiArrowRightOnRectangle, HiUserCircle } from "react-icons/hi2";

export default function AuthenticatedLayout({ header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // State untuk mengontrol dropdown profil (Buka/Tutup)
    const [isUserOpen, setIsUserOpen] = useState(false);

    const { flash, auth, errors } = usePage().props;
    const user = auth.user;

    // Efek Flash Message
    useEffect(() => {
        if (!flash) return;

        if (flash.success) {
            toast.success(flash.success, { duration: 5000 });
        }
        if (flash.error) {
            toast.error(flash.error, { duration: 5000 });
        }
        if (flash.info) {
            toast(flash.info, { duration: 5000 });
        }

        if (!flash.success) {
            const keys = Object.keys(errors);
            if (keys.length > 0) {
                const firstMsg = errors[keys[0]];
                const message = Array.isArray(firstMsg) ? firstMsg[0] : firstMsg;
                toast.error(message ?? 'Periksa kembali input Anda.', { duration: 5000 });
            }
        }

    }, [flash?.key]); 

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Toaster Global */}
            <Toaster position="top-right" />

            {/* Sidebar (Kiri) */}
            <Sidebar />

            {/* Main Content Wrapper (Kanan) */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* --- HEADER NAVBAR --- */}
                <header className="bg-white shadow-sm sticky top-0 z-20 h-16 flex items-center justify-between px-6">

                    {/* Bagian Kiri: Judul Halaman / Breadcrumb */}
                    <div className="flex-1">
                        {header}
                    </div>

                    {/* Bagian Kanan: Profil & Dropdown Logout */}
                    <div className="flex items-center gap-4">

                        {/* Mobile Toggle Button */}
                        <button
                            onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                            className="md:hidden text-gray-600 hover:text-primary transition"
                        >
                            <HiBars3 className="w-6 h-6" />
                        </button>

                        {/* --- USER DROPDOWN START --- */}
                        <div className="relative">
                            {/* Tombol Trigger Dropdown */}
                            <button
                                onClick={() => setIsUserOpen(!isUserOpen)}
                                className="flex items-center gap-3 focus:outline-none group"
                            >
                                {/* Nama & Email (Hidden di Mobile) */}
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-gray-700 group-hover:text-primary transition">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>

                                {/* Avatar Lingkaran */}
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20 transition group-hover:bg-primary group-hover:text-white">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>

                                {/* Ikon Panah Bawah */}
                                <HiChevronDown
                                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isUserOpen ? 'rotate-180 text-primary' : ''}`}
                                />
                            </button>

                            {/* Menu Dropdown (Muncul jika isUserOpen = true) */}
                            {isUserOpen && (
                                <>
                                    {/* Backdrop Invisible (Untuk menutup saat klik di luar) */}
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsUserOpen(false)}
                                    ></div>

                                    {/* Isi Dropdown */}
                                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl py-2 border border-gray-100 z-20 origin-top-right animate-in fade-in zoom-in-95 duration-100">

                                        {/* Info User (Hanya muncul di Mobile) */}
                                        <div className="px-4 py-3 border-b border-gray-50 sm:hidden bg-gray-50">
                                            <p className="text-sm font-bold text-gray-800">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>

                                        <div className="px-2 pt-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Akun
                                        </div>

                                        {/* Menu: Profile */}
                                        <Link
                                            href={route('profile.edit')}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary rounded-lg mx-2 transition-colors my-1"
                                        >
                                            <HiUserCircle className="w-5 h-5" />
                                            Edit Profil
                                        </Link>

                                        <div className="border-t border-gray-100 my-1"></div>

                                        {/* Menu: LOGOUT */}
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg mx-2 transition-colors mb-1"
                                        >
                                            <HiArrowRightOnRectangle className="w-5 h-5" />
                                            Keluar (Log Out)
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                        {/* --- USER DROPDOWN END --- */}

                    </div>
                </header>

                {/* --- CONTENT AREA --- */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}