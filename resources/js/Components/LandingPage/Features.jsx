import React from 'react';

export default function Features() {
    const features = [
        {
            title: "Kualitas Terjamin",
            description: "Proses produksi dengan teknologi modern dan standar BPOM, SNI, serta ISO 22000 untuk memastikan kualitas air yang aman dan sehat untuk keluarga Anda.",
            icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
            color: "from-green-500 to-emerald-400",
            stats: "SNI & ISO Certified"
        },
        {
            title: "Sumber Air Alami",
            description: "Berasal dari sumber air pegunungan vulkanik terpilih yang terjaga kemurniannya, memberikan rasa yang segar dan mineral alami yang baik untuk tubuh.",
            icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            color: "from-blue-500 to-cyan-400",
            stats: "Sumber Pegunungan"
        },
        {
            title: "Harga Terjangkau",
            description: "Komitmen memberikan produk berkualitas tinggi dengan harga yang kompetitif dan terjangkau untuk seluruh lapisan masyarakat Indonesia.",
            icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            color: "from-orange-500 to-amber-400",
            stats: "Harga Kompetitif"
        },
        {
            title: "Teknologi Modern",
            description: "Menggunakan teknologi UV dan Reverse Osmosis terbaru untuk memastikan air bebas dari kontaminan dan bakteri berbahaya.",
            icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
            color: "from-purple-500 to-pink-400",
            stats: "UV & RO System"
        }
    ];

    return (
        <section id="keunggulan" className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-white to-blue-50">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-r from-blue-100/20 to-sky-100/20"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Mengapa Memilih Salga Mandiri?</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-sky-400 mx-auto mb-6"></div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Komitmen kami menghadirkan pengalaman minum air terbaik dengan standar internasional
                    </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="group relative">
                            {/* Hover effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-white rounded-2xl transform group-hover:scale-105 transition-transform duration-500 opacity-0 group-hover:opacity-100 blur"></div>
                            
                            {/* Main card */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2 border border-blue-100 relative z-10 h-full flex flex-col">
                                {/* Icon with gradient */}
                                <div className="relative mb-6">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto`}>
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} />
                                        </svg>
                                    </div>
                                    <div className={`absolute -inset-2 bg-gradient-to-br ${feature.color} rounded-xl blur opacity-25 group-hover:opacity-50 transition-opacity duration-300`}></div>
                                </div>
                                
                                <h3 className="text-xl font-bold text-dark mb-3 group-hover:text-blue-600 transition-colors duration-300 text-center">
                                    {feature.title}
                                </h3>
                                
                                <div className="flex-grow mb-6">
                                    <p className="text-gray-600 leading-relaxed text-center">
                                        {feature.description}
                                    </p>
                                </div>
                                
                                {/* Stats badge dengan garis atas yang tetap */}
                                <div className="relative mt-auto pt-6">
                                    {/* Garis atas */}
                                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
                                    
                                    <div className="flex justify-center">
                                        <span className={`inline-block px-3 py-1 text-xs font-semibold bg-gradient-to-r ${feature.color} bg-opacity-10 text-gray-700 rounded-full border border-blue-200`}>
                                            {feature.stats}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Bottom line effect */}
                                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r ${feature.color} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}