import { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'Produk', href: '#produk' },
        { name: 'Keunggulan', href: '#keunggulan' },
        { name: 'Tentang Kami', href: '#tentang' },
    ];

    return (
        <nav className="bg-white shadow-sm fixed w-full top-0 z-50 border-b border-blue-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <svg className="w-10 h-10 text-primary mr-3" viewBox="0 0 50 50" fill="currentColor">
                            <path d="M25 5 L25 20 Q25 30 15 35 Q25 40 25 50 Q25 40 35 35 Q25 30 25 20 Z" opacity="0.8" />
                            <ellipse cx="25" cy="15" rx="8" ry="6" fill="currentColor" opacity="0.6" />
                        </svg>
                        <span className="text-2xl font-bold text-primary">PT Salga Mandiri</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a key={link.name} href={link.href} className="text-dark hover:text-primary transition-colors duration-300 font-medium">
                                {link.name}
                            </a>
                        ))}
                        <Link href={route('login')}>
                            <button className="bg-primary text-white px-6 py-2.5 rounded-full hover:bg-secondary transition-all duration-300 font-semibold shadow-lg hover:shadow-xl cursor-pointer ">
                                Login
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-dark hover:text-primary focus:outline-none">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-blue-100">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2 text-dark hover:text-primary hover:bg-blue-50 rounded-md transition-colors duration-300"
                            >
                                {link.name}
                            </a>
                        ))}
                        <Link href={route('login')}>
                            <button className="block w-full text-left px-3 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-all duration-300 font-semibold">
                                Login
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}