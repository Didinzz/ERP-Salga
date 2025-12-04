import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Import Partials
import StatsGrid from './Partials/StatsGrid';
import UserTable from './Partials/UserTable';
import CreateUserForm from './Partials/CreateFormUser';

export default function UserIndex({ auth, users, filters, stats }) { // Tambah props stats
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    // Logic Search (Debounce sederhana bisa ditambahkan jika perlu)
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        router.get(route('users.index'), { search: value }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h2>
                    <p className="text-sm text-gray-500 mt-1">Kelola data pengguna sistem PT Salga Mandiri</p>
                </div>
            }
        >
            <Head title="Manajemen Pengguna" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* 1. Bagian Statistik */}
                    <StatsGrid stats={stats} /> {/* Kirim stats sebagai props */}

                    <div className="mt-6 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* 2. Bagian Tabel & Toolbar */}
                            <UserTable
                                users={users}
                                searchTerm={searchTerm}
                                onSearch={handleSearch}
                                onAddClick={() => setIsModalOpen(true)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Modal Form Tambah */}
            <CreateUserForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

        </AuthenticatedLayout>
    );
}