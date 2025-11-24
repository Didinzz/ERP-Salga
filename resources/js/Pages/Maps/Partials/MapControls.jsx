import { useState } from "react";
import { FaBars, FaPlus, FaUpDownLeftRight, FaXmark, FaLocationDot } from "react-icons/fa6";

export default function MapControls({ mode, onChangeMode }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const selectMode = (newMode) => {
        // Jika klik mode yang sama, matikan (kembali ke view)
        const targetMode = mode === newMode ? 'view' : newMode;
        onChangeMode(targetMode); // Panggil handler parent untuk Toast & State
        setIsOpen(false);
    };

    // Tentukan Icon Utama berdasarkan Mode
    const MainIcon = mode === 'add' ? FaPlus
        : mode === 'edit' ? FaUpDownLeftRight
            : FaBars;

    return (
        <div className="absolute top-4 right-4 z-[400] flex flex-col items-end">

            {/* --- 1. Main Button (Fixed) --- */}
            <button
                onClick={toggleMenu}
                className={`w-12 h-12 rounded-full shadow-xl flex items-center justify-center text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${mode !== 'view'
                        ? (mode === 'add' ? 'bg-green-600 text-white rotate-0' : 'bg-orange-500 text-white rotate-0')
                        : (isOpen ? 'bg-white text-red-500 rotate-90' : 'bg-blue-600 text-white rotate-0')
                    }`}
            >
                {isOpen ? <FaXmark /> : <MainIcon />}
            </button>

            {/* --- 2. Dropdown Menu (Animated) --- */}
            {/* Container relative terhadap button di atas */}
            <div className={`
                absolute top-14 right-0 w-max flex flex-col gap-2 origin-top
                transition-all duration-300 ease-out
                ${isOpen
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}
            `}>

                {/* Item: Mode Tambah */}
                <button
                    onClick={() => selectMode('add')}
                    className={`group flex items-center justify-end gap-3 p-1 rounded-full transition-all ${mode === 'add' ? 'opacity-100' : 'opacity-90 hover:opacity-100'}`}
                >
                    <span className="bg-white text-gray-700 text-xs font-bold px-3 py-1.5 rounded-md shadow-md">
                        Tambah Lokasi
                    </span>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${mode === 'add' ? 'bg-green-600 text-white' : 'bg-white text-green-600 group-hover:bg-green-50'
                        }`}>
                        <FaPlus />
                    </div>
                </button>

                {/* Item: Mode Edit */}
                <button
                    onClick={() => selectMode('edit')}
                    className={`group flex items-center justify-end gap-3 p-1 rounded-full transition-all ${mode === 'edit' ? 'opacity-100' : 'opacity-90 hover:opacity-100'}`}
                >
                    <span className="bg-white text-gray-700 text-xs font-bold px-3 py-1.5 rounded-md shadow-md">
                        Geser Marker
                    </span>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${mode === 'edit' ? 'bg-orange-500 text-white' : 'bg-white text-orange-500 group-hover:bg-orange-50'
                        }`}>
                        <FaUpDownLeftRight />
                    </div>
                </button>

            </div>
        </div>
    );
}