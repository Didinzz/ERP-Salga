import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useRef } from 'react';

import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: iconMarker,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const GORONTALO_BOUNDS = [
    [0.1000, 121.0000], // Pojok Kiri Bawah (Selatan - Barat)
    [1.5000, 124.5000]
]

const MAP_LAYERS = {
    satellite: {
        // Esri World Imagery (Satelit) - Tetap GRATIS
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: "Tiles &copy; Esri"
    },
    street: {
        // OpenStreetMap (Standar) - Tetap GRATIS
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: "&copy; OpenStreetMap contributors"
    },
    dark: {
        // GANTI STADIA KE CARTO (Gratis)
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        attribution: "&copy; <a href='https://www.carto.com/attributions'>CARTO</a>"
    }
};

function MapClickHandler({ mode, onLocationSelect }) {
    useMapEvents({
        click(e) {
            if (mode === 'add') {
                onLocationSelect(e.latlng);
            }
        },
    });
    return null;
}

function MapController({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) map.flyTo(center, 16, { duration: 1.5 });
    }, [center, map]);
    return null;
}

export default function CustomerMap({ customers, center, mode, onMapClick, onDragEnd, onEditClick, currentLayer }) {
    const activeLayer = MAP_LAYERS[currentLayer] || MAP_LAYERS.satellite;
    return (
        <div className={`relative z-0 h-full w-full ${mode === 'add' ? 'cursor-crosshair' : ''}`}>

            {/* Alert Mode Tambah (Optional Visual Cue) */}
            {mode === 'add' && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[400] pointer-events-none">
                    <span className="bg-green-600 text-white px-4 py-2 rounded-full shadow-lg text-xs font-bold animate-pulse border-2 border-white">
                        Tap peta untuk lokasi baru
                    </span>
                </div>
            )}

            <MapContainer
                center={center}
                zoom={13}
                minZoom={11}
                maxZoom={18}
                maxBounds={GORONTALO_BOUNDS}
                maxBoundsViscosity={1.0}
                scrollWheelZoom={true}
                className="h-full w-full"
                style={{ height: "100%", width: "100%" }}
                cursor={mode === 'add' ? 'crosshair' : 'default'}
            >
                <MapController center={center} />
                <MapClickHandler mode={mode} onLocationSelect={onMapClick} />

                <TileLayer
                    key={currentLayer}
                    attribution={activeLayer.attribution}
                    url={activeLayer.url}
                />

                {currentLayer === 'satellite' && (
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
                        attribution="&copy; CARTO"
                        opacity={0.8} // Label nama jalan
                        zIndex={100} // Pastikan di atas satelit
                    />
                )}

                {customers.map((customer) => (
                    <DraggableMarker
                        key={customer.id}
                        customer={customer}
                        mode={mode}
                        onEditClick={onEditClick} // Pass fungsi edit
                        onDragEnd={onDragEnd}
                    />
                ))}
            </MapContainer>
        </div>
    );
}

function DraggableMarker({ customer, mode, onEditClick, onDragEnd }) {
    const markerRef = useRef(null);

    const eventHandlers = {

        dragend: () => {
            const marker = markerRef.current;
            if (marker) {
                onDragEnd(customer, marker.getLatLng());
            }
        },
    };

    return (
        <Marker
            draggable={mode === 'edit'}
            eventHandlers={eventHandlers}
            position={[customer.lat, customer.lng]}
            ref={markerRef}
            opacity={mode === 'add' ? 0.6 : 1}
        >
            <Popup>
                <div className="p-1 text-center min-w-[150px]">
                    <h3 className="font-bold text-sm mb-1 text-gray-800">{customer.name}</h3>
                    <p className="text-[10px] text-gray-500 mb-3 line-clamp-2">{customer.address}</p>

                    {/* Tombol Edit di dalam Popup */}
                    {/* Saat diklik, panggil onEditClick yang akan membuka Modal Form */}
                    <button
                        onClick={() => onEditClick(customer)}
                        className="block w-full bg-blue-600 text-white text-xs py-1.5 px-2 rounded hover:bg-blue-700 transition-colors font-semibold shadow-sm"
                    >
                        Edit Detail Data
                    </button>
                </div>
            </Popup>
        </Marker>
    );
}