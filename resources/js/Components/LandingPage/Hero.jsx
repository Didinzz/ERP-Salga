import React from 'react';

export default function Hero() {
    return (
        <section id="home" className="pt-28 pb-16 md:pt-36 md:pb-24 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-50">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-dark leading-tight">
                            Hidup Lebih Sehat dengan <span className="gradient-text">Air Murni Berkualitas</span>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed bg-white/50 p-6 rounded-2xl border border-blue-100 shadow-sm">
                            CV Salga Mandiri menghadirkan air minum dalam kemasan premium dengan teknologi UV dan reverse osmosis. 
                            Teruji laboratorium, aman untuk keluarga, dan menyegarkan setiap hari.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <button 
                                onClick={() => document.getElementById('produk').scrollIntoView({ behavior: 'smooth' })}
                                className="group relative bg-gradient-to-r from-blue-500 to-sky-400 text-white px-8 py-3.5 rounded-full hover:from-blue-600 hover:to-sky-500 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                <span className="relative flex items-center justify-center space-x-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                    <span>Lihat Produk Kami</span>
                                </span>
                            </button>
                            
                            <button 
                                onClick={() => document.getElementById('keunggulan').scrollIntoView({ behavior: 'smooth' })}
                                className="group relative border-2 border-blue-500 text-blue-600 px-8 py-3.5 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 font-semibold overflow-hidden">
                                <div className="absolute inset-0 bg-blue-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                                <span className="relative flex items-center justify-center space-x-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Pelajari Lebih Lanjut</span>
                                </span>
                            </button>
                        </div>
                        
                        {/* Stats */}
                        <div className="mt-12 grid grid-cols-3 gap-4 max-w-md">
                            <div className="text-center p-4 bg-white/80 rounded-xl border border-blue-100">
                                <div className="text-2xl font-bold text-blue-600">15+</div>
                                <div className="text-sm text-gray-600">Tahun</div>
                            </div>
                            <div className="text-center p-4 bg-white/80 rounded-xl border border-blue-100">
                                <div className="text-2xl font-bold text-blue-600">50K+</div>
                                <div className="text-sm text-gray-600">Pelanggan</div>
                            </div>
                            <div className="text-center p-4 bg-white/80 rounded-xl border border-blue-100">
                                <div className="text-2xl font-bold text-blue-600">100%</div>
                                <div className="text-sm text-gray-600">Teruji</div>
                            </div>
                        </div>
                    </div>

                    {/* Illustration */}
                    <div className="flex justify-center">
                        <div className="relative w-full max-w-lg">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-sky-300 rounded-full blur-3xl opacity-10 animate-pulse"></div>
                            
                            <svg viewBox="0 0 500 500" className="w-full h-auto relative z-10">
                                {/* Animated background circles */}
                                <circle cx="250" cy="250" r="180" fill="#0EA5E9" opacity="0.05">
                                    <animate attributeName="r" values="180;190;180" dur="4s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="250" cy="250" r="140" fill="#3B82F6" opacity="0.08">
                                    <animate attributeName="r" values="140;150;140" dur="5s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="250" cy="250" r="100" fill="#0EA5E9" opacity="0.1">
                                    <animate attributeName="r" values="100;110;100" dur="6s" repeatCount="indefinite" />
                                </circle>

                                {/* Main water bottle with floating animation */}
                                <g className="animate-float">
                                    <path d="M 220 120 L 220 140 Q 220 145 225 145 L 275 145 Q 280 145 280 140 L 280 120 Q 280 115 275 115 L 225 115 Q 220 115 220 120 Z" fill="#3B82F6" opacity="0.3" />
                                    <rect x="215" y="145" width="70" height="15" rx="3" fill="#0EA5E9" opacity="0.4" />
                                    <path d="M 225 160 L 225 360 Q 225 380 245 385 L 255 385 Q 275 380 275 360 L 275 160 Z" fill="#E0F2FE" stroke="#0EA5E9" strokeWidth="3" />
                                    
                                    {/* Animated water level */}
                                    <path d="M 225 250 L 225 360 Q 225 380 245 385 L 255 385 Q 275 380 275 360 L 275 250 Z" fill="url(#waterGradient)" opacity="0.8">
                                        <animate attributeName="d" 
                                            values="M 225 250 L 225 360 Q 225 380 245 385 L 255 385 Q 275 380 275 360 L 275 250 Z;
                                                    M 225 240 L 225 360 Q 225 380 245 385 L 255 385 Q 275 380 275 360 L 275 240 Z;
                                                    M 225 250 L 225 360 Q 225 380 245 385 L 255 385 Q 275 380 275 360 L 275 250 Z"
                                            dur="3s" repeatCount="indefinite" />
                                    </path>
                                    
                                    <ellipse cx="250" cy="250" rx="20" ry="15" fill="#FFFFFF" opacity="0.4" />
                                    <ellipse cx="250" cy="250" rx="15" ry="10" fill="#FFFFFF" opacity="0.6">
                                        <animate attributeName="ry" values="10;8;10" dur="2s" repeatCount="indefinite" />
                                    </ellipse>
                                </g>

                                {/* Gradient definition */}
                                <defs>
                                    <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.6" />
                                    </linearGradient>
                                </defs>

                                {/* Animated small water drops */}
                                {[
                                    { cx: 150, cy: 200, r: 12, dur: 2 },
                                    { cx: 350, cy: 180, r: 15, dur: 2.5 },
                                    { cx: 380, cy: 280, r: 10, dur: 2.2 },
                                    { cx: 120, cy: 320, r: 14, dur: 2.8 },
                                    { cx: 200, cy: 100, r: 8, dur: 3 },
                                    { cx: 300, cy: 90, r: 11, dur: 2.7 },
                                ].map((drop, i) => (
                                    <circle key={i} cx={drop.cx} cy={drop.cy} r={drop.r} fill="#0EA5E9" opacity="0.4">
                                        <animate attributeName="cy" values={`${drop.cy};${drop.cy + 20};${drop.cy}`} dur={`${drop.dur}s`} repeatCount="indefinite" />
                                        <animate attributeName="opacity" values="0.4;0.6;0.4" dur={`${drop.dur}s`} repeatCount="indefinite" />
                                    </circle>
                                ))}

                                {/* Animated waves */}
                                <path d="M 100 400 Q 150 390 200 400 T 300 400 T 400 400" stroke="url(#waveGradient)" strokeWidth="2" fill="none">
                                    <animate attributeName="d" 
                                        values="M 100 400 Q 150 390 200 400 T 300 400 T 400 400;
                                                M 100 402 Q 150 392 200 402 T 300 402 T 400 402;
                                                M 100 400 Q 150 390 200 400 T 300 400 T 400 400"
                                        dur="2s" repeatCount="indefinite" />
                                </path>
                                <path d="M 100 420 Q 150 410 200 420 T 300 420 T 400 420" stroke="url(#waveGradient2)" strokeWidth="2" fill="none">
                                    <animate attributeName="d" 
                                        values="M 100 420 Q 150 410 200 420 T 300 420 T 400 420;
                                                M 100 422 Q 150 412 200 422 T 300 422 T 400 422;
                                                M 100 420 Q 150 410 200 420 T 300 420 T 400 420"
                                        dur="3s" repeatCount="indefinite" />
                                </path>

                                <defs>
                                    <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.3" />
                                        <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.5" />
                                        <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.3" />
                                    </linearGradient>
                                    <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                                        <stop offset="50%" stopColor="#0EA5E9" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}