/**
 * AC UI Input Wrapper
 * ---------------------------------------------------------------------------
 * Wrapper component that maps existing Input props to AC UI library Input
 */

import React from 'react';
import { Input as ACInput } from '@kishor-aracreate/ac-ui-library-test';

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
    type = 'text',
    ...props
}) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Map our input types to AC UI types
    const mapType = (type: string) => {
        switch (type) {
            case 'text':
                return 'text';
            case 'email':
                return 'email';
            case 'password':
                return 'password';
            case 'checkbox':
                return 'checkbox';
            default:
                return 'text';
        }
    };

    return (
        <div className="space-y-1">
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <ACInput
                type={mapType(type)}
                className={className}
                value={props.value?.toString()}
                onChange={props.onChange}
                placeholder={props.placeholder}
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