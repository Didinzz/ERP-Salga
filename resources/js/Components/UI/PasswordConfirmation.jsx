// Components/UI/PasswordConfirmation.jsx
import { useEffect, useState } from 'react';
import { HiShieldCheck } from "react-icons/hi2";
import PasswordInput from './PasswordInput';

export default function PasswordConfirmation({
    password,
    passwordConfirmation,
    onPasswordChange,
    onConfirmationChange,
    passwordError = "",
    confirmationError = "",
    className = ""
}) {
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    useEffect(() => {
        if (password && passwordConfirmation) {
            setPasswordsMatch(password === passwordConfirmation);
        } else {
            setPasswordsMatch(true);
        }
    }, [password, passwordConfirmation]);

    return (
        <div className={className}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PasswordInput
                    label="Kata Sandi"
                    name="password"
                    value={password}
                    onChange={onPasswordChange}
                    placeholder="Min 8 karakter"
                    error={passwordError}
                    required
                />

                <PasswordInput
                    label="Konfirmasi Sandi"
                    name="password_confirmation"
                    value={passwordConfirmation}
                    onChange={onConfirmationChange}
                    icon={HiShieldCheck}
                    placeholder="Ketik ulang sandi"
                    error={confirmationError || (!passwordsMatch && "Konfirmasi password tidak sesuai")}
                    required
                />
            </div>

            {/* Live Validation Indicator Sederhana */}
            {passwordConfirmation && (
                <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${passwordsMatch
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {passwordsMatch ? (
                        <span className="flex items-center gap-2">
                            <HiShieldCheck className="w-4 h-4" />
                            Password sesuai
                        </span>
                    ) : (
                        <span>Password tidak sesuai</span>
                    )}
                </div>
            )}
        </div>
    );
}