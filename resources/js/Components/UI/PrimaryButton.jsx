import React from 'react';

// Komponen Spinner Internal (Bisa dipisah jika ingin digunakan di tempat lain)
const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export default function PrimaryButton({
    className = '',
    disabled,
    processing,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center px-6 py-2.5 bg-primary border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ${disabled || processing ? 'opacity-75 cursor-not-allowed' : ''
                } ` + className
            }
            disabled={disabled || processing}
        >
            {/* Tampilkan Spinner jika processing true */}
            {processing && <Spinner />}

            {children}
        </button>
    );
}