// Components/UI/PasswordInput.jsx
import { useState } from 'react';
import { HiEye, HiEyeSlash, HiLockClosed } from "react-icons/hi2";

export default function PasswordInput({
    label,
    name,
    value,
    onChange,
    icon: Icon = HiLockClosed,
    placeholder = "",
    error = "",
    required = false,
    disabled = false,
    className = "",
}) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type={showPassword ? "text" : "password"}
                    name={name}
                    id={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`block w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors ${error
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300'
                        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    onClick={togglePasswordVisibility}
                    disabled={disabled}
                >
                    {showPassword ? <HiEyeSlash className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                </button>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}