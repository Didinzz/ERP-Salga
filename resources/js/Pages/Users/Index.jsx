import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Import Partials
import StatsGrid from './Partials/StatsGrid';
import UserTable from './Partials/UserTable';
import CreateUserForm from './Partials/CreateFormUser';

export default function UserIndex({ auth, users, filters }) {
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
                    <h2 className="text-2xl font-bold text-dark">Manajemen Pengguna</h2>
                    <p className="text-sm text-gray-500 mt-1">Kelola data pengguna sistem PT Salga Mandiri</p>
                </div>
            }
        >
            <Head title="Manajemen Pengguna" />

            {/* 1. Bagian Statistik (Partial) */}
            <StatsGrid totalUsers={users.total} />

            {/* 2. Bagian Tabel & Toolbar (Partial) */}
            <UserTable
                users={users}
                searchTerm={searchTerm}
                onSearch={handleSearch}
                onAddClick={() => setIsModalOpen(true)}
            />

            {/* 3. Modal Form Tambah (Partial) */}
            <CreateUserForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

        </AuthenticatedLayout>
    );
}