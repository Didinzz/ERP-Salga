import React from 'react';

export default function About() {
    return (
        <section id="tentang" className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Tentang PT Salga Mandiri</h2>
                        <div className="w-24 h-1 bg-primary mb-6"></div>
                        <p className="text-lg text-gray-600 leading-relaxed mb-6">
                            PT Salga Mandiri adalah perusahaan manufaktur air minum dalam kemasan (AMDK) yang telah dipercaya oleh masyarakat Indonesia. Dengan fasilitas produksi modern dan tim profesional yang berpengalaman, kami berkomitmen untuk menghadirkan produk berkualitas tinggi yang memenuhi standar kesehatan dan keamanan pangan.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                            Visi kami adalah menjadi produsen AMDK terkemuka yang memberikan kontribusi nyata bagi kesehatan masyarakat Indonesia melalui produk berkualitas dan pelayanan terbaik.
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                <div className="text-4xl font-bold text-primary mb-2">15+</div>
                                <div className="text-gray-600 font-medium">Tahun Pengalaman</div>
                            </div>
                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                                <div className="text-gray-600 font-medium">Pelanggan Setia</div>
                            </div>
                        </div>
                    </div>

                    {/* Illustration Factory */}
                    <div className="flex justify-center">
                        <svg viewBox="0 0 500 500" className="w-full max-w-md h-auto">
                            {/* Building */}
                            <rect x="100" y="250" width="300" height="200" rx="5" fill="#E0F2FE" stroke="#0EA5E9" strokeWidth="3" />
                            <rect x="120" y="270" width="60" height="80" fill="#3B82F6" opacity="0.3" />
                            <rect x="200" y="270" width="60" height="80" fill="#3B82F6" opacity="0.3" />
                            <rect x="280" y="270" width="60" height="80" fill="#3B82F6" opacity="0.3" />
                            <rect x="220" y="380" width="60" height="70" fill="#0EA5E9" opacity="0.5" />
                            {/* Roof */}
                            <path d="M 80 250 L 250 150 L 420 250 Z" fill="#0EA5E9" opacity="0.7" />

                            {/* Chimney with Smoke Animation */}
                            <rect x="320" y="180" width="30" height="70" fill="#3B82F6" />
                            <circle cx="335" cy="160" r="20" fill="#E0F2FE" opacity="0.6">
                                <animate attributeName="r" values="20;25;20" dur="2s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="330" cy="140" r="18" fill="#E0F2FE" opacity="0.5">
                                <animate attributeName="r" values="18;23;18" dur="2.5s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2.5s" repeatCount="indefinite" />
                            </circle>

                            {/* Trees */}
                            <rect x="50" y="380" width="20" height="60" fill="#3B82F6" opacity="0.3" />
                            <circle cx="60" cy="370" r="35" fill="#0EA5E9" opacity="0.4" />
                            <rect x="430" y="380" width="20" height="60" fill="#3B82F6" opacity="0.3" />
                            <circle cx="440" cy="370" r="35" fill="#0EA5E9" opacity="0.4" />

                            {/* Water Decoration */}
                            <circle cx="150" cy="100" r="10" fill="#0EA5E9" opacity="0.5" />
                            <circle cx="350" cy="120" r="12" fill="#3B82F6" opacity="0.5" />
                            <circle cx="200" cy="90" r="8" fill="#0EA5E9" opacity="0.5" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
}