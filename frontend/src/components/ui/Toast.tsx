/**
 * Toast Component
 * ---------------------------------------------------------------------------
 * Toast notification system for displaying temporary messages to users.
 * Supports different types (success, error, warning, info) and auto-dismiss.
 */

import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface ToastProps {
    toast: ToastData;
    onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (toast.duration && toast.duration > 0) {
            const timer = setTimeout(() => {
                handleDismiss();
            }, toast.duration);
            return () => clearTimeout(timer);
        }
    }, [toast.duration]);

    const handleDismiss = () => {
        setIsLeaving(true);
        setTimeout(() => {
            onDismiss(toast.id);
        }, 300); // Match the animation duration
    };

    const getToastStyles = () => {
        const baseStyles = 'flex items-start p-4 rounded-lg shadow-lg border transition-all duration-300 transform';
        const visibilityStyles = isVisible && !isLeaving
            ? 'translate-x-0 opacity-100'
            : 'translate-x-full opacity-0';

        switch (toast.type) {
            case 'success':
                return `${baseStyles} bg-green-50 border-green-200 ${visibilityStyles}`;
            case 'error':
                return `${baseStyles} bg-red-50 border-red-200 ${visibilityStyles}`;
            case 'warning':
                return `${baseStyles} bg-yellow-50 border-yellow-200 ${visibilityStyles}`;
            case 'info':
                return `${baseStyles} bg-blue-50 border-blue-200 ${visibilityStyles}`;
            default:
                return `${baseStyles} bg-gray-50 border-gray-200 ${visibilityStyles}`;
        }
    };

    const getIcon = () => {
        const iconClass = 'w-5 h-5 flex-shrink-0';

        switch (toast.type) {
            case 'success':
                return (
                    <svg className={`${iconClass} text-green-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'error':
                return (
                    <svg className={`${iconClass} text-red-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg className={`${iconClass} text-yellow-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'info':
                return (
                    <svg className={`${iconClass} text-blue-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const getTextColor = () => {
        switch (toast.type) {
            case 'success':
                return 'text-green-800';
            case 'error':
                return 'text-red-800';
            case 'warning':
                return 'text-yellow-800';
            case 'info':
                return 'text-blue-800';
            default:
                return 'text-gray-800';
        }
    };

    return (
        <div className={getToastStyles()}>
            {getIcon()}
            <div className="ml-3 flex-1">
                <div className={`text-sm font-medium ${getTextColor()}`}>
                    {toast.title}
                </div>
                {toast.message && (
                    <div className={`text-sm mt-1 ${getTextColor()} opacity-90`}>
                        {toast.message}
                    </div>
                )}
                {toast.action && (
                    <div className="mt-2">
                        <button
                            onClick={toast.action.onClick}
                            className={`text-sm font-medium underline hover:no-underline ${getTextColor()}`}
                        >
                            {toast.action.label}
                        </button>
                    </div>
                )}
            </div>
            <button
                onClick={handleDismiss}
                className={`ml-4 flex-shrink-0 ${getTextColor()} hover:opacity-75 transition-opacity`}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default Toast;