import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-semibold text-gray-900">
                    Hapus Akun
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Setelah akun Anda dihapus, semua data dan sumber dayanya akan dihapus secara permanen. 
                    Sebelum menghapus akun Anda, silakan unduh data atau informasi yang ingin Anda simpan.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                Hapus Akun
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Apakah Anda yakin ingin menghapus akun Anda?
                    </h2>

                    <p className="text-sm text-gray-600">
                        Setelah akun Anda dihapus, semua data dan sumber dayanya akan dihapus secara permanen. 
                        Masukkan password Anda untuk mengonfirmasi bahwa Anda ingin menghapus akun secara permanen.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 focus:border-red-500 focus:ring-red-500"
                            isFocused
                            placeholder="Masukkan password Anda"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <SecondaryButton 
                            onClick={closeModal}
                            className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
                        >
                            Batal
                        </SecondaryButton>

                        <DangerButton 
                            disabled={processing}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                        >
                            Hapus Akun
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}