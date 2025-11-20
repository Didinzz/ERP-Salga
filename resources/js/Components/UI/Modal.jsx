import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
// TIPS: Jika belum install headlessui, jalankan: npm install @headlessui/react
// Jika tidak ingin pakai library, gunakan versi manual di bawah ini:

/* VERSI MANUAL (Tanpa Install Tambahan)
   Gunakan kode di bawah ini jika Anda malas install library baru.
*/

import { HiXMark } from "react-icons/hi2";

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-neutral-900/50 backdrop-blur-sm p-4 md:inset-0">
            {/* Overlay untuk close saat klik luar */}
            <div
                className="fixed inset-0 w-full h-full"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-lg max-h-full rounded-xl bg-white shadow-2xl ring-1 ring-gray-200 animate-slideDown">

                {/* Header */}
                <div className="flex items-center justify-between border-b p-4 md:p-5 bg-gradient-to-r from-primary to-secondary rounded-t-xl">
                    <h3 className="text-xl font-semibold text-white">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        type="button"
                        className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-white hover:bg-white/20 hover:text-white"
                    >
                        <HiXMark className="w-6 h-6" />
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 md:p-5 overflow-y-auto max-h-[80vh]">
                    {children}
                </div>
            </div>
        </div>
    );
}