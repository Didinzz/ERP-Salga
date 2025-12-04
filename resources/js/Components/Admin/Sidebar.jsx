import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
// Import Icons
import {
    HiHome, HiUserGroup, HiCube, HiTruck,
    HiClipboardDocumentList, HiCog6Tooth, HiChevronDown
} from "react-icons/hi2";
import { RiDashboardFill } from "react-icons/ri";
import { TbCashRegister } from "react-icons/tb";
import { FaMapSigns } from 'react-icons/fa';

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
    const { url, props } = usePage();
    const { auth } = props;
    const userRole = auth?.user?.role || 'guest';

    // Fungsi untuk mengecek apakah role memiliki akses
    const hasAccess = (allowedRoles) => {
        return allowedRoles.includes(userRole);
    };

    // Menu berdasarkan role
    const menuConfig = {
        dashboard: {
            label: "Dashboard",
            icon: RiDashboardFill,
            href: "/dashboard",
            allowed: ['admin', 'staff', 'kasir', 'driver'],
        },
        users: {
            label: "Pengguna",
            icon: HiUserGroup,
            href: "/users",
            allowed: ['admin'], // Hanya admin
        },
        kasir: {
            label: "Kasir",
            icon: TbCashRegister,
            href: "/kasir",
            allowed: ['admin', 'kasir'], // Admin dan kasir
        },
        products: {
            label: "Produk",
            icon: HiCube,
            href: "/products",
            allowed: ['admin', 'staff', 'kasir'], // Admin, staff, dan kasir
        },
        logistik: {
            label: "Logistik",
            icon: HiTruck,
            allowed: ['admin', 'driver'], // Admin, staff, dan driver
            submenus: [
                {
                    label: "Pengiriman",
                    href: "/logistik/deliveries",
                    allowed: ['admin', 'driver'],
                },
                {
                    label: "Peta Pelanggan",
                    href: "/logistik/map",
                    allowed: ['admin', 'driver'],
                }
            ]
        },
        // Tambahkan menu lainnya sesuai kebutuhan
    };

    // Filter menu yang bisa diakses berdasarkan role
    const accessibleMenus = Object.entries(menuConfig).filter(([key, menu]) => 
        hasAccess(menu.allowed)
    );

    return (
        <aside className="w-64 bg-white shadow-lg flex-shrink-0 hidden md:flex flex-col h-screen sticky top-0 z-20">
            {/* Logo Header */}
            <div className="p-6 border-b border-gray-200 flex items-center">
                <svg className="w-10 h-10 text-primary mr-3" viewBox="0 0 50 50" fill="currentColor">
                    <path d="M25 5 L25 20 Q25 30 15 35 Q25 40 25 50 Q25 40 35 35 Q25 30 25 20 Z" opacity="0.8" />
                    <ellipse cx="25" cy="15" rx="8" ry="6" fill="currentColor" opacity="0.6" />
                </svg>
                <div>
                    <h1 className="text-lg font-bold text-dark">CV. Salga Mandiri</h1>
                    <p className="text-xs text-gray-500 capitalize">
                        {userRole === 'admin' ? 'Admin Panel' : 
                         userRole === 'staff' ? 'Staff Panel' :
                         userRole === 'kasir' ? 'Kasir Panel' :
                         userRole === 'driver' ? 'Driver Panel' : 'Panel'}
                    </p>
                </div>
            </div>

            {/* Menu List */}
            <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
                <MenuSection label="Main Menu" />

                {/* Dashboard - Semua role bisa akses */}
                {hasAccess(menuConfig.dashboard.allowed) && (
                    <MenuItem 
                        href={menuConfig.dashboard.href} 
                        label={menuConfig.dashboard.label} 
                        icon={menuConfig.dashboard.icon} 
                        active={url.startsWith('/dashboard')} 
                    />
                )}

                {/* Menu Manajemen Data - hanya muncul jika ada akses selain dashboard */}
                {accessibleMenus.filter(([key]) => key !== 'dashboard').length > 0 && (
                    <>
                        <MenuSection label="Manajemen Data" />

                        {/* Pengguna - Hanya admin */}
                        {hasAccess(menuConfig.users.allowed) && (
                            <MenuItem 
                                href={menuConfig.users.href} 
                                label={menuConfig.users.label} 
                                icon={menuConfig.users.icon} 
                                active={url.startsWith('/users')} 
                            />
                        )}

                        {/* Kasir - Admin dan kasir */}
                        {hasAccess(menuConfig.kasir.allowed) && (
                            <MenuItem 
                                href={menuConfig.kasir.href} 
                                label={menuConfig.kasir.label} 
                                icon={menuConfig.kasir.icon} 
                                active={url.startsWith('/kasir')} 
                            />
                        )}

                        {/* Produk - Admin, staff, dan kasir */}
                        {hasAccess(menuConfig.products.allowed) && (
                            <MenuItem 
                                href={menuConfig.products.href} 
                                label={menuConfig.products.label} 
                                icon={menuConfig.products.icon} 
                                active={url.startsWith('/products')} 
                            />
                        )}

                        {/* Logistik - Admin, staff, dan driver */}
                        {hasAccess(menuConfig.logistik.allowed) && (
                            <DropdownMenu 
                                label={menuConfig.logistik.label} 
                                icon={menuConfig.logistik.icon} 
                                active={url.startsWith('/logistik')}
                            >
                                {menuConfig.logistik.submenus.map((submenu, index) => (
                                    hasAccess(submenu.allowed) && (
                                        <div key={index}>
                                            <Link 
                                                href={submenu.href} 
                                                className={`block pl-14 pr-6 py-2 text-sm transition-colors ${url === submenu.href ? 'text-primary font-bold' : 'text-gray-500 hover:text-primary'}`}
                                            >
                                                {submenu.label}
                                            </Link>
                                        </div>
                                    )
                                ))}
                            </DropdownMenu>
                        )}
                    </>
                )}
            </nav>
        </aside>
    );
}