/**
 * AC UI Button Wrapper
 * ---------------------------------------------------------------------------
 * Wrapper component that maps existing Button props to AC UI library Button
 */

import React from 'react';
import { Button as ACButton } from '@kishor-aracreate/ac-ui-library-test';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    children,
    className = '',
    disabled,
    ...props
}) => {
    // Map our variants to AC UI variants
    const mapVariant = (variant: string) => {
        switch (variant) {
            case 'primary':
                return 'primary';
            case 'secondary':
                return 'outline';
            case 'danger':
                return 'primary'; // AC UI doesn't have danger, use primary with custom styling
            case 'ghost':
                return 'ghost';
            case 'outline':
                return 'outline';
            default:
                return 'primary';
        }
    };

    // Map size to CSS classes since AC UI Button doesn't have size prop
    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'px-3 py-1.5 text-sm';
            case 'md':
                return 'px-4 py-2 text-base';
            case 'lg':
                return 'px-6 py-3 text-lg';
            default:
                return 'px-4 py-2 text-base';
        }
    };

    // Add danger styling for danger variant
    const dangerClasses = variant === 'danger'
        ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300'
        : '';

    const combinedClassName = `${getSizeClasses()} ${dangerClasses} ${className}`.trim();

    // Extract onClick to handle type compatibility
    const { onClick, ...restProps } = props;

    return (
        <ACButton
            variant={mapVariant(variant)}
            className={combinedClassName}
            disabled={disabled || isLoading}
            loading={isLoading}
            onClick={onClick ? () => onClick({} as React.MouseEvent<HTMLButtonElement>) : undefined}
            {...restProps}
        >
            {children}
        </ACButton>
    );
};

export default Button;