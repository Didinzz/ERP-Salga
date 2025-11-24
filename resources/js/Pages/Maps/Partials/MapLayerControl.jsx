import { useState } from "react";
import { FaLayerGroup, FaMap, FaCity } from "react-icons/fa6";
import { PiGlobeHemisphereEastFill } from "react-icons/pi";

export default function MapLayerControl({ currentLayer, onChangeLayer }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    const layers = [
        { id: 'satellite', name: 'Satelit (Esri)', icon: PiGlobeHemisphereEastFill, color: 'bg-blue-600' },
        { id: 'street', name: 'Jalan Raya (OSM)', icon: FaMap, color: 'bg-green-600' },
        { id: 'dark', name: 'Mode Gelap', icon: FaCity, color: 'bg-gray-800' },
    ];

    return (
        // POSISI: Pojok Kanan Bawah (bottom-8 right-4)
        <div className="absolute bottom-8 right-4 z-[400] flex flex-col items-end">

            {/* Menu Dropdown (Muncul ke ATAS) */}
            <div className={`
                absolute bottom-14 right-0 w-max flex flex-col gap-2 origin-bottom-right
                transition-all duration-300 ease-out
                ${isOpen
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}
            `}>
                {layers.map((layer) => (
                    <button
                        key={layer.id}
                        onClick={() => {
                            onChangeLayer(layer.id);
                            setIsOpen(false);
                        }}
                        className="group flex items-center justify-end gap-2 p-1 rounded-full transition-all"
                    >
                        {/* Label Nama Layer */}
                        <span className={`text-xs font-bold px-2 py-1 rounded-md shadow-md transition-colors ${currentLayer === layer.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 opacity-0 group-hover:opacity-100'
                            }`}>
                            {layer.name}
                        </span>

                        {/* Icon Layer */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-white text-sm transition-all transform group-hover:scale-110 ${layer.color} ${currentLayer === layer.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                            }`}>
                            <layer.icon />
                        </div>
                    </button>
                ))}
            </div>

            {/* Tombol Utama (Trigger) */}
            <button
                onClick={toggle}
                className={`w-12 h-12 rounded-full shadow-xl flex items-center justify-center text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 ${isOpen ? 'rotate-180 bg-gray-100' : ''}`}
                title="Ganti Lapisan Peta"
            >
                <FaLayerGroup />
            </button>

        </div>
    );
}