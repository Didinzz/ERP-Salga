import { Link } from '@inertiajs/react';
import Badge from '@/Components/UI/Badge';
import { HiPencilSquare, HiTrash, HiMagnifyingGlass, HiPlus } from "react-icons/hi2";

export default function UserTable({ users, searchTerm, onSearch, onAddClick }) {
    return (
        <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
            {/* --- Toolbar (Search & Filter) --- */}
            <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={onSearch}
                            placeholder="Cari pengguna..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                        />
                        <HiMagnifyingGlass className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-primary">
                        <option value="">Semua Role</option>
                        <option value="Admin">Admin</option>
                        <option value="Distributor">Distributor</option>
                    </select>
                </div>

                <button
                    onClick={onAddClick}
                    className="w-full md:w-auto bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-secondary transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                    <HiPlus className="w-5 h-5" /> Tambah Pengguna
                </button>
            </div>

            {/* --- Table Content --- */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left"><input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" /></th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Nama</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Telepon</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.data.length > 0 ? (
                            users.data.map((user) => (
                                <tr key={user.id} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="px-6 py-4"><input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" /></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-3 shrink-0">
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className="font-medium text-gray-900">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{user.email}</td>
                                    <td className="px-6 py-4"><Badge type="role" label={user.role || 'Distributor'} /></td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{user.phone || '-'}</td>
                                    <td className="px-6 py-4"><Badge type="status" label={user.status || 'Aktif'} /></td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-3">
                                            <button className="text-primary hover:text-secondary transition-colors" title="Edit">
                                                <HiPencilSquare className="w-5 h-5" />
                                            </button>
                                            <button className="text-red-500 hover:text-red-700 transition-colors" title="Hapus">
                                                <HiTrash className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">Data tidak ditemukan.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- Pagination --- */}
            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                    Menampilkan <span className="font-medium">{users.from || 0}</span> - <span className="font-medium">{users.to || 0}</span> dari <span className="font-medium">{users.total}</span> data
                </div>
                <div className="flex gap-2">
                    {users.links.map((link, k) => (
                        <Link
                            key={k}
                            href={link.url || '#'}
                            disabled={!link.url}
                            className={`px-3 py-1 border rounded text-sm transition-colors ${link.active
                                    ? 'bg-primary text-white border-primary'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}