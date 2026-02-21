import { FaLocationDot, FaPhone, FaUser, FaMagnifyingGlass, FaPen, FaTrash } from "react-icons/fa6";
import { useState } from "react";

export default function CustomerList({ customers, selectedId, onSelect, currentUser, onEdit, onDelete }) {
    const [search, setSearch] = useState("");

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.owner?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full bg-white border-r border-gray-200 flex flex-col z-10 shadow-xl h-full">
            {/* Header Search */}
            <div className="p-4 bg-blue-50 border-b border-blue-100 flex-shrink-0">
                <h3 className="font-bold text-blue-800 mb-2">Lokasi Pelanggan ({filtered.length})</h3>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Cari toko atau pemilik..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm"
                    />
                    <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="divide-y divide-gray-100">
                    {filtered.length > 0 ? (
                        filtered.map((customer) => (
                            <div
                                key={customer.id}
                                onClick={() => onSelect(customer)}
                                className={`group p-4 cursor-pointer transition-all hover:bg-blue-50 flex justify-between items-start ${selectedId === customer.id ? 'bg-blue-50 border-l-4 border-blue-500 pl-3' : 'border-l-4 border-transparent'
                                    }`}
                            >
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm">{customer.name}</h4>
                                    <div className="mt-1 text-xs text-gray-500 space-y-1">
                                        {customer.owner && <p className="flex items-center gap-2"><FaUser className="text-gray-400" /> {customer.owner}</p>}
                                        {customer.phone && <p className="flex items-center gap-2"><FaPhone className="text-gray-400" /> {customer.phone}</p>}
                                        <p className="flex items-center gap-2 line-clamp-1"><FaLocationDot className="text-gray-400" /> {customer.address}</p>
                                    </div>
                                </div>

                                {/* Tombol Admin (Edit/Delete) */}
                                {currentUser.role === 'admin' && (
                                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onEdit(customer); }}
                                            className="p-2 bg-white border border-gray-200 rounded-full text-blue-600 hover:bg-blue-50 shadow-sm transition-colors"
                                            title="Edit Data"
                                        >
                                            <FaPen size={10} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDelete(customer.id); }}
                                            className="p-2 bg-white border border-gray-200 rounded-full text-red-600 hover:bg-red-50 shadow-sm transition-colors"
                                            title="Hapus Lokasi"
                                        >
                                            <FaTrash size={10} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-400 text-sm flex flex-col items-center">
                            <FaLocationDot className="text-3xl mb-2 opacity-20" />
                            <p>Tidak ada data ditemukan.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}