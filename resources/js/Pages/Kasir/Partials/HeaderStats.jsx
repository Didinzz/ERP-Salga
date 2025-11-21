import { FaStore, FaReceipt, FaMoneyBillWave, FaChartLine, FaUser } from "react-icons/fa6";

export default function HeaderStats({ cashierName, date }) {
    return (
        <header className="mb-6">
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-8">
                <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Tanggal</p>
                        <p className="text-sm font-bold text-gray-700">{date}</p>
                    </div>
                    <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Kasir</p>
                            <p className="text-sm font-bold text-gray-700">{cashierName}</p>
                        </div>
                        <FaUser className="text-4xl text-gray-300" />
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                        <FaReceipt size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Transaksi</p>
                        <p className="text-2xl font-bold text-gray-800">0</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-xl text-green-600">
                        <FaMoneyBillWave size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Omset</p>
                        <p className="text-2xl font-bold text-gray-800">Rp 0</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                        <FaChartLine size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Terlaris</p>
                        <p className="text-lg font-bold text-gray-800 line-clamp-1">-</p>
                    </div>
                </div>
            </div>
        </header>
    );
}