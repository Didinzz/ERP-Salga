import React from 'react';

export default function CallToAction() {
    return (
        <section className="py-16 md:py-20 gradient-bg">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Siap Menjadi Mitra Distribusi Kami?
                </h2>
                <p className="text-lg md:text-xl text-white text-opacity-95 mb-8 leading-relaxed">
                    Bergabunglah dengan jaringan distribusi PT Salga Mandiri dan dapatkan produk berkualitas dengan harga menarik.
                </p>
                <button className="bg-white text-primary px-10 py-4 rounded-full hover:bg-blue-50 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105">
                    Hubungi Kami Sekarang
                </button>
            </div>
        </section>
    );
}