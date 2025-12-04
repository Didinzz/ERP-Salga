export default function Footer() {
    return (
        <footer id="kontak" className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Hubungi Kami</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-sky-400 mx-auto mb-6"></div>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Kami siap melayani kebutuhan air mineral berkualitas untuk Anda
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    {/* Company Info */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-400 rounded-xl flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">CV. Salga Mandiri</h3>
                                <p className="text-sm text-gray-300">Air Mineral Berkualitas</p>
                            </div>
                        </div>
                        
                        <p className="text-gray-300 leading-relaxed mb-6">
                            Produsen air minum dalam kemasan terpercaya dengan komitmen kualitas dan pelayanan terbaik untuk seluruh Indonesia. 
                            Dengan teknologi modern dan standar tertinggi.
                        </p>
                        
                        {/* Social Media */}
                        <div className="flex space-x-4">
                            {[
                                { icon: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z", label: "Twitter" },
                                { icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z", label: "Instagram" },
                                { icon: "M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z", label: "Facebook" },
                                { icon: "M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-3.862c0-1.881-2.002-1.722-2.002 0v3.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z", label: "LinkedIn" },
                                { icon: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12", label: "GitHub" }
                            ].map((social, index) => (
                                <a 
                                    key={index} 
                                    href="#" 
                                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors duration-300 group"
                                    aria-label={social.label}
                                >
                                    <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" viewBox="0 0 24 24">
                                        <path d={social.icon} fill="currentColor" />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                        <h4 className="text-xl font-bold mb-6 flex items-center">
                            <svg className="w-6 h-6 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Kontak Informasi
                        </h4>
                        
                        <ul className="space-y-4">
                            {[
                                {
                                    icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z",
                                    title: "Alamat",
                                    content: "Jl. Raya Industri No. 123, Kelurahan Industri, Kecamatan Modern, Jakarta Timur 13930",
                                    color: "text-blue-400"
                                },
                                {
                                    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                                    title: "Email",
                                    content: "info@salgamandiri.co.id\ncs@salgamandiri.co.id",
                                    color: "text-green-400"
                                },
                                {
                                    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
                                    title: "Telepon",
                                    content: "+62 21 1234 5678 (Office)\n+62 812 3456 7890 (WhatsApp)",
                                    color: "text-purple-400"
                                },
                            ].map((contact, index) => (
                                <li key={index} className="flex items-start space-x-3 group hover:bg-white/5 p-3 rounded-lg transition-colors duration-300">
                                    <div className={`flex-shrink-0 w-10 h-10 ${contact.color.replace('text-', 'bg-')}/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <svg className={`w-5 h-5 ${contact.color}`} fill="currentColor" viewBox="0 0 24 24">
                                            <path d={contact.icon} />
                                        </svg>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-white">{contact.title}</h5>
                                        <p className="text-sm text-gray-300 whitespace-pre-line">{contact.content}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Map Section */}
                    <div className="lg:col-span-1 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <h4 className="text-xl font-bold mb-6 flex items-center">
                            <svg className="w-6 h-6 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Lokasi Kami
                        </h4>
                        
                        {/* Map Container */}
                        <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-white/20">
                            {/* Map Loading State */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-sky-800 flex items-center justify-center z-0">
                                <div className="text-center">
                                    <div className="w-16 h-16 border-4 border-white/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-white/70 text-sm">Memuat peta...</p>
                                </div>
                            </div>
                            
                            {/* Google Maps Embed */}
                            <div className="relative z-10">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3646.7616697653903!2d123.1344922745282!3d0.5718459994225669!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x327ed38f3bad4c99%3A0x2833cc2a915e8c07!2sCV.%20Salga%20Mandiri!5e1!3m2!1sid!2sid!4v1764839663923!5m2!1sid!2sid" 
                                    width="100%" 
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="rounded-lg"
                                    title="CV Salga Mandiri Location Map"
                                />
                            </div>
                            
                            {/* Map Controls Overlay */}
                            <div className="absolute bottom-4 right-4 z-20 flex space-x-2">
                                <button 
                                    className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-300"
                                    onClick={() => window.open('https://maps.google.com/?q=CV.Salga+Mandiri', '_blank')}
                                    aria-label="Buka di Google Maps"
                                >
                                    <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </button>
                                <button 
                                    className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300"
                                    onClick={() => window.open('https://www.google.com/maps/dir//CV.+Salga+Mandiri', '_blank')}
                                    aria-label="Dapatkan petunjuk arah"
                                >
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright & Links */}
                <div className="border-t border-gray-700 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-center md:text-left mb-6 md:mb-0">
                            <p className="text-gray-400">
                                © {new Date().getFullYear()} <span className="font-semibold text-white">CV Salga Mandiri</span>. All rights reserved.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
                            {[
                                { name: "Kebijakan Privasi", href: "#" },
                                { name: "Syarat & Ketentuan", href: "#" },
                                { name: "FAQ", href: "#" },
                                { name: "Karir", href: "#" }
                            ].map((link, index) => (
                                <a 
                                    key={index} 
                                    href={link.href} 
                                    className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </div>
                    
                    {/* Certifications */}
                    <div className="mt-8 flex flex-wrap justify-center items-center gap-6">
                        {[
                            { name: "BPOM", color: "bg-green-500" },
                            { name: "SNI", color: "bg-blue-500" },
                            { name: "ISO 22000", color: "bg-purple-500" },
                            { name: "Halal", color: "bg-emerald-500" }
                        ].map((cert, index) => (
                            <div key={index} className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full">
                                <div className={`w-2 h-2 ${cert.color} rounded-full`}></div>
                                <span className="text-sm text-gray-300">{cert.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Back to top button */}
            <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 z-50"
                aria-label="Kembali ke atas"
            >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                </svg>
            </button>
        </footer>
    );
}