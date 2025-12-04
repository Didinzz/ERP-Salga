import { useState, useEffect } from 'react';
import { usePage, Link } from '@inertiajs/react'; // Import Link untuk logout
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from '@/Components/Admin/Sidebar';
// Import Icons
import { HiBars3, HiChevronDown, HiArrowRightOnRectangle, HiUserCircle } from "react-icons/hi2";
import { FaClock } from "react-icons/fa";

export default function AuthenticatedLayout({ header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState('');

    const { flash, auth, errors } = usePage().props;
    const user = auth.user;

    // Update jam real-time
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            setCurrentTime(`${hours}:${minutes}:${seconds}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        
        return () => clearInterval(interval);
    }, []);

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
                <header className="bg-white shadow-sm sticky top-0 z-20 h-24 flex items-center justify-between px-6">

                    {/* Bagian Kiri: Judul Halaman / Breadcrumb */}
                    <div className="flex-1">
                        <div className="text-md font-semibold text-gray-800">
                            {header}
                        </div>
                    </div>

                    {/* Bagian Kanan: Jam & Profil */}
                    <div className="flex items-center gap-6">

                        {/* Jam Real-time */}
                        <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-50 to-sky-50 px-5 py-2 rounded-xl border border-blue-100">
                            <FaClock className="w-4 h-4 text-blue-500 mr-4" />
                            <div className="text-center">
                                <div className="text-lg font-bold text-gray-800 leading-tight">
                                    {currentTime}
                                </div>
                                <div className="text-xs text-gray-500">
                                    WITA - Gorontalo
                                </div>
                            </div>
                        </div>

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
                                <div className="text-right hidden lg:block">
                                    <p className="text-sm font-medium text-gray-700 group-hover:text-primary transition">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>

                                {/* Avatar Lingkaran - DI PERBESAR */}
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 text-white flex items-center justify-center font-bold text-lg border-2 border-white shadow-lg transition group-hover:shadow-xl group-hover:scale-105">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>

                                {/* Ikon Panah Bawah */}
                                <HiChevronDown
                                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isUserOpen ? 'rotate-180 text-primary' : ''}`}
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

                                    {/* Isi Dropdown - DI PERBESAR */}
                                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl py-3 border border-gray-200 z-20 origin-top-right animate-in fade-in zoom-in-95 duration-100">

                                        {/* Info User - DI PERBESAR */}
                                        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-sky-50/50">
                                            <p className="text-base font-bold text-gray-800">{user.name}</p>
                                            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                                        </div>
                                        
                                        {/* Menu: Profile - DI PERBESAR */}
                                        <Link
                                            href={route('profile.edit')}
                                            className="flex items-center gap-3 px-5 py-3 text-base text-gray-700 hover:bg-blue-50 hover:text-primary rounded-lg mx-2 transition-colors my-1 group"
                                        >
                                            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                                <HiUserCircle className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <span className="font-medium">Edit Profil</span>
                                        </Link>

                                        <div className="border-t border-gray-100 my-2 mx-4"></div>

                                        {/* Menu: LOGOUT - DI PERBESAR */}
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="w-full text-left flex items-center gap-3 px-5 py-3 text-base text-red-600 hover:bg-red-50 rounded-lg mx-2 transition-colors mb-1 group"
                                        >
                                            <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                                                <HiArrowRightOnRectangle className="w-5 h-5 text-red-600" />
                                            </div>
                                            <span className="font-medium">Keluar</span>
                                        </Link>

                                        {/* Jam dalam dropdown (Mobile) */}
                                        <div className="md:hidden mt-3 pt-3 border-t border-gray-100 px-4">
                                            <div className="flex items-center gap-2">
                                                <FaClock className="w-4 h-4 text-gray-400" />
                                                <div className="text-sm font-medium text-gray-700">{currentTime}</div>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">Waktu Server</div>
                                        </div>
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