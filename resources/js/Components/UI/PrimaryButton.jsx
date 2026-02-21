import React from 'react';
import Spinner from './Spinner';

// Komponen Spinner Internal (Bisa dipisah jika ingin digunakan di tempat lain)


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

            {children}
        </button>
    );
}