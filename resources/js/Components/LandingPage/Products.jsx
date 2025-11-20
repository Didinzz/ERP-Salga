import React from 'react';

export default function Products() {
    const products = [
        {
            id: 1,
            name: 'Kemasan 240ml',
            desc: 'Praktis untuk dibawa bepergian',
            price: 'Rp 1.500',
            type: 'cup',
            viewBox: '0 0 100 160',
            widthClass: 'w-20 h-32'
        },
        {
            id: 2,
            name: 'Kemasan 600ml',
            desc: 'Ukuran ideal untuk aktivitas harian',
            price: 'Rp 3.000',
            type: 'bottle_medium',
            viewBox: '0 0 100 160',
            widthClass: 'w-24 h-36'
        },
        {
            id: 3,
            name: 'Kemasan 1500ml',
            desc: 'Hemat untuk keluarga',
            price: 'Rp 5.500',
            type: 'bottle_large',
            viewBox: '0 0 120 180',
            widthClass: 'w-28 h-40'
        },
        {
            id: 4,
            name: 'Galon 19 Liter',
            desc: 'Solusi ekonomis untuk rumah & kantor',
            price: 'Rp 18.000',
            type: 'gallon',
            viewBox: '0 0 140 180',
            widthClass: 'w-32 h-40'
        },
    ];

    const renderProductIcon = (type) => {
        switch (type) {
            case 'cup':
                return (
                    <>
                        <rect x="35" y="15" width="30" height="8" rx="2" fill="#0EA5E9" />
                        <path d="M 40 23 L 40 140 Q 40 150 50 150 Q 60 150 60 140 L 60 23 Z" fill="#E0F2FE" stroke="#0EA5E9" strokeWidth="2" />
                        <path d="M 40 80 L 40 140 Q 40 150 50 150 Q 60 150 60 140 L 60 80 Z" fill="#0EA5E9" opacity="0.3" />
                    </>
                );
            case 'bottle_medium':
                return (
                    <>
                        <rect x="32" y="12" width="36" height="10" rx="2" fill="#0EA5E9" />
                        <path d="M 37 22 L 37 145 Q 37 155 50 155 Q 63 155 63 145 L 63 22 Z" fill="#E0F2FE" stroke="#0EA5E9" strokeWidth="2" />
                        <path d="M 37 75 L 37 145 Q 37 155 50 155 Q 63 155 63 145 L 63 75 Z" fill="#0EA5E9" opacity="0.3" />
                    </>
                );
            case 'bottle_large':
                return (
                    <>
                        <rect x="35" y="10" width="50" height="12" rx="3" fill="#0EA5E9" />
                        <path d="M 40 22 L 40 160 Q 40 170 60 170 Q 80 170 80 160 L 80 22 Z" fill="#E0F2FE" stroke="#0EA5E9" strokeWidth="2" />
                        <path d="M 40 70 L 40 160 Q 40 170 60 170 Q 80 170 80 160 L 80 70 Z" fill="#0EA5E9" opacity="0.3" />
                    </>
                );
            case 'gallon':
                return (
                    <>
                        <ellipse cx="70" cy="25" rx="35" ry="15" fill="#0EA5E9" />
                        <rect x="35" y="25" width="70" height="130" rx="5" fill="#E0F2FE" stroke="#0EA5E9" strokeWidth="2" />
                        <rect x="35" y="90" width="70" height="65" rx="5" fill="#0EA5E9" opacity="0.3" />
                        <ellipse cx="70" cy="155" rx="35" ry="15" fill="#0EA5E9" opacity="0.3" />
                    </>
                );
            default: return null;
        }
    };

    return (
        <section id="produk" className="py-16 md:py-24 bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Produk Kami</h2>
                    <div className="w-24 h-1 bg-primary mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">Tersedia dalam berbagai ukuran kemasan untuk memenuhi kebutuhan Anda</p>
                </div>

                <div className="grid md:grid-cols-4 gap-8">
                    {products.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-blue-100">
                            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-6 mb-4 flex items-center justify-center h-48">
                                <svg viewBox={item.viewBox} className={item.widthClass}>
                                    {renderProductIcon(item.type)}
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-dark mb-2 text-center">{item.name}</h3>
                            <p className="text-gray-600 text-center text-sm mb-4">{item.desc}</p>
                            <div className="text-center">
                                <span className="text-2xl font-bold text-primary">{item.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}