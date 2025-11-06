/**
 * Card Component
 * ---------------------------------------------------------------------------
 * Reusable card component for content containers with responsive design.
 */

import React from 'react';

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
    const paddingClasses = {
        none: '',
        sm: 'p-3 sm:p-4',
        md: 'p-4 sm:p-6',
        lg: 'p-6 sm:p-8',
    };

    const classes = `
    bg-white rounded-lg border border-gray-200 shadow-sm
    ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''}
    ${paddingClasses[padding]}
    ${className}
  `.trim();

    return (
        <div className={classes}>
            {children}
        </div>
    );
};

export default Card;