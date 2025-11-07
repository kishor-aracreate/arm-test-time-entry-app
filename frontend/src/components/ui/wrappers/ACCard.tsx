/**
 * AC UI Card Wrapper
 * ---------------------------------------------------------------------------
 * Wrapper component that maps existing Card props to AC UI library Card
 */

import React from 'react';
import { Card as ACCard } from '@kishor-aracreate/ac-ui-library-test';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    padding = 'md',
    hover = false
}) => {
    // Map padding to AC UI Card styling
    const paddingClasses = {
        none: '',
        sm: 'p-3 sm:p-4',
        md: 'p-4 sm:p-6',
        lg: 'p-6 sm:p-8',
    };

    // Add hover effect if needed
    const hoverClasses = hover ? 'hover:shadow-md transition-shadow duration-200' : '';

    const combinedClassName = `${paddingClasses[padding]} ${hoverClasses} ${className}`.trim();

    return (
        <ACCard
            variant="default"
            className={combinedClassName}
        >
            {children}
        </ACCard>
    );
};

export default Card;