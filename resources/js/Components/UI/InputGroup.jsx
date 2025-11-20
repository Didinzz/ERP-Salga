import React from 'react';

export default function InputGroup({
    label,
    name,
    type = 'text',
    value,
    onChange,
    icon: Icon,
    placeholder,
    error,
    required = false,
    className = ''
}) {
    return (
        <div className={className}>
            {label && (
                <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative">
                {/* Icon Wrapper */}
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}

                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    className={`w-full py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow sm:text-sm ${Icon ? 'pl-10' : 'px-4'
                        } ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder={placeholder}
                    required={required}
                />
            </div>

            {/* Error Message */}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}