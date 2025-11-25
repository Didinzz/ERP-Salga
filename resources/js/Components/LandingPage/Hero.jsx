import React from 'react';

export default function Hero() {
    return (
        <section id="home" className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-dark leading-tight">
                            Air Murni Berkualitas untuk <span className="gradient-text">Kehidupan Sehat</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                           CV Salga Mandiri adalah produsen terpercaya air minum dalam kemasan (AMDK) dengan standar kualitas tinggi, memberikan kesegaran alami untuk keluarga Indonesia.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <button className="bg-primary text-white px-8 py-3.5 rounded-full hover:bg-secondary transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                                Lihat Produk Kami
                            </button>
                            <button className="border-2 border-primary text-primary px-8 py-3.5 rounded-full hover:bg-primary hover:text-white transition-all duration-300 font-semibold">
                                Pelajari Lebih Lanjut
                            </button>
                        </div>
                    </div>

                    {/* Illustration - Exact Copy from HTML with React Syntax Fixes */}
                    <div className="flex justify-center">
                        <div className="relative w-full max-w-lg">
                            <svg viewBox="0 0 500 500" className="w-full h-auto">
                                {/* Background circles */}
                                <circle cx="250" cy="250" r="180" fill="#0EA5E9" opacity="0.05" />
                                <circle cx="250" cy="250" r="140" fill="#3B82F6" opacity="0.08" />
                                <circle cx="250" cy="250" r="100" fill="#0EA5E9" opacity="0.1" />

                                {/* Water bottle Main Group with Animation Class */}
                                <g className="water-drop">
                                    <path d="M 220 120 L 220 140 Q 220 145 225 145 L 275 145 Q 280 145 280 140 L 280 120 Q 280 115 275 115 L 225 115 Q 220 115 220 120 Z" fill="#3B82F6" opacity="0.3" />
                                    <rect x="215" y="145" width="70" height="15" rx="3" fill="#0EA5E9" opacity="0.4" />
                                    <path d="M 225 160 L 225 360 Q 225 380 245 385 L 255 385 Q 275 380 275 360 L 275 160 Z" fill="#E0F2FE" stroke="#0EA5E9" strokeWidth="3" />
                                    <path d="M 225 250 L 225 360 Q 225 380 245 385 L 255 385 Q 275 380 275 360 L 275 250 Z" fill="#0EA5E9" opacity="0.3" />
                                    <ellipse cx="250" cy="250" rx="20" ry="15" fill="#FFFFFF" opacity="0.4" />
                                </g>

                                {/* Animated Small Drops */}
                                <circle cx="150" cy="200" r="12" fill="#0EA5E9" opacity="0.4">
                                    <animate attributeName="cy" values="200;220;200" dur="2s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="350" cy="180" r="15" fill="#3B82F6" opacity="0.4">
                                    <animate attributeName="cy" values="180;200;180" dur="2.5s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="380" cy="280" r="10" fill="#0EA5E9" opacity="0.4">
                                    <animate attributeName="cy" values="280;295;280" dur="2.2s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="120" cy="320" r="14" fill="#3B82F6" opacity="0.4">
                                    <animate attributeName="cy" values="320;340;320" dur="2.8s" repeatCount="indefinite" />
                                </circle>

                                {/* Waves at bottom */}
                                <path d="M 100 400 Q 150 390 200 400 T 300 400 T 400 400" stroke="#0EA5E9" strokeWidth="2" fill="none" opacity="0.3" />
                                <path d="M 100 420 Q 150 410 200 420 T 300 420 T 400 420" stroke="#3B82F6" strokeWidth="2" fill="none" opacity="0.2" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}