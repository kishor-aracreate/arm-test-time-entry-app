/**
 * Input Component
 * ---------------------------------------------------------------------------
 * Reusable input component with validation states and labels.
 */

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    className = '',
    id,
    style,
    disabled,
    ...props
}) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 11)}`;

    const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm transition-colors duration-200';
    const errorClasses = error
        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
    const stateClasses = disabled ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900';

    const inputClasses = `${baseClasses} ${errorClasses} ${stateClasses} ${className}`.trim();

    return (
        <div className="space-y-1">
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                {...props}
                id={inputId}
                className={inputClasses}
                disabled={disabled}
                style={{
                    ...style,
                    color: disabled ? '#6b7280' : '#111827',
                    WebkitTextFillColor: disabled ? '#6b7280' : '#111827'
                }}
            />
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
            {helperText && !error && (
                <p className="text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
};

export default Input;