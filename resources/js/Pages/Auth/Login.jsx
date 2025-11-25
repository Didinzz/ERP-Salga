import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { HiEye, HiEyeSlash, HiEnvelope, HiLockClosed, HiCheckCircle } from "react-icons/hi2";
import { CgSpinner } from "react-icons/cg";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onSuccess: () => setIsSuccess(true),
        });
    };

    return (
        <div className="h-full w-full flex bg-gray-50">
            <Head title="Masuk Aplikasi" />

            <div className="hidden lg:flex lg:w-1/2 gradient-bg relative overflow-hidden items-center justify-center p-12">

                {/* Decorative circles */}
                <div className="absolute top-20 left-20 w-64 h-64 bg-white opacity-5 rounded-full"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-white opacity-5 rounded-full"></div>
                <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white opacity-5 rounded-full"></div>

                {/* Content */}
                <div className="relative z-10 text-center"> {/* fade-in class jika ada di css global */}

                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                            <svg className="w-24 h-24 text-white" viewBox="0 0 50 50" fill="currentColor">
                                <path d="M25 5 L25 20 Q25 30 15 35 Q25 40 25 50 Q25 40 35 35 Q25 30 25 20 Z" opacity="0.9" />
                                <ellipse cx="25" cy="15" rx="8" ry="6" fill="currentColor" opacity="0.7" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">CV Salga Mandiri</h1>
                    <p className="text-xl text-white text-opacity-90 mb-8">Sistem Manajemen Admin</p>
                    <p className="text-lg text-white text-opacity-80 max-w-md mx-auto leading-relaxed">
                        Platform terpadu untuk mengelola operasional air minum dalam kemasan dengan mudah dan efisien
                    </p>

                    {/* Animated Illustration (SVG) */}
                    <div className="mt-12">
                        <svg viewBox="0 0 400 300" className="w-full max-w-md mx-auto">
                            {/* Water bottles */}
                            <g className="water-drop">
                                <rect x="140" y="100" width="40" height="8" rx="2" fill="white" opacity="0.8" />
                                <path d="M 145 108 L 145 220 Q 145 230 160 230 Q 175 230 175 220 L 175 108 Z" fill="white" opacity="0.9" stroke="white" strokeWidth="2" />
                                <path d="M 145 150 L 145 220 Q 145 230 160 230 Q 175 230 175 220 L 175 150 Z" fill="white" opacity="0.4" />
                            </g>

                            <g className="water-drop" style={{ animationDelay: '0.5s' }}>
                                <rect x="185" y="90" width="45" height="10" rx="2" fill="white" opacity="0.8" />
                                <path d="M 190 100 L 190 230 Q 190 242 207.5 242 Q 225 242 225 230 L 225 100 Z" fill="white" opacity="0.9" stroke="white" strokeWidth="2" />
                                <path d="M 190 140 L 190 230 Q 190 242 207.5 242 Q 225 242 225 230 L 225 140 Z" fill="white" opacity="0.4" />
                            </g>

                            <g className="water-drop" style={{ animationDelay: '1s' }}>
                                <rect x="235" y="105" width="35" height="7" rx="2" fill="white" opacity="0.8" />
                                <path d="M 240 112 L 240 215 Q 240 224 252.5 224 Q 265 224 265 215 L 265 112 Z" fill="white" opacity="0.9" stroke="white" strokeWidth="2" />
                                <path d="M 240 155 L 240 215 Q 240 224 252.5 224 Q 265 224 265 215 L 265 155 Z" fill="white" opacity="0.4" />
                            </g>

                            {/* Water drops (Using SMIL animations within JSX) */}
                            <circle cx="120" cy="140" r="8" fill="white" opacity="0.5">
                                <animate attributeName="cy" values="140;160;140" dur="2s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="280" cy="130" r="10" fill="white" opacity="0.5">
                                <animate attributeName="cy" values="130;150;130" dur="2.5s" repeatCount="indefinite" />
                            </circle>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto bg-gray-100">
                {/* Card Container */}
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative z-10">

                    {/* Mobile Logo (Visible only on mobile) */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="bg-blue-50 p-3 rounded-full">
                                <svg className="w-12 h-12 text-blue-600" viewBox="0 0 50 50" fill="currentColor">
                                    <path d="M25 5 L25 20 Q25 30 15 35 Q25 40 25 50 Q25 40 35 35 Q25 30 25 20 Z" opacity="0.9" />
                                    <ellipse cx="25" cy="15" rx="8" ry="6" fill="currentColor" opacity="0.7" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">CV Salga Mandiri</h2>
                        <p className="text-gray-500">Admin Panel</p>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang!</h2>
                        <p className="text-gray-500">Silakan login untuk melanjutkan ke dashboard admin</p>
                    </div>

                    {status && (
                        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-100 text-sm font-medium flex items-center gap-2">
                            <HiCheckCircle className="text-lg" /> {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                    <HiEnvelope className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.email ? 'border-red-300 ring-red-100' : 'border-gray-300'}`}
                                    placeholder="admin@salgamandiri.co.id"
                                    autoComplete="email"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                    <HiLockClosed className="w-5 h-5" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.password ? 'border-red-300 ring-red-100' : 'border-gray-300'}`}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
                                >
                                    {showPassword ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between mb-6">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
                            </label>

                            {/* {canResetPassword && (
                                <Link href={route('password.request')} className="text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                                    Lupa Password?
                                </Link>
                            )} */}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing || isSuccess}
                            className={`w-full py-3 rounded-lg font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02] 
                                ${isSuccess
                                    ? 'bg-green-500 hover:bg-green-600'
                                    : 'gradient-bg hover:opacity-90'
                                } 
                                disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
                        >
                            {processing ? (
                                <>
                                    <CgSpinner className="animate-spin text-xl" />
                                    <span>Memproses...</span>
                                </>
                            ) : isSuccess ? (
                                <>
                                    <HiCheckCircle className="text-xl" />
                                    <span>Login Berhasil!</span>
                                </>
                            ) : (
                                <span>Masuk</span>
                            )}
                        </button>
                    </form>

                    {/* Footer text inside card */}
                    <div className="mt-8 text-center text-sm text-gray-500">
                        <p>&copy; {new Date().getFullYear()} CV Salga Mandiri. All rights reserved.</p>
                    </div>
                </div>

                {/* Footer Page */}

            </div>
        </div>
    );
}