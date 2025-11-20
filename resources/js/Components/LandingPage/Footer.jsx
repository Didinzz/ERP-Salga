export default function Footer() {
    return (
        <footer id="kontak" className="bg-dark text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Company Info */}
                    <div className="md:col-span-2">
                        <div className="flex items-center mb-4">
                            <span className="text-2xl font-bold">PT Salga Mandiri</span>
                        </div>
                        <p className="text-gray-400 mb-4 leading-relaxed">
                            Produsen air minum dalam kemasan terpercaya dengan komitmen kualitas dan pelayanan terbaik untuk seluruh Indonesia.
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-2">
                        <h4 className="text-lg font-semibold mb-4">Kontak</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li className="flex items-start">
                                <span>Jl. Industri No. 123, Jakarta, Indonesia</span>
                            </li>
                            <li className="flex items-center">
                                <span>info@salgamandiri.co.id</span>
                            </li>
                            <li className="flex items-center">
                                <span>+62 21 1234 5678</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-700 pt-8 text-center">
                    <p className="text-gray-400 text-sm">© 2025 PT Salga Mandiri. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}