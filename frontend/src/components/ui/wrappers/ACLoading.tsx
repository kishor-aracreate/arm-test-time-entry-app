/**
 * AC UI Loading Wrapper
 * ---------------------------------------------------------------------------
 * Wrapper component that maps existing Loading props to AC UI library Skeleton
 * Since AC UI doesn't have a direct Loading component, we use Skeleton with custom styling
 */

import React from 'react';
import { Skeleton } from '@kishor-aracreate/ac-ui-library-test';

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'spinner' | 'dots' | 'pulse';
    text?: string;
    className?: string;
    fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
    size = 'md',
    variant = 'spinner',
    text,
    className = '',
    fullScreen = false
}) => {
    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'w-4 h-4';
            case 'md':
                return 'w-6 h-6';
            case 'lg':
                return 'w-8 h-8';
            case 'xl':
                return 'w-12 h-12';
            default:
                return 'w-6 h-6';
        }
    };

    const getTextSize = () => {
        switch (size) {
            case 'sm':
                return 'text-sm';
            case 'md':
                return 'text-base';
            case 'lg':
                return 'text-lg';
            case 'xl':
                return 'text-xl';
            default:
                return 'text-base';
        }
    };

    // For spinner variant, create a custom spinner since AC UI Skeleton doesn't have spinner
    const renderSpinner = () => (
        <svg
            className={`animate-spin ${getSizeClasses()} text-blue-600`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );

    const renderDots = () => (
        <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className={`bg-blue-600 rounded-full animate-pulse ${size === 'sm' ? 'w-2 h-2' :
                        size === 'md' ? 'w-3 h-3' :
                            size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'
                        }`}
                    style={{
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: '1s'
                    }}
                />
            ))}
        </div>
    );

    const renderLoadingIndicator = () => {
        switch (variant) {
            case 'spinner':
                return renderSpinner();
            case 'dots':
                return renderDots();
            case 'pulse':
                return (
                    <Skeleton
                        variant="circular"
                        size={size === 'xl' ? 'lg' : size}
                        animation="pulse"
                        className={getSizeClasses()}
                    />
                );
            default:
                return renderSpinner();
        }
    };

    const content = (
        <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
            {renderLoadingIndicator()}
            {text && (
                <p className={`text-gray-600 font-medium ${getTextSize()}`}>
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    {content}
                </div>
            </div>
        );
    }

    return content;
};

export default Loading;