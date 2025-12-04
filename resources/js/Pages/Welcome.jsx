import { Head } from '@inertiajs/react';
import Navbar from '@/Components/LandingPage/Navbar';
import Hero from '@/Components/LandingPage/Hero';
import Features from '@/Components/LandingPage/Features';
import Products from '@/Components/LandingPage/Products';
import About from '@/Components/LandingPage/About';
import CallToAction from '@/Components/LandingPage/CallToAction';
import Footer from '@/Components/LandingPage/Footer';

// Terima props dari controller
export default function Welcome({ 
    canLogin, 
    canRegister, 
    laravelVersion, 
    phpVersion, 
    products 
}) {
    console.log('Products from controller:', products); // Debug: cek data yang diterima

    return (
        <>
            <Head title="CV Salga Mandiri - Air Minum Berkualitas" />

            <div className="font-sans antialiased bg-white text-gray-900">
                <Navbar />

                <main>
                    <Hero />
                    <Features />
                    <Products products={products} /> {/* Kirim props ke Products */}
                    <About />
                    <CallToAction />
                </main>

                <Footer />
            </div>
        </>
    );
}