import { Link } from '@inertiajs/react';
import Badge from '@/Components/UI/Badge';
import { HiPencilSquare, HiTrash, HiMagnifyingGlass, HiPlus } from "react-icons/hi2";
import EditFormUser from './EditFormUser';
import { useState } from 'react';
import DeleteUserConfirmation from './DeleteUserConfirmation';

export default function UserTable({ users, searchTerm, onSearch, onAddClick }) {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Handler untuk membuka modal edit
    const handleEdit = (user) => {
        setSelectedUser(user);
        setEditModalOpen(true);
    };

    // Handler untuk menutup modal
    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedUser(null);
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedUser(null);
    };

    return (
        <>
            {/* --- Toolbar (Search & Filter) --- */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <HiMagnifyingGlass className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={onSearch}
                            placeholder="Cari pengguna..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                        />
                    </div>

                    {/* Filter Dropdown */}
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                        <option value="">Semua Role</option>
                        <option value="Admin">Admin</option>
                        <option value="Distributor">Distributor</option>
                    </select>
                </div>

                {/* Add User Button */}
                <button
                    onClick={onAddClick}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                >
                    <HiPlus className="h-5 w-5 mr-2" />
                    Tambah Pengguna
                </button>
            </div>

            {/* --- Table Container --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        {/* --- HEADER --- */}
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Telepon</th>
                                <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>

                        {/* --- BODY --- */}
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.data.length > 0 ? (
                                users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                                        
                                        {/* Kolom 1: Nama & Avatar */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 text-white flex items-center justify-center font-bold border-2 border-white shadow-sm">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-gray-900">{user.name}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Kolom 2: Email */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                        </td>

                                        {/* Kolom 3: Role */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge type="role" label={user.role || 'Distributor'} />
                                        </td>

                                        {/* Kolom 4: Telepon */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.kontak || '-'}</div>
                                        </td>

                                        {/* Kolom 5: Status */}
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <Badge type="status" label={user.status || 'Aktif'} />
                                        </td>

                                        {/* Kolom 6: Aksi */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-2 bg-white border border-gray-200 rounded-lg text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm"
                                                    title="Edit Pengguna"
                                                >
                                                    <HiPencilSquare className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user)}
                                                    className="p-2 bg-white border border-gray-200 rounded-lg text-red-600 hover:bg-red-50 hover:border-red-300 transition-all shadow-sm"
                                                    title="Hapus Pengguna"
                                                >
                                                    <HiTrash className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <div className="w-12 h-12 mb-3 opacity-20 flex items-center justify-center">
                                                <HiMagnifyingGlass className="w-8 h-8" />
                                            </div>
                                            <p className="text-base font-medium text-gray-900">Tidak ada pengguna ditemukan</p>
                                            <p className="text-sm text-gray-500">Coba ubah pencarian Anda atau tambah pengguna baru.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- PAGINATION --- */}
                {users.links && users.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                        <div className="text-sm text-gray-500 hidden sm:block">
                            Menampilkan <span className="font-bold">{users.from}</span> sampai <span className="font-bold">{users.to}</span> dari <span className="font-bold">{users.total}</span> data
                        </div>
                        <div className="flex gap-1">
                            {users.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${link.active
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : !link.url
                                                ? 'text-gray-400 cursor-not-allowed bg-transparent'
                                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                        }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <EditFormUser
                isOpen={editModalOpen}
                onClose={closeEditModal}
                user={selectedUser}
            />

            <DeleteUserConfirmation
                isOpen={deleteModalOpen}
                onClose={closeDeleteModal}
                user={selectedUser}
            />
        </>
    );
}