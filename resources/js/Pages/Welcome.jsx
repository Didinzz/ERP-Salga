import { Head } from '@inertiajs/react';
import Navbar from '@/Components/LandingPage/Navbar';
import Hero from '@/Components/LandingPage/Hero';
import Features from '@/Components/LandingPage/Features';
import Products from '@/Components/LandingPage/Products';
import About from '@/Components/LandingPage/About';
import CallToAction from '@/Components/LandingPage/CallToAction';
import Footer from '@/Components/LandingPage/Footer';

export default function Welcome() {
    return (
        <>
            <Head title="PT Salga Mandiri - Air Minum Berkualitas" />

            <div className="font-sans antialiased bg-white text-gray-900">
                <Navbar />

                <main>
                    <Hero />
                    <Features />
                    <Products />
                    <About />
                    <CallToAction />
                </main>

                <Footer />
            </div>
        </>
    );
}