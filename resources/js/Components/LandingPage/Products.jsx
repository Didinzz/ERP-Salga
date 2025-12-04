import React from 'react';

export default function Products({ products = [] }) {
    // Fungsi untuk render icon SVG
    const renderSvgIcon = (type) => {
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
            default: 
                return (
                    <>
                        <rect x="35" y="15" width="30" height="8" rx="2" fill="#0EA5E9" />
                        <path d="M 40 23 L 40 140 Q 40 150 50 150 Q 60 150 60 140 L 60 23 Z" fill="#E0F2FE" stroke="#0EA5E9" strokeWidth="2" />
                        <path d="M 40 80 L 40 140 Q 40 150 50 150 Q 60 150 60 140 L 60 80 Z" fill="#0EA5E9" opacity="0.3" />
                    </>
                );
        }
    };

    // Jika tidak ada produk dari database
    if (!products || products.length === 0) {
        return (
            <section id="produk" className="py-16 md:py-24 bg-gradient-to-br from-blue-50 via-white to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Produk Kami</h2>
                        <div className="w-24 h-1 bg-primary mx-auto mb-4"></div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Tersedia dalam berbagai ukuran kemasan untuk memenuhi kebutuhan Anda</p>
                    </div>
                    
                    <div className="text-center py-12">
                        <div className="inline-block p-8 bg-white rounded-2xl shadow-lg border border-blue-100">
                            <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 rounded-full">
                                <svg className="w-20 h-20 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-700 mb-2">Belum Ada Produk Tersedia</h3>
                            <p className="text-gray-600 mb-4">Produk akan segera ditambahkan</p>
                            <div className="animate-pulse flex space-x-2 justify-center">
                                <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                                <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                                <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="produk" className="py-16 md:py-24 bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/3 translate-y-1/3"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-sky-400 rounded-full mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Produk Air Mineral Kami</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-sky-400 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">Pilihan terbaik untuk kebutuhan hidrasi Anda dengan kualitas terjamin</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((item) => (
                        <div key={item.id} className="group relative">
                            {/* Hover effect background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-sky-400 rounded-2xl transform group-hover:scale-105 transition-transform duration-300 opacity-0 group-hover:opacity-10 blur"></div>
                            
                            {/* Main card */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2 border border-blue-100 relative z-10 h-full flex flex-col">
                                {/* Product image/icon */}
                                <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-6 mb-6 flex items-center justify-center h-56 relative overflow-hidden">
                                    {/* Water wave effect */}
                                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-blue-100/50 to-transparent"></div>
                                    
                                    {item.image_url && item.image_url !== 'https://placehold.co/300x300/e2e8f0/1e40af?text=No+Image' ? (
                                        <div className="w-full h-full flex items-center justify-center relative">
                                            <img 
                                                src={item.image_url} 
                                                alt={item.name}
                                                className="max-w-full max-h-full object-contain rounded-lg transform group-hover:scale-110 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    const svgElement = document.createElement('svg');
                                                    svgElement.setAttribute('viewBox', item.viewBox || '0 0 100 160');
                                                    svgElement.setAttribute('class', item.widthClass || 'w-24 h-36');
                                                    svgElement.innerHTML = renderSvgIcon(item.type).props.children;
                                                    e.target.parentElement.appendChild(svgElement);
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <svg viewBox={item.viewBox || '0 0 100 160'} className={`${item.widthClass || 'w-24 h-36'} transform group-hover:scale-110 transition-transform duration-300`}>
                                            {renderSvgIcon(item.type)}
                                        </svg>
                                    )}
                                </div>

                                {/* Badge untuk status stok */}
                                {item.original_product?.stock_status && (
                                    <div className={`absolute top-4 right-4 px-3 py-2 rounded-full text-sm font-bold ${
                                        item.original_product.stock_status === 'Tersedia' 
                                            ? 'bg-green-100 text-green-800' 
                                            : item.original_product.stock_status === 'Sedikit'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {item.original_product.stock_status}
                                    </div>
                                )}
                                
                                {/* Product name and description */}
                                <div className="mb-2 flex-grow">
                                    <h3 className="text-xl font-bold text-dark mb-3 text-center group-hover:text-blue-600 transition-colors duration-300">
                                        {item.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm text-center leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                                
                                {/* Price and details */}
                                <div className="mt-auto">
                                    <div className="text-center mb-4">
                                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                                            {item.price}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">Harga per unit</p>
                                    </div>
                                    
                                    {/* Product details grid */}
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="grid grid-cols-2 gap-2">
                                            {/* Brand */}
                                            {item.original_product?.brand && (
                                                <div className="text-center">
                                                    <div className="text-xs text-gray-500 mb-1">Brand</div>
                                                    <div className="text-sm font-medium text-gray-800 truncate" title={item.original_product.brand}>
                                                        {item.original_product.brand}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Size */}
                                            {item.original_product?.size && (
                                                <div className="text-center">
                                                    <div className="text-xs text-gray-500 mb-1">Ukuran</div>
                                                    <div className="text-sm font-medium text-blue-600 truncate" title={item.original_product.size}>
                                                        {item.original_product.size}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Water Type */}
                                            {item.original_product?.water_type && (
                                                <div className="text-center">
                                                    <div className="text-xs text-gray-500 mb-1">Tipe Air</div>
                                                    <div className="text-sm font-medium text-purple-600 truncate" title={item.original_product.water_type}>
                                                        {item.original_product.water_type}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Bottle Type */}
                                            {item.original_product?.bottle_type && (
                                                <div className="text-center">
                                                    <div className="text-xs text-gray-500 mb-1">Kemasan</div>
                                                    <div className="text-sm font-medium text-green-600 truncate" title={item.original_product.bottle_type}>
                                                        {item.original_product.bottle_type}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Additional info section */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-sky-50 rounded-full px-6 py-3 border border-blue-100">
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">
                            <span className="font-semibold text-blue-600">Gratis pengiriman</span> untuk pemesanan di atas Rp 50.000
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}