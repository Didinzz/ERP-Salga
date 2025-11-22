import { useState } from "react";
import { FaArrowLeft, FaCalendarAlt, FaSearch } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa6";
import { MdHistory } from "react-icons/md";

export default function TransactionHistory({ transactions, onBack }) {
    const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
    const [search, setSearch] = useState('');

    // Filter logic (Frontend sederhana)
    const filteredData = transactions.filter(t =>
        t.invoice.toLowerCase().includes(search.toLowerCase())
        // Note: Filter tanggal idealnya fetch ulang ke backend, 
        // tapi ini contoh filter data yang ada dulu.
    );

    return (
        <div className="bg-white rounded-2xl shadow-lg flex flex-col h-full overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        
                        <MdHistory className="text-blue-600" /> Riwayat Transaksi
                    </h2>
                    <button onClick={onBack} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-semibold hover:bg-blue-100 transition-all flex items-center gap-2 text-sm">
                        <FaBoxOpen className="text-lg" /> Katalog Produk
                    </button>
                </div>

                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Cari No. Invoice..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-xl bg-gray-50 text-sm focus:outline-none focus:border-blue-500"
                        />
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <div className="relative">
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={e => setDateFilter(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-xl bg-gray-50 text-sm focus:outline-none focus:border-blue-500"
                        />
                        <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-6 py-3">Invoice</th>
                            <th className="px-6 py-3">Waktu</th>
                            <th className="px-6 py-3">Metode</th>
                            <th className="px-6 py-3 text-right">Total</th>
                            <th className="px-6 py-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((trx) => (
                                <tr key={trx.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{trx.invoice}</td>
                                    <td className="px-6 py-4 text-gray-500">{trx.time}</td>
                                    <td className="px-6 py-4 capitalize">{trx.method}</td>
                                    <td className="px-6 py-4 text-right font-bold text-blue-600">
                                        Rp {parseFloat(trx.total).toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Sukses</span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
                                    Tidak ada data transaksi pada tanggal ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}