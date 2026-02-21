import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HiUserGroup, HiCube, HiTruck,
    HiChevronDown, HiXMark // Tambah icon close
} from "react-icons/hi2";
import { RiDashboardFill } from "react-icons/ri";
import { TbCashRegister } from "react-icons/tb";

// Helper: Menu Item
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

// Helper: Dropdown
const DropdownMenu = ({ icon: Icon, label, active, children }) => {
    const [isOpen, setIsOpen] = useState(active);
    return (
        <div className="mb-1">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-6 py-3 transition-all duration-300 group ${active || isOpen ? 'text-primary' : 'text-gray-600 hover:bg-blue-50'}`}
            >
                <div className="flex items-center">
                    <Icon className={`w-5 h-5 mr-3 transition-colors ${active || isOpen ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
                    <span className="font-medium">{label}</span>
                </div>
                <HiChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
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

// TERIMA PROPS isOpen & onClose DARI LAYOUT
export default function Sidebar({ isOpen, onClose }) {
    const { url, props } = usePage();
    const userRole = props.auth?.user?.role || 'guest';

    const hasAccess = (allowedRoles) => allowedRoles.includes(userRole);

    const menuConfig = {
        dashboard: { label: "Dashboard", icon: RiDashboardFill, href: "/dashboard", allowed: ['admin', 'staff', 'kasir', 'driver'] },
        users: { label: "Pengguna", icon: HiUserGroup, href: "/users", allowed: ['admin'] },
        kasir: { label: "Kasir", icon: TbCashRegister, href: "/kasir", allowed: ['admin', 'kasir'] },
        products: { label: "Produk", icon: HiCube, href: "/products", allowed: ['admin', 'staff', 'kasir'] },
        logistik: {
            label: "Logistik",
            icon: HiTruck,
            allowed: ['admin', 'driver'],
            submenus: [
                { label: "Pengiriman", href: "/logistik/deliveries", allowed: ['admin', 'driver'] },
                { label: "Peta Pelanggan", href: "/logistik/map", allowed: ['admin', 'driver'] }
            ]
        },
    };

    const accessibleMenus = Object.entries(menuConfig).filter(([key, menu]) => hasAccess(menu.allowed));

    return (
        <>
            {/* --- OVERLAY (UNTUK MOBILE) --- */}
            <div
                className={`fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={onClose}
            ></div>

            {/* --- SIDEBAR CONTAINER --- */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-30 
                    w-64 bg-white shadow-xl flex-shrink-0 flex flex-col h-screen 
                    transition-transform duration-300 ease-in-out transform 
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Logo Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center">
                        <svg className="w-8 h-8 text-primary mr-3" viewBox="0 0 50 50" fill="currentColor">
                            <path d="M25 5 L25 20 Q25 30 15 35 Q25 40 25 50 Q25 40 35 35 Q25 30 25 20 Z" opacity="0.8" />
                            <ellipse cx="25" cy="15" rx="8" ry="6" fill="currentColor" opacity="0.6" />
                        </svg>
                        <div>
                            <h1 className="text-lg font-bold text-dark">Salga Mandiri</h1>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">
                                {userRole} Panel
                            </p>
                        </div>
                    </div>

                    {/* Tombol Close (Hanya di Mobile) */}
                    <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-red-500">
                        <HiXMark size={24} />
                    </button>
                </div>

                {/* Menu List */}
                <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
                    <MenuSection label="Main Menu" />

                    {hasAccess(menuConfig.dashboard.allowed) && (
                        <MenuItem href={menuConfig.dashboard.href} label={menuConfig.dashboard.label} icon={menuConfig.dashboard.icon} active={url.startsWith('/dashboard')} />
                    )}

                    {accessibleMenus.filter(([key]) => key !== 'dashboard').length > 0 && (
                        <>
                            <MenuSection label="Manajemen Data" />
                            {hasAccess(menuConfig.users.allowed) && (
                                <MenuItem href={menuConfig.users.href} label={menuConfig.users.label} icon={menuConfig.users.icon} active={url.startsWith('/users')} />
                            )}
                            {hasAccess(menuConfig.kasir.allowed) && (
                                <MenuItem href={menuConfig.kasir.href} label={menuConfig.kasir.label} icon={menuConfig.kasir.icon} active={url.startsWith('/kasir')} />
                            )}
                            {hasAccess(menuConfig.products.allowed) && (
                                <MenuItem href={menuConfig.products.href} label={menuConfig.products.label} icon={menuConfig.products.icon} active={url.startsWith('/products')} />
                            )}
                            {hasAccess(menuConfig.logistik.allowed) && (
                                <DropdownMenu label={menuConfig.logistik.label} icon={menuConfig.logistik.icon} active={url.startsWith('/logistik')}>
                                    {menuConfig.logistik.submenus.map((submenu, index) => (
                                        hasAccess(submenu.allowed) && (
                                            <Link key={index} href={submenu.href} className={`block pl-14 pr-6 py-2 text-sm transition-colors ${url === submenu.href ? 'text-primary font-bold' : 'text-gray-500 hover:text-primary'}`}>
                                                {submenu.label}
                                            </Link>
                                        )
                                    ))}
                                </DropdownMenu>
                            )}
                        </>
                    )}
                </nav>
            </aside>
        </>
    );
}