import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
// Import Icons
import {
    HiHome, HiUserGroup, HiCube, HiTruck,
    HiClipboardDocumentList, HiCog6Tooth, HiChevronDown
} from "react-icons/hi2";

import { RiDashboardFill } from "react-icons/ri";

import { TbCashRegister } from "react-icons/tb";
// Helper: Menu Item Single
const MenuItem = ({ href, icon: Icon, label, active }) => (
    <Link
        href={href}
        className={`flex items-center px-6 py-3 transition-all duration-300 group ${active
            ? 'bg-blue-50 border-l-4 border-primary text-primary'
            : 'text-gray-600 hover:bg-blue-50 hover:border-l-4 hover:border-blue-300 border-l-4 border-transparent'
            }`}
    >
        <Icon className={`w-5 h-5 mr-3 transition-colors ${active ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
        <span className="font-medium">{label}</span>
    </Link>
);

// Helper: Dropdown Menu
const DropdownMenu = ({ icon: Icon, label, active, children }) => {
    const [isOpen, setIsOpen] = useState(active);

    return (
        <div className="mb-1">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-6 py-3 transition-all duration-300 group ${active || isOpen ? 'text-primary' : 'text-gray-600 hover:bg-blue-50'
                    }`}
            >
                <div className="flex items-center">
                    <Icon className={`w-5 h-5 mr-3 transition-colors ${active || isOpen ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
                    <span className="font-medium">{label}</span>
                </div>
                <HiChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="bg-gray-50 py-2">
                    {children}
                </div>
            </div>
        </div>
    );
};

const MenuSection = ({ label }) => (
    <div className="px-6 py-3 mt-2 mb-1">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
    </div>
);

export default function Sidebar() {
    // Bisa menggunakan usePage().url untuk mendeteksi active link secara otomatis
    const { url } = usePage();

    return (
        <aside className="w-64 bg-white shadow-lg flex-shrink-0 hidden md:flex flex-col h-screen sticky top-0 z-20">
            {/* Logo Header */}
            <div className="p-6 border-b border-gray-200 flex items-center">
                <svg className="w-10 h-10 text-primary mr-3" viewBox="0 0 50 50" fill="currentColor">
                    <path d="M25 5 L25 20 Q25 30 15 35 Q25 40 25 50 Q25 40 35 35 Q25 30 25 20 Z" opacity="0.8" />
                    <ellipse cx="25" cy="15" rx="8" ry="6" fill="currentColor" opacity="0.6" />
                </svg>
                <div>
                    <h1 className="text-lg font-bold text-dark">PT Salga Mandiri</h1>
                    <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
            </div>

            {/* Menu List */}
            <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
                <MenuSection label="Main Menu" />

                <MenuItem href="/dashboard" label="Dashboard" icon={RiDashboardFill} active={url.startsWith('/dashboard')} />

                <MenuSection label="Manajemen Data" />

                <MenuItem href="/users" label="Pengguna" icon={HiUserGroup} active={url.startsWith('/users')} />

                <MenuItem href="/kasir" label="Kasir" icon={TbCashRegister} active={url.startsWith('/kasir')} />

                <MenuItem href="/products" label="Produk" icon={HiCube} active={url.startsWith('/products')} />

                <DropdownMenu label="Logistik" icon={HiTruck} active={url.startsWith('/orders')}>
                    <Link href="orders" className="block pl-14 pr-6 py-2 text-sm text-gray-500 hover:text-primary hover:bg-white transition-colors">Pemesanan</Link>
                    <Link href="deliveries" className="block pl-14 pr-6 py-2 text-sm text-gray-500 hover:text-primary hover:bg-white transition-colors">Pengiriman</Link>
                </DropdownMenu>

                <MenuSection label="Lainnya" />

                <MenuItem href="#" label="Laporan" icon={HiClipboardDocumentList} active={false} />
                <MenuItem href="#" label="Pengaturan" icon={HiCog6Tooth} active={false} />
            </nav>
        </aside>
    );
}