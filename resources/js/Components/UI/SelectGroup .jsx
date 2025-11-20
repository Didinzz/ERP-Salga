import React from 'react';

export default function SelectGroup({
    label,
    name,
    value,
    onChange,
    icon: Icon,
    children,
    error,
    required = false
}) {
    return (
        <div>
            {label && (
                <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}

                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`w-full py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white sm:text-sm appearance-none ${Icon ? 'pl-10' : 'px-4'
                        } ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                    required={required}
                >
                    {children}
                </select>

                {/* Custom Chevron Arrow to replace default browser arrow if needed, 
                    but 'appearance-none' usually needs a manual arrow. 
                    For simplicity, we let browser handle it or you can add an SVG arrow here at right-3 */}
            </div>

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}