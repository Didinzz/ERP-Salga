import React from 'react';

export default function About() {
    const achievements = [
        { value: "15+", label: "Tahun Pengalaman", description: "Melayani sejak 2008" },
        { value: "50K+", label: "Pelanggan Setia", description: "Di seluruh Indonesia" },
        { value: "100%", label: "Teruji BPOM", description: "Standar Nasional" },
        { value: "24/7", label: "Layanan", description: "Support Tim" }
    ];

    const values = [
        {
            title: "Kualitas",
            description: "Komitmen terhadap kualitas terbaik dalam setiap tetes air yang kami produksi",
            icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        },
        {
            title: "Inovasi",
            description: "Terus berinovasi dalam teknologi pengolahan air untuk hasil terbaik",
            icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        },
        {
            title: "Kepercayaan",
            description: "Membangun kepercayaan melalui transparansi dan pelayanan terbaik",
            icon: "M5.121 17.804C7.664 19.711 10 21 12 21c5 0 9-3 9-9s-3-9-9-9-9 3-9 9c0 1.76.743 3.37 1.94 4.557M18 18l3-3-3-3M3 3l3 3-3 3"
        },
        {
            title: "Lingkungan",
            description: "Peduli terhadap lingkungan dengan proses produksi ramah lingkungan",
            icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        }
    ];

    return (
        <section id="tentang" className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-blue-100/30 to-sky-100/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-blue-100/30 to-sky-100/30 rounded-full blur-3xl"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Tentang CV Salga Mandiri</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-sky-400 mx-auto mb-6"></div>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-12 items-start mb-6">
                    {/* Content - KIRI */}
                    <div>
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 mb-8">
                            <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                <span className="font-bold text-blue-600">CV Salga Mandiri</span> adalah perusahaan manufaktur air minum dalam kemasan (AMDK) yang telah dipercaya oleh masyarakat Indonesia sejak 2008. Dengan fasilitas produksi modern dan tim profesional yang berpengalaman, kami berkomitmen untuk menghadirkan produk berkualitas tinggi yang memenuhi standar kesehatan dan keamanan pangan.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Visi kami adalah menjadi produsen AMDK terkemuka yang memberikan kontribusi nyata bagi kesehatan masyarakat Indonesia melalui produk berkualitas dan pelayanan terbaik, dengan misi menjaga keberlanjutan lingkungan dan kesejahteraan komunitas.
                            </p>
                        </div>
                    </div>

                    {/* Values - KANAN */}
                    <div>
                        <div className="space-y-4">
                            {values.map((value, index) => (
                                <div key={index} className="flex items-start space-x-4 py-5 px-4 bg-white/80 rounded-xl border border-blue-100 hover:bg-white transition-colors duration-300">
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-400 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={value.icon} />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-dark mb-1">{value.title}</h4>
                                        <p className="text-gray-600 text-sm">{value.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Achievements */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {achievements.map((achievement, index) => (
                        <div key={index} className="group relative">
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center relative z-10">
                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent mb-2">
                                    {achievement.value}
                                </div>
                                <div className="font-semibold text-dark mb-1">{achievement.label}</div>
                                <div className="text-sm text-gray-500">{achievement.description}</div>
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-500 to-sky-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-sky-100 rounded-2xl transform group-hover:scale-105 transition-transform duration-500 opacity-0 group-hover:opacity-50 blur"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}